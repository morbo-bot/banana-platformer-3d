export const GRAVITY = -20;
export const MOVE_SPEED = 6;
export const JUMP_VELOCITY = 9;

export type Vec3 = { x: number; y: number; z: number };

export type Platform = {
  x: number;
  y: number;
  z: number;
  width: number;
  depth: number;
  height: number;
};

export type PlayerState = {
  position: Vec3;
  velocity: Vec3;
  onGround: boolean;
  height: number;
  spawn: Vec3;
};

export type InputState = {
  left: boolean;
  right: boolean;
  forward: boolean;
  backward: boolean;
  jump: boolean;
};

export function stepPhysics(player: PlayerState, dt: number, platforms: Platform[]): PlayerState {
  const next: PlayerState = {
    position: { ...player.position },
    velocity: { ...player.velocity },
    onGround: false,
    height: player.height,
    spawn: { ...player.spawn },
  };

  next.velocity.y += GRAVITY * dt;
  next.position.x += next.velocity.x * dt;
  next.position.y += next.velocity.y * dt;
  next.position.z += next.velocity.z * dt;

  for (const p of platforms) {
    const withinX = Math.abs(next.position.x - p.x) <= p.width / 2;
    const withinZ = Math.abs(next.position.z - p.z) <= p.depth / 2;
    const top = p.y + p.height / 2;
    const playerBottom = next.position.y - player.height / 2;
    const wasAbove = player.position.y - player.height / 2 >= top - 0.03;

    if (withinX && withinZ && playerBottom <= top && wasAbove && next.velocity.y <= 0) {
      next.position.y = top + player.height / 2;
      next.velocity.y = 0;
      next.onGround = true;
    }
  }

  if (next.position.y < -20) {
    next.position = { ...player.spawn };
    next.velocity = { x: 0, y: 0, z: 0 };
    next.onGround = false;
  }

  return next;
}

export function applyInput(player: PlayerState, input: InputState): void {
  const vx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const vz = (input.backward ? 1 : 0) - (input.forward ? 1 : 0);
  player.velocity.x = vx * MOVE_SPEED;
  player.velocity.z = vz * MOVE_SPEED;
  if (input.jump && player.onGround) {
    player.velocity.y = JUMP_VELOCITY;
    player.onGround = false;
  }
}

export function reachedGoal(playerPosition: Vec3, goal: { x: number; y: number; z: number; radius: number }): boolean {
  const dx = playerPosition.x - goal.x;
  const dy = playerPosition.y - goal.y;
  const dz = playerPosition.z - goal.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz) < goal.radius;
}
