import { describe, it, expect } from 'vitest';
import { applyInput, reachedGoal, stepPhysics, JUMP_VELOCITY, type PlayerState } from '../src/gameLogic';

const platform = [{ x: 0, y: 0, z: 0, width: 10, depth: 10, height: 1 }];

describe('gameLogic', () => {
  it('lands on platform and sets onGround', () => {
    const player: PlayerState = {
      position: { x: 0, y: 2, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      onGround: false,
      height: 1.8,
      spawn: { x: 0, y: 3, z: 0 },
    };

    let next = player;
    for (let i = 0; i < 20; i++) {
      next = stepPhysics(next, 0.05, platform);
      if (next.onGround) break;
    }
    expect(next.onGround).toBe(true);
    expect(next.velocity.y).toBe(0);
    expect(next.position.y).toBeGreaterThan(1.3);
  });

  it('jumps only when grounded', () => {
    const grounded: PlayerState = {
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      onGround: true,
      height: 1.8,
      spawn: { x: 0, y: 0, z: 0 },
    };
    applyInput(grounded, { left: false, right: false, forward: false, backward: false, jump: true });
    expect(grounded.velocity.y).toBe(JUMP_VELOCITY);

    const air: PlayerState = {
      position: { x: 0, y: 1, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      onGround: false,
      height: 1.8,
      spawn: { x: 0, y: 0, z: 0 },
    };
    applyInput(air, { left: false, right: false, forward: false, backward: false, jump: true });
    expect(air.velocity.y).toBe(0);
  });

  it('resets player if falling out of world', () => {
    const player: PlayerState = {
      position: { x: 0, y: -21, z: 0 },
      velocity: { x: 1, y: -10, z: 1 },
      onGround: false,
      height: 1.8,
      spawn: { x: 1, y: 3, z: 1 },
    };

    const next = stepPhysics(player, 0.016, platform);
    expect(next.position).toEqual({ x: 1, y: 3, z: 1 });
    expect(next.velocity).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('detects goal reach', () => {
    expect(reachedGoal({ x: 0, y: 0, z: 0 }, { x: 0.5, y: 0.1, z: 0, radius: 1 })).toBe(true);
    expect(reachedGoal({ x: 5, y: 0, z: 0 }, { x: 0, y: 0, z: 0, radius: 1 })).toBe(false);
  });
});
