#!/usr/bin/env python3
import json
import shutil
from datetime import datetime
from pathlib import Path

def scan_artifacts(artifacts_dir):
    """Scan the artifacts directory and create a JSON manifest."""
    artifacts = []
    
    for artifact_dir in Path(artifacts_dir).iterdir():
        if not artifact_dir.is_dir():
            continue
            
        manifest_file = artifact_dir / 'manifest.json'
        if not manifest_file.exists():
            continue
            
        try:
            with open(manifest_file) as f:
                manifest = json.load(f)
            
            # Copy the component files to the src/components/artifacts directory
            component_file = artifact_dir / 'component.jsx'
            if component_file.exists():
                component_name = manifest.get('componentName', '')
                if not component_name:
                    print(f"Warning: {artifact_dir} missing componentName in manifest.json")
                    continue
                    
                # Create components/artifacts directory if it doesn't exist
                components_dir = Path(artifacts_dir).parent / 'components' / 'artifacts'
                components_dir.mkdir(parents=True, exist_ok=True)
                
                # Copy component file
                shutil.copy2(component_file, components_dir / f"{component_name}.jsx")
                
                artifacts.append({
                    'id': artifact_dir.name,
                    'title': manifest.get('title', artifact_dir.name),
                    'description': manifest.get('description', ''),
                    'date': manifest.get('date', datetime.now().strftime('%Y-%m-%d')),
                    'componentName': component_name
                })
            else:
                print(f"Warning: {artifact_dir} missing component.jsx")
            
        except Exception as e:
            print(f"Error processing {artifact_dir}: {e}")
            
    return artifacts

def write_artifacts_json(artifacts, output_file):
    """Write the artifacts data to a JSON file."""
    with open(output_file, 'w') as f:
        json.dump(artifacts, f, indent=2)

def main():
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    artifacts_dir = project_root / 'src' / 'artifacts'
    output_file = project_root / 'src' / 'artifacts.json'
    
    # Create artifacts directory if it doesn't exist
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    # Scan artifacts and write to JSON
    artifacts = scan_artifacts(artifacts_dir)
    write_artifacts_json(artifacts, output_file)
    print(f"Found {len(artifacts)} artifacts")
    print(f"Artifacts data written to {output_file}")

if __name__ == '__main__':
    main()
