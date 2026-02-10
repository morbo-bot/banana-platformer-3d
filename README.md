# Banana Platformer 3D

A small 3D platform game built with Three.js.

## Controls
- Move: WASD or Arrow Keys
- Jump: Space

## Development
```bash
npm install
npm test
npm run build
npm run test:e2e
npm run dev
```

## TDD Notes
Core movement/physics logic is tested in `tests/gameLogic.test.js`.
Playwright E2E checks page load and render in `e2e/game.spec.js`.
