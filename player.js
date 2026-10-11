// ===== المشغل الشامل لـ AlameeereTv (HLS / DASH / TS) =====

var hls = null;
var shakaPlayer = null;
var tsPlayer = null;
var cur = { r: -1, i: -1 };
var retryT = null;
var ctrlHideTimer = null;
var isCtrlHidden = false;
var curQualityIdx = -1;
var lastBytes = 0;
var lastTime = 0;

// عناصر المشغل
var v = document.getElementById('v');
var wrap = document.getElementById('player-wrap');
var ctrl = document.querySelector('.ctrl');
var qMenu = document.getElementById('q-menu');
var audioMenu = document.getElementById('audio-menu');
var playBtn = document.getElementById('btn-play');
var qBtn = document.getElementById('btn-q');
var audioBtn = document.getElementById('btn-audio');

// 1. إنشاء شريط العدادات العلوي (المشاهدين + سرعة النت) وشاشات التنبيه
function setupOverlays() {
    if (!document.getElementById('top-bar-overlay')) {
        var topBar = document.createElement('div');
        topBar.id = 'top-bar-overlay';
        topBar.style.cssText = 'position:absolute;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;align-items:center;z-index:20;pointer-events:none;transition:opacity 0.3s;direction:ltr;';
        
        // عداد سرعة النت
        var speedBadge = document.createElement('div');
        speedBadge.id = 'net-speed-badge';
        speedBadge.style.cssText = 'background:rgba(0,0,0,0.65);color:#22c55e;padding:4px 10px;border-radius:14px;font-size:12px;font-weight:bold;backdrop-filter:blur(4px);border:1px solid rgba(255,255,255,0.1);';
        speedBadge.textContent = '0 KB/s';

        // عداد المشاهدين
        var viewersBadge = document.createElement('div');
        viewersBadge.id = 'live-viewers-badge';
        viewersBadge.style.cssText = 'background:rgba(220,38,38,0.75);color:#fff;padding:4px 10px;border-radius:14px;font-size:12px;font-weight:bold;backdrop-filter:blur(4px);display:flex;align-items:center;gap:5px;direction:rtl;';
        viewersBadge.innerHTML = '<span style="width:7px;height:7px;background:#fff;border-radius:50%;display:inline-block;animation:pulseDot 1.5s infinite;"></span> <span id="viewers-count">1,240</span> مباشر';

        topBar.appendChild(speedBadge);
        topBar.appendChild(viewersBadge);
        wrap.appendChild(topBar);
    }

    // شعار AlameeereTv بموج متحرك
    if (!document.getElementById('wave-logo')) {
        var waveBox = document.createElement('div');
        waveBox.id = 'wave-logo';
        waveBox.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:5;pointer-events:none;text-align:center;display:none;';
        waveBox.innerHTML = '<div style="font-size:36px;font-weight:900;letter-spacing:2px;background:linear-gradient(90deg,#444 0%,#fff 50%,#444 100%);background-size:200% 100%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:waveShimmer 2.2s infinite linear;">AlameeereTv</div>';
        wrap.appendChild(waveBox);

        // إضافة حركة الموج لـ CSS
        if (!document.getElementById('wave-style')) {
            var st = document.createElement('style');
            st.id = 'wave-style';
            st.textContent = '@keyframes waveShimmer{0%{background-position:100% 0;}100%{background-position:-100% 0;}}' +
                             '@keyframes pulseDot{0%,100%{opacity:1;}50%{opacity:0.3;}}' +
                             'button[onclick*="seek"],.btn-seek,#btn-forward,#btn-rewind{display:none!important;}';
            document.head.appendChild(st);
        }
    }

    // شاشة تنبيه: هذه القناة لا تعمل
    if (!document.getElementById('ch-error-screen')) {
        var errScreen = document.createElement('div');
        errScreen.id = 'ch-error-screen';
        errScreen.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,0.9);display:none;flex-direction:column;align-items:center;justify-content:center;z-index:25;color:#fff;gap:10px;text-align:center;';
        errScreen.innerHTML = '<div style="font-size:42px;">⚠️</div><div style="font-size:18px;font-weight:bold;color:#ef4444;">هذه القناة لا تعمل حالياً</div>';
        wrap.appendChild(errScreen);
    }
}

setupOverlays();

function showWaveLogo(show) {
    var el = document.getElementById('wave-logo');
    if (el) el.style.display = show ? 'block' : 'none';
}

function showChannelError(show) {
    var el = document.getElementById('ch-error-screen');
    if (el) el.style.display = show ? 'flex' : 'none';
}

function updateSpeed(bps) {
    var badge = document.getElementById('net-speed-badge');
    if (!badge) return;
    if (bps > 1024 * 1024) {
        badge.textContent = (bps / (1024 * 1024)).toFixed(1) + ' Mbps';
    } else {
        badge.textContent = Math.round(bps / 1024) + ' KB/s';
    }
}

// 2. إدارة إخفاء الأزرار والعدادات معاً بعد 5 ثوانٍ وعلى اللمس
function hideControls() {
    if (isCtrlHidden) return;
    if (ctrl) ctrl.style.opacity = '0';
    var topBar = document.getElementById('top-bar-overlay');
    if (topBar) topBar.style.opacity = '0';
    if (qMenu) qMenu.style.display = 'none';
    if (audioMenu) audioMenu.style.display = 'none';
    isCtrlHidden = true;
}

function showControls() {
    if (ctrl) ctrl.style.opacity = '1';
    var topBar = document.getElementById('top-bar-overlay');
    if (topBar) topBar.style.opacity = '1';
    isCtrlHidden = false;
    resetControlsTimeout();
}

function resetControlsTimeout() {
    clearTimeout(ctrlHideTimer);
    if (!v.paused) {
        ctrlHideTimer = setTimeout(hideControls, 5000);
    }
}

// التفاعل باللمس والماوس مع شاشة الفيديو
wrap.addEventListener('click', function (e) {
    if (e.target.closest('.ctrl') || e.target.closest('#q-menu') || e.target.closest('#audio-menu')) return;
    if (isCtrlHidden) {
        showControls();
    } else {
        hideControls();
    }
});

wrap.addEventListener('mousemove', function () {
    if (isCtrlHidden) showControls();
    else resetControlsTimeout();
});

// 3. تنظيف المشغلات السابقة
function destroyCurrent() {
    showChannelError(false);
    if (retryT) { clearTimeout(retryT); retryT = null; }
    if (hls) { hls.destroy(); hls = null; }
    if (shakaPlayer) { shakaPlayer.destroy(); shakaPlayer = null; }
    if (tsPlayer) { tsPlayer.destroy(); tsPlayer = null; }
    v.removeAttribute('src');
    v.load();
}

// 4. تشغيل قنوات HLS مع التثبيت على أدنى جودة تلقائياً
function playHLS(url) {
    destroyCurrent();
    showWaveLogo(false);

    if (Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            startLevel: 0, // البدء دائماً بأدنى جودة
            autoLevelCapping: -1
        });
        hls.loadSource(url);
        hls.attachMedia(v);

        hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
            // تثبيت الجودة على المستوى الأدنى 0 لمنع القفز التلقائي للجودة العالية
            if (data.levels && data.levels.length > 0) {
                hls.currentLevel = 0;
            }
            v.play().catch(function(){});
            buildHlsQuality();
            buildHlsAudio();
            resetControlsTimeout();
        });

        // قياس سرعة التنزيل الفعلية
        hls.on(Hls.Events.FRAG_LOADED, function (event, data) {
            if (data.stats && data.stats.total && data.stats.loading) {
                var duration = (data.stats.loading.end - data.stats.loading.start) / 1000;
                if (duration > 0) {
                    var bps = (data.stats.total * 8) / duration;
                    updateSpeed(bps);
                }
            }
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        hls.recoverMediaError();
                        break;
                    default:
                        destroyCurrent();
                        showChannelError(true);
                        break;
                }
            }
        });
    } else if (v.canPlayType('application/vnd.apple.mpegurl')) {
        v.src = url;
        v.play().catch(function(){});
    } else {
        showChannelError(true);
    }
}

// 5. تشغيل DASH ClearKey (مثل MBC)
function playDash(url, clearKey) {
    destroyCurrent();
    showWaveLogo(false);
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
        showChannelError(true);
        return;
    }

    shakaPlayer = new shaka.Player(v);
    
    // إلغاء ABR والتثبيت على أقل جودة
    shakaPlayer.configure({
        abr: { enabled: false }
    });

    if (clearKey) {
        var parts = clearKey.split(':');
        if (parts.length === 2) {
            var servers = {};
            servers[parts[0].trim()] = parts[1].trim();
            shakaPlayer.configure({ drm: { clearKeys: servers } });
        }
    }

    shakaPlayer.load(url).then(function () {
        var tracks = shakaPlayer.getVariantTracks();
        if (tracks.length > 0) {
            tracks.sort(function (a, b) { return a.bandwidth - b.bandwidth; });
            shakaPlayer.selectVariantTrack(tracks[0], true); // اختيار أقل جودة
        }
        v.play().catch(function(){});
        buildDashQuality();
        buildDashAudio();
        resetControlsTimeout();
    }).catch(function () {
        showChannelError(true);
    });
}

// 6. تشغيل TS المباشر
function playTS(url) {
    destroyCurrent();
    showWaveLogo(false);
    if (window.mpegts && mpegts.isSupported()) {
        tsPlayer = mpegts.createPlayer({ type: 'mpegts', isLive: true, url: url });
        tsPlayer.attachMediaElement(v);
        tsPlayer.load();
        tsPlayer.play().catch(function () {
            showChannelError(true);
        });
    } else {
        showChannelError(true);
    }
}

// 7. دالة تشغيل القناة (Load)
function load(ri, ci) {
    showChannelError(false);
    cur.r = ri;
    cur.i = ci;
    var ch = ROWS[ri].channels[ci];
    if (!ch) return;

    // تمييز الزر النشط في قائمة القنوات
    document.querySelectorAll('.ch-btn').forEach(function (b) { b.classList.remove('active'); });
    var btn = document.getElementById('ch-' + ri + '-' + ci);
    if (btn) btn.classList.add('active');

    // قنوات ذات جودات متعددة (مثل beIN): نبدأ دائماً بآخر جودة (الأقل / SD)
    if (ch.qualities && ch.qualities.length > 0) {
        var lowestIdx = ch.qualities.length - 1; // الجودة الأقل (SD)
        curQualityIdx = lowestIdx;
        buildCustomQualityMenu(ch, lowestIdx);
        playHLS(ch.qualities[lowestIdx].url);
        return;
    }

    curQualityIdx = -1;

    // تشغيل باقي أنواع القنوات
    if (ch.dash) {
        playDash(ch.dash, ch.clearKey);
    } else if (ch.ts) {
        playTS(ch.ts);
    } else if (ch.url) {
        playHLS(ch.url);
    }
}

// 8. بناء قائمة الجودات المخصصة وتلوين النشطة بالأخضر
function buildCustomQualityMenu(ch, activeIdx) {
    if (!qMenu) return;
    qMenu.innerHTML = '';
    ch.qualities.forEach(function (q, idx) {
        var b = document.createElement('button');
        b.className = 'q-item';
        b.textContent = q.name || q.label;
        if (idx === activeIdx) {
            b.style.color = '#22c55e';
            b.style.fontWeight = 'bold';
        }
        b.onclick = function () {
            curQualityIdx = idx;
            buildCustomQualityMenu(ch, idx);
            playHLS(q.url);
            qMenu.style.display = 'none';
        };
        qMenu.appendChild(b);
    });
}

// بناء جودات HLS التلقائية
function buildHlsQuality() {
    if (!qMenu || !hls || !hls.levels) return;
    qMenu.innerHTML = '';
    hls.levels.forEach(function (lvl, idx) {
        var b = document.createElement('button');
        b.className = 'q-item';
        b.textContent = lvl.height ? (lvl.height + 'p') : ('جودة ' + (idx + 1));
        if (idx === hls.currentLevel) {
            b.style.color = '#22c55e';
            b.style.fontWeight = 'bold';
        }
        b.onclick = function () {
            hls.currentLevel = idx; // تثبيت يدوي دائم
            buildHlsQuality();
            qMenu.style.display = 'none';
        };
        qMenu.appendChild(b);
    });
}

// بناء جودات DASH التلقائية
function buildDashQuality() {
    if (!qMenu || !shakaPlayer) return;
    qMenu.innerHTML = '';
    var tracks = shakaPlayer.getVariantTracks();
    tracks.forEach(function (t, idx) {
        var b = document.createElement('button');
        b.className = 'q-item';
        b.textContent = t.height ? (t.height + 'p') : (Math.round(t.bandwidth / 1000) + 'k');
        if (t.active) {
            b.style.color = '#22c55e';
            b.style.fontWeight = 'bold';
        }
        b.onclick = function () {
            shakaPlayer.selectVariantTrack(t, true);
            buildDashQuality();
            qMenu.style.display = 'none';
        };
        qMenu.appendChild(b);
    });
}

// 9. دعم القنوات الصوتية / المعلقين (Audio Tracks)
function buildHlsAudio() {
    if (!audioMenu || !hls) return;
    audioMenu.innerHTML = '';
    var tracks = hls.audioTracks;
    if (tracks && tracks.length > 1) {
        if (audioBtn) audioBtn.style.display = 'inline-flex';
        tracks.forEach(function (t, idx) {
            var b = document.createElement('button');
            b.className = 'audio-item';
            b.textContent = t.name || ('صوت ' + (idx + 1));
            if (idx === hls.audioTrack) {
                b.style.color = '#22c55e';
                b.style.fontWeight = 'bold';
            }
            b.onclick = function () {
                hls.audioTrack = idx;
                buildHlsAudio();
                audioMenu.style.display = 'none';
            };
            audioMenu.appendChild(b);
        });
    } else {
        if (audioBtn) audioBtn.style.display = 'none';
    }
}

function buildDashAudio() {
    if (!audioMenu || !shakaPlayer) return;
    audioMenu.innerHTML = '';
    var languages = shakaPlayer.getAudioLanguages();
    if (languages && languages.length > 1) {
        if (audioBtn) audioBtn.style.display = 'inline-flex';
        languages.forEach(function (lang) {
            var b = document.createElement('button');
            b.className = 'audio-item';
            b.textContent = lang === 'ar' ? 'تعليق عربي' : lang;
            b.onclick = function () {
                shakaPlayer.selectAudioLanguage(lang);
                audioMenu.style.display = 'none';
            };
            audioMenu.appendChild(b);
        });
    } else {
        if (audioBtn) audioBtn.style.display = 'none';
    }
}

// 10. فتح وإغلاق القوائم المنبثقة
function toggleQ() {
    if (!qMenu) return;
    if (qMenu.style.display === 'block') {
        qMenu.style.display = 'none';
    } else {
        if (audioMenu) audioMenu.style.display = 'none';
        qMenu.style.display = 'block';
    }
    resetControlsTimeout();
}

function toggleAudio() {
    if (!audioMenu) return;
    if (audioMenu.style.display === 'block') {
        audioMenu.style.display = 'none';
    } else {
        if (qMenu) qMenu.style.display = 'none';
        audioMenu.style.display = 'block';
    }
    resetControlsTimeout();
}

// 11. تشغيل / إيقاف
function togglePlay() {
    if (v.paused) {
        v.play();
        if (playBtn) playBtn.textContent = '⏸';
    } else {
        v.pause();
        if (playBtn) playBtn.textContent = '▶';
    }
    resetControlsTimeout();
}

// 12. ملء الشاشة
function toggleFull() {
    if (!document.fullscreenElement) {
        if (wrap.requestFullscreen) wrap.requestFullscreen();
        else if (wrap.webkitRequestFullscreen) wrap.webkitRequestFullscreen();
        else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
}

// 13. بناء صفوف وأيقونات القنوات مع إصلاح شعارات ألوان والفجر
function buildChannels() {
    var chRows = document.getElementById('ch-rows');
    if (!chRows || !window.ROWS) return;
    chRows.innerHTML = '';

    ROWS.forEach(function (row, ri) {
        var rDiv = document.createElement('div');
        rDiv.className = 'row-wrap';

        var label = document.createElement('div');
        label.className = 'row-label';
        label.innerHTML = '<span class="tv-icon">📺</span>' + row.group;
        rDiv.appendChild(label);

        var scroll = document.createElement('div');
        scroll.className = 'ch-scroll';

        row.channels.forEach(function (c, ci) {
            var b = document.createElement('button');
            b.className = 'ch-btn';
            b.id = 'ch-' + ri + '-' + ci;

            if (c.logo) {
                // عرض الشعار بملء المساحة بدون تشويه وبدون كتابة الاسم تحته
                var img = document.createElement('img');
                img.src = c.logo;
                img.style.cssText = 'max-height:36px;max-width:85%;object-fit:contain;pointer-events:none;';
                b.appendChild(img);
            } else if (ri === 0) {
                // شعارات beIN
                var imgBein = document.createElement('img');
                imgBein.src = 'bein.png';
                imgBein.style.cssText = 'max-height:28px;max-width:60px;object-fit:contain;pointer-events:none;';
                var numSpan = document.createElement('span');
                numSpan.className = 'bein-num';
                numSpan.textContent = (ci + 1);
                b.appendChild(imgBein);
                b.appendChild(numSpan);
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
    load(0, 0); // تشغيل أول قناة فوراً بأقل جودة
} else {
    showWaveLogo(true);
}
