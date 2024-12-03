const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'Gray Ghost Dashboead builder', 'React');
const targetDir = path.join(__dirname, '..');

// Copy and transform components
async function integrateComponents() {
  // Copy styles
  await fs.copy(
    path.join(sourceDir, 'src', 'styles'),
    path.join(targetDir, 'styles', 'dashboard')
  );

  // Copy components
  await fs.copy(
    path.join(sourceDir, 'src', 'components'),
    path.join(targetDir, 'components', 'dashboard')
  );

  // Copy screens as pages
  await fs.copy(
    path.join(sourceDir, 'src', 'screens'),
    path.join(targetDir, 'app', 'dashboard')
  );

  // Copy public assets
  await fs.copy(
    path.join(sourceDir, 'public'),
    path.join(targetDir, 'public', 'dashboard')
  );

  console.log('Dashboard components integrated successfully!');
}

// Update package.json with required dependencies
async function updateDependencies() {
  const sourcePkg = require(path.join(sourceDir, 'package.json'));
  const targetPkg = require(path.join(targetDir, 'package.json'));

  const newDeps = {
    ...targetPkg.dependencies,
    ...sourcePkg.dependencies
  };

  targetPkg.dependencies = newDeps;
  
  await fs.writeJson(path.join(targetDir, 'package.json'), targetPkg, { spaces: 2 });
  console.log('Dependencies updated successfully!');
}

async function main() {
  try {
    await integrateComponents();
    await updateDependencies();
    console.log('Integration completed successfully!');
  } catch (error) {
    console.error('Integration failed:', error);
    process.exit(1);
  }
}

main();
