const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const REPO_NAME = 'MelVocalcoachingbBerlin';
const BASE_PATH = `/${REPO_NAME}`;
const OUT_DIR = path.join(process.cwd(), 'out');

console.log('🔍 Starting deployment verification...');

// Check if the out directory exists
if (!fs.existsSync(OUT_DIR)) {
  console.error('❌ The "out" directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// Check for .nojekyll file
const nojekyllPath = path.join(OUT_DIR, '.nojekyll');
if (!fs.existsSync(nojekyllPath)) {
  console.error('❌ .nojekyll file is missing in the out directory.');
  console.log('   Creating it now...');
  fs.writeFileSync(nojekyllPath, '');
  console.log('✅ .nojekyll file created');
} else {
  console.log('✅ .nojekyll file exists');
}

// Check next.config.js settings
try {
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfig = require(nextConfigPath);
  
  if (nextConfig.basePath !== BASE_PATH) {
    console.error(`❌ basePath in next.config.js is incorrect. Expected: "${BASE_PATH}", Found: "${nextConfig.basePath}"`);
  } else {
    console.log('✅ basePath is correctly configured');
  }
  
  if (nextConfig.assetPrefix !== `${BASE_PATH}/`) {
    console.error(`❌ assetPrefix in next.config.js is incorrect. Expected: "${BASE_PATH}/", Found: "${nextConfig.assetPrefix}"`);
  } else {
    console.log('✅ assetPrefix is correctly configured');
  }
  
  if (!nextConfig.trailingSlash) {
    console.error('❌ trailingSlash should be set to true in next.config.js');
  } else {
    console.log('✅ trailingSlash is correctly configured');
  }
  
  if (nextConfig.publicRuntimeConfig?.basePath !== BASE_PATH) {
    console.error(`❌ publicRuntimeConfig.basePath is incorrect. Expected: "${BASE_PATH}", Found: "${nextConfig.publicRuntimeConfig?.basePath}"`);
  } else {
    console.log('✅ publicRuntimeConfig.basePath is correctly configured');
  }
  
  if (nextConfig.output !== 'export') {
    console.error('❌ output should be set to "export" in next.config.js');
  } else {
    console.log('✅ output is correctly configured');
  }
} catch (error) {
  console.error('❌ Error checking next.config.js:', error.message);
}

// Check GitHub Actions workflow file
const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'deploy.yml');
if (!fs.existsSync(workflowPath)) {
  console.error('❌ GitHub Actions workflow file is missing');
} else {
  const workflowContent = fs.readFileSync(workflowPath, 'utf8');
  
  if (!workflowContent.includes('touch out/.nojekyll')) {
    console.error('❌ GitHub workflow is missing the step to create .nojekyll file');
  } else {
    console.log('✅ GitHub workflow includes .nojekyll creation step');
  }
  
  if (!workflowContent.includes('actions/upload-pages-artifact@v2')) {
    console.error('❌ GitHub workflow is using an outdated upload-pages-artifact action');
  } else {
    console.log('✅ GitHub workflow is using the latest upload-pages-artifact action');
  }
}

// Sample check of image paths in some HTML files
try {
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
  
  let incorrectImagePaths = 0;
  const sampleSize = Math.min(5, htmlFiles.length);
  
  console.log(`🔍 Checking ${sampleSize} HTML files for image paths...`);
  
  for (let i = 0; i < sampleSize; i++) {
    const htmlContent = fs.readFileSync(htmlFiles[i], 'utf8');
    
    // Check for image src without BASE_PATH
    const imgTags = htmlContent.match(/<img[^>]+src="(?!https?:\/\/|\/MelVocalcoachingbBerlin\/)[^"]+"/g);
    if (imgTags && imgTags.length > 0) {
      console.error(`❌ Found ${imgTags.length} image(s) with incorrect path in ${path.relative(OUT_DIR, htmlFiles[i])}`);
      incorrectImagePaths += imgTags.length;
    }
  }
  
  if (incorrectImagePaths === 0) {
    console.log('✅ No image path issues found in the sample HTML files');
  } else {
    console.error(`❌ Found a total of ${incorrectImagePaths} incorrect image paths in the sample HTML files`);
  }
} catch (error) {
  console.error('❌ Error checking HTML files:', error.message);
}

console.log('\n📋 Deployment verification completed.');
console.log('🚀 If all checks passed, your site is ready for deployment to GitHub Pages!'); 