# Laravel Package Scaffold

This script scaffolds a Laravel package with a predefined structure and necessary files. It is built using Deno and creates the following:

- Basic directory structure
- `composer.json` with dynamic content based on the package name
- Service provider class
- `.gitignore` file
- Initializes a Git repository

## Prerequisites

Ensure you have the following installed:

- [Deno](https://deno.land/)
- Git

## Usage

You can run this script directly from a remote URL using Deno, similar to `npx` for Node.js. To scaffold a package, use the following command:

```bash
$ deno run --allow-write --allow-read --allow-run https://github/wyxos/stax/index.ts <package-name>
```

### Required Permissions

The script requires the following permissions:

- `--allow-write`: To create directories and write files.
- `--allow-read`: To read templates and existing files.
- `--allow-run`: To initialize a Git repository.

## Example

To scaffold a package named `my-laravel-package`:

```bash
$ deno run --allow-write --allow-read --allow-run https://github/wyxos/stax/index.ts my-laravel-package
```

After running the script, the following will be created in the current directory:

```
my-laravel-package/
├── src/
│   ├── Providers/
│       └── MyLaravelPackageServiceProvider.php
├── composer.json
├── .gitignore
```

## Customization

Modify the templates located in the `templates/` directory to customize the generated files. Ensure the placeholders (`{{PACKAGE_NAME}}`, `{{NAMESPACE}}`, `{{CLASS_NAME}}`) are preserved for dynamic replacement.
