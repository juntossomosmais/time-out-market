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

## Development

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a new branch: `git checkout -b my-new-branch`
4. Make your changes

### Local testing using NPM Link

To locally test any library you could use NPM Link following the steps below:

Link the library by navigating to the `node_modules/@juntossomosmais/library-name` directory, example:

```bash
cd node_modules/@juntossomosmais/linters
npm link
```

Import library into your project by linking it using NPM Link. Navigate to your project's directory and run the following command example:

```bash
npm link @juntossomosmais/linters
```

This will create a symbolic link between your project and the locally library.

Now you can use test the modifications in your project and test them locally. Make sure to revert these changes and remove the NPM Link when you're done testing to avoid any conflicts or unexpected behavior with the actual installed version of library in your project.

By following these steps, you can easily test and verify any customizations or modifications you have made to library locally using NPM Link.

## Contributing

**!important**, as it's an internal project, we don't accept external suggestions to change or add new features.

We only accept contributions from **Juntos Somos Mais** members, but you could like our project and use it as a reference to build your own project.
