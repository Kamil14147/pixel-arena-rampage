
export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isShopOpen: boolean;
  wave: number;
  coins: number;
  enemiesKilled: number;
  waveEnemiesRemaining: number;
}

export interface Player {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  weapon: Weapon;
  armor: number;
  lastShot: number;
}

export interface Enemy {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  lastAttack: number;
  type: 'normal' | 'fast' | 'tank';
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  damage: number;
  range: number;
  distance: number;
}

export interface Weapon {
  name: string;
  damage: number;
  fireRate: number;
  bulletSpeed: number;
  range: number;
  price: number;
  color: string;
}
