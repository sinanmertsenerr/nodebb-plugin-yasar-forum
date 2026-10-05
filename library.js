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

// Araç sayfaları (timetable, CV oluşturucu) kenar çubukları kapalı çizilir: sayfa açılırken bir an açık görünüp kapanmasın.
// Yalnızca bu yanıttaki başlık değişir; kişinin kayıtlı ayarı ve tarayıcıdaki config aynı kalır (çıkınca eski hâline döner).
const TOOL_TEMPLATES = ['timetable', 'cv'];

plugin.closeSidebarsOnTools = async function (hookData) {
	const tpl = hookData.data && hookData.data.template;
	const config = hookData.templateData && hookData.templateData.config;
	if (tpl && TOOL_TEMPLATES.some(name => tpl[name]) && config && config.theme && config.theme.openSidebars) {
		hookData.templateData = { ...hookData.templateData, config: { ...config, theme: { ...config.theme, openSidebars: false } } };
	}
	return hookData;
};
