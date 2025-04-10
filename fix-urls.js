/**
 * Fix URL Case Sensitivity Issues
 * 
 * This script checks for case sensitivity issues in URLs and fixes them
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk') || { green: (s) => '✅ ' + s, red: (s) => '❌ ' + s, yellow: (s) => '⚠️ ' + s, blue: (s) => 'ℹ️ ' + s };

// The correct case for the repository name
const CORRECT_REPO_NAME = 'MelVocalcoachingbBerlin';
// Common incorrect cases to check for
const INCORRECT_CASES = ['MelVocalcoachingBerlin', 'melvocalcoachingbberlin', 'Melvocalcoachingbberlin'];

// Get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      // Skip node_modules and temporary/backup directories
      if (
        !file.includes('node_modules') && 
        !file.includes('temp_') && 
        !file.includes('backup') &&
        !file.includes('.next') &&
        !file.includes('out')
      ) {
        arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
      }
    } else {
      // Include only text-based files
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.json', '.md', '.webmanifest'].includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });
  
  return arrayOfFiles;
}

// Fix case sensitivity issues in a file
function fixCaseSensitivity(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  let changed = false;
  
  // Check for incorrect cases of the repository name
  INCORRECT_CASES.forEach(incorrectCase => {
    // Don't replace in the script itself
    if (filePath.includes('fix-urls.js')) return;
    
    // Create regex that doesn't match variable names
    const regex = new RegExp(`(["'/])${incorrectCase}(["'/])`, 'g');
    
    if (content.match(regex)) {
      content = content.replace(regex, `$1${CORRECT_REPO_NAME}$2`);
      changed = true;
    }
  });
  
  // Special case for HTML files: check for manifest references
  if (filePath.endsWith('.html') || filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    // Fix manifest references
    const manifestRegex = /href=["'](.*?site\.webmanifest)["']/g;
    let match;
    
    while ((match = manifestRegex.exec(content)) !== null) {
      const originalPath = match[1];
      let fixedPath = originalPath;
      
      // If it has incorrect case, fix it
      INCORRECT_CASES.forEach(incorrectCase => {
        if (originalPath.includes(incorrectCase)) {
          fixedPath = originalPath.replace(incorrectCase, CORRECT_REPO_NAME);
          changed = true;
        }
      });
      
      // If it doesn't have the repository name but should (for absolute paths)
      if (fixedPath.startsWith('/') && !fixedPath.includes(CORRECT_REPO_NAME) && !fixedPath.startsWith(`/${CORRECT_REPO_NAME}`)) {
        fixedPath = `/${CORRECT_REPO_NAME}${fixedPath}`;
        changed = true;
      }
      
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
  }
  
  if (changed) {
    console.log(chalk.green(`Fixed case sensitivity in: ${relativePath}`));
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
async function main() {
  console.log(chalk.blue('🔍 Checking for case sensitivity issues in URLs...'));
  
  // Get all text files
  const files = getAllFiles('.');
  
  // Check each file
  let filesFixed = 0;
  
  for (const file of files) {
    if (fixCaseSensitivity(file)) {
      filesFixed++;
    }
  }
  
  if (filesFixed === 0) {
    console.log(chalk.green('✅ No case sensitivity issues found!'));
  } else {
    console.log(chalk.green(`✅ Fixed case sensitivity issues in ${filesFixed} files!`));
    console.log(chalk.blue('\nNext steps:'));
    console.log('1. Run npm run build to rebuild with the fixed URLs');
    console.log('2. Run npm run deploy to deploy the fixed site');
  }
}

main().catch(console.error); 