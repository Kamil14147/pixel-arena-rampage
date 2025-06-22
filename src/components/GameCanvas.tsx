
import React, { useRef, useEffect } from 'react';
import { Player, Enemy, Bullet } from '../types/game';

interface GameCanvasProps {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
}

const GameCanvas: React.FC<GameCanvasProps> = ({ player, enemies, bullets }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 800, 600);

    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    for (let y = 0; y < 600; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }

    // Draw bullets
    bullets.forEach(bullet => {
      ctx.fillStyle = player.weapon.color;
      ctx.shadowColor = player.weapon.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw enemies
    enemies.forEach(enemy => {
      // Enemy body
      ctx.fillStyle = enemy.type === 'fast' ? '#ff4444' : '#cc2222';
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 8;
      ctx.fillRect(enemy.x - 10, enemy.y - 10, 20, 20);
      
      // Enemy health bar
      const healthPercent = enemy.health / enemy.maxHealth;
      ctx.fillStyle = '#333';
      ctx.fillRect(enemy.x - 12, enemy.y - 18, 24, 4);
      ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : healthPercent > 0.25 ? '#FFC107' : '#F44336';
      ctx.fillRect(enemy.x - 12, enemy.y - 18, 24 * healthPercent, 4);
      
      ctx.shadowBlur = 0;
    });

    // Draw player
    ctx.fillStyle = '#00ff88';
    ctx.shadowColor = '#00ff88';
    ctx.shadowBlur = 15;
    ctx.fillRect(player.x - 12, player.y - 12, 24, 24);
    
    // Player health bar
    const playerHealthPercent = player.health / player.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x - 15, player.y - 25, 30, 6);
    ctx.fillStyle = playerHealthPercent > 0.5 ? '#4CAF50' : playerHealthPercent > 0.25 ? '#FFC107' : '#F44336';
    ctx.fillRect(player.x - 15, player.y - 25, 30 * playerHealthPercent, 6);
    
    ctx.shadowBlur = 0;

  }, [player, enemies, bullets]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border-2 border-green-500 bg-black"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default GameCanvas;
