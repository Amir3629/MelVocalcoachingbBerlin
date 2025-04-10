/**
 * Fix Manifest URLs
 * 
 * This script ensures all references to site.webmanifest use the correct paths
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk') || { green: (s) => '✅ ' + s, red: (s) => '❌ ' + s, yellow: (s) => '⚠️ ' + s, blue: (s) => 'ℹ️ ' + s };

// The correct repository name
const CORRECT_REPO_NAME = 'MelVocalcoachingbBerlin';

// Get all HTML files in the out directory
function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(filePath, arrayOfFiles);
    } else {
      if (file.endsWith('.html')) {
        arrayOfFiles.push(filePath);
      }
    }
  });
  
  return arrayOfFiles;
}

// Fix manifest references in an HTML file
function fixManifestReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  let changed = false;
  
  // Look for manifest references with wrong paths
  const manifestRegex = /href=["'](.*?site\.webmanifest)["']/g;
  let match;
  
  while ((match = manifestRegex.exec(content)) !== null) {
    const originalPath = match[1];
    let fixedPath = originalPath;
    
    // Check if the path has the wrong repository name or missing repository name
    if (!originalPath.includes(`/${CORRECT_REPO_NAME}/`)) {
      // Fix the path to include the correct repository name
      if (originalPath.startsWith('/')) {
        fixedPath = `/${CORRECT_REPO_NAME}${originalPath}`;
        changed = true;
      }
    }
    
    // Apply the fix if needed
    if (fixedPath !== originalPath) {
      content = content.replace(
        `href="${originalPath}"`,
        `href="${fixedPath}"`
      ).replace(
        `href='${originalPath}'`,
        `href='${fixedPath}'`
      );
    }
  }
  
  // Fix preloaded manifests
  const preloadRegex = /rel=["']manifest["'] href=["'](.*?)["']/g;
  while ((match = preloadRegex.exec(content)) !== null) {
    const originalPath = match[1];
    let fixedPath = originalPath;
    
    // Check if the path has the wrong repository name or missing repository name
    if (!originalPath.includes(`/${CORRECT_REPO_NAME}/`)) {
      // Fix the path to include the correct repository name
      if (originalPath.startsWith('/')) {
        fixedPath = `/${CORRECT_REPO_NAME}${originalPath}`;
        changed = true;
      }
    }
    
    // Apply the fix if needed
    if (fixedPath !== originalPath) {
      content = content.replace(
        `href="${originalPath}"`,
        `href="${fixedPath}"`
      ).replace(
        `href='${originalPath}'`,
        `href='${fixedPath}'`
      );
    }
  }
  
  if (changed) {
    console.log(chalk.green(`Fixed manifest references in: ${relativePath}`));
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
async function main() {
  console.log(chalk.blue('🔍 Checking for incorrect manifest references...'));
  
  // Get all HTML files in the out directory
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    console.error(chalk.red('❌ Error: out directory does not exist. Run npm run build first.'));
    process.exit(1);
  }
  
  const htmlFiles = getAllHtmlFiles(outDir);
  
  // Fix manifest references in each HTML file
  let filesFixed = 0;
  
  for (const file of htmlFiles) {
    if (fixManifestReferences(file)) {
      filesFixed++;
    }
  }
  
  if (filesFixed === 0) {
    console.log(chalk.green('✅ No manifest reference issues found!'));
  } else {
    console.log(chalk.green(`✅ Fixed manifest references in ${filesFixed} files!`));
  }
}

main().catch(console.error); 