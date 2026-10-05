'use strict';

const nconf = nodebb.require('nconf');
const meta = nodebb.require('./src/meta');

const manifest = require('./static/manifest.json');

const plugin = module.exports;

const base = () => `${nconf.get('relative_path')}/assets/plugins/nodebb-plugin-yasar-forum/static`;

// ACP'deki eski özel CSS/JS hâlâ açıksa dosyalar eklenmez; aynı kod iki kez yüklenmesin.
// Geçiş: eklentiyi etkinleştir, sonra ACP > Görünüm > Özelleşmiş İçerik'te iki anahtarı kapat. Geri dönmek için aç.
const enabled = value => value === true || value === 1 || value === '1' || value === 'on';

// Stil, NodeBB'nin kendi CSS'inden hemen sonra gelir (eski satır içi <style> ile aynı sıra)
plugin.addStylesheet = async function (data) {
	if (!enabled(meta.config.useCustomCSS)) {
		data.links.push({
			rel: 'stylesheet',
			type: 'text/css',
			href: `${base()}/custom.css?v=${manifest.css}`,
		});
	}
	return data;
};

// Betik "defer" ile NodeBB'nin kendi betiğinden sonra, sayfa açılışından (app.coldLoad) önce çalışır
plugin.addScript = async function (scripts) {
	if (!enabled(meta.config.useCustomJS)) {
		scripts.push(`${base()}/custom.js?v=${manifest.js}`);
	}
	return scripts;
};

// Kenar çubuklarının bu yanıtta açık mı kapalı mı çizileceği (sol çubuk başlıkta, sağ çubuk alt şablonda: iki kanca):
// - Girişli: kendi kayıtlı seçimi (Harmony hesabına yazar); seçim yapmadıysa ACP'deki varsayılan.
//   Timetable ve CV Oluşturucu'da kapalı: uygulamalar geniş alana ihtiyaç duyuyor; çıkınca seçimi geri gelir.
// - Misafir: açık; kendisi kapattıysa kapalı ("yu-sidebars" çerezi, custom.js yazar). Giriş kartında araç yok,
//   orada kapatılmaz. Sunucu doğrudan doğru hâli çizer: açılışta "açık görünüp kapanma" olmaz.
// Yalnızca bu yanıttaki başlığın config kopyası değişir; kişinin kayıtlı ayarı ve tarayıcıdaki config aynı kalır.
const TOOL_TEMPLATES = ['timetable', 'cv'];
const GATE_TEMPLATE = 'yu-login-gate';
const SIDEBAR_COOKIE = 'yu-sidebars';

plugin.sidebarState = async function (hookData) {
	const config = hookData.templateData && hookData.templateData.config;
	if (!config || !config.theme) {
		return hookData;
	}
	const req = hookData.req || {};
	const tpl = hookData.data && hookData.data.template;
	const gate = hookData.data && hookData.data.templateToRender === GATE_TEMPLATE;
	const saved = !!config.theme.openSidebars;
	let open = saved;
	if (!(req.uid > 0)) {
		open = (req.cookies && req.cookies[SIDEBAR_COOKIE]) !== 'closed';
	} else if (tpl && !gate && TOOL_TEMPLATES.some(name => tpl[name])) {
		open = false;
	}
	if (open !== saved) {
		hookData.templateData = { ...hookData.templateData, config: { ...config, theme: { ...config.theme, openSidebars: open } } };
	}
	return hookData;
};

// Öğrenci araçları (Timetable, CV Oluşturucu) menüde herkese görünür ama yalnızca girişli kullanılır.
// Misafire aracın yerine giriş kartı çizilir (sunucuda, sayfa geçişlerinde de); aracın kendisi HTML'e hiç girmez.
// Dönüş adresi oturuma yazılır: giriş yapınca aynı sayfaya dönülür (NodeBB'nin kendi yöntemi, misafir zaten oturum alıyor).
const svg = inner => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const GATED = {
	timetable: {
		title: 'Timetable',
		text: 'Derslerini seç, çakışmayan haftalık ders programını saniyeler içinde oluştur.',
		icon: svg('<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>'),
	},
	cv: {
		title: 'CV Oluşturucu',
		text: 'Hazır şablonlarla CV\'ni hazırla, PDF olarak indir. Bilgilerin senin cihazında kalır.',
		icon: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M15 18a3 3 0 1 0-6 0"/><circle cx="12" cy="13" r="2"/>'),
	},
};
plugin.gateTools = async function (hookData) {
	const { req, templateData } = hookData;
	const key = templateData && templateData.template && Object.keys(GATED).find(name => templateData.template[name]);
	if (!key || (req.uid && req.uid > 0)) {
		return hookData;
	}
	const rel = nconf.get('relative_path');
	const path = String(templateData.url || '/').replace(new RegExp(`^${rel}`), '') || '/';
	if (req.session) {
		req.session.returnTo = path;
	}
	templateData.templateToRender = GATE_TEMPLATE;
	// Aracın kendi verisi misafire gitmesin (CV uygulamasının dosya adresleri gibi)
	['js', 'css', 'fonts'].forEach((field) => { delete templateData[field]; });
	templateData.yuGate = {
		key,
		...GATED[key],
		loginUrl: `${rel}/login`,
		registerUrl: `${rel}/register`,
		allowRegistration: meta.config.registrationType === 'normal',
	};
	return hookData;
};

// Giriş kartında sayfaya ait bileşenler (ör. Timetable'ın iframe'i) misafire hiç gitmez: ne HTML'e ne sayfa verisine.
// Yalnızca her sayfada olan alanlar kalır (üst bilgi, alt bilgi, marka şeridi, kenar çubuğu altı).
const GATE_KEEP_AREAS = new Set(['header', 'footer', 'brand-header', 'sidebar-footer']);

plugin.hideToolWidgets = async function (hookData) {
	const gate = hookData && hookData.templateData && hookData.templateData.templateToRender === GATE_TEMPLATE;
	if (gate && !GATE_KEEP_AREAS.has(hookData.location)) {
		hookData.html = '';
	}
	return hookData;
};
