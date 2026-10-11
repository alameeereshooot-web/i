// ===== المشغل الشامل لـ HLS و MPEG-DASH (ClearKey) و TS =====

var hls = null;
var shakaPlayer = null;
var tsPlayer = null;
var cur = { r: -1, i: -1 };
var retryT = null;
var ctrlTimer = null;
var curQualityIdx = 0;
var netSpeedInterval = null;
var lastLoadedBytes = 0;
var lastSpeedTime = Date.now();

// عناصر الصفحة المتطابقة 100% مع index.html
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
var ctrlOverlay = document.getElementById('controls-overlay');

// 1. إخفاء زري التقديم والتأخير نهائياً وتنظيف الشريط
function cleanControls() {
    var skipBtns = document.querySelectorAll('#btn-row button[onclick*="skip"]');
    skipBtns.forEach(function (b) { b.style.display = 'none'; });

    // تحسين زر السرعة ليعمل كـ Toggle لإظهار/إخفاء بادج سرعة النت الحقيقية
    if (spdBtn) {
        spdBtn.onclick = function () {
            if (speedBadge) {
                speedBadge.classList.toggle('hide');
                spdBtn.classList.toggle('on', !speedBadge.classList.contains('hide'));
            }
        };
    }

    // إضافة عداد المشاهدين بجانب عنوان القناة في شريط التحكم العلوي
    var topBar = document.getElementById('top-bar');
    if (topBar && !document.getElementById('viewers-badge')) {
        var vb = document.createElement('div');
        vb.id = 'viewers-badge';
        vb.style.cssText = 'background:rgba(220,38,38,0.8);color:#fff;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:bold;display:flex;align-items:center;gap:5px;direction:rtl;';
        vb.innerHTML = '<span style="width:6px;height:6px;background:#fff;border-radius:50%;display:inline-block;"></span> <span id="viewers-count">1,240</span> مباشر';
        topBar.appendChild(vb);

        setInterval(function () {
            var countEl = document.getElementById('viewers-count');
            if (countEl) {
                var curCount = parseInt(countEl.textContent.replace(/,/g, '')) || 1240;
                var delta = Math.floor(Math.random() * 9) - 4;
                var nextCount = Math.max(450, curCount + delta);
                countEl.textContent = nextCount.toLocaleString();
            }
        }, 6000);
    }

    // إضافة زر الصوتيات وقائمته
    var btnRow = document.getElementById('btn-row');
    var qw = document.getElementById('qw');
    if (btnRow && qw && !document.getElementById('audio-wrap')) {
        var aw = document.createElement('div');
        aw.id = 'audio-wrap';
        aw.style.cssText = 'position:relative;display:none;';
        aw.innerHTML = '<button class="tb" id="audio-btn" onclick="toggleAudio()" title="المعلقين / الصوتيات">🎙️ صوت</button>' +
                       '<div id="am" style="position:absolute;bottom:42px;left:0;background:rgba(15,15,15,0.95);border:1px solid rgba(255,255,255,0.15);border-radius:8px;display:none;flex-direction:column;min-width:110px;max-height:200px;overflow-y:auto;z-index:60;box-shadow:0 4px 12px rgba(0,0,0,0.6);backdrop-filter:blur(4px);"></div>';
        btnRow.insertBefore(aw, qw);
    }

    // إعداد تأثير الموج لشعار AlameeereTv الترحيبي
    var brandSpan = document.querySelector('#brand-overlay span');
    if (brandSpan) {
        brandSpan.style.background = 'linear-gradient(90deg, #444 0%, #ffffff 50%, #444 100%)';
        brandSpan.style.backgroundSize = '200% 100%';
        brandSpan.style.webkitBackgroundClip = 'text';
        brandSpan.style.webkitTextFillColor = 'transparent';
        brandSpan.style.animation = 'waveShimmer 2.4s infinite linear';
    }
    if (!document.getElementById('wave-anim-style')) {
        var st = document.createElement('style');
        st.id = 'wave-anim-style';
        st.textContent = '@keyframes waveShimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }' +
                         '#qm button.active-q { color: #22c55e !important; font-weight: bold !important; background: rgba(34, 197, 94, 0.15) !important; }' +
                         '#am button { background:transparent; border:none; border-bottom:1px solid rgba(255,255,255,0.05); color:#eee; padding:8px 12px; font-size:12px; text-align:center; cursor:pointer; }' +
                         '#am button.active-a { color: #22c55e !important; font-weight: bold !important; background: rgba(34, 197, 94, 0.15) !important; }' +
                         '#am.open { display: flex !important; }';
        document.head.appendChild(st);
    }
}
cleanControls();

// 2. التحكم في إخفاء الأزرار وشريط التحكم بعد 5 ثوانٍ
function resetCtrlTimeout() {
    clearTimeout(ctrlTimer);
    pw.classList.add('show-ctrl');
    ctrlTimer = setTimeout(function () {
        pw.classList.remove('show-ctrl');
        closeQ();
        closeAudio();
    }, 5000);
}

pw.addEventListener('mousemove', resetCtrlTimeout);
pw.addEventListener('click', function (e) {
    if (e.target.closest('#controls-overlay button, #controls-overlay input, #qm, #am')) return;
    resetCtrlTimeout();
});

// إعداد الإضاءة وتناسب العرض
var brightness = parseFloat(localStorage.getItem('brightness') || '0');
if (brightL) brightL.style.opacity = brightness;

var ASPECTS = [{ cls: 'fc', lbl: '↕ عادي' }, { cls: 'fv', lbl: '⛶ ملء' }, { cls: 'ff', lbl: '↔ مفيد' }];
var aspectIdx = parseInt(localStorage.getItem('aspectIdx') || '0');
function applyAspect(i) {
    if (!vid || !fitBtn) return;
    vid.className = ASPECTS[i].cls;
    fitBtn.textContent = ASPECTS[i].lbl;
    fitBtn.classList.toggle('on', i !== 0);
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
    t.textContent = msg || '⚠️ هذه القناة لا تعمل';
    t.style.display = 'block';
    setTimeout(function () { t.style.display = 'none'; }, 4000);
}

// قياس سرعة التنزيل الحقيقية للنت
function updateNetSpeed(bytes) {
    if (!speedBadge || speedBadge.classList.contains('hide')) return;
    var now = Date.now();
    var duration = (now - lastSpeedTime) / 1000;
    if (duration > 0.4 && bytes > 0) {
        var kbps = Math.round((bytes / 1024) / duration);
        if (kbps > 1024) {
            speedBadge.textContent = '📡 ' + (kbps / 1024).toFixed(1) + ' MB/s';
        } else {
            speedBadge.textContent = '📡 ' + kbps + ' KB/s';
        }
        lastSpeedTime = now;
    }
}

// تنظيف وتدمير المشغلات الحالية قبل تشغيل بث جديد
async function resetPlayers() {
    if (hls) { hls.destroy(); hls = null; }
    if (shakaPlayer) { await shakaPlayer.destroy(); shakaPlayer = null; }
    if (tsPlayer) { tsPlayer.destroy(); tsPlayer = null; }
    if (vid) { vid.removeAttribute('src'); vid.load(); }
}

// تشغيل روابط MPEG-DASH مع فك تشفير ClearKey
async function loadDash(url, clearkeyConfig) {
    showLoader();
    if (vid) vid.style.display = 'block';
    if (iframeWrap) iframeWrap.style.display = 'none';
    await resetPlayers();

    if (!window.shaka) {
        hideLoader();
        toast('⚠️ مكتبة Shaka Player غير محملة');
        return;
    }

    shaka.polyfill.installAll();
    if (!shaka.Player.isBrowserSupported()) {
        hideLoader();
        toast('⚠️ متصفحك لا يدعم تشغيل MPEG-DASH');
        return;
    }

    shakaPlayer = new shaka.Player(vid);
    var drmConfig = {};
    if (clearkeyConfig && Object.keys(clearkeyConfig).length > 0) {
        drmConfig.clearKeys = clearkeyConfig;
    }

    shakaPlayer.configure({
        drm: drmConfig,
        manifest: { dash: { ignoreDrmInfo: true } },
        streaming: { bufferingGoal: 10, rebufferingGoal: 2 },
        abr: { enabled: false }
    });

    shakaPlayer.addEventListener('error', function (event) {
        console.error('Shaka error:', event.detail);
        hideLoader();
        toast('⚠️ هذه القناة لا تعمل');
    });

    try {
        await shakaPlayer.load(url);
        hideLoader();
        pw.classList.add('playing');
        vid.play().catch(function () {});
        buildDashQuality();
        buildDashAudio();
        resetCtrlTimeout();
    } catch (e) {
        hideLoader();
        console.error('Failed to load DASH:', e);
        toast('⚠️ هذه القناة لا تعمل');
    }
}

// تشغيل روابط MPEG-TS المباشرة عبر mpegts.js
async function loadTs(url) {
    if (!window.mpegts || !mpegts.isSupported()) {
        toast('⚠️ المتصفح لا يدعم بث TS');
        return;
    }
    showLoader();
    if (vid) vid.style.display = 'block';
    if (iframeWrap) iframeWrap.style.display = 'none';
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
        resetCtrlTimeout();
    }, { once: true });

    tsPlayer.play().catch(function (e) {
        console.log('Autoplay TS:', e);
    });

    tsPlayer.on(mpegts.Events.ERROR, function (type, detail, info) {
        console.error('TS Error:', type, detail, info);
        hideLoader();
        toast('⚠️ هذه القناة لا تعمل');
    });
}

// تشغيل روابط HLS
function loadHls(url) {
    showLoader();
    if (vid) vid.style.display = 'block';
    if (iframeWrap) iframeWrap.style.display = 'none';
    resetPlayers().then(function () {
        if (window.Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                startLevel: 0,
                autoLevelCapping: -1,
                liveSyncDurationCount: 1,
                liveMaxLatencyDurationCount: 3,
                maxBufferLength: 8,
                maxMaxBufferLength: 15,
                manifestLoadingTimeOut: 3500,
                manifestLoadingMaxRetry: 2,
                levelLoadingTimeOut: 3500,
                fragLoadingTimeOut: 5000
            });
            hls.loadSource(url);
            hls.attachMedia(vid);

            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                hideLoader();
                pw.classList.add('playing');
                hls.currentLevel = 0;
                vid.play().catch(function () {});
                buildHlsQuality();
                buildHlsAudio();
                resetCtrlTimeout();
            });

            hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
                if (data && data.frag && data.frag.loaded) {
                    updateNetSpeed(data.frag.loaded);
                }
            });

            hls.on(Hls.Events.ERROR, function (e, d) {
                if (d.fatal) {
                    hideLoader();
                    toast('⚠️ هذه القناة لا تعمل');
                    if (d.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    }
                }
            });
        } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = url;
            vid.addEventListener('loadeddata', function () {
                hideLoader();
                pw.classList.add('playing');
                resetCtrlTimeout();
            }, { once: true });
            vid.play().catch(function () {});
        } else {
            hideLoader();
            toast('⚠️ المتصفح لا يدعم بث HLS');
        }
    });
}

// دالة اختيار القناة وتحويلها للمشغل المناسب
function load(ri, ci) {
    if (ri < 0 || ri >= ROWS.length || ci < 0 || ci >= ROWS[ri].channels.length) return;
    cur = { r: ri, i: ci };
    if (retryT) { clearTimeout(retryT); retryT = null; }

    document.querySelectorAll('.ch').forEach(function (b) { b.classList.remove('on'); });
    var btn = document.getElementById('ch-' + ri + '-' + ci);
    if (btn) btn.classList.add('on');

    var ch = ROWS[ri].channels[ci];
    if (chTitle) {
        chTitle.textContent = ch.n;
        chTitle.style.display = 'block';
    }

    curQualityIdx = 0;
    buildCustomQualityMenu(ch);

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

    var type = ch.t || (targetUrl.includes('.mpd') ? 'dash' : (targetUrl.includes('.ts') ? 'ts' : 'hls'));

    if (type === 'dash') {
        loadDash(targetUrl, ch.clearkey);
    } else if (type === 'ts') {
        loadTs(targetUrl);
    } else if (type === 'iframe') {
        resetPlayers();
        if (vid) vid.style.display = 'none';
        if (iframeWrap) iframeWrap.style.display = 'block';
        if (iframePlayer) iframePlayer.src = targetUrl;
        pw.classList.add('playing');
        resetCtrlTimeout();
    } else {
        loadHls(finalUrl);
    }
}

// بناء قائمة الجودة مع تلوين الجودة النشطة بالأخضر
function buildCustomQualityMenu(ch) {
    if (!qm) return;
    qm.innerHTML = '';
    if (ch.qualities && ch.qualities.length > 0) {
        ch.qualities.forEach(function (q, idx) {
            var b = document.createElement('button');
            b.textContent = q.label;
            if (idx === curQualityIdx) b.classList.add('active-q');

            b.onclick = function () {
                curQualityIdx = idx;
                var qBtns = qm.querySelectorAll('button');
                qBtns.forEach(function (btn) { btn.classList.remove('active-q'); });
                b.classList.add('active-q');

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

function buildHlsQuality() {
    if (cur.r !== -1 && cur.i !== -1 && ROWS[cur.r].channels[cur.i].qualities) return;
    if (!qm || !hls || !hls.levels || !hls.levels.length) return;
    qm.innerHTML = '';

    hls.levels.forEach(function (lv, i) {
        var b = document.createElement('button');
        b.textContent = lv.height ? lv.height + 'p' : Math.round(lv.bitrate / 1000) + 'k';
        if (hls.currentLevel === i || (hls.currentLevel === -1 && i === 0)) b.classList.add('active-q');

        b.onclick = function () {
            hls.currentLevel = i;
            var qBtns = qm.querySelectorAll('button');
            qBtns.forEach(function (btn) { btn.classList.remove('active-q'); });
            b.classList.add('active-q');
            closeQ();
        };
        qm.appendChild(b);
    });

    var autoBtn = document.createElement('button');
    autoBtn.textContent = 'تلقائي (Auto)';
    if (hls.currentLevel === -1) autoBtn.classList.add('active-q');
    autoBtn.onclick = function () {
        hls.currentLevel = -1;
        var qBtns = qm.querySelectorAll('button');
        qBtns.forEach(function (btn) { btn.classList.remove('active-q'); });
        autoBtn.classList.add('active-q');
        closeQ();
    };
    qm.appendChild(autoBtn);
}

function buildDashQuality() {
    if (cur.r !== -1 && cur.i !== -1 && ROWS[cur.r].channels[cur.i].qualities) return;
    if (!qm || !shakaPlayer) return;
    qm.innerHTML = '';

    var rawTracks = shakaPlayer.getVariantTracks().filter(function (t) { return t.height; });
    if (!rawTracks.length) return;

    rawTracks.sort(function (a, b) { return (a.height || 0) - (b.height || 0); });

    var seen = {};
    var tracks = rawTracks.filter(function (t) {
        if (seen[t.height]) return false;
        seen[t.height] = true;
        return true;
    });

    tracks.forEach(function (tr, idx) {
        var b = document.createElement('button');
        b.textContent = tr.height + 'p';
        if (idx === 0) b.classList.add('active-q');

        b.onclick = function () {
            shakaPlayer.configure({ abr: { enabled: false } });
            shakaPlayer.selectVariantTrack(tr, true);
            var qBtns = qm.querySelectorAll('button');
            qBtns.forEach(function (btn) { btn.classList.remove('active-q'); });
            b.classList.add('active-q');
            closeQ();
        };
        qm.appendChild(b);
    });
}

// دعم اختيار المسارات الصوتية
function buildHlsAudio() {
    var aw = document.getElementById('audio-wrap');
    var am = document.getElementById('am');
    if (!aw || !am || !hls || !hls.audioTracks || hls.audioTracks.length <= 1) {
        if (aw) aw.style.display = 'none';
        return;
    }
    aw.style.display = 'inline-block';
    am.innerHTML = '';
    hls.audioTracks.forEach(function (track, i) {
        var b = document.createElement('button');
        b.textContent = track.name || ('صوت ' + (i + 1));
        if (hls.audioTrack === i) b.classList.add('active-a');
        b.onclick = function () {
            hls.audioTrack = i;
            var aBtns = am.querySelectorAll('button');
            aBtns.forEach(function (btn) { btn.classList.remove('active-a'); });
            b.classList.add('active-a');
            closeAudio();
        };
        am.appendChild(b);
    });
}

function buildDashAudio() {
    var aw = document.getElementById('audio-wrap');
    var am = document.getElementById('am');
    if (!aw || !am || !shakaPlayer) return;
    var audioTracks = shakaPlayer.getAudioLanguages();
    if (!audioTracks || audioTracks.length <= 1) {
        aw.style.display = 'none';
        return;
    }
    aw.style.display = 'inline-block';
    am.innerHTML = '';
    audioTracks.forEach(function (lang, i) {
        var b = document.createElement('button');
        b.textContent = lang || ('صوت ' + (i + 1));
        b.onclick = function () {
            shakaPlayer.selectAudioLanguage(lang);
            var aBtns = am.querySelectorAll('button');
            aBtns.forEach(function (btn) { btn.classList.remove('active-a'); });
            b.classList.add('active-a');
            closeAudio();
        };
        am.appendChild(b);
    });
}

function closeQ() { if (qm) qm.classList.remove('open'); }
function toggleQ() { if (qm) qm.classList.toggle('open'); closeAudio(); }
function closeAudio() { var am = document.getElementById('am'); if (am) am.classList.remove('open'); }
function toggleAudio() { var am = document.getElementById('am'); if (am) am.classList.toggle('open'); closeQ(); }

function togglePlay() { if (vid) { vid.paused ? vid.play() : vid.pause(); } }
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
function reloadCurrentStream() {
    if (cur.r !== -1 && cur.i !== -1) load(cur.r, cur.i);
}

// كامل الشاشة مع الدوران
function doFullscreen() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement || pw.classList.contains('fullscreen-fallback');
    if (isFs) {
        if (document.exitFullscreen) document.exitFullscreen().catch(function () {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(function () {});
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
        } else if (vid && vid.webkitEnterFullscreen) {
            vid.webkitEnterFullscreen();
        } else {
            pw.classList.add('fullscreen-fallback');
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock('landscape').catch(function () {});
            }
        }
    }
}

['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) {
    document.addEventListener(ev, function () {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            pw.classList.remove('fullscreen-fallback');
            if (screen.orientation && screen.orientation.unlock) {
                try { screen.orientation.unlock(); } catch (e) {}
            }
        }
    });
});

// إيماءات اللمس: الصوت (يمين)، الإضاءة (يسار)، النقر (إظهار/إخفاء)، النقر المزدوج (ملء الشاشة)
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

pw.addEventListener('touchstart', function (e) {
    if (e.target.closest('#controls-overlay button, #controls-overlay input, #qm, #am')) return;

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
            var curOp = parseFloat(brightL ? brightL.style.opacity : '0') || 0;
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
        } else if (touchSide === 'bright' && brightL) {
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

    if (e.target.closest('#controls-overlay button, #controls-overlay input, #qm, #am')) return;

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
                clearTimeout(ctrlTimer);
                closeQ();
                closeAudio();
            } else {
                resetCtrlTimeout();
            }
        }, 280);
    }
    touchSide = '';
});

// بناء واجهة القنوات الأصلية المتوافقة 100% مع style.css
function buildChannels() {
    if (!chRows || !window.ROWS) return;
    chRows.innerHTML = '';

    ROWS.forEach(function (row, ri) {
        var rDiv = document.createElement('div');
        rDiv.className = 'ch-row';

        var rowTitle = row.label || row.group || '';
        rDiv.innerHTML = '<div class="row-label"><span>' + (row.icon || '📺') + '</span><span>' + rowTitle + '</span></div>';

        var scroll = document.createElement('div');
        scroll.className = 'row-scroll';

        row.channels.forEach(function (c, ci) {
            var b = document.createElement('button');
            var cls = 'ch';
            if (c.t === 'dash') cls += ' dash-ch';
            if (c.t === 'ts') cls += ' ts-ch';
            if (c.t === 'iframe') cls += ' iframe-ch';
            b.className = cls;
            b.id = 'ch-' + ri + '-' + ci;

            if (c.logo) {
                b.classList.add('custom-logo-ch');
                var img = document.createElement('img');
                img.src = c.logo;
                img.alt = c.n;
                b.appendChild(img);
            } else if (ri === 0) {
                b.classList.add('bein-logo-ch');
                var img = document.createElement('img');
                img.src = 'bein-' + (ci + 1) + '.png';
                img.alt = c.n;
                b.appendChild(img);
            } else if (rowTitle.indexOf('ثمانية') !== -1) {
                b.classList.add('thamanya-ch');
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

            b.onclick = function () {
                load(ri, ci);
            };
            scroll.appendChild(b);
        });

        rDiv.appendChild(scroll);
        chRows.appendChild(rDiv);
    });
}

// بدء التشغيل
buildChannels();
if (window.ROWS && ROWS.length && ROWS[0].channels.length) {
    load(0, 0);
}
