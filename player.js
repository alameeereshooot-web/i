// ===== المشغل الشامل لـ HLS و MPEG-DASH (ClearKey) و TS =====

var hls = null;
var shakaPlayer = null;
var tsPlayer = null;
var cur = { r: -1, i: -1 };
var retryT = null;

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
brightL.style.opacity = brightness;

// تناسب العرض
var ASPECTS = [{ cls: 'fc', lbl: '↕ عادي' }, { cls: 'fv', lbl: '⛶ ملء' }, { cls: 'ff', lbl: '↔ مفيد' }];
var aspectIdx = parseInt(localStorage.getItem('aspectIdx') || '0');
function applyAspect(i) {
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

function showLoader() { loader.style.display = 'flex'; }
function hideLoader() { loader.style.display = 'none'; }
function toast(msg) {
    var t = document.getElementById('err-toast');
    t.textContent = msg;
    t.style.display = 'block';
    setTimeout(function () { t.style.display = 'none'; }, 4000);
}

// تنظيف وتدمير المشغلات الحالية قبل تشغيل بث جديد
async function resetPlayers() {
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
    vid.removeAttribute('src');
    vid.load();
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

    // إعدادات مفاتيح ClearKey إن وجدت
    if (clearkeyConfig && Object.keys(clearkeyConfig).length > 0) {
        shakaPlayer.configure({
            drm: {
                clearKeys: clearkeyConfig
            }
        });
    }

    shakaPlayer.addEventListener('error', function (event) {
        console.error('Shaka error:', event.detail);
        toast('خطأ في تشغيل DASH: ' + (event.detail?.message || 'مشكلة في التشفير أو البث'));
    });

    try {
        await shakaPlayer.load(url);
        hideLoader();
        pw.classList.add('playing');
        vid.play().catch(function () {});
        buildDashQuality();
    } catch (e) {
        hideLoader();
        console.error('Failed to load DASH:', e);
        toast('تعذر فك تشفير أو تشغيل بث DASH');
    }
}

// تشغيل روابط MPEG-TS المباشرة عبر mpegts.js
function loadTs(url) {
    showLoader();
    vid.style.display = 'block';
    iframeWrap.style.display = 'none';
    resetPlayers().then(function () {
        if (window.mpegts && mpegts.getFeatureList().mseLivePlayback) {
            tsPlayer = mpegts.createPlayer({
                type: 'mpegts',
                isLive: true,
                url: url
            }, {
                enableWorker: true,
                lazyLoad: false,
                liveBufferLatencyChasing: true
            });
            tsPlayer.attachMediaElement(vid);
            tsPlayer.load();
            tsPlayer.play().catch(function () {});

            tsPlayer.on(mpegts.Events.ERROR, function (e, d) {
                console.error('TS Error:', e, d);
                hideLoader();
                toast('خطأ في تشغيل بث TS');
            });

            vid.addEventListener('playing', function () {
                hideLoader();
                pw.classList.add('playing');
            }, { once: true });
        } else {
            hideLoader();
            toast('المتصفح لا يدعم تشغيل بث TS');
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
                startLevel: 0,
                autoLevelEnabled: false,
                lowLatencyMode: true,
                manifestLoadingMaxRetry: 4
            });
            hls.loadSource(url);
            hls.attachMedia(vid);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                hideLoader();
                pw.classList.add('playing');
                vid.play().catch(function () {});
                buildHlsQuality();
            });
            hls.on(Hls.Events.ERROR, function (e, d) {
                if (d.fatal) {
                    toast('خطأ في الاتصال بقناة HLS');
                    if (d.type === Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    }
                }
            });
        } else if (vid.canPlayType('application/vnd.apple.mpegurl')) {
            vid.src = url;
            vid.addEventListener('loadeddata', function () { hideLoader(); pw.classList.add('playing'); }, { once: true });
            vid.play().catch(function () {});
        } else {
            hideLoader();
            toast('المتصفح لا يدعم بث HLS');
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
    chTitle.textContent = ch.n;
    chTitle.style.display = 'block';

    var type = ch.t || (ch.u.includes('.mpd') ? 'dash' : (ch.u.includes('.ts') ? 'ts' : 'hls'));

    if (type === 'dash') {
        loadDash(ch.u, ch.clearkey);
    } else if (type === 'ts') {
        loadTs(ch.u);
    } else if (type === 'iframe') {
        resetPlayers();
        vid.style.display = 'none';
        iframeWrap.style.display = 'block';
        iframePlayer.src = ch.u;
        pw.classList.add('playing');
    } else {
        loadHls(ch.u);
    }
}

// بناء قائمة الجودة لـ HLS
function buildHlsQuality() {
    qm.innerHTML = '';
    if (!hls || !hls.levels?.length) return;
    var autoBtn = document.createElement('button');
    autoBtn.textContent = 'تلقائي';
    autoBtn.onclick = function () { hls.currentLevel = -1; closeQ(); };
    qm.appendChild(autoBtn);

    hls.levels.forEach(function (lv, i) {
        var b = document.createElement('button');
        b.textContent = lv.height ? lv.height + 'p' : Math.round(lv.bitrate / 1000) + 'k';
        b.onclick = function () { hls.currentLevel = i; closeQ(); };
        qm.appendChild(b);
    });
}

// بناء قائمة الجودة لـ DASH
function buildDashQuality() {
    qm.innerHTML = '';
    if (!shakaPlayer) return;
    var tracks = shakaPlayer.getVariantTracks().filter(t => t.type === 'video');
    if (!tracks.length) return;

    var autoBtn = document.createElement('button');
    autoBtn.textContent = 'تلقائي';
    autoBtn.onclick = function () {
        shakaPlayer.configure({ abr: { enabled: true } });
        closeQ();
    };
    qm.appendChild(autoBtn);

    tracks.forEach(function (tr) {
        var b = document.createElement('button');
        b.textContent = tr.height ? tr.height + 'p' : Math.round(tr.bandwidth / 1000) + 'k';
        b.onclick = function () {
            shakaPlayer.configure({ abr: { enabled: false } });
            shakaPlayer.selectVariantTrack(tr, true);
            closeQ();
        };
        qm.appendChild(b);
    });
}

function closeQ() {`qm.classList.remove('open'); }
function toggleQ() { qm.classList.toggle('open'); }

function togglePlay() { vid.paused ? vid.play() : vid.pause(); }
function toggleMute() {
    vid.muted = !vid.muted;
    document.getElementById('mute-btn').textContent = vid.muted ? '🔇' : '🔊';
    document.getElementById('vs').value = vid.muted ? 0 : vid.volume;
}
function setVolume(v) {
    vid.volume = parseFloat(v);
    vid.muted = v == 0;
    document.getElementById('mute-btn').textContent = v == 0 ? '🔇' : '🔊';
    document.getElementById('vs').value = v;
}
function skip(s) { vid.currentTime += s; }
function reloadCurrentStream() {
    if (cur.r !== -1 && cur.i !== -1) load(cur.r, cur.i);
}

// إعداد كامل الشاشة
function doFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else {
        var req = pw.requestFullscreen || pw.webkitRequestFullscreen;
        if (req) req.call(pw);
    }
}

// بناء واجهة القنوات
function buildChannels() {
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
            b.textContent = c.n;
            b.id = 'ch-' + ri + '-' + ci;
            b.onclick = function () { load(ri, ci); };
            scroll.appendChild(b);
        });
        rDiv.appendChild(scroll);
        chRows.appendChild(rDiv);
    });
}

// بدء التشغيل
buildChannels();
if (ROWS.length && ROWS[0].channels.length) {
    load(0, 0);
}
