// src/ altındaki kaynakları static/ altına derler: SCSS sıkıştırılmış CSS'e, JS kapsamlı bir fonksiyona sarılır.
// Dosya adları değişmez; önbellek kırmak için içerik özeti static/manifest.json'a yazılır.
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import * as sass from 'sass';

const hash = s => createHash('sha256').update(s).digest('hex').slice(0, 12);

const scss = await readFile('src/custom.scss', 'utf8');
const css = sass.compileString(scss, { style: 'compressed' }).css;

// NodeBB özel JS'i bir fonksiyonun içinde çalıştırıyordu (prepareFooter); aynı kapsam korunur
const source = await readFile('src/custom.js', 'utf8');
const js = `/* nodebb-plugin-yasar-forum — kaynak: src/custom.js */\n(function () {\n${source}\n}());\n`;
new Function(js);

await writeFile('static/custom.css', css);
await writeFile('static/custom.js', js);
await writeFile('static/manifest.json', `${JSON.stringify({ css: hash(css), js: hash(js) }, null, '\t')}\n`);
console.log(`custom.css ${css.length} B, custom.js ${js.length} B`);
