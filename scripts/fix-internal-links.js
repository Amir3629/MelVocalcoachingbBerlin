const fs = require('fs');
const path = require('path');

// Configuration
const REPO_NAME = 'MelVocalcoachingbBerlin';
const BASE_PATH = `/${REPO_NAME}`;
const OUT_DIR = path.join(process.cwd(), 'out');

console.log('🔧 Starting internal link fixing process...');

// Check if the out directory exists
if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ The "out" directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Find all JavaScript files that might contain routing logic
let jsFiles = [];
const findJsFiles = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findJsFiles(filePath);
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  }
};

findJsFiles(OUT_DIR);
console.log(`🔍 Found ${jsFiles.length} JavaScript files to process`);

// Patterns to look for
const routerPushPattern = /router\.push\(['"](?!\/?MelVocalcoachingbBerlin\/)(\/?[^'"]+)['"]\)/g;
const linkHrefPattern = /href={['"](?!\/?MelVocalcoachingbBerlin\/)(\/?[^'"]+)['"]}|href=["'](?!\/?MelVocalcoachingbBerlin\/)(\/?[^"']+)["']/g;
const navigatePattern = /navigate\(['"](?!\/?MelVocalcoachingbBerlin\/)(\/?[^'"]+)['"]\)/g;

// Process each JavaScript file
let totalFixed = 0;
let totalFiles = 0;

for (const jsFile of jsFiles) {
  let content = fs.readFileSync(jsFile, 'utf8');
  let originalContent = content;
  
  // Fix router.push calls
  content = content.replace(routerPushPattern, (match, p1) => {
    if (p1.startsWith('/')) {
      return `router.push("${BASE_PATH}${p1}")`;
    } else {
      return `router.push("${BASE_PATH}/${p1}")`;
    }
  });
  
  // Fix Link href attributes
  content = content.replace(linkHrefPattern, (match, p1, p2) => {
    const path = p1 || p2;
    if (path.startsWith('/')) {
      return match.replace(path, `${BASE_PATH}${path}`);
    } else {
      return match.replace(path, `${BASE_PATH}/${path}`);
    }
  });
  
  // Fix navigate calls
  content = content.replace(navigatePattern, (match, p1) => {
    if (p1.startsWith('/')) {
      return `navigate("${BASE_PATH}${p1}")`;
    } else {
      return `navigate("${BASE_PATH}/${p1}")`;
    }
  });
  
  // If the content has changed, write it back
  if (content !== originalContent) {
    fs.writeFileSync(jsFile, content);
    console.log(`✅ Fixed links in ${path.relative(OUT_DIR, jsFile)}`);
    totalFixed++;
  }
  
  totalFiles++;
}

console.log(`\n📋 Internal link fixing completed.`);
console.log(`🔧 Fixed links in ${totalFixed} out of ${totalFiles} JavaScript files.`);
console.log(`🚀 Your site should now have correct internal navigation links!`); 