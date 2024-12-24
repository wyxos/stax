import { ensureDir } from "https://deno.land/std/fs/mod.ts";

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

    // Step 2: Read and Populate composer.json Template
    const composerTemplate = await Deno.readTextFile("templates/composer.template.json");
    const composerJson = composerTemplate
        .replace(/{{PACKAGE_NAME}}/g, packageName)
        .replace(/{{NAMESPACE}}/g, namespace)
        .replace(/{{CLASS_NAME}}/g, className);
    await Deno.writeTextFile(`${baseDir}/composer.json`, composerJson);

    // Step 3: Read and Populate Service Provider Template
    const serviceProviderTemplate = await Deno.readTextFile("templates/ServiceProviderTemplate.php");
    const serviceProvider = serviceProviderTemplate
        .replace(/{{NAMESPACE}}/g, namespace)
        .replace(/{{CLASS_NAME}}/g, className);
    await Deno.writeTextFile(`${baseDir}/src/Providers/${className}.php`, serviceProvider);

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
    const gitInitProcess = Deno.run({
        cmd: ["git", "init"],
        cwd: baseDir,
        stdout: "null",
        stderr: "null",
    });
    const gitInitStatus = await gitInitProcess.status();
    if (gitInitStatus.success) {
        console.log(`Git repository initialized.`);
    } else {
        console.error(`Failed to initialize Git repository.`);
    }

    console.log(`Laravel package ${packageName} scaffolded successfully.`);
}

// Get the package name from the command line argument
const packageName = Deno.args[0];
if (!packageName) {
    console.error("Usage: deno run --allow-write --allow-read --allow-run index.ts <package-name>");
    Deno.exit(1);
}

// Run the script
await scaffoldLaravelPackage(packageName);