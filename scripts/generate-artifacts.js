#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { promises: fsPromises } = require('fs');

async function scanArtifacts(artifactsDir) {
  const artifacts = [];
  
  try {
    const dirs = await fsPromises.readdir(artifactsDir, { withFileTypes: true });
    
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;
      
      const artifactPath = path.join(artifactsDir, dir.name);
      const manifestPath = path.join(artifactPath, 'manifest.json');
      
      // Check if manifest exists
      if (!fs.existsSync(manifestPath)) continue;
      
      try {
        // Read manifest
        const manifest = JSON.parse(await fsPromises.readFile(manifestPath, 'utf8'));
        
        // Check for component file
        const componentFile = path.join(artifactPath, 'component.jsx');
        if (fs.existsSync(componentFile)) {
          const componentName = manifest.componentName;
          
          if (!componentName) {
            console.log(`Warning: ${artifactPath} missing componentName in manifest.json`);
            continue;
          }
          
          // Create components/artifacts directory if it doesn't exist
          const componentsDir = path.join(path.dirname(artifactsDir), 'components', 'artifacts');
          await fsPromises.mkdir(componentsDir, { recursive: true });
          
          // Copy component file
          await fsPromises.copyFile(
            componentFile, 
            path.join(componentsDir, `${componentName}.jsx`)
          );
          
          artifacts.push({
            id: dir.name,
            title: manifest.title || dir.name,
            description: manifest.description || '',
            date: manifest.date || new Date().toISOString().split('T')[0],
            componentName
          });
        } else {
          console.log(`Warning: ${artifactPath} missing component.jsx`);
        }
      } catch (e) {
        console.error(`Error processing ${artifactPath}: ${e.message}`);
      }
    }
  } catch (e) {
    console.error(`Error scanning artifacts: ${e.message}`);
  }
  
  return artifacts;
}

async function writeArtifactsJson(artifacts, outputFile) {
  await fsPromises.writeFile(
    outputFile,
    JSON.stringify(artifacts, null, 2)
  );
}

async function main() {
  // Get the project root directory
  const scriptDir = path.dirname(__filename);
  const projectRoot = path.dirname(scriptDir);
  const artifactsDir = path.join(projectRoot, 'src', 'artifacts');
  const outputFile = path.join(projectRoot, 'src', 'artifacts.json');
  
  // Create artifacts directory if it doesn't exist
  await fsPromises.mkdir(artifactsDir, { recursive: true });
  
  // Scan artifacts
  const artifacts = await scanArtifacts(artifactsDir);
  
  // Sort artifacts by date (newest first)
  artifacts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Write sorted artifacts to JSON
  await writeArtifactsJson(artifacts, outputFile);
  
  console.log(`Found ${artifacts.length} artifacts`);
  console.log(`Artifacts data written to ${outputFile}`);
}
main().catch(err => {
  console.error(err);
  process.exit(1);
});
