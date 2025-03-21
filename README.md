# AI Generated Artifacts

A React-based web application showcasing Set Kyar Wa Lar's collection of AI-generated artifacts. Each artifact is a self-contained interactive component that demonstrates various concepts through visualizations and simulations.

## Getting Started


### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

Generally, we use the following structure for each artifact:

1. Ask Claude to generate artifact
2. Run `node scripts/add-artifact.js` to add the artifact to the registry
3. Run `node scripts/generate-manifest.js` to generate the manifest
4. Run `npm start` to start the development server and verify the artifact
5. Run `npm run build` to build the artifact for production


## Development

- Each artifact should be a self-contained component
- Use Tailwind CSS for styling

## Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App

## License

MIT