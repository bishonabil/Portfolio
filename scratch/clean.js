const fs = require('fs');
const path = require('path');

const cssPath = path.resolve('css/styles.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// 1. Remove first particles block
css = css.replace(/\/\* Particle\/Stars Effect \*\/[\s\S]*?(?=\.device-tablet \{)/, '');

// 2. Remove old #hero-section override
css = css.replace(/\/\* Hero Section Padding \*\/[\s\S]*?@media \(min-width: 1024px\) \{[\s\S]*?\}\s*\}/, '');

// 3. Remove second particles block and keyframes up to WhatsApp styles
css = css.replace(/\/\* Particle\/Stars Effect \*\/[\s\S]*?(?=\/\* WhatsApp Button Styles \*\/)/, '');

// 4. Remove rotate-center keyframes at the end
css = css.replace(/@keyframes rotate-center\s*\{[\s\S]*?\}\s*\}$/, '');

fs.writeFileSync(cssPath, css.trim() + '\n');

const jsPath = path.resolve('js/script.js');
let js = fs.readFileSync(jsPath, 'utf-8');

// Remove particle script logic
js = js.replace(/\/\/ Particle Stars Cursor Follower \(Hero Section\)[\s\S]*?\(\)\s*;/g, '');

fs.writeFileSync(jsPath, js.trim() + '\n');

console.log('Cleanup complete.');
