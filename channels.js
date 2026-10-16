// ==========================================
// 1. المتغيرات الأساسية وروابط السيرفرات
// ==========================================
const ta2alBase = "https://l.alameeeretv.workers.dev/?url=http://so.ta2al.us:80/live/MH12ARBMH12/MH12ARBMH12/";
const gamerdzBaseUrl1 = "https://x.gamerdz1517.com/live/00:1A:79:9A:B0:A8/smgo6jm8/";
const gamerdzBaseUrl2 = "https://x.gamerdz1517.com/live/00:1A:79:c2:a0:33/hkgukywu/";
const server1Base = "https://i.m737217130.workers.dev/s1/live/";

// ==========================================
// 2. مصفوفات القنوات
// ==========================================

var beinMultiQualities = [
    {
        n: "beIN 1",
        u: `${ta2alBase}332188.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}332188.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}35767.ts` },
            { label: "NANO 2M", src: `${ta2alBase}906544.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}204112.ts` }
        ]
    },
    {
        n: "beIN 2",
        u: `${ta2alBase}499052.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}499052.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}131825.ts` },
            { label: "NANO 2M", src: `${ta2alBase}392327.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}934886.ts` }
        ]
    },
    {
        n: "beIN 3",
        u: `${ta2alBase}34592.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}34592.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}652548.ts` },
            { label: "NANO 2M", src: `${ta2alBase}423451.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}595940.ts` }
        ]
    },
    {
        n: "beIN 4",
        u: `${ta2alBase}914326.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}914326.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}243256.ts` },
            { label: "NANO 2M", src: `${ta2alBase}259959.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}738363.ts` }
        ]
    },
    {
        n: "beIN 5",
        u: `${ta2alBase}799894.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}799894.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}35682.ts` },
            { label: "NANO 2M", src: `${ta2alBase}478444.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}291247.ts` }
        ]
    },
    {
        n: "beIN 6",
        u: `${ta2alBase}786431.ts`,
        t: "ts",
        qualities: [
            { label: "SD 2M (الأساسية)", src: `${ta2alBase}786431.ts` },
            { label: "LOW 1M (ضعيف)", src: `${ta2alBase}641814.ts` },
            { label: "NANO 2M", src: `${ta2alBase}750305.ts` },
            { label: "HQ 4M (عالية)", src: `${ta2alBase}780270.ts` }
        ]
    }
];

var osnChannels = [
    { n: "OSN Movies", u: `${ta2alBase}1848.ts`, t: "ts" },
    { n: "OSN Movies First", u: `${ta2alBase}1851.ts`, t: "ts" },
    { n: "OSN Action", u: `${ta2alBase}1849.ts`, t: "ts" },
    { n: "OSN Yahala Cinema", u: `${ta2alBase}1852.ts`, t: "ts" },
    { n: "OSN Yahala", u: `${ta2alBase}1854.ts`, t: "ts" },
    { n: "OSN Series", u: `${ta2alBase}1847.ts`, t: "ts" },
    { n: "OSN Comedy", u: `${ta2alBase}1845.ts`, t: "ts" },
    { n: "OSN Discovery", u: `${ta2alBase}1860.ts`, t: "ts" },
    { n: "OSN History", u: `${ta2alBase}1857.ts`, t: "ts" },
    { n: "OSN Disney", u: `${ta2alBase}1867.ts`, t: "ts" },
    { n: "OSN Nick Jr", u: `${ta2alBase}1865.ts`, t: "ts" },
    { n: "OSN Kids Zone", u: `${ta2alBase}1864.ts`, t: "ts" }
];

var tamanyaSportTsChannels = [
    { n: "ثمانية 1 SD", u: `${ta2alBase}560245.ts`, t: "ts" },
    { n: "ثمانية 1 HQ", u: `${ta2alBase}739003.ts`, t: "ts" },
    { n: "ثمانية 1 HD", u: `${ta2alBase}696998.ts`, t: "ts" },
    { n: "ثمانية 2 SD", u: `${ta2alBase}310421.ts`, t: "ts" },
    { n: "ثمانية 2 HQ", u: `${ta2alBase}670314.ts`, t: "ts" },
    { n: "ثمانية 2 HD", u: `${ta2alBase}572066.ts`, t: "ts" },
    { n: "ثمانية 3 SD", u: `${ta2alBase}982038.ts`, t: "ts" },
    { n: "ثمانية 3 HQ", u: `${ta2alBase}867094.ts`, t: "ts" },
    { n: "ثمانية 3 HD", u: `${ta2alBase}140439.ts`, t: "ts" }
];

var beinMultiQualities1 = [
    {
        n: "beIN 1",
        u: `${gamerdzBaseUrl1}1806555.ts`,
        t: "ts",
        qualities: [
            { label: "360p", src: `${gamerdzBaseUrl1}1806555.ts` },
            { label: "720p", src: `${gamerdzBaseUrl1}1806573.ts` },
            { label: "1080p", src: `${gamerdzBaseUrl1}1806582.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806564.ts` },
            { label: "صوت إنجليزي EN", src: `${gamerdzBaseUrl1}1806546.ts` }
        ]
    },
    {
        n: "beIN 2",
        u: `${gamerdzBaseUrl1}1806554.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806554.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806572.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806581.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806563.ts` }
        ]
    },
    {
        n: "beIN 3",
        u: `${gamerdzBaseUrl1}1806553.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806553.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806571.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806580.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806562.ts` }
        ]
    },
    {
        n: "beIN 4",
        u: `${gamerdzBaseUrl1}1806552.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806552.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806570.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806579.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806561.ts` }
        ]
    },
    {
        n: "beIN 5",
        u: `${gamerdzBaseUrl1}1806551.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806551.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806569.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806578.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806560.ts` }
        ]
    },
    {
        n: "beIN 6",
        u: `${gamerdzBaseUrl1}1806550.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806550.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806568.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806577.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806559.ts` }
        ]
    },
    {
        n: "beIN 7",
        u: `${gamerdzBaseUrl1}1806549.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806549.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806567.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806576.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806558.ts` }
        ]
    },
    {
        n: "beIN 8",
        u: `${gamerdzBaseUrl1}1806548.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806548.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806566.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806575.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806557.ts` }
        ]
    },
    {
        n: "beIN 9",
        u: `${gamerdzBaseUrl1}1806547.ts`,
        t: "ts",
        qualities: [
            { label: "SD (الأساسية)", src: `${gamerdzBaseUrl1}1806547.ts` },
            { label: "HD 720p", src: `${gamerdzBaseUrl1}1806565.ts` },
            { label: "FHD 1080p", src: `${gamerdzBaseUrl1}1806574.ts` },
            { label: "4K", src: `${gamerdzBaseUrl1}1806556.ts` }
        ]
    }
];

var beinMultiQualities2 = [
    {
        n: "BEIN 1",
        u: `${gamerdzBaseUrl2}1330437.m3u8`,
        t: "hls",
        qualities: [
            { label: "HEVC", src: `${gamerdzBaseUrl2}1330433.m3u8` },
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330437.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660414.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660413.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330457.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330474.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836254.m3u8` }
        ]
    },
    {
        n: "BEIN 2",
        u: `${gamerdzBaseUrl2}1330438.m3u8`,
        t: "hls",
        qualities: [
            { label: "HEVC", src: `${gamerdzBaseUrl2}1330434.m3u8` },
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330438.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660416.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660415.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330458.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330475.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836255.m3u8` }
        ]
    },
    {
        n: "BEIN 3",
        u: `${gamerdzBaseUrl2}1330439.m3u8`,
        t: "hls",
        qualities: [
            { label: "HEVC", src: `${gamerdzBaseUrl2}1330435.m3u8` },
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330439.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660418.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660417.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330459.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330476.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836256.m3u8` }
        ]
    },
    {
        n: "BEIN 4",
        u: `${gamerdzBaseUrl2}1330440.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330440.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660420.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660419.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330460.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330477.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836257.m3u8` }
        ]
    },
    {
        n: "BEIN 5",
        u: `${gamerdzBaseUrl2}1330441.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330441.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660422.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660421.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330461.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330478.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836258.m3u8` }
        ]
    },
    {
        n: "BEIN 6",
        u: `${gamerdzBaseUrl2}1330442.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330442.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660424.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660423.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330462.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330479.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836259.m3u8` }
        ]
    },
    {
        n: "BEIN 7",
        u: `${gamerdzBaseUrl2}1330443.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330443.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660426.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660425.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330463.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330480.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836260.m3u8` }
        ]
    },
    {
        n: "BEIN 8",
        u: `${gamerdzBaseUrl2}1330444.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330444.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660428.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660427.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330464.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330481.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836261.m3u8` }
        ]
    },
    {
        n: "BEIN 9",
        u: `${gamerdzBaseUrl2}1330445.m3u8`,
        t: "hls",
        qualities: [
            { label: "HD 1080p", src: `${gamerdzBaseUrl2}1330445.m3u8` },
            { label: "720p", src: `${gamerdzBaseUrl2}1660430.m3u8` },
            { label: "SD 480p", src: `${gamerdzBaseUrl2}1660429.m3u8` },
            { label: "SD", src: `${gamerdzBaseUrl2}1330465.m3u8` },
            { label: "LQ", src: `${gamerdzBaseUrl2}1330482.m3u8` },
            { label: "LOW", src: `${gamerdzBaseUrl2}1836262.m3u8` }
        ]
    }
];

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

var beinMultiChannels = [
    { n: "bein1", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F194432.m3u8", t: "hls" },
    { n: "bein2", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F618157.m3u8", t: "hls" },
    { n: "bein3", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F117974.m3u8", t: "hls" },
    { n: "bein4", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F332578.m3u8", t: "hls" },
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

var mbcNewChannels = [
    { n: "MBC 1", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-1/15cf99af5de54063fdabfefe66adc075/index.m3u8", t: "hls" },
    { n: "MBC 2", u: `${ta2alBase}1662.ts`, t: "ts" },
    { n: "MBC 3", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-3-usa/5d58265a862a476dc7f97694addb5ded/index.m3u8", t: "hls" },
    { n: "MBC 4", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-4/24f134f1cd63db9346439e96b86ca6ed/index.m3u8", t: "hls" },
    { n: "MBC 5", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-5/ee6b000cee0629411b666ab26cb13e9b/index.m3u8", t: "hls" },
    { n: "MBC Action", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1657.m3u8", t: "hls" },
    { n: "MBC Drama", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-drama/2c28a458e2f3253e678b07ac7d13fe71/index.m3u8", t: "hls" },
    { n: "MBC Masr", u: "https://shd-gcp-live.lg.mncdn.com/live/bitmovin-mbc-masr/956eac069c78a35d47245db6cdbb1575/index.m3u8", t: "hls" },
    { n: "MBC Masr 2", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-masr-2/754931856515075b0aabf0e583495c68/index.m3u8", t: "hls" },
    { n: "MBC Masr Drama", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-masr-drama/567b703c19ede6598222de81b0e4508b/index.m3u8", t: "hls" },
    { n: "MBC Iraq", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-iraq/e38c44b1b43474e1c39cb5b90203691e/index.m3u8", t: "hls" },
    { n: "MBC Persia", u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-persia/818ee8e4b592dc497608f066d825bfb4/index.m3u8", t: "hls" }
];

var sportsChannels = [
    { n: "الكأس 1", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass1-p/main.m3u8?hdnts=exp=1791013759~hmac=5755ff523ffb4b3167f3b16f7e296debc460cf0bd0a26c072cbf639365bfe0bd", t: "hls" },
    { n: "الكأس 2", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass2-p/main.m3u8?hdnts=exp=1791014475~hmac=dad763d0641e79a6c4d4f3c43b268420323e38ed9b2f190c2d1adc5ffb021fd0", t: "hls" },
    { n: "الكأس 3", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass3-p/main.m3u8?hdnts=exp=1791014610~hmac=a648caf89bbc1731b6ac51cb50647669660e10f261cca1993830e1b27b74a7a4", t: "hls" },
    { n: "الكأس 4", u: "https://kurdtv.org/api/public/hls?u=https://liveeu-gcps.alkassdigital.net/alkass4-p/main.m3u8?hdnts=exp=1791014653~hmac=11cd143c45081413756c4aac990d9e31ca29a6f0bf8ad79460b87df9172bad51", t: "hls" },
    { n: "الكأس 5", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass5-p/main.m3u8?hdnts=exp=1791014779~hmac=4d7c41c57afecc8d2332d260ceffbab729353f8e88db414b1ca1028130ceaaf8", t: "hls" },
    { n: "الكأس 6", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass6-p/main.m3u8?hdnts=exp=1791014835~hmac=12ce55403c0888ac0882868fa4cb67c3f198469428e1fda3d2477dc5abc003e4", t: "hls" },
    { n: "الكأس 7", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass7-p/main.m3u8?hdnts=exp=1791014864~hmac=aef4f6a41d4787a5e90e033c5a42868f3f40f13bd1e9e47bd453b598e9948d04", t: "hls" },
    { n: "الكأس 8", u: "https://website.screenifyplus.workers.dev/?stream=https://liveeu-gcps.alkassdigital.net/alkass8-p/main.m3u8?hdnts=exp=1791014918~hmac=003577ba5468468aed277034da98ad3170542d0c60cd41c1eb6359775ba4c83b", t: "hls" },
    { n: "البحرين 1", u: "https://5c7b683162943.streamlock.net/live/ngrp:sportsone_all/playlist.m3u8", t: "hls" },
    { n: "البحرين 2", u: "https://5c7b683162943.streamlock.net/live/ngrp:bahrainsportstwo_all/playlist.m3u8", t: "hls" },
    { n: "العراقية رياضية", u: "https://imn-live.esite-lab.com/hls/iraqia-sports-1.m3u8", t: "hls" },
    { n: "Zain TV 1", u: "https://zaintv1.zaintvpro.workers.dev/live/z1.m3u8", t: "hls" }
];

var dashChannels = [
    {
        n: "mbc2 HD",
        u: "https://shd-mediacdn-live.edgenextcdn.net/live/bitmovin-mbc-2/51db9d7fa48a27d051f1eecb68069151/index.mpd",
        t: "dash",
        clearkey: {
            "b1a8592dff8a4965983fd7f8ee7006dc": "0954d76121a0c33c6e3f52175aca6c05"
        }
    },
    {
        n: "MBC Action HD",
        u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-action/8ea6ca1108d03e03da5e61372354f5c8/index.mpd",
        t: "dash",
        clearkey: {
            "73d6c44e70d24e09a1c4735bb6e2f696": "22f2237a1722bf4d4623346a3ea08b7c"
        }
    },
    {
        n: "MBC Max HD",
        u: "https://shd-gcp-live.edgenextcdn.net/live/bitmovin-mbc-max/b628d2bbaee0431a17859963edf2975f/index.mpd",
        t: "dash",
        clearkey: {
            "9f494797bdec4203aed785cc18901e5e": "784c3fabbb87e741d7a4dcf13d03bc35"
        }
    },
    {
        n: "Starzplay 1 HD",
        u: "https://sps1.starzplayarabia.com/out/v1/eee188845e9543699fd24e5a9890c6e2/index.mpd",
        t: "dash",
        clearkey: {
            "b253c726c24c7c94a3ddf9b1907e2c76": "097963d6ad73c3d712a104981de0ed42"
        }
    },
    {
        n: "Starzplay 2 HD",
        u: "https://sps2.starzplayarabia.com/out/v1/15e7d1ffb99746dda03f71dbbbc3c08b/index.mpd",
        t: "dash",
        clearkey: {
            "ee861edcd99093153a763a94b14c2c5a": "ab3991f6a7729ba1ea4bcdba0c1ae6c0"
        }
    }
];

var playChannels = [
    { n: "MBC Action", u: `${ta2alBase}1657.ts`, t: "ts" },
    { n: "SHAHID SPORT", u: `${ta2alBase}2475.ts`, t: "ts" },
    { n: "Al-wan 1", u: `${ta2alBase}3461.ts`, t: "ts", logo: "logos/alwan-1.png" },
    { n: "Al-wan 2", u: `${ta2alBase}3460.ts`, t: "ts", logo: "logos/alwan-2.png" },
    { n: "Al-wan 3", u: `${ta2alBase}3459.ts`, t: "ts", logo: "logos/alwan-3.png" },
    { n: "Al-wan 4", u: `${ta2alBase}3458.ts`, t: "ts", logo: "logos/alwan-4.png" },
    { n: "Al-wan 5", u: `${ta2alBase}3457.ts`, t: "ts", logo: "logos/alwan-5.png" },
    { n: "Al-wan 6", u: `${ta2alBase}3456.ts`, t: "ts", logo: "logos/alwan-6.png" },
    { n: "STARZPLAY 1 Low", u: `${ta2alBase}596497.ts`, t: "ts" },
    { n: "STARZPLAY 2 Low", u: `${ta2alBase}52964.ts`, t: "ts" },
    { n: "STARZPLAY 1 SD", u: `${ta2alBase}63544.ts`, t: "ts" },
    { n: "STARZPLAY 2 SD", u: `${ta2alBase}740664.ts`, t: "ts" },
    { n: "STARZPLAY 1 HD", u: `${ta2alBase}166999.ts`, t: "ts" },
    { n: "STARZPLAY 2 HD", u: `${ta2alBase}974145.ts`, t: "ts" },
    { n: "STARZPLAY 1 FHD", u: `${ta2alBase}454397.ts`, t: "ts" },
    { n: "STARZPLAY 2 FHD", u: `${ta2alBase}652321.ts`, t: "ts" },
    { n: "STC TV 1HD", u: `${ta2alBase}2483.ts`, t: "ts" },
    { n: "STC TV Sports 1HD", u: `${ta2alBase}2482.ts`, t: "ts" },
    { n: "ALRabiaa Sport HD", u: `${ta2alBase}2174.ts`, t: "ts" },
    { n: "Al Fajer HD1", u: `${ta2alBase}1114.ts`, t: "ts", logo: "logos/fajer-1.png" },
    { n: "Al Fajer HD2", u: `${ta2alBase}1113.ts`, t: "ts", logo: "logos/fajer-2.png" },
    { n: "Al Fajer HD3", u: `${ta2alBase}1112.ts`, t: "ts", logo: "logos/fajer-3.png" },
    { n: "Al Fajer HD4", u: `${ta2alBase}1111.ts`, t: "ts", logo: "logos/fajer-4.png" },
    { n: "Al Fajer HD5", u: `${ta2alBase}1110.ts`, t: "ts", logo: "logos/fajer-5.png" }
];
var entertainmentChannels = [
    { n: "Movies 1", u: `${ta2alBase}1936.ts`, t: "ts" },
    { n: "Movies 2", u: `${ta2alBase}1935.ts`, t: "ts" },
    { n: "Movies 3", u: `${ta2alBase}1934.ts`, t: "ts" },
    { n: "Movies 4", u: `${ta2alBase}1933.ts`, t: "ts" },
    { n: "Drama 1", u:`${ta2alBase}1932.ts`, t: "ts" },
    { n: "Series 1", u: `${ta2alBase}1931.ts`, t: "ts" },
    { n: "Series 2", u: `${ta2alBase}1930.ts`, t: "ts" },
    { n: "star Life", u: `${ta2alBase}1929.ts`, t: "ts" },
    { n: "star film", u: `${ta2alBase}1926.ts`, t: "ts" },
    { n: "star Action", u: `${ta2alBase}1925.ts`, t: "ts" },
    { n: "star se", u: `${ta2alBase}1920.ts`, t: "ts" },
    { n: "Star World", u: `${ta2alBase}1924.ts`, t: "ts" },
    { n: "Star Movies", u: `${ta2alBase}1923.ts`, t: "ts" },
    { n: "Gourmet", u: `${ta2alBase}1922.ts`, t: "ts" },
    { n: "Fatafeat", u: `${ta2alBase}1921.ts`, t: "ts" },
    { n: "Baraem", u: `${ta2alBase}1917.ts`, t: "ts" },
    { n: "jeem", u: `${ta2alBase}1916.ts`, t: "ts" },
    { n: "Baby", u: `${ta2alBase}1915.ts`, t: "ts" },
    { n: "Travel", u: `${ta2alBase}1914.ts`, t: "ts" },
    { n: "Carton Network", u: `${ta2alBase}1913.ts`, t: "ts" },
    { n: "Boomerang", u: `${ta2alBase}1912.ts`, t: "ts" }
];

var fajerChannels = [
    { n: "الفجر 1", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1114.m3u8", t: "hls", logo: "logos/fajer-1.png" },
    { n: "الفجر 2", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1113.m3u8", t: "hls", logo: "logos/fajer-2.png" },
    { n: "الفجر 3", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1112.m3u8", t: "hls", logo: "logos/fajer-3.png" },
    { n: "الفجر 4", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1111.m3u8", t: "hls", logo: "logos/fajer-4.png" },
    { n: "الفجر 5", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F1110.m3u8", t: "hls", logo: "logos/fajer-5.png" }
];

var tamanyaSportHlsChannels = [
    { n: "ثمانية ١", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3455_.m3u8", t: "hls" },
    { n: "ثمانية ٢", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3454_.m3u8", t: "hls" },
    { n: "ثمانية ٣", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3453_.m3u8", t: "hls" },
    { n: "ثمانية 1 SD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F469683.m3u8", t: "hls" },
    { n: "ثمانية 2 SD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F126197.m3u8", t: "hls" },
    { n: "ثمانية 3 SD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F598188.m3u8", t: "hls" },
    { n: "ثمانية 1 HD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F882115.m3u8", t: "hls" },
    { n: "ثمانية 2 HD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F785917.m3u8", t: "hls" },
    { n: "ثمانية 3 HD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F595243.m3u8", t: "hls" },
    { n: "ثمانية 1 FHD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F715065.m3u8", t: "hls" },
    { n: "ثمانية 2 FHD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F976309.m3u8", t: "hls" },
    { n: "ثمانية 3 FHD", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F248005.m3u8", t: "hls" },
    { n: "ثمانية 1 4K", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F710135.m3u8", t: "hls" },
    { n: "ثمانية 2 4k", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F769078.m3u8", t: "hls" },
    { n: "ثمانية 3 4K", u: "https://l.alameeeretv.workers.dev/?url=http%3A%2F%2Fso.ta2al.us%3A80%2Flive%2FMH12ARBMH12%2FMH12ARBMH12%2F841733.m3u8", t: "hls" }
];
var SoloSportChannels = [
    { n: "solo 1", u: `${server1Base}834440.m3u8`, t: "ts" },
    { n: "solo 2", u: `${server1Base}834436.m3u8`, t: "ts" },
    { n: "solo 3", u: `${server1Base}834432.m3u8`, t: "ts" },
    { n: "solo 4", u: `${server1Base}834428.m3u8`, t: "ts" },
    { n: "solo 5", u: `${server1Base}834424.m3u8`, t: "ts" }
];  
var alwanChannels = [
    { n: "الوان 1", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3461_.m3u8", t: "hls", logo: "logos/alwan-1.png" },
    { n: "الوان 2", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3460_.m3u8", t: "hls", logo: "logos/alwan-2.png" },
    { n: "الوان 3", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3459_.m3u8", t: "hls", logo: "logos/alwan-3.png" },
    { n: "الوان 4", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3458_.m3u8", t: "hls", logo: "logos/alwan-4.png" },
    { n: "الوان 5", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3457_.m3u8", t: "hls", logo: "logos/alwan-5.png" },
    { n: "الوان 6", u: "https://l.alameeeretv.workers.dev/?url=https%3A%2F%2Fblcco.linkip.org%2Flive%2F3456_.m3u8", t: "hls", logo: "logos/alwan-6.png" },
    { n: "الوان 7", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738888.m3u8", t: "hls" },
    { n: "الوان 8", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738887.m3u8", t: "hls" },
    { n: "الوان 9", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738886.m3u8", t: "hls" },
    { n: "الوان 10", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738885.m3u8", t: "hls" },
    { n: "الوان افلام 1", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738869.m3u8", t: "hls" },
    { n: "الوان افلام 2", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738868.m3u8", t: "hls" },
    { n: "الوان افلام 3", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738867.m3u8", t: "hls" },
    { n: "الوان افلام 4", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738866.m3u8", t: "hls" },
    { n: "الوان مسلسلات", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738862.m3u8", t: "hls" },
    { n: "الوان مسلسلات+", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738858.m3u8", t: "hls" },
    { n: "الوان تركي", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738865.m3u8", t: "hls" },
    { n: "الوان كوري", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738859.m3u8", t: "hls" },
    { n: "الوان بوليوود", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738860.m3u8", t: "hls" },
    { n: "الوان انمي", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738857.m3u8", t: "hls" },
    { n: "الوان WWE", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738882.m3u8", t: "hls" },
    { n: "الوان UFC", u: "http://vip2.sharkhost.xyz/live/9143315182/7352465335/738884.m3u8", t: "hls" }
];

const sscDashChannels = [
  {
    n: "SSC News",
    u: "https://ssc-news-live-enc.edgenextcdn.net/out/v1/ef466f43623c4bbaa3f905b566ec35ea/index.mpd",
    t: "dash",
    clearkey: {
      "3d04975236a44f62857d181597705ee6": "362133e9cb13189ad4fe095ced216f60"
    }
  },
  {
    n: "SSC 1 Sports",
    u: "https://ssc-1-enc.edgenextcdn.net/out/v1/c696e4819b55414388a1a487e8a45ca1/index.mpd",
    t: "dash",
    clearkey: {
      "d84c325f36814f39bbe59080272b10c3": "550727de4c96ef1ecff874905493580f"
    }
  },
  {
    n: "SSC 2 Sports",
    u: "https://ssc-2-enc.edgenextcdn.net/out/v1/a16db2ec338a445a82d9c541cc9293f9/index.mpd",
    t: "dash",
    clearkey: {
      "8bcfc55359e24bd7ad1c5560a96ddd3c": "b5dcf721ab522af92a9d3bf0bd55b596"
    }
  },
  {
    n: "SSC 3 Sports",
    u: "https://ssc-3-enc.edgenextcdn.net/out/v1/42e86125555242aaa2a12056832e7814/index.mpd",
    t: "dash",
    clearkey: {
      "7de5dd08ad8041d586c2f16ccc9490a1": "5e1503f3398b34f5099933fedab847ef"
    }
  },
  {
    n: "SSC 4 Sports",
    u: "https://ssc-4-enc.edgenextcdn.net/out/v1/5267ea5772874b0db24559d643eaad93/index.mpd",
    t: "dash",
    clearkey: {
      "5c672f6b85a94638872d0214f7806ed4": "bf8756fbb866ee2d5c701c2289dd8de3"
    }
  },
  {
    n: "SSC 5 Sports",
    u: "https://ssc-5-enc.edgenextcdn.net/out/v1/99289eac5a7b4319905da595afbd792b/index.mpd",
    t: "dash",
    clearkey: {
      "c88b512b17ab4f6cb09eb0ff4a1056ed": "adc08ee1c20a734972a55c9aebbd1888"
    }
  },
  {
    n: "SSC Extra 1",
    u: "https://ssc-extra-1-enc.edgenextcdn.net/out/v1/647c58693f1d46af92bd7e69f17912cb/index.mpd",
    t: "dash",
    clearkey: {
      "ecbc9e6fe6b145efb6658fb5cf7427f8": "03c17e28911f71221acbc0b11f900401"
    }
  },
  {
    n: "SSC Extra 2",
    u: "https://ssc-extra-2-enc.edgenextcdn.net/out/v1/8b70de2b70d447ba8a7450ba90926a2d/index.mpd",
    t: "dash",
    clearkey: {
      "4d89249bd4ca4ebc9e70443265f9507d": "cf074ffd2646c9c2f8513b47fa57bc30"
    }
  },
  {
    n: "SSC Extra 3",
    u: "https://ssc-extra-2-enc.edgenextcdn.net/out/v1/8f1c6c3f05ef4284a64b342891bd85ae/index.mpd",
    t: "dash",
    clearkey: {
      "73efb1eb27294f8ea059765b368f411b": "8af553e93bc5b20e828a14a7643e0c59"
    }
  }
];

const thmaneyahDashChannels = [
  {
    n: "ثمانية 1",
    u: "https://scccrwb-live.cdn.intigral-ott.net/bpk-tv/STCT1/wv-pr/manifest.mpd",
    t: "dash",
    clearkey: {
      "714c789c76686632652eefc19f18c3db": "962cee49ee9422b44a6c60a7999854ad"
    }
  },
  {
    n: "ثمانية 2",
    u: "https://scccrwb-live.cdn.intigral-ott.net/bpk-tv/STCT2/wv-pr/manifest.mpd",
    t: "dash",
    clearkey: {
      "97e293d59ed72db87f12fe7075d8bb4c": "c633955e4477ed5acbae68a2b0f1d216"
    }
  },
  {
    n: "ثمانية 3",
    u: "https://scccrwb-live.cdn.intigral-ott.net/bpk-tv/STCT3/wv-pr/manifest.mpd",
    t: "dash",
    clearkey: {
      "4bc8e4e871589a45e7c0c7d245c243c6": "4c5e8108e0f3cea4b588f5727d3de482"
    }
  }
];

const artDashChannels = [
  {
    n: "Art Aflam",
    u: "https://ev-tcn-dxb-cdn.aws.playco.com/live/eds/ART_Aflam/DASH/ART_Aflam.mpd",
    t: "dash",
    clearkey: {
      "47425a7e8f7e4030d186559852ae97db": "264e7cb9dfd6b9e5c281c97db4c2b4fa"
    }
  },
  {
    n: "Art Aflam 1",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/ART_Aflam/DASH/ART_Aflam.mpd",
    t: "dash",
    clearkey: {
      "264e7cb9dfd6b9e5c281c97db4c2b4fa": "47425a7e8f7e4030d186559852ae97db"
    }
  },
  {
    n: "Art Aflam 2",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/ART_Aflam_2/DASH/ART_Aflam_2.mpd",
    t: "dash",
    clearkey: {
      "809a386e57689d56c01a5c3190889641": "d54639bb7d418d515e5198663a6d7ae5"
    }
  },
  {
    n: "Art Cinema",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/ART_Cinema/DASH/ART_Cinema.mpd",
    t: "dash",
    clearkey: {
      "bd484fc91dcf152010a0e367e15ab60e": "d9bed0a77b7da410129820bcc6606670"
    }
  },
  {
    n: "Art Hekayat 1",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/ART_Hekayat/DASH/ART_Hekayat.mpd",
    t: "dash",
    clearkey: {
      "3d614bb04140eda383d117fb55e9a361": "b669cdf2cb65eff56d1e3534c7a54b53"
    }
  },
  {
    n: "Art Hekayat 2",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/ART_Hekayat_2/DASH/ART_Hekayat_2.mpd",
    t: "dash",
    clearkey: {
      "4ccb01903d6868e27953ff0298d4ac05": "d156518d6ab453d9f9d12c243280be8f"
    }
  }
];

const starzDashChannels = [
  {
    n: "Starzplay 1",
    u: "https://sps1.starzplayarabia.com/out/v1/eee188845e9543699fd24e5a9890c6e2/index.mpd",
    t: "dash",
    clearkey: {
      "b253c726c24c7c94a3ddf9b1907e2c76": "097963d6ad73c3d712a104981de0ed42"
    }
  },
  {
    n: "Starzplay 2",
    u: "https://sps2.starzplayarabia.com/out/v1/15e7d1ffb99746dda03f71dbbbc3c08b/index.mpd",
    t: "dash",
    clearkey: {
      "ee861edcd99093153a763a94b14c2c5a": "ab3991f6a7729ba1ea4bcdba0c1ae6c0"
    }
  },
  {
    n: "Starzplay 3",
    u: "https://sps3.starzplayarabia.com/out/v1/95528122fa434bcd948c9ed2e7afabee/index.mpd",
    t: "dash",
    clearkey: {
      "117c29396ec6fd295880013241a466e1": "3dfb883251884e66d784111877c44b13"
    }
  }
];

const shahidDashChannels = [
  {
    n: "Shahid Sport 1",
    u: "https://shahid-sports-1-enc.edgenextcdn.net/out/v1/0169cfa282614ebe97ef0201da87bb04/index.mpd",
    t: "dash",
    clearkey: {
      "ab081a704aad41829b1123b09b6ecafd": "dd51609092fff15e68b91debf5d591f9"
    }
  },
  {
    n: "Shahid Sport 2",
    u: "https://shahid-sports-2-enc.edgenextcdn.net/out/v1/589aa6b16ce942388695b5b214f4ae93/index.mpd",
    t: "dash",
    clearkey: {
      "50a7f3afc00a40b38face4db639d0e4c": "ad7000691326064706281a700b7d6714"
    }
  },
  {
    n: "Shahid Sport 3",
    u: "https://shahid-sports-3-enc.edgenextcdn.net/out/v1/2658c96bbfa54f339e357fe36361587e/index.mpd",
    t: "dash",
    clearkey: {
      "2b6f6b340aa8467785e4e82f9320fb5a": "8889701d704078c4d910ed1409413d9b"
    }
  },
  {
    n: "Shahid Sport 4",
    u: "https://shahid-sports-4-enc.edgenextcdn.net/out/v1/f813ab47644d4c41a99285513f6c7409/index.mpd",
    t: "dash",
    clearkey: {
      "6477160076644679af1028534f03f67e": "1267f99705113a62c7782c4d5281a7eb"
    }
  },
  {
    n: "Shahid Sport 5",
    u: "https://shahid-sports-5-enc.edgenextcdn.net/out/v1/ae00715d1c2c4432852b44a254c04a3d/index.mpd",
    t: "dash",
    clearkey: {
      "e2df3c205b674360bc6f364ba1090e70": "93da2c77bc812bc05a6e20ad8d35ea78"
    }
  }
];

const arabicDashChannels = [
  {
    n: "CN Arabia",
    u: "https://scccrwb-live.cdn.intigral-ott.net/bpk-tv/CNA/wv-pr/manifest.mpd",
    t: "dash",
    clearkey: {
      "ece7bbc683eb35d1e6b3e32cccbd8fb0": "f72bd6ea26e243524d58993b58122313"
    }
  },
  {
    n: "MBC Plus Variety",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/MBC_Plus_Variety_HD/DASH/MBC_Plus_Variety_HD.mpd",
    t: "dash",
    clearkey: {
      "a458dbbe9cb445d92a27fb45cd371be7": "b00f2e592b5bbade5beaa61e3aee7b32"
    }
  },
  {
    n: "MBC 2",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/MBC_2HD/DASH/MBC_2HD.mpd",
    t: "dash",
    clearkey: {
      "535b41e50f71d5dcdd7b61685500980f": "864e981865940ef26cde333a1a8be344"
    }
  },
  {
    n: "MBC Max",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/MBC_Max_HD/DASH/MBC_Max_HD.mpd",
    t: "dash",
    clearkey: {
      "d995e35f26a3f5ad83f783272d33d956": "5e065664006dfd499957b7a4324c8a4f"
    }
  },
  {
    n: "MBC Elife",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/MBC_Plus_eLife_HD/DASH/MBC_Plus_eLife_HD.mpd",
    t: "dash",
    clearkey: {
      "867c8d7670eab5e7aa10571830ad3d8c": "030cf68626950b12145bc7147d6a9bda"
    }
  },
  {
    n: "MBC Action",
    u: "https://ev-fast-mpd.starzplayarabia.com/live/eds/MBC_Action_HD/DASH/MBC_Action_HD.mpd",
    t: "dash",
    clearkey: {
      "d889ec7cb5cd8acb44f702726a56ae21": "37be04cfb92f19ecd6074b976c1f3c54"
    }
  }
];

const ksaSportDashChannels = [
  {
    n: "KSA Sport 1",
    u: "https://ev-tcn-dxb-cdn.aws.playco.com/live/eds/KSA_Sports1_HD/DASH/KSA_Sports1_HD.mpd",
    t: "dash",
    clearkey: {
      "a0723ff5bf2bbbb31dc727e4346b1cc7": "29951a0a48586258ab168f26b3f58daa"
    }
  },
  {
    n: "KSA Sport 2",
    u: "https://ev-tcn-dxb-cdn.aws.playco.com/live/eds/KSA_Sports2_HD/DASH/KSA_Sports2_HD.mpd",
    t: "dash",
    clearkey: {
      "f7142ef5a9d7b8ef1044232e74605e91": "f36d37064c1109c107ffab95c0f7532d"
    }
  },
  {
    n: "KSA Sport 3",
    u: "https://ev-fuj-dxb-cdn-edge2.aws.playco.com/live/eds/KSA_Sports3_HD/DASH/KSA_Sports3_HD.mpd",
    t: "dash",
    clearkey: {
      "637dc9620732d390ab2df32e070256f0": "0e47bb47e90258b5f392f8ecb54a8b22"
    }
  }
];

// ==========================================
// 3. جدول الأقسام النهائي
// ==========================================
var ROWS = [
    { label: 'BEIN SPORTS', channels: beinMultiQualities, special: false },
    { label: 'OSN', channels: osnChannels, special: false },
    { label: 'ثمانية sport', channels: tamanyaSportTsChannels, special: false },
    { label: 'ثمانية سبورت', channels: tamanyaSportHlsChannels, special: false },
    { label: 'BEIN متعددة (سيرفر 1)', channels: beinMultiQualities1, special: false },
    { label: 'BEIN متعددة (سيرفر 2)', channels: beinMultiQualities2, special: false },
    { label: 'bein الأصلية', channels: beinChannels, special: false },
    { label: 'bein متعددة مفردة', channels: beinMultiChannels, special: true },
    { label: 'أخبار', channels: newsChannels, special: false },
    { label: 'mbc', channels: mbcNewChannels, special: false },
    { label: 'رياضة', channels: sportsChannels, special: false },
    { label: 'قنوات DASH', channels: dashChannels, special: false },
    { label: 'وقت اللعب', channels: playChannels, special: false },
    { label: 'ترفيه', channels: entertainmentChannels, special: false },
    { label: 'الفجر', channels: fajerChannels, special: false },
    { label: 'solo sport', channels: SoloSportChannels, special: false },
    { label: 'الوان', channels: alwanChannels, special: false },
    { label: "ssc Dash", ico: "⚽", channels: sscDashChannels },
    { label: "thmaneyah Dash", ico: "📡", channels: thmaneyahDashChannels },
    { label: "art Dach", ico: "🎭", channels: artDashChannels },
    { label: "ستارز Dach", ico: "⭐", channels: starzDashChannels },
    { label: "Shahid Dach", ico: "📺", channels: shahidDashChannels },
    { label: "قنوات عربية", ico: "📺", channels: arabicDashChannels },
    { label: "KSA Sport Dach", ico: "🇸🇦", channels: ksaSportDashChannels }
];
var channelRows = ROWS;
