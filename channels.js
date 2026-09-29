// ===== دعم ClearKey وقنوات MPEG-DASH و HLS =====

var beinChannels = [
    { n: "bein 1 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/50.m3u8", t: "hls" },
    { n: "bein 2 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/51.m3u8", t: "hls" },
    { n: "bein 3 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/52.m3u8", t: "hls" },
    { n: "bein 4 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/53.m3u8", t: "hls" },
    { n: "bein 5 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/54.m3u8", t: "hls" },
    { n: "bein 6 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/55.m3u8", t: "hls" },
    { n: "bein 7 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/56.m3u8", t: "hls" },
    { n: "bein 8 HD", u: "https://mainnew.fiberlive.live:8443/live/D8550E7ACCB1/775371713/57.m3u8", t: "hls" }
];

var dashClearKeyChannels = [
    // أمثلة لقنوات MPEG-DASH المشفرة بـ ClearKey:
    // المفاتيح تكون بنظام 16-byte hex: KEY_ID : KEY
    {
        n: "تجربة DASH ClearKey",
        u: "https://storage.googleapis.com/shaka-demo-assets/angel-one-clearkey/dash.mpd",
        t: "dash",
        clearkey: {
            "4a656e6e69666572416e6e6973746f6e": "7b80302b0c3cb7a26f0490b62b694b28"
        }
    }
];

var beinMultiChannels = [
    { n: "bein1", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F194432.m3u8", t: "hls" },
    { n: "bein2", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F618157.m3u8", t: "hls" },
    { n: "bein3", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F117974.m3u8", t: "hls" },
    { n: "bein4", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F194432.m3u8", t: "hls" },
    { n: "bein5", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F332578.m3u8", t: "hls" }
];

var newsChannels = [
    { n: "الجزيرة", u: "https://live-hls-web-aja2-gcp.thehlive.com/AJA2/index.m3u8", t: "hls" },
    { n: "الجزيرة مباشر", u: "https://live-hls-web-ajm-ll-bp.thehlive.com/AJM/index.m3u8", t: "hls" },
    { n: "الجزيرة الوثائقية", u: "https://live-hls-web-ajd-gcp.thehlive.com/AJD/index.m3u8", t: "hls" },
    { n: "العربية", u: "https://live.alarabiya.net/alarabiapublish/alarabiya.smil/playlist.m3u8", t: "hls" },
    { n: "الحدث", u: "https://live.alarabiya.net/alarabiapublish/alhadath.smil/playlist.m3u8", t: "hls" },
    { n: "سكاي نيوز", u: "https://stream.skynewsarabia.com/hls/sna.m3u8", t: "hls" },
    { n: "القرآن الكريم", u: "https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8", t: "hls" },
    { n: "السنة النبوية", u: "https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8", t: "hls" }
];

var varietyChannels = [
    { n: "MBC 1", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-1/15cf99af5de54063fdabfefe66adc075/index.m3u8", t: "hls" },
    { n: "MBC 2", u: "https://auratvdz.lovable.app/api/public/stream?url=http%3A%2F%2Fcloth.orangecord.net%2Fpdf%2Fsat2MBC2%2Findex.m3u8%3Ftoken%3D%3D", t: "hls" },
    { n: "MBC 3", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-3-usa/5d58265a862a476dc7f97694addb5ded/index.m3u8", t: "hls" },
    { n: "MBC 4", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-4/24f134f1cd63db9346439e96b86ca6ed/index.m3u8", t: "hls" },
    { n: "MBC 5", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-5/ee6b000cee0629411b666ab26cb13e9b/index.m3u8", t: "hls" },
    { n: "MBC Action", u: "https://edge66.magictvbox.com/liveApple/MBC_Action/index.m3u8", t: "hls" },
    { n: "MBC Masr", u: "https://shd-gcp-live.lg.mncdn.com/live/bitmovin-mbc-masr/956eac069c78a35d47245db6cdbb1575/index.m3u8", t: "hls" },
    { n: "MBC Masr 2", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-masr-2/754931856515075b0aabf0e583495c68/index.m3u8", t: "hls" },
    { n: "MBC Plus Drama", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-plus-drama/e37251ec2aac8f6c98f75cd0fa37cd28/index.m3u8", t: "hls" },
    { n: "MBC Drama", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-drama/2c28a458e2f3253e678b07ac7d13fe71/index.m3u8", t: "hls" },
    { n: "MBC Iraq", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-iraq/e38c44b1b43474e1c39cb5b90203691e/index.m3u8", t: "hls" },
    { n: "MBC Persia", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-persia/818ee8e4b592dc497608f066d825bfb4/index.m3u8", t: "hls" },
    { n: "AD Premium 1", u: "https://www.elahmad.ru/tv/live/shahid_shaka.php?id=abudhabi_premium_1", t: "ts" },
    { n: "AD Premium 2", u: "https://www.elahmad.ru/tv/live/shahid_shaka.php?id=abudhabi_premium_2", t: "ts" }
];

var sportsChannels = [
    { n: "الكأس 1", u: "https://storage.googleapis.com/livealkass-eu/alkass1-p/main.m3u8", t: "hls" },
    { n: "الكأس 2", u: "https://storage.googleapis.com/livealkass-eu/alkass2-p/main.m3u8", t: "hls" },
    { n: "الكأس 3", u: "https://storage.googleapis.com/livealkass-eu/alkass3-p/main.m3u8", t: "hls" },
    { n: "الكأس 4", u: "https://storage.googleapis.com/livealkass-eu/alkass4-p/main.m3u8", t: "hls" },
    { n: "الكأس 5", u: "https://storage.googleapis.com/livealkass-eu/alkass5-p/main.m3u8", t: "hls" },
    { n: "الكأس 6", u: "https://storage.googleapis.com/livealkass-eu/alkass6-p/main.m3u8", t: "hls" },
    { n: "البحرين 1", u: "https://5c7b683162943.streamlock.net/live/ngrp:sportsone_all/playlist.m3u8", t: "hls" },
    { n: "البحرين 2", u: "https://5c7b683162943.streamlock.net/live/ngrp:bahrainsportstwo_all/playlist.m3u8", t: "hls" },
    { n: "العراقية رياضية", u: "https://imn-live.esite-lab.com/hls/iraqia-sports-1.m3u8", t: "hls" }
];

var ROWS = [
    { label: 'bein الرياضية', icon: '⚽', channels: beinChannels, special: false },
    { label: 'DASH & ClearKey', icon: '🔐', channels: dashClearKeyChannels, special: false },
    { label: 'bein متعدد الجودات', icon: '⚡', channels: beinMultiChannels, special: true },
    { label: 'قنوات الأخبار', icon: '📰', channels: newsChannels, special: false },
    { label: 'منوعات ودراما', icon: '🎭', channels: varietyChannels, special: false },
    { label: 'القنوات الرياضية', icon: '🏆', channels: sportsChannels, special: false }
];
