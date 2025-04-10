const fs = require('fs');
const path = require('path');

// Configuration
const REPO_NAME = 'MelVocalcoachingbBerlin';
const BASE_PATH = `/${REPO_NAME}`;
const OUT_DIR = path.join(process.cwd(), 'out');

console.log('🔧 Starting image path fixing process...');

// Check if the out directory exists
if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ The "out" directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Find all HTML files
let htmlFiles = [];
const findHtmlFiles = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(filePath);
    }
  }
};

findHtmlFiles(OUT_DIR);
console.log(`🔍 Found ${htmlFiles.length} HTML files to process`);

// Process each HTML file
let totalFixed = 0;
let totalFiles = 0;

for (const htmlFile of htmlFiles) {
  let content = fs.readFileSync(htmlFile, 'utf8');
  let originalContent = content;
  
  // Fix image paths in src attributes that don't start with http://, https://, or the BASE_PATH
  content = content.replace(
    /(<img[^>]+src=")(?!https?:\/\/|\/MelVocalcoachingbBerlin\/)(\/[^"]+)/g, 
    `$1${BASE_PATH}$2`
  );
  
  // Fix image paths in srcset attributes
  content = content.replace(
    /(<img[^>]+srcset=")(?!https?:\/\/|\/MelVocalcoachingbBerlin\/)(\/[^"]+)/g, 
    `$1${BASE_PATH}$2`
  );
  
  // Fix CSS background image URLs
  content = content.replace(
    /(background-image:\s*url\((?!['"]https?:\/\/|['"]\/MelVocalcoachingbBerlin\/|['"]data:))(['"]?)(\/?[^)]+)/g, 
    (match, prefix, quote, url) => {
      if (url.startsWith('/')) {
        return `${prefix}${quote}${BASE_PATH}${url}`;
      } else {
        return `${prefix}${quote}/${url}`;
      }
    }
  );
  
  // Fix link href attributes
  content = content.replace(
    /(<link[^>]+href=")(?!https?:\/\/|\/MelVocalcoachingbBerlin\/|#)(\/[^"]+)/g, 
    `$1${BASE_PATH}$2`
  );
  
  // Fix script src attributes
  content = content.replace(
    /(<script[^>]+src=")(?!https?:\/\/|\/MelVocalcoachingbBerlin\/)(\/[^"]+)/g, 
    `$1${BASE_PATH}$2`
  );
  
  // Fix anchor href attributes (only for internal links)
  content = content.replace(
    /(<a[^>]+href=")(?!https?:\/\/|mailto:|tel:|#|\/MelVocalcoachingbBerlin\/)(\/[^"]+)/g, 
    `$1${BASE_PATH}$2`
  );
  
  // If the content has changed, write it back
  if (content !== originalContent) {
    fs.writeFileSync(htmlFile, content);
    console.log(`✅ Fixed paths in ${path.relative(OUT_DIR, htmlFile)}`);
    totalFixed++;
  }
  
  totalFiles++;
}

console.log(`\n📋 Image path fixing completed.`);
console.log(`🔧 Fixed paths in ${totalFixed} out of ${totalFiles} HTML files.`);
console.log(`🚀 Your site should now have correct image and asset paths!`); 