// ينسخ الخطوط (Cairo + Aref Ruqaa + Cinzel) داخل التطبيق عشان تشتغل بدون إنترنت
const fs = require('fs'), path = require('path');
const out = path.join(__dirname, '..', 'www', 'fonts');
fs.mkdirSync(out, { recursive: true });
const want = { cairo: [400, 600, 700, 800, 900], 'aref-ruqaa': [700], cinzel: [700, 900] };
let css = '';
for (const [pkg, weights] of Object.entries(want)) {
  const dir = path.join(__dirname, '..', 'node_modules', '@fontsource', pkg);
  if (!fs.existsSync(dir)) { console.warn('⚠️ ما لقيت', pkg, '— شغّل npm install أول'); continue; }
  const dest = path.join(out, pkg); fs.mkdirSync(dest, { recursive: true });
  for (const w of weights) {
    const f = path.join(dir, `${w}.css`);
    if (!fs.existsSync(f)) continue;
    let c = fs.readFileSync(f, 'utf8');
    const files = [...c.matchAll(/url\(\.\/files\/([^)]+)\)/g)].map(m => m[1]);
    for (const file of files) {
      const src = path.join(dir, 'files', file);
      if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dest, file));
    }
    css += c.replace(/url\(\.\/files\//g, `url(./${pkg}/`) + '\n';
  }
}
fs.writeFileSync(path.join(out, 'fonts.css'), css);
console.log('✅ الخطوط جاهزة في www/fonts');
