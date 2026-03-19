const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const srcIndexPath = path.join(projectRoot, 'src', 'index.html');
const distIndexPath = path.join(distDir, 'index.html');
const srcJsDir = path.join(projectRoot, 'src', 'js');
const srcImgDir = path.join(projectRoot, 'Img');
const distJsDir = path.join(distDir, 'js');
const distImgDir = path.join(distDir, 'Img');

fs.mkdirSync(distDir, { recursive: true });

let html = fs.readFileSync(srcIndexPath, 'utf8');
html = html.replace(/\.\.\/dist\/main\.css/g, './main.css');
html = html.replace(/\.\.\/Img\//g, './Img/');

fs.writeFileSync(distIndexPath, html, 'utf8');
copyDir(srcJsDir, distJsDir);
copyDir(srcImgDir, distImgDir);

console.log('Prepared dist/index.html, dist/js, and dist/Img for deployment.');

function copyDir(source, destination) {
    if (!fs.existsSync(source)) {
        return;
    }

    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true });
}
