
import { Weapon } from '../types/game';

export const weapons: { [key: string]: Weapon } = {
  pistol: {
    name: "Pistolet",
    damage: 15,
    fireRate: 300,
    bulletSpeed: 8,
    range: 300,
    price: 0,
    color: "#FFD700"
  },
  shotgun: {
    name: "Shotgun",
    damage: 35,
    fireRate: 800,
    bulletSpeed: 6,
    range: 150,
    price: 150,
    color: "#FF6B35"
  },
  rifle: {
    name: "Karabin",
    damage: 25,
    fireRate: 150,
    bulletSpeed: 12,
    range: 450,
    price: 300,
    color: "#4ECDC4"
  },
  laser: {
    name: "Laser",
    damage: 20,
    fireRate: 100,
    bulletSpeed: 15,
    range: 400,
    price: 500,
    color: "#E74C3C"
  }
};
