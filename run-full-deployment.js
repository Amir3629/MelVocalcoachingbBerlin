/**
 * Full Deployment Process Script
 * 
 * Runs all necessary steps to prepare and deploy the site to GitHub Pages
 */

const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (s) => '✅ ' + s, red: (s) => '❌ ' + s, yellow: (s) => '⚠️ ' + s, blue: (s) => 'ℹ️ ' + s };

console.log('🚀 Running full GitHub Pages deployment process...\n');

try {
  // Step 1: Fix all image paths
  console.log(chalk.blue('Step 1: Fixing image paths...'));
  execSync('node fix-image-paths.js', { stdio: 'inherit' });
  
  // Step 2: Verify deployment configuration
  console.log('\n' + chalk.blue('Step 2: Verifying deployment configuration...'));
  execSync('node verify-deployment.js', { stdio: 'inherit' });
  
  // Step 3: Build the project
  console.log('\n' + chalk.blue('Step 3: Building the project...'));
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Verify the out directory
  console.log('\n' + chalk.blue('Step 4: Verifying the out directory...'));
  execSync('node verify-out-dir.js', { stdio: 'inherit' });
  
  // Step 5: Force create .nojekyll file
  console.log('\n' + chalk.blue('Step 5: Ensuring .nojekyll file exists...'));
  try {
    execSync('type nul > out\\.nojekyll', { stdio: 'inherit' });
  } catch (error) {
    console.log('Note: Error creating .nojekyll via type command - this is normal on non-Windows systems');
    execSync('touch out/.nojekyll || echo ".nojekyll already exists"', { stdio: 'inherit' });
  }
  
  // Step 6: Deploy to GitHub Pages
  console.log('\n' + chalk.blue('Step 6: Deploying to GitHub Pages...'));
  execSync('gh-pages -d out -b gh-pages', { stdio: 'inherit' });
  
  // Success
  console.log('\n' + chalk.green('✅ Deployment process completed!'));
  console.log('\nYour site should now be live at: https://amir3629.github.io/MelVocalcoachingbBerlin/');
  console.log('\nIMPORTANT: Configure GitHub Pages settings:');
  console.log('1. Go to your GitHub repository Settings > Pages');
  console.log('2. Set source to "GitHub Actions"');
  console.log('3. Wait for the GitHub Actions workflow to complete (check the Actions tab)');
  console.log('4. Verify your site is working at https://amir3629.github.io/MelVocalcoachingbBerlin/');
  console.log('5. Check https://amir3629.github.io/MelVocalcoachingbBerlin/verify.html to confirm deployment');
  
} catch (error) {
  console.error('\n' + chalk.red('❌ Error in deployment process:'), error.message);
  process.exit(1);
} 