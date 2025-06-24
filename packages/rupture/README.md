# @juntossomosmais/rupture

A powerful SCSS Media Queries library for creating clean, maintainable responsive designs. Based on the [rupture-sass](https://github.com/senvolodymyr/rupture-sass) library with custom modifications for modern responsive design needs.

## Features

- 🎯 **Clean Media Queries**: Simple, readable mixins for all your breakpoint needs
- 📱 **Mobile-First**: Built with mobile-first responsive design in mind
- 🔧 **Customizable**: Fully configurable breakpoints and settings
- 💪 **Powerful**: Supports complex media queries with density, orientation, and more
- 📦 **Lightweight**: Pure SCSS with no runtime dependencies

## Installation

```bash
npm install @juntossomosmais/rupture
```

## Quick Start

```scss
@use '@juntossomosmais/rupture' as rupture;

.my-component {
  padding: 16px;

  @include rupture.mobile() {
    padding: 8px;
  }

  @include rupture.tablet() {
    padding: 12px;
  }

  @include rupture.desktop() {
    padding: 24px;
  }
}
```

## Configuration

You can customize rupture by defining your own `$rupture` map before importing:

```scss
$rupture: (
  mobile-cutoff: 480px,
  desktop-cutoff: 1024px,
  hd-cutoff: 1920px,
  scale: 0 480px 768px 1024px 1280px 1920px,
  scale-names: 'xs' 's' 'm' 'l' 'xl' 'hd',
  enable-em-breakpoints: false,
  anti-overlap: false,
  base-font-size: 16px
);

@use '@juntossomosmais/rupture' as rupture;
```

## Default Configuration

```scss
$rupture: (
  mobile-cutoff: 400px,
  desktop-cutoff: 1050px,
  hd-cutoff: 1800px,
  scale: 0 400px 600px 800px 1050px 1800px,
  scale-names: 'xs' 's' 'm' 'l' 'xl' 'hd',
  enable-em-breakpoints: false,
  anti-overlap: false,
  base-font-size: 16px,
  rasterise-media-queries: false,
  density-queries: 'dppx' 'webkit' 'moz' 'dpi',
  retina-density: 1.5,
  use-device-width: false
);
```

## Available Mixins

### Basic Breakpoint Mixins

#### `@include mobile()`
Styles for mobile devices (up to mobile-cutoff)

```scss
.component {
  @include rupture.mobile() {
    font-size: 14px;
  }
}
```

#### `@include tablet()`
Styles for tablets (between mobile-cutoff and desktop-cutoff)

```scss
.component {
  @include rupture.tablet() {
    font-size: 16px;
  }
}
```

#### `@include desktop()`
Styles for desktop and larger (from desktop-cutoff)

```scss
.component {
  @include rupture.desktop() {
    font-size: 18px;
  }
}
```

#### `@include hd()`
Styles for high-density displays (from hd-cutoff)

```scss
.component {
  @include rupture.hd() {
    font-size: 20px;
  }
}
```

### Range-Based Mixins

#### `@include from($breakpoint)`
Styles from a specific breakpoint and up

```scss
.component {
  @include rupture.from(768px) {
    display: flex;
  }

  // Using named breakpoints
  @include rupture.from('m') {
    gap: 16px;
  }
}
```

#### `@include to($breakpoint)`
Styles up to a specific breakpoint

```scss
.component {
  @include rupture.to(767px) {
    display: block;
  }

  // Using named breakpoints
  @include rupture.to('small') {
    margin: 8px;
  }
}
```

#### `@include between($min, $max)`
Styles between two breakpoints

```scss
.component {
  @include rupture.between(768px, 1024px) {
    padding: 16px;
  }

  // Using scale indices
  @include rupture.between(2, 4) {
    margin: 12px;
  }
}
```

#### `@include at($breakpoint)`
Styles for a specific breakpoint only

```scss
.component {
  @include rupture.at(3) {
    border: 1px solid #ccc;
  }
}
```

### Device-Specific Mixins

#### `@include retina()`
Styles for retina/high-DPI displays

```scss
.logo {
  background-image: url('logo.png');

  @include rupture.retina() {
    background-image: url('logo@2x.png');
    background-size: contain;
  }
}
```

#### `@include landscape()` / `@include portrait()`
Styles based on device orientation

```scss
.gallery {
  @include rupture.landscape() {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  @include rupture.portrait() {
    display: block;
  }
}
```

#### `@include hover()` / `@include touch()`
Styles based on input capability

```scss
.button {
  background: blue;

  @include rupture.hover() {
    &:hover {
      background: darkblue;
    }
  }

  @include rupture.touch() {
    padding: 12px 16px; // Larger touch targets
  }
}
```

### Advanced Usage

#### Density Queries
Target specific pixel densities

```scss
.icon {
  @include rupture.density(2) {
    background-image: url('icon@2x.png');
  }
}
```

#### Anti-Overlap
Prevent overlapping breakpoints

```scss
.component {
  @include rupture.between(768px, 1024px, $anti-overlap: 1px) {
    // Ensures no overlap with adjacent breakpoints
    width: 50%;
  }
}
```

#### Em-Based Breakpoints
Use em units for breakpoints

```scss
// Configure em breakpoints
$rupture: (
  enable-em-breakpoints: true,
  base-font-size: 16px
);

@use '@juntossomosmais/rupture' as rupture;
```

## Named Breakpoints

You can use predefined breakpoint names:

- `'xs'` - Extra small (index 1)
- `'s'` - Small (index 2)
- `'m'` - Medium (index 3)
- `'l'` - Large (index 4)
- `'xl'` - Extra large (index 5)
- `'hd'` - HD/4K (index 6)

Or common aliases:
- `'small'`, `'sm'` → Small breakpoint
- `'medium'`, `'md'` → Medium breakpoint
- `'large'`, `'lg'` → Large breakpoint

## Scale System

The scale system uses indexed breakpoints:

```scss
// Default scale: 0, 400px, 600px, 800px, 1050px, 1800px
//               1    2      3      4       5       6

@include rupture.at(1) { } // 0 to 400px
@include rupture.at(2) { } // 400px to 600px
@include rupture.at(3) { } // 600px to 800px
// etc.
```

## Real-World Examples

### Responsive Navigation

```scss
.navigation {
  @include rupture.mobile() {
    position: fixed;
    top: 0;
    left: -100%;
    width: 80%;
    height: 100vh;
    transition: left 0.3s ease;

    &.open {
      left: 0;
    }
  }

  @include rupture.desktop() {
    position: static;
    display: flex;
    width: auto;
    height: auto;
  }
}
```

### Responsive Grid

```scss
.grid {
  display: grid;
  gap: 16px;

  @include rupture.mobile() {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  @include rupture.tablet() {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @include rupture.desktop() {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @include rupture.hd() {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}
```

### Responsive Typography

```scss
.heading {
  font-weight: bold;

  @include rupture.mobile() {
    font-size: 24px;
    line-height: 1.2;
  }

  @include rupture.tablet() {
    font-size: 32px;
    line-height: 1.25;
  }

  @include rupture.desktop() {
    font-size: 40px;
    line-height: 1.3;
  }

  @include rupture.retina() {
    font-weight: 500; // Thinner weight for high-DPI
  }
}
```

## Migration from Other Libraries

### From original rupture-sass

The API is largely compatible. Main differences:

- Import with `@use` instead of `@import`
- Namespace your mixins: `@include rupture.mobile()` instead of `@include mobile()`
- Some internal functions have been updated for Sass 1.33+ compatibility

### From custom media queries

```scss
// Before
@media (max-width: 767px) {
  .component { display: block; }
}

@media (min-width: 768px) {
  .component { display: flex; }
}

// After
.component {
  @include rupture.mobile() {
    display: block;
  }

  @include rupture.from(768px) {
    display: flex;
  }
}
```

## Browser Support

- All modern browsers
- IE11+ (with appropriate Sass compilation)
- Mobile browsers

## Contributing

This package is part of the Juntos Somos Mais monorepo. Please see the main repository for contribution guidelines.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.
