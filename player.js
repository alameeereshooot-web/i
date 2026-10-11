// ===== المشغل الشامل لـ HLS و MPEG-DASH (ClearKey) و TS =====

var hls = null;
var shakaPlayer = null;
var tsPlayer = null;
var cur = { r: -1, i: -1 };
var retryT = null;
var ctrlHideTimer = null;
var viewerTimer = null;
var consecutiveErrors = 0;
var curQualityIdx = 0; // مؤشر الجودة الحالية النشطة

var vid = document.getElementById('vid');
var iframeWrap = document.getElementById('iframe-wrap');
var iframePlayer = document.getElementById('iframe-player');
var qm = document.getElementById('qm');
var qBtn = document.getElementById('q-btn');
var loader = document.getElementById('loader');
var chTitle = document.getElementById('ch-title');
var dblHint = document.getElementById('dbl-hint');
var dblTxt = document.getElementById('dbl-txt');
var swInd = document.getElementById('swipe-ind');
var siIcon = document.getElementById('si-icon');
var siBar = document.getElementById('si-bar');
var siLabel = document.getElementById('si-label');
var brightL = document.getElementById('brightness-layer');
var pw = document.getElementById('player-wrap');
var chRows = document.getElementById('ch-rows');
var fitBtn = document.getElementById('fit-btn');
var speedBadge = document.getElementById('speed-badge');
var spdBtn = document.getElementById('spd-btn');

var brightness = parseFloat(localStorage.getItem('brightness') || '0');
if (brightL) brightL.style.opacity = brightness;

// تناسب العرض
var ASPECTS = [{ cls: 'fc', lbl: '↕ عادي' }, { cls: 'fv', lbl: '⛶ ملء' }, { cls: 'ff', lbl: '↔ مفيد' }];
var aspectIdx = parseInt(localStorage.getItem('aspectIdx') || '0');
function applyAspect(i) {
    if (!vid) return;
    vid.className = ASPECTS[i].cls;
    if (fitBtn) {
        fitBtn.textContent = ASPECTS[i].lbl;
        fitBtn.classList.toggle('on', i !== 0);
    }
    localStorage.setItem('aspectIdx', i);
}
function cycleAspect() {
    aspectIdx = (aspectIdx + 1) % ASPECTS.length;
    applyAspect(aspectIdx);
}
applyAspect(aspectIdx);

function showLoader() { if (loader) loader.style.display = 'flex'; }
function hideLoader() { if (loader) loader.style.display = 'none'; }
function toast(msg) {
    var t = document.getElementById('err-toast');
    if (!t) return;
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(function () { t.style.display = 'none'; }, 4000);
}

// ===== التحكم في ظهور واختفاء أزرار التحكم (5 ثوانٍ) =====
function showControls() {
    if (!pw) return;
    pw.classList.add('show-ctrl');
    resetControlsTimeout();
}

function hideControls() {
    if (!pw) return;
    if (qm && qm.classList.contains('open')) return;
    if (vid && vid.paused) return;
    pw.classList.remove('show-ctrl');
}

function resetControlsTimeout() {
    if (ctrlHideTimer) clearTimeout(ctrlHideTimer);
    ctrlHideTimer = setTimeout(function () {
        hideControls();
    }, 5000); // 5 ثوانٍ
}

// تفاعل المستخدم يُظهر عناصر التحكم
if (pw) {
    pw.addEventListener('mousemove', function () {
        showControls();
    });
    pw.addEventListener('touchstart', function () {
        resetControlsTimeout();
    }, { passive: true });
}

// ===== عداد سرعة النت اللحظية الحقيقية =====
function updateRealSpeed(bitsPerSec) {
    if (!speedBadge && !spdBtn) return;
    var target = speedBadge || spdBtn;
    if (!bitsPerSec || bitsPerSec <= 0) return;
    
    var mbps = (bitsPerSec / (1024 * 1024)).toFixed(1);
    var kbps = Math.round(bitsPerSec / 1024);
    
    var text = (bitsPerSec >= 1024 * 1024) ? (mbps + ' Mbps') : (kbps + ' KB/s');
    target.textContent = '⚡ ' + text;
}

// ===== عداد المتصلين المباشرين الذكي =====
function initViewerCounter() {
    var titleWrap = chTitle;
    if (!titleWrap) return;
    var badge = document.getElementById('live-viewers-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.id = 'live-viewers-badge';
        badge.style.marginRight = '10px';
        badge.style.fontSize = '12px';
        badge.style.background = 'rgba(239, 68, 68, 0.25)';
        badge.style.color = '#fca5a5';
        badge.style.border = '1px solid rgba(239, 68, 68, 0.4)';
        badge.style.padding = '2px 8px';
        badge.style.borderRadius = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.display = 'inline-block';
        titleWrap.parentNode.insertBefore(badge, titleWrap.nextSibling);
    }

    var baseViewers = Math.floor(Math.random() * 800) + 1100;
    function updateCount() {
        var diff = Math.floor(Math.random() * 41) - 20;
        baseViewers = Math.max(350, baseViewers + diff);
        badge.textContent = '👁️ ' + baseViewers.toLocaleString('en-US') + ' مباشر';
    }
    updateCount();
    if (viewerTimer) clearInterval(viewerTimer);
    viewerTimer = setInterval(updateCount, 9000);
}

// تنظيف وتدمير المشغلات الحالية قبل تشغيل بث جديد
async function resetPlayers() {
    consecutiveErrors = 0;
    if (hls) {
        hls.destroy();
        hls = null;
    }
    if (shakaPlayer) {
        await shakaPlayer.destroy();
        shakaPlayer = null;
    }
    if (tsPlayer) {
        tsPlayer.destroy();
        tsPlayer = null;
    }
    if (vid) {
        vid.removeAttribute('src');
        vid.load();
    }
}

// تشغيل روابط MPEG-DASH مع فك تشفير ClearKey
async function loadDash(url, clearkeyConfig) {
    showLoader();
    vid.style.display = 'block';
    iframeWrap.style.display = 'none';
    await resetPlayers();

    if (!window.shaka) {
        hideLoader();
        toast('مكتبة Shaka Player غير محملة');
        return;
    }

    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
        hideLoader();
        toast('متصفحك لا يدعم تشغيل MPEG-DASH أو DRM');
        return;
    }

    shakaPlayer = new shaka.Player(vid);

    var drmConfig = {};
    if (clearkeyConfig && Object.keys(clearkeyConfig).length > 0) {
        drmConfig.clearKeys = clearkeyConfig;
    }

    shakaPlayer.configure({
        drm: drmConfig,
        manifest: {
            dash: {
                ignoreDrmInfo: true
            }
        },
        streaming: {
            bufferingGoal: 10,
            rebufferingGoal: 2
        }
    });

    shakaPlayer.addEventListener('error', function (event) {
        console.error('Shaka error:', event.detail);
        consecutiveErrors++;
        if (consecutiveErrors > 2) {
            toast('تعذر تشغيل القناة، جارٍ إعادة المحاولة...');
        }
    });

    try {
        await shakaPlayer.load(url);
        hideLoader();
        pw.classList.add('playing');
        resetControlsTimeout();
        vid.play().catch(function () {});
        buildDashQuality();
        initViewerCounter();

        // قراءة السرعة اللحظية من Shaka
        setInterval(function () {
            if (shakaPlayer) {
                var stats = shakaPlayer.getStats();
                if (stats && stats.estimatedBandwidth) {
                    updateRealSpeed(stats.estimatedBandwidth);
                }
            }
        }, 3000);
    } catch (e) {
        hideLoader();
        console.error('Failed to load DASH:', e);
        toast('تعذر فك تشفير أو تشغيل بث DASH');
    }
}

// تشغيل روابط MPEG-TS المباشرة عبر mpegts.js
async function loadTs(url) {
    if (!mpegts.isSupported()) {
        toast('المتصفح لا يدعم بث TS');
        return;
    }
    showLoader();
    vid.style.display = 'block';
    iframeWrap.style.display = 'none';
    await resetPlayers();

    tsPlayer = mpegts.createPlayer({
        type: 'mpegts',
        isLive: true,
        url: url
    }, {
        enableWorker: false,
        lazyLoad: false,
        enableStashBuffer: true,
        stashInitialSize: 384 * 1024,
        liveBufferLatencyChasing: true,
        liveBufferLatencyMaxLatency: 4.5,
        liveBufferLatencyMinRemain: 2.0,
        autoCleanupSourceBuffer: true,
        autoCleanupMaxBackwardDuration: 60,
        autoCleanupMinBackwardDuration: 30
    });

    tsPlayer.attachMediaElement(vid);
    tsPlayer.load();

    vid.addEventListener('playing', function () {
        hideLoader();
        pw.classList.add('playing');
        resetControlsTimeout();
        initViewerCounter();
    }, { once: true });

    tsPlayer.play().catch(function (e) {
        console.log('Autoplay TS:', e);
    });

    tsPlayer.on(mpegts.Events.ERROR, function (type, detail, info) {
        console.error('TS Error:', type, detail, info);
        consecutiveErrors++;
        if (consecutiveErrors > 2) {
            hideLoader();
            toast('خطأ في تشغيل قناة TS');
        }
    });
}

// تشغيل روابط HLS
function loadHls(url) {
    showLoader();
    vid.style.display = 'block';
    iframeWrap.style.display = 'none';
    resetPlayers().then(function () {
        if (window.Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                startLevel: -1,
                liveSyncDurationCount: 1,
                liveMaxLatencyDurationCount: 3,
                maxBufferLength: 8,
                maxMaxBufferLength: 15,
                manifestLoadingTimeOut: 4500,
                manifestLoadingMaxRetry: 3,
                levelLoadingTimeOut: 4500,
                fragLoadingTimeOut: 6000
            });
            hls.loadSource(url);
            hls.attachMedia(vid);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                hideLoader();
                pw.classList.add('playing');
                resetControlsTimeout();
                vid.play().catch(function () {});
                buildHlsQuality();
                buildAudioTracksMenu();
                initViewerCounter();
            });

            // حساب سرعة النت الحقيقية اللحظية من قطع الفيديو
            hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
                consecutiveErrors = 0;
                if (data && data.stats) {
                    var loadMs = data.stats.loading.end - data.stats.loading.start;
                    if (loadMs > 0 && data.stats.loaded > 0) {
                        var bits = data.stats.loaded * 8;
                        var bps = (bits / loadMs) * 1000;
                        updateRealSpeed(bps);
                    }
                }
            });

            // محاولة المعالجة الذكية لشبكة HLS دون إظهار أخطاء كاذبة
            hls.on(Hls.Events.ERROR, function (e, d) {
                if (d.fatal) {
                    consecutiveErrors++;
                    if (d.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        console.warn('Network hiccup, auto-recovering...');
                        hls.startLoad();
                        if (consecutiveErrors >= 3) {
                            toast('جودة الشبكة ضعيفة، جارٍ المحاولة...');
                        }
                    } else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        console.warn('Media glitch, recovering media...');
                        hls.recoverMediaError();
                    } else {
                        toast('تعذر استمرار البث');
                        hls.destroy();
                    }
                }
            });
        } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = url;
            vid.addEventListener('loadeddata', function () { 
                hideLoader(); 
                pw.classList.add('playing'); 
                resetControlsTimeout();
                initViewerCounter();
            }, { once: true });
            vid.play().catch(function () {});
        } else {
            hideLoader();
            toast('المتصفح لا يدعم بث HLS');
        }
    });
}

// دالة اختيار وتشغيل القناة مباشرة
function load(ri, ci) {
    if (ri < 0 || ri >= ROWS.length || ci < 0 || ci >= ROWS[ri].channels.length) return;
    cur = { r: ri, i: ci };
    if (retryT) { clearTimeout(retryT); retryT = null; }

    document.querySelectorAll('.ch').forEach(function (b) { b.classList.remove('on'); });
    var btn = document.getElementById('ch-' + ri + '-' + ci);
    if (btn) btn.classList.add('on');

    var ch = ROWS[ri].channels[ci];
    chTitle.textContent = ch.n;
    chTitle.style.display = 'block';

    // إعادة ضبط مؤشر الجودة على الأولى وتحديث القائمة
    curQualityIdx = 0;
    buildCustomQualityMenu(ch, 0);

    var targetUrl = (ch.qualities && ch.qualities.length > 0) ? ch.qualities[0].src : ch.u;
    var DENO = 'https://sho.alameeereshooot-web.deno.net/?url=';
    
    var finalUrl = targetUrl;
    var isMpd = targetUrl.indexOf('.mpd') !== -1;
    var alreadyProxied =
        targetUrl.indexOf('deno.net') !== -1 ||
        targetUrl.indexOf('l.alameeeretv.workers.dev') !== -1;
        
    var needProxy = !alreadyProxied && !isMpd && (
        targetUrl.indexOf('http://') === 0 ||
        targetUrl.indexOf('sharkhost.xyz') !== -1 ||
        targetUrl.indexOf('blcco.linkip.org') !== -1 ||
        /\.ts(\?|$)/i.test(targetUrl)
    );

    if (needProxy) {
        var m3u8Url = targetUrl.replace(/\.ts(\?|$)/i, '.m3u8$1');
        finalUrl = DENO + encodeURIComponent(m3u8Url);
        loadHls(finalUrl);
        return;
    }

    var type = ch.t || (targetUrl.includes('.mpd') ? 'dash' : 'hls');

    if (type === 'dash') {
        loadDash(targetUrl, ch.clearkey);
    } else if (type === 'iframe') {
        resetPlayers();
        vid.style.display = 'none';
        iframeWrap.style.display = 'block';
        iframePlayer.src = targetUrl;
        pw.classList.add('playing');
        resetControlsTimeout();
    } else {
        loadHls(finalUrl);
    }
}

// قائمة الجودات المخصصة مع تلوين الجودة التي تعمل بالأخضر
function buildCustomQualityMenu(ch, activeIdx) {
    if (!qm) return;
    qm.innerHTML = '';
    if (typeof activeIdx === 'undefined') activeIdx = curQualityIdx;

    if (ch.qualities && ch.qualities.length > 0) {
        ch.qualities.forEach(function (q, idx) {
            var b = document.createElement('button');
            b.textContent = q.label;

            // تلوين الجودة التي تعمل بالأخضر الزاهي
            if (idx === activeIdx) {
                b.style.color = '#22c55e';
                b.style.fontWeight = 'bold';
            } else {
                b.style.color = '';
                b.style.fontWeight = 'normal';
            }

            b.onclick = function () {
                curQualityIdx = idx;
                buildCustomQualityMenu(ch, idx);
                var type = ch.t || (q.src.includes('.mpd') ? 'dash' : (q.src.includes('.ts') ? 'ts' : 'hls'));
                if (type === 'dash') loadDash(q.src, ch.clearkey);
                else if (type === 'ts') loadTs(q.src);
                else loadHls(q.src);
                closeQ();
            };
            qm.appendChild(b);
        });
    }
}

// بناء قائمة الجودة لـ HLS تلقائياً مع تلوين الجودة الحالية بالأخضر
function buildHlsQuality() {
    if (cur.r !== -1 && cur.i !== -1 && ROWS[cur.r].channels[cur.i].qualities) return;
    if (!qm) return;
    qm.innerHTML = '';
    if (!hls || !hls.levels || !hls.levels.length) return;
    
    var autoBtn = document.createElement('button');
    autoBtn.textContent = 'تلقائي';
    if (hls.currentLevel === -1) {
        autoBtn.style.color = '#22c55e';
        autoBtn.style.fontWeight = 'bold';
    }
    autoBtn.onclick = function () { 
        hls.currentLevel = -1; 
        buildHlsQuality();
        closeQ(); 
    };
    qm.appendChild(autoBtn);

    hls.levels.forEach(function (lv, i) {
        var b = document.createElement('button');
        b.textContent = lv.height ? lv.height + 'p' : Math.round(lv.bitrate / 1000) + 'k';
        if (hls.currentLevel === i) {
            b.style.color = '#22c55e';
            b.style.fontWeight = 'bold';
        }
        b.onclick = function () { 
            hls.currentLevel = i; 
            buildHlsQuality();
            closeQ(); 
        };
        qm.appendChild(b);
    });
}

// ===== قائمة اختيار المسار الصوتي (المعلقين) =====
function buildAudioTracksMenu() {
    if (!hls || !hls.audioTracks || hls.audioTracks.length <= 1) return;
    
    var audioHeader = document.createElement('div');
    audioHeader.style.cssText = 'padding:6px 12px;font-size:11px;color:#94a3b8;border-top:1px solid #334155;margin-top:4px;';
    audioHeader.textContent = '🎙️ اختيار المعلق / الصوت:';
    qm.appendChild(audioHeader);

    hls.audioTracks.forEach(function (tr, i) {
        var b = document.createElement('button');
        var name = tr.name || tr.lang || ('صوت ' + (i + 1));
        b.textContent = '🔊 ' + name;
        if (hls.audioTrack === i) b.style.color = '#38bdf8';
        b.onclick = function () {
            hls.audioTrack = i;
            closeQ();
            toast('تم اختيار: ' + name);
        };
        qm.appendChild(b);
    });
}

// بناء قائمة الجودة لـ DASH تلقائياً مع تلوين الجودة الحالية بالأخضر
function buildDashQuality() {
    if (cur.r !== -1 && cur.i !== -1 && ROWS[cur.r].channels[cur.i].qualities) return;
    if (!qm || !shakaPlayer) return;
    qm.innerHTML = '';

    var rawTracks = shakaPlayer.getVariantTracks().filter(function (t) { return t.height; });
    if (!rawTracks.length) return;

    rawTracks.sort(function (a, b) { return (b.height || 0) - (a.height || 0); });

    var seen = {};
    var tracks = rawTracks.filter(function (t) {
        if (seen[t.height]) return false;
        seen[t.height] = true;
        return true;
    });

    var isAbr = shakaPlayer.getConfiguration().abr.enabled;

    var autoBtn = document.createElement('button');
    autoBtn.textContent = 'تلقائي';
    if (isAbr) {
        autoBtn.style.color = '#22c55e';
        autoBtn.style.fontWeight = 'bold';
    }
    autoBtn.onclick = function () {
        shakaPlayer.configure({ abr: { enabled: true } });
        buildDashQuality();
        closeQ();
    };
    qm.appendChild(autoBtn);

    tracks.forEach(function (tr) {
        var b = document.createElement('button');
        b.textContent = tr.height + 'p';
        if (!isAbr && tr.active) {
            b.style.color = '#22c55e';
            b.style.fontWeight = 'bold';
        }
        b.onclick = function () {
            shakaPlayer.configure({ abr: { enabled: false } });
            shakaPlayer.selectVariantTrack(tr, true);
            buildDashQuality();
            closeQ();
        };
        qm.appendChild(b);
    });
}

function closeQ() { if (qm) qm.classList.remove('open'); }
function toggleQ() { 
    if (qm) {
        qm.classList.toggle('open');
        if (qm.classList.contains('open')) {
            if (cur.r !== -1 && cur.i !== -1 && ROWS[cur.r].channels[cur.i].qualities) {
                buildCustomQualityMenu(ROWS[cur.r].channels[cur.i], curQualityIdx);
            } else if (hls) {
                buildHlsQuality();
            } else if (shakaPlayer) {
                buildDashQuality();
            }
        }
        resetControlsTimeout();
    }
}

function togglePlay() { 
    if (!vid) return;
    vid.paused ? vid.play() : vid.pause(); 
    resetControlsTimeout();
}
function toggleMute() {
    if (!vid) return;
    vid.muted = !vid.muted;
    var mb = document.getElementById('mute-btn');
    if (mb) mb.textContent = vid.muted ? '🔇' : '🔊';
    var vs = document.getElementById('vs');
    if (vs) vs.value = vid.muted ? 0 : vid.volume;
}
function setVolume(v) {
    if (!vid) return;
    vid.volume = parseFloat(v);
    vid.muted = v == 0;
    var mb = document.getElementById('mute-btn');
    if (mb) mb.textContent = v == 0 ? '🔇' : '🔊';
    var vs = document.getElementById('vs');
    if (vs) vs.value = v;
}
function skip(s) { 
    if (vid) vid.currentTime += s; 
    resetControlsTimeout();
}
function reloadCurrentStream() {
    if (cur.r !== -1 && cur.i !== -1) load(cur.r, cur.i);
}

// إعداد ملء الشاشة مع الدوران الأفقي
function doFullscreen() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement || pw.classList.contains('fullscreen-fallback');
    if (isFs) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(function () {});
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen().catch(function () {});
        }
        pw.classList.remove('fullscreen-fallback');
        if (screen.orientation && screen.orientation.unlock) {
            try { screen.orientation.unlock(); } catch (e) {}
        }
    } else {
        var req = pw.requestFullscreen || pw.webkitRequestFullscreen;
        if (req) {
            var p = req.call(pw, { navigationUI: 'hide' });
            if (p && p.then) {
                p.then(function () {
                    if (screen.orientation && screen.orientation.lock) {
                        screen.orientation.lock('landscape').catch(function () {});
                    }
                }).catch(function () {});
            } else {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(function () {});
                }
            }
        } else if (vid.webkitEnterFullscreen) {
            vid.webkitEnterFullscreen();
        } else {
            pw.classList.add('fullscreen-fallback');
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(function () {});
            }
        }
    }
    resetControlsTimeout();
}

['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            pw.classList.remove('fullscreen-fallback');
            if (screen.orientation && screen.orientation.unlock) {
                try { screen.orientation.unlock(); } catch (e) {}
            }
        }
        resetControlsTimeout();
    });
});

// ===== إيماءات اللمس للصوت والإضاءة =====
var touchStartX = 0;
var touchStartY = 0;
var touchSide = '';
var isSwiping = false;
var initialVal = 0;
var swipeTimer = null;
var lastTapTime = 0;
var singleTapTimer = null;

function showSwipeIndicator(icon, label, pct, color) {
    if (!swInd) return;
    siIcon.textContent = icon;
    siLabel.textContent = label + ' ' + Math.round(pct) + '%';
    siBar.style.width = Math.min(100, Math.max(0, pct)) + '%';
    siBar.style.background = color || '#38bdf8';
    swInd.style.display = 'flex';
    clearTimeout(swipeTimer);
    swipeTimer = setTimeout(function () {
        swInd.style.display = 'none';
    }, 900);
}

function showDblHint(txt) {
    if (!dblHint || !dblTxt) return;
    dblTxt.textContent = txt;
    dblHint.classList.add('show');
    setTimeout(function () {
        dblHint.classList.remove('show');
    }, 800);
}

if (pw) {
    pw.addEventListener('touchstart', function (e) {
        if (e.target.closest('#controls-overlay button, #controls-overlay input, #qm')) return;

        if (e.touches.length === 1) {
            var t = e.touches[0];
            touchStartX = t.clientX;
            touchStartY = t.clientY;
            isSwiping = false;

            var rect = pw.getBoundingClientRect();
            var relX = t.clientX - rect.left;

            if (relX > rect.width / 2) {
                touchSide = 'vol';
                initialVal = vid.muted ? 0 : vid.volume;
            } else {
                touchSide = 'bright';
                var curOp = parseFloat(brightL.style.opacity || '0');
                initialVal = Math.round((1 - (curOp / 0.85)) * 100);
            }
        }
    }, { passive: true });

    pw.addEventListener('touchmove', function (e) {
        if (e.touches.length !== 1 || !touchSide) return;
        var t = e.touches[0];
        var deltaY = touchStartY - t.clientY;
        var deltaX = t.clientX - touchStartX;

        if (!isSwiping && Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
            isSwiping = true;
        }

        if (isSwiping) {
            var rect = pw.getBoundingClientRect();
            var changePct = (deltaY / (rect.height * 0.7)) * 100;

            if (touchSide === 'vol') {
                var newVol = Math.min(1, Math.max(0, initialVal + (changePct / 100)));
                vid.volume = newVol;
                vid.muted = newVol === 0;
                var vs = document.getElementById('vs');
                if (vs) vs.value = newVol;
                var muteBtn = document.getElementById('mute-btn');
                if (muteBtn) muteBtn.textContent = newVol === 0 ? '🔇' : (newVol < 0.5 ? '🔉' : '🔊');
                showSwipeIndicator(newVol === 0 ? '🔇' : '🔊', 'الصوت', newVol * 100, '#38bdf8');
            } else if (touchSide === 'bright') {
                var newBright = Math.min(100, Math.max(5, initialVal + changePct));
                var newOpacity = ((100 - newBright) / 100) * 0.85;
                brightL.style.opacity = newOpacity;
                localStorage.setItem('brightness', newOpacity);
                showSwipeIndicator('☀️', 'الإضاءة', newBright, '#facc15');
            }
        }
    }, { passive: true });

    pw.addEventListener('touchend', function (e) {
        if (isSwiping) {
            touchSide = '';
            isSwiping = false;
            return;
        }

        if (e.target.closest('#controls-overlay button, #controls-overlay input, #qm')) return;

        var now = Date.now();
        if (now - lastTapTime < 300) {
            clearTimeout(singleTapTimer);
            lastTapTime = 0;
            doFullscreen();
            showDblHint(document.fullscreenElement ? '⛶ خروج من ملء الشاشة' : '⛶ ملء الشاشة مع الدوران');
        } else {
            lastTapTime = now;
            singleTapTimer = setTimeout(function () {
                if (pw.classList.contains('show-ctrl')) {
                    pw.classList.remove('show-ctrl');
                } else {
                    showControls();
                }
            }, 300);
        }
        touchSide = '';
    });
}

// بناء واجهة القنوات مع دعم لوجوهات الفجر وألوان و beIN وثمانية
function buildChannels() {
    if (!chRows) return;
    chRows.innerHTML = '';
    ROWS.forEach(function (row, ri) {
        var rDiv = document.createElement('div');
        rDiv.className = 'ch-row';
        rDiv.innerHTML = '<div class="row-label"><span>' + (row.icon || '📺') + '</span><span>' + row.label + '</span></div>';
        var scroll = document.createElement('div');
        scroll.className = 'row-scroll';

        row.channels.forEach(function (c, ci) {
            var b = document.createElement('button');
            var cls = 'ch';
            if (c.t === 'dash') cls += ' dash-ch';
            if (c.t === 'ts') cls += ' ts-ch';
            if (c.t === 'iframe') cls += ' iframe-ch';
            b.className = cls;

            if (c.logo) {
                b.classList.add('custom-logo-ch');
                var img = document.createElement('img');
                img.src = c.logo;
                img.alt = c.n;
                img.style.maxHeight = '28px';
                img.style.maxWidth = '60px';
                img.style.objectFit = 'contain';
                b.appendChild(img);
            } else if (ri === 0) {
                b.classList.add('bein-logo-ch');
                var img = document.createElement('img');
                img.src = 'bein-' + (ci + 1) + '.png';
                img.alt = c.n;
                b.appendChild(img);
            } else if (row.label && row.label.indexOf('ثمانية') !== -1) {
                b.classList.add('thamanya-ch');
                b.style.display = 'inline-flex';
                b.style.alignItems = 'center';
                b.style.gap = '8px';
                var img = document.createElement('img');
                img.src = 'thamanya.png';
                img.alt = 'ثمانية';
                var txt = document.createElement('span');
                txt.textContent = c.n.replace(/^ثمانية\s*/, '');
                b.appendChild(img);
                b.appendChild(txt);
            } else {
                b.textContent = c.n;
            }

            b.onclick = function () { load(ri, ci); };
            scroll.appendChild(b);
        });
        rDiv.appendChild(scroll);
        chRows.appendChild(rDiv);
    });
}

// بدء التشغيل التلقائي عند فتح الصفحة
buildChannels();
if (ROWS && ROWS.length && ROWS[0].channels.length) {
    load(0, 0);
}
