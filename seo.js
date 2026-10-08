'use strict';

// Arama motorları için: sayfa başlıkları, açıklamalar, anahtar kelimeler ve yapılandırılmış veri (JSON-LD).
// Google "keywords" etiketini okumaz; Yandex ve Bing az da olsa okur. Google'da sıralamayı başlık, açıklama,
// içerik ve JSON-LD belirler: asıl iş onlarda.

const nconf = nodebb.require('nconf');

const seo = module.exports;

const SITE = 'Yaşar Forum';
const HOME_TITLE = 'Yaşar Üniversitesi Öğrenci Forumu';
const HOME_DESCRIPTION = 'Yaşar Üniversitesi öğrencilerinin forumu: ders notları, çıkmış sorular, ev arkadaşı, ikinci el ilanlar, '
	+ 'kayıp eşya, etkinlikler, Erasmus+, ders programı oluşturucu, yemekhane menüsü ve CV oluşturucu.';

// "Yaşar Üniversitesi ders notları" gibi aramaların bütün yazılışları: Türkçe karakterli ve karaktersiz,
// "Yaşar Üni", "Yaşar", "YU" kısaltmalarıyla.
const PREFIXES = ['Yaşar Üniversitesi', 'Yaşar Üni', 'Yaşar', 'YU'];
const ascii = s => s
	.replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/ş/g, 's').replace(/Ş/g, 'S')
	.replace(/ğ/g, 'g').replace(/Ğ/g, 'G').replace(/ü/g, 'u').replace(/Ü/g, 'U')
	.replace(/ö/g, 'o').replace(/Ö/g, 'O').replace(/ç/g, 'c').replace(/Ç/g, 'C');

function keywords(terms, extra = []) {
	const out = [];
	terms.forEach((term) => {
		PREFIXES.forEach(prefix => out.push(`${prefix} ${term}`));
	});
	out.push(...extra);
	const all = out.flatMap(k => [k.toLocaleLowerCase('tr'), ascii(k).toLowerCase()]);
	return [...new Set(all)].join(', ');
}

const SITE_KEYWORDS = keywords(['forum', 'forumu', 'öğrenci forumu', 'öğrencileri', 'öğrenci'], [
	'Yaşar Forum', 'yu.uniforum.app', 'uniforum Yaşar', 'Yaşar University forum', 'Yaşar University students',
	'İzmir üniversite forumu', 'İzmir öğrenci forumu', 'Bornova öğrenci forumu', 'Yaşar Üniversitesi itiraf',
	'Yaşar Üniversitesi yemekhane', 'Yaşar Üniversitesi ders programı', 'Yaşar Üniversitesi akademik takvim',
]);

// Kategori numarasına göre (ACP'deki cid). Başlık "<ad> – Yaşar Üniversitesi | Yaşar Forum" olur.
const CATEGORIES = {
	2: {
		description: 'Yaşar Üniversitesi öğrencilerinin genel sohbet alanı: kampüs, bölümler, hocalar, yurt ve İzmir\'de öğrenci hayatı üzerine konuş.',
		terms: ['genel sohbet', 'öğrenci sohbet', 'kampüs', 'öğrenci hayatı', 'yorumlar', 'hocalar'],
	},
	4: {
		description: 'Yaşar Üniversitesi öğrencileri için ev arkadaşı ve oda arkadaşı ilanları: Bornova ve çevresinde kiralık ev, bütçe ve konum önerileri.',
		terms: ['ev arkadaşı', 'oda arkadaşı', 'kiralık ev', 'öğrenci evi', 'yurt'],
		extra: ['Bornova ev arkadaşı', 'Bornova kiralık öğrenci evi', 'İzmir öğrenci ev arkadaşı'],
	},
	5: {
		description: 'Yaşar Üniversitesi ders notları, özetler ve önemli kavramlar: bölüm bölüm ders notu paylaş, vize ve finale birlikte hazırlan.',
		terms: ['ders notları', 'ders notu', 'özet', 'vize notları', 'final notları'],
	},
	7: {
		description: 'Yaşar Üniversitesi kampüsünde kaybolan ya da bulunan eşyalar: kayıp kartını, telefonunu, cüzdanını sor, bulduğunu bildir.',
		terms: ['kayıp eşya', 'kayıp kart', 'bulunan eşya'],
	},
	9: {
		description: 'Yaşar Üniversitesi sosyal aktiviteler: etkinlik, parti, spor, okey, gezi; birlikte bir şeyler yapacak arkadaş bul, anket aç.',
		terms: ['etkinlik', 'etkinlikler', 'sosyal aktiviteler', 'kulüpler', 'parti', 'spor'],
	},
	10: {
		description: 'UniSnap: Yaşar Üniversitesi kampüsünden çektiğin fotoğrafları anonim paylaş.',
		terms: ['kampüs fotoğrafları', 'UniSnap', 'anonim'],
	},
	13: {
		description: 'Yaşar Forum duyuruları: Yaşar Üniversitesi öğrencileri için önemli duyurular, forum güncellemeleri ve yeni araçlar.',
		terms: ['duyurular', 'duyuru', 'haberler'],
	},
	15: {
		description: 'Yaşar Üniversitesi vize ve final çıkmış soruları: ders ders çıkmış sınav soruları, quiz ve cevapları.',
		terms: ['çıkmış sorular', 'çıkmış sınav soruları', 'vize soruları', 'final soruları', 'sınav'],
	},
	16: {
		description: 'Yaşar Üniversitesi öğrencileri arasında ikinci el alım satım: eşya, kitap, elektronik, mobilya ilanları ver ya da bul.',
		terms: ['ilan', 'ikinci el', 'alım satım', 'kitap satış', 'eşya satış'],
		extra: ['Bornova ikinci el öğrenci eşyası'],
	},
	17: {
		description: 'Yaşar Üniversitesi Erasmus+ deneyimleri: anlaşmalı okullar, başvuru, hibe, konaklama ve yurt dışı dönemi üzerine sor, paylaş.',
		terms: ['Erasmus', 'Erasmus+', 'Erasmus başvuru', 'Erasmus hibe', 'Erasmus okulları', 'yurt dışı'],
	},
};

// Öğrenci sayfaları (eklentilerin kendi sayfaları). Erasmus+ kendi başlık, açıklama ve sitemap'ini yazar.
const PAGES = {
	'/yemekhane': {
		pageTitle: 'Yaşar Üniversitesi Yemekhane Menüsü: Bugün ve Bu Hafta',
		description: 'Yaşar Üniversitesi yemekhanesinde bugün ne var? Kahvaltı, öğle ve akşam menüsü, kaloriler, set menü ve tek tek fiyatlar. Her gün güncel.',
		terms: ['yemekhane', 'yemekhane menüsü', 'yemek listesi', 'bugünkü yemek', 'yemek menüsü', 'kafeterya', 'yemekhane fiyatları'],
		extra: ['Yaşar yemekhane bugün', 'Yaşar Üniversitesi bugün yemekte ne var', 'Bornova kampüs yemekhane'],
		changefreq: 'daily',
	},
	'/timetable': {
		title: 'Timetable',
		pageTitle: 'Ders Programı Oluşturucu (Timetable) – Yaşar Üniversitesi',
		description: 'Yaşar Üniversitesi ders programı oluşturucu: derslerini seç, çakışmayan haftalık programları gör.',
		terms: ['ders programı', 'ders programı oluşturucu', 'timetable', 'haftalık program', 'ders seçimi'],
	},
	'/cv': {
		title: 'CV Oluşturucu',
		pageTitle: 'Ücretsiz CV Oluşturucu – Yaşar Üniversitesi Öğrencileri',
		description: 'Hazır şablonlarla CV hazırla, PDF olarak indir. Ücretsiz, bilgilerin cihazında kalır.',
		terms: ['CV', 'CV oluşturucu', 'özgeçmiş', 'staj CV'],
		extra: ['ücretsiz CV oluşturucu', 'CV hazırla', 'özgeçmiş hazırla'],
	},
	'/pdf': {
		title: 'PDF Araçları',
		pageTitle: 'Ücretsiz PDF Araçları – Yaşar Üniversitesi Öğrencileri',
		description: 'PDF birleştir, böl, düzenle, imzala; belgeni telefonla tara. Ücretsiz, dosyaların cihazından çıkmaz.',
		terms: ['PDF araçları'],
		extra: ['PDF birleştir', 'PDF böl', 'PDF düzenle', 'PDF imzala', 'belge tara', 'ücretsiz PDF araçları'],
	},
	'/akademik-takvim': {
		title: 'Akademik Takvim',
		pageTitle: 'Yaşar Üniversitesi Akademik Takvim 2026-2027',
		description: 'Yaşar Üniversitesi 2026-2027 akademik takvimi: dönem başlangıçları, sınav haftaları ve tatiller.',
		terms: ['akademik takvim', '2026-2027 akademik takvim', 'sınav tarihleri', 'dönem başlangıcı'],
	},
};
seo.PAGES = PAGES;

const rel = () => nconf.get('relative_path');
const siteUrl = () => nconf.get('url');

function pathOf(req) {
	const path = String((req && req.path) || '').replace(/^\/api(?=\/|$)/, '') || '/';
	return rel() && path.startsWith(rel()) ? path.slice(rel().length) || '/' : path;
}

function templateOf(data) {
	const tpl = data && data.templateData && data.templateData.template;
	return tpl ? tpl.name : '';
}

// Aynı adlı etiketi değiştirir, yoksa ekler (kategori ve konu denetleyicileri kendi etiketlerini zaten koyuyor)
function setTag(list, key, name, content) {
	const found = list.find(tag => tag && tag[key] === name);
	if (found) {
		found.content = content;
		delete found.translate;
	} else {
		list.push({ [key]: name, content });
	}
}

function describe(list, { title, description, keywords: words }) {
	if (title) {
		setTag(list, 'property', 'og:title', title);
		setTag(list, 'name', 'title', title);
	}
	if (description) {
		setTag(list, 'name', 'description', description);
		setTag(list, 'property', 'og:description', description);
	}
	if (words) {
		setTag(list, 'name', 'keywords', words);
	}
}

// Arama sonucunda işe yaramayan sayfalar: profiller, üye ve grup listeleri, giriş/kayıt, arama, fediverse akışı.
// "noindex, follow": Google bağlantıları izler ama sayfayı dizine koymaz; site boş sonuçlarla sulanmaz.
// Giriş isteyen sayfalar (ör. /unread) misafire giriş formunu 200 ile gösterir; şablon adı "login" olur.
const NOINDEX_TEMPLATES = new Set(['users', 'groups/list', 'groups/details', 'world', 'search', 'login', 'register',
	'register/complete', 'reset', 'reset_code', 'tos', 'confirm', 'outgoing', 'popular', 'unread', 'top']);
const noindex = tpl => NOINDEX_TEMPLATES.has(tpl) || tpl.startsWith('account/');
seo.noindex = noindex;

seo.metaTags = async function (hookData) {
	const { req, data } = hookData;
	const res = data && data.res;
	const tpl = templateOf(data);
	const page = PAGES[pathOf(req)];

	// Tek keywords etiketi: ACP'deki genel etiket varsa çıkar
	hookData.tags = hookData.tags.filter(tag => !(tag && tag.name === 'keywords'));
	// Denetleyicinin etiketleri (res.locals.metaTags) bu kancadan sonra eklenir: o diziyi yerinde düzenle
	const list = (res && res.locals && res.locals.metaTags) || hookData.tags;

	// Sayfanın kendi anahtar kelimeleri varsa (ör. Erasmus+ sayfaları) onlar kalır
	if (!list.some(tag => tag && tag.name === 'keywords')) {
		list.push({ name: 'keywords', content: SITE_KEYWORDS });
	}
	if (noindex(tpl)) {
		setTag(list, 'name', 'robots', 'noindex, follow');
	}
	if (page) {
		describe(list, {
			title: `${page.pageTitle} | ${SITE}`,
			description: page.description,
			keywords: keywords(page.terms, page.extra),
		});
	} else if (tpl === 'category') {
		const cat = CATEGORIES[data.templateData.cid];
		if (cat) {
			describe(list, {
				title: `${data.templateData.name} – Yaşar Üniversitesi | ${SITE}`,
				description: cat.description,
				keywords: keywords(cat.terms, cat.extra),
			});
		}
	} else if (tpl === 'categories') {
		describe(list, { title: `${HOME_TITLE} | ${SITE}`, description: HOME_DESCRIPTION, keywords: SITE_KEYWORDS });
	}
	return hookData;
};

// Ana sayfa (/) ile /categories aynı sayfa: ikisi de kök adresi gösterir, Google "/categories"i ayrı dizine eklemesin
seo.linkTags = async function (hookData) {
	const { req, data } = hookData;
	const res = data && data.res;
	const path = pathOf(req);
	// Öğrenci sayfalarının canonical adresi yok: sorgu dizgeli kopyalar (?utm=…) ayrı sayfa sayılmasın
	if (PAGES[path] && !hookData.links.some(link => link && link.rel === 'canonical')
		&& !(res && res.locals && (res.locals.linkTags || []).some(link => link && link.rel === 'canonical'))) {
		hookData.links.push({ rel: 'canonical', href: `${siteUrl()}${path}` });
	}
	if (templateOf(data) === 'categories' && res && res.locals && Array.isArray(res.locals.linkTags)) {
		const canonical = res.locals.linkTags.find(link => link && link.rel === 'canonical');
		if (canonical && !/[?&]page=([2-9]|\d{2,})/.test(canonical.href)) {
			canonical.href = `${siteUrl()}/`;
		}
	}
	return hookData;
};

// <title>: kategori sayfaları okul adıyla, kategori listesi forumun tam adıyla
seo.categoryTitle = async function (hookData) {
	const { templateData } = hookData;
	if (templateData && CATEGORIES[templateData.cid]) {
		templateData.title = `${templateData.name} – Yaşar Üniversitesi`;
	}
	return hookData;
};

// Öğrenci sayfalarının <title>'ı (her eklentinin kendi başlığı kısa: "Erasmus+", "Timetable")
seo.pageTitle = async function (hookData) {
	const page = PAGES[pathOf(hookData.req)];
	if (page && hookData.templateData) {
		hookData.templateData.title = page.pageTitle;
	}
	return hookData;
};

seo.categoriesTitle = async function (hookData) {
	if (hookData.templateData) {
		hookData.templateData.title = HOME_TITLE;
	}
	return hookData;
};

// JSON-LD: ana sayfada site (Google'daki site adı ve arama kutusu).
// Konuların forum verisini (DiscussionForumPosting) tema zaten yazıyor: ikinci kopya Google'da hata veriyor.
function websiteLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE,
		alternateName: [HOME_TITLE, 'Yaşar Üniversitesi Forumu', 'Yasar Forum', 'Yaşar Üni Forum', 'YU Forum'],
		url: `${siteUrl()}/`,
		description: HOME_DESCRIPTION,
		inLanguage: 'tr-TR',
		about: { '@type': 'CollegeOrUniversity', name: 'Yaşar Üniversitesi', alternateName: 'Yaşar University', url: 'https://www.yasar.edu.tr/' },
		potentialAction: {
			'@type': 'SearchAction',
			target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl()}/search?term={search_term_string}&in=titlesposts` },
			'query-input': 'required name=search_term_string',
		},
	};
}

const script = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

seo.structuredData = async function (hookData) {
	const { data, templateData } = hookData;
	const tpl = data && data.template && data.template.name;
	if (tpl !== 'categories' || !templateData) {
		return hookData;
	}
	hookData.templateData = {
		...templateData,
		useCustomHTML: true,
		customHTML: `${templateData.useCustomHTML ? (templateData.customHTML || '') : ''}\n${script(websiteLd())}`,
	};
	return hookData;
};

seo.SITE_KEYWORDS = SITE_KEYWORDS;
seo.HOME_TITLE = HOME_TITLE;
seo.HOME_DESCRIPTION = HOME_DESCRIPTION;
