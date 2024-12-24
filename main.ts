import { ensureDir } from "jsr:@std/fs@1";
import { fromFileUrl } from "jsr:@std/path@1";


async function scaffoldLaravelPackage(packageName: string) {
  const baseDir = `./${packageName}`;
  const namespace = packageName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("\\");
  const className = namespace.split("\\").pop() + "ServiceProvider";

  console.log(`Scaffolding Laravel package: ${packageName}...`);

  // Step 1: Create package structure
  await ensureDir(`${baseDir}/src`);
  await ensureDir(`${baseDir}/src/Providers`);

  async function readTemplate(templatePath: string): Promise<string> {
    if (templatePath.startsWith("file://")) {
      // Local execution
      return await Deno.readTextFile(new URL(templatePath));
    } else if (templatePath.startsWith("https://")) {
      // Global execution
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to fetch template: ${response.statusText}`);
      }
      return await response.text();
    } else {
      throw new Error("Unsupported template path.");
    }
  }

  const templateBase = new URL("./templates/", import.meta.url).toString();

  const composerTemplate = await readTemplate(`${templateBase}composer.template.json`);
  const composerJson = composerTemplate
      .replace(/{{PACKAGE_NAME}}/g, packageName)
      .replace(/{{NAMESPACE}}/g, namespace)
      .replace(/{{CLASS_NAME}}/g, className);
  await Deno.writeTextFile(`${baseDir}/composer.json`, composerJson);

  const serviceProviderTemplate = await readTemplate(`${templateBase}ServiceProviderTemplate.php`);
  const serviceProvider = serviceProviderTemplate
      .replace(/{{NAMESPACE}}/g, namespace)
      .replace(/{{CLASS_NAME}}/g, className);
  await Deno.writeTextFile(
      `${baseDir}/src/Providers/${className}.php`,
      serviceProvider,
  );

  // Step 4: Create .gitignore File
  const gitignoreContent = `
.idea/
vendor/
composer.lock
node_modules/
.env
.DS_Store
`;
  await Deno.writeTextFile(`${baseDir}/.gitignore`, gitignoreContent);

  console.log(`.gitignore file created.`);

  // Step 5: Initialize Git Repository
  try {
    const gitInit = new Deno.Command("git", {
      args: ["init"],
      cwd: baseDir,
    });
    const { success } = await gitInit.output();
    if (success) {
      console.log(`Git repository initialized.`);
    } else {
      console.error(`Failed to initialize Git repository.`);
    }
  } catch (error) {
    console.error(`Error initializing Git repository:`, error);
  }

  console.log(`Laravel package ${packageName} scaffolded successfully.`);
}

// Get the package name from the command line argument
const packageName = Deno.args[0];
if (!packageName) {
  console.error(
    "Usage: deno run --allow-write --allow-read --allow-run index.ts <package-name>",
  );
  Deno.exit(1);
}

// Run the script
await scaffoldLaravelPackage(packageName);
