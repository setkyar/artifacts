#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const prettier = require("prettier");

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function collectInput() {
  console.log("📝 Create New Artifact");
  console.log("---------------------");

  // Collect initial inputs
  const artifactPath = await question(
    "Enter artifact path (e.g., agent-simulator): "
  );
  const title = await question("Enter artifact title: ");
  const description = await question("Enter artifact description: ");
  const componentName = await question("Enter component name: ");

  // Close readline interface to avoid interference
  rl.close();

  // Prompt for JSX code
  console.log("\n📌 Paste your JSX component code below.");
  console.log(
    "After pasting, press Control-D (or Control-Z on Windows) to finish.\n"
  );

  let buffer = "";
  process.stdin.setEncoding("utf8");

  // Return a promise to collect JSX code
  return new Promise((resolve) => {
    const onData = (chunk) => {
      buffer += chunk;
    };

    const onEnd = () => {
      process.stdin.removeListener("data", onData);
      process.stdin.removeListener("end", onEnd);
      process.stdin.pause();
      resolve({
        artifactPath,
        title,
        description,
        componentName,
        jsxCode: buffer,
      });
    };

    process.stdin.on("data", onData);
    process.stdin.on("end", onEnd);
    process.stdin.resume();
  });
}

async function createArtifact(data) {
  try {
    console.log("Creating artifact...");
    console.log("Current working directory:", process.cwd());

    const artifactsDir = path.join(process.cwd(), "src", "artifacts");
    console.log("Artifacts directory:", artifactsDir);

    // Create artifacts directory if it doesn't exist
    if (!fs.existsSync(artifactsDir)) {
      console.log("Creating artifacts directory...");
      fs.mkdirSync(artifactsDir, { recursive: true });
    }

    const componentDir = path.join(artifactsDir, data.artifactPath);
    console.log("Component directory:", componentDir);

    // Create component directory
    if (!fs.existsSync(componentDir)) {
      console.log("Creating component directory...");
      fs.mkdirSync(componentDir, { recursive: true });
    }

    console.log("Formatting JSX code...");
    // Format JSX code with Prettier
    const formattedJSX = await prettier.format(data.jsxCode, {
      parser: "babel",
      semi: true,
      singleQuote: true,
      trailingComma: "es5",
    });

    // Create manifest.json with current date
    const today = new Date().toISOString().split("T")[0];
    const manifest = {
      title: data.title,
      description: data.description,
      date: today,
      componentName: data.componentName,
    };

    console.log("Writing files...");
    // Write files
    const componentPath = path.join(componentDir, "component.jsx");
    const manifestPath = path.join(componentDir, "manifest.json");

    fs.writeFileSync(componentPath, formattedJSX);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`\n✅ Successfully created artifact: ${data.componentName}`);
    console.log(`   Location: ${componentDir}`);
    console.log("\nFiles created:");
    console.log(`- ${componentPath}`);
    console.log(`- ${manifestPath}`);
  } catch (error) {
    console.error("Error creating artifact:", error);
    throw error;
  }
}

async function main() {
  try {
    const input = await collectInput();
    await createArtifact(input);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();