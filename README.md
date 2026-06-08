![readme-logo](https://github.com/juntossomosmais/time-out-market/assets/20569339/e54b4b9c-4f21-481e-8ccc-4a862ea296af)

<div align="center">
  <h1>Time Out Market</h1>
  <p>
    <a href="https://github.com/juntossomosmais/atomium/actions/workflows/release-and-publish-packages.yml">
      <img
        alt="Release Status"
        src="https://img.shields.io/github/actions/workflow/status/juntossomosmais/atomium/release-and-publish-packages.yml?label=Release%20Status"
      />
    </a>
  </p>
  <br />
</div>

> Time Out Market is a market of shared JavaScript libraries to help you save time and effort

## About

This project aims to create a market of shared JavaScript libraries to help you save time and effort. The libraries are created by [Juntos Somos Mais](https://github.com/juntossomosmais) community and can be used in our internal projects.

## Packages

- [Linters](packages/linters/README.md) - A set of linters configs to be used in our JavaScript projects
- [http-front-cache](packages/http-front-cache/README.md) - Utility was created to provide a simple and efficient way to cache the results of service functions in the browser

## Documentation

- [Architecture Decision Records (ADRs)](docs/README.md) - Technical decisions and their rationale


## Development

### Getting Started

This project uses [pnpm](https://pnpm.io) as package manager (v10 or later). If you don't have it yet, install it with `corepack enable pnpm` or follow the [installation guide](https://pnpm.io/installation).

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a new branch: `git checkout -b my-new-branch`
4. Make your changes

### Local testing using pnpm link

You can use `pnpm link` to locally test any library. In your consumer project, link the library by pointing to its directory in this repository:

```bash
pnpm link ../path/to/time-out-market/packages/linters
```

This will create a symbolic link between your project and the local library.

Now, you can test the modifications in your project locally. Make sure to revert these changes and remove the link when you're done testing to avoid any conflicts or unexpected behavior with the actual installed library version in your project by running:

```bash
pnpm unlink @juntossomosmais/linters
pnpm install
```

Following these steps, you can quickly test and verify any customizations or modifications you have made to the library locally using pnpm link.

## Contributing

**!important**, as it's an internal project, we don't accept external suggestions to change or add new features.

We only accept contributions from **Juntos Somos Mais** members, but you could like our project and use it as a reference to build your own project.
