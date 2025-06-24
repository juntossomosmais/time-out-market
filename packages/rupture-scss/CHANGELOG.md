# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-24

### Added
- Initial release of @juntossomosmais/rupture
- SCSS Media Queries library with responsive design mixins
- Support for mobile, tablet, desktop, and HD breakpoints
- Range-based mixins: `from()`, `to()`, `between()`, `at()`
- Device-specific mixins: `retina()`, `landscape()`, `portrait()`, `hover()`, `touch()`
- Configurable breakpoint system with named breakpoints
- Anti-overlap functionality to prevent breakpoint conflicts
- Support for em-based breakpoints
- Density query support for high-DPI displays
- Comprehensive documentation and examples

### Features
- Clean, readable mixin API
- Mobile-first responsive design approach
- Fully customizable breakpoints and settings
- Pure SCSS with no runtime dependencies
- Compatible with Sass 1.32.0+

### Technical Details
- Based on rupture-sass with modern Sass compatibility updates
- Supports scale-based and pixel-based breakpoint definitions
- Handles edge cases and validation for robust media query generation
- Optimized for performance with efficient Sass compilation
