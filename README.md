# AI Generated Artifacts

A React-based web application showcasing Set Kyar Wa Lar's collection of AI-generated artifacts. Each artifact is a self-contained interactive component that demonstrates various concepts through visualizations and simulations.

## Getting Started


### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Create and activate a Python virtual environment (if needed for any Python dependencies):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Unix/macOS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── public/           # Static files
├── src/
│   ├── artifacts/    # Individual artifact components and manifests
│   ├── components/   # Shared React components
│   └── artifacts.json # Artifact registry
├── scripts/         # Build and utility scripts
└── package.json     # Project dependencies and scripts
```

## Artifact System

The project uses a manifest-based system to manage artifacts:

1. **Artifact Structure**:
   Each artifact in the `src/artifacts/` directory must contain:
   - `manifest.json`: Defines artifact metadata (title, description, date, componentName)
   - `component.jsx`: The React component implementing the artifact

2. **Registration Process**:
   - Place new artifacts in the `src/artifacts/` directory
   - Run the Python script to generate `artifacts.json`:
     ```bash
     python scripts/manage_artifacts.py
     ```
   - The script will:
     - Scan all artifact directories
     - Copy component files to `src/components/artifacts/`
     - Generate `artifacts.json` with metadata

3. **Loading System**:
   - `Home.js` loads `artifacts.json` to display the artifact gallery
   - `ArtifactView.js` dynamically loads individual artifacts using React.lazy()

## Development

- Each artifact should be a self-contained component
- Use Tailwind CSS for styling
- Follow the manifest structure for new artifacts

## Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## License

MIT