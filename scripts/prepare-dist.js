const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const srcIndexPath = path.join(projectRoot, 'src', 'index.html');
const distIndexPath = path.join(distDir, 'index.html');
const srcJsDir = path.join(projectRoot, 'src', 'js');
const srcImgDir = path.join(projectRoot, 'Img');
const osCssSrcPath = path.join(projectRoot, 'node_modules', 'overlayscrollbars', 'styles', 'overlayscrollbars.css');
const osJsSrcPath = path.join(projectRoot, 'node_modules', 'overlayscrollbars', 'browser', 'overlayscrollbars.browser.es6.js');
const distJsDir = path.join(distDir, 'js');
const distImgDir = path.join(distDir, 'Img');
const distVendorDir = path.join(distDir, 'vendor', 'overlayscrollbars');
const distOsCssPath = path.join(distVendorDir, 'overlayscrollbars.css');
const distOsJsPath = path.join(distVendorDir, 'overlayscrollbars.browser.es6.js');

fs.mkdirSync(distDir, { recursive: true });

let html = fs.readFileSync(srcIndexPath, 'utf8');
html = html.replace(/\.\.\/dist\/main\.css/g, './main.css');
html = html.replace(/\.\.\/Img\//g, './Img/');
html = html.replace(/\.\.\/node_modules\/overlayscrollbars\/styles\/overlayscrollbars\.css/g, './vendor/overlayscrollbars/overlayscrollbars.css');
html = html.replace(/\.\.\/node_modules\/overlayscrollbars\/browser\/overlayscrollbars\.browser\.es6\.js/g, './vendor/overlayscrollbars/overlayscrollbars.browser.es6.js');

fs.writeFileSync(distIndexPath, html, 'utf8');
copyDir(srcJsDir, distJsDir);
copyDir(srcImgDir, distImgDir);
copyFile(osCssSrcPath, distOsCssPath);
copyFile(osJsSrcPath, distOsJsPath);

console.log('Prepared dist/index.html, dist/js, dist/Img, and dist/vendor/overlayscrollbars for deployment.');

function copyDir(source, destination) {
    if (!fs.existsSync(source)) {
        return;
    }

    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true });
}

function copyFile(source, destination) {
    if (!fs.existsSync(source)) {
        return;
    }

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
}
