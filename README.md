# 3D Community Showcase & Seismic Universe

An interactive 3D WebGL community showcase built with React 19, TypeScript, Three.js, and Tailwind CSS.

## Features

- **Dynamic 3D Layout Modes**: Seamless transitions between Sphere, Helix, Grid, and Table layouts.
- **Seismic 3D Universe**: An autonomous floating cosmic background featuring 3D faceted crystal monoliths with slow, majestic drift.
- **Glassmorphic Aesthetics**: Hardware-accelerated background composite with realistic glass specular reflections and silky blur.
- **Performant Three.js Engine**: Zero GC vector allocations in the animation loop and throttled raycasting for buttery smooth 60/120 FPS.
- **Community Gallery**: Dynamic member cards with rich details, search, filtering, custom profile modals, and ZIP file asset loading.

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The app will be accessible at `http://localhost:3000`.

### Production Build

```bash
npm run build
```

## Project Structure

- `src/components/`: Modular React components (`ThreeCanvas`, `BackgroundView`, `ControlDock`, `ProfileModal`, etc.)
- `src/utils/`: 3D math & geometry helpers (`layouts.ts`, `seismicUniverse.ts`, `textureGenerator.ts`)
- `src/config/`: Configuration for community members and background styling
- `public/seismicart/`: Static visual assets and artworks

## License

MIT
