# Laravel Package Scaffold

This script scaffolds a Laravel package with a predefined structure and
necessary files. It is built using Deno and creates the following:

- Basic directory structure
- `composer.json` with dynamic content based on the package name
- Service provider class
- `.gitignore` file
- Initializes a Git repository

## Prerequisites

Ensure you have the following installed:

- [Deno](https://deno.land/) (version 2.1.4 or newer)
- Git

## Usage

Run the package directly using the `jsr:` protocol:

```bash
$ deno run --allow-write --allow-read --allow-run jsr:@wyxos/stax <arguments>
```

Replace:

- `<arguments>` with the arguments your script requires.

### Example

To scaffold a Laravel package named `my-laravel-package`, run:

```bash
$ deno run --allow-write --allow-read --allow-run jsr:@wyxos/stax my-laravel-package
```

## Optional Global Installation

If you want to install it globally:

```bash
deno install --allow-write --allow-read --allow-run -n stax jsr:@wyxos/stax
```

Then you can run the package like this:

```bash
stax my-laravel-package
```
