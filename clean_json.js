const fs = require('fs');

const path = 'templates/index.json';
let raw = fs.readFileSync(path, 'utf8');

raw = raw.replace(/<p>missing translation:[^<]+<\/p>/g, '<p>Text content</p>');

fs.writeFileSync(path, raw);
console.log('Cleaned HTML tags in index.json');
