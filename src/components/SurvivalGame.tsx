import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameCanvas from './GameCanvas';
import GameUI from './GameUI';
import Shop from './Shop';
import { GameState, Player, Enemy, Bullet, Weapon } from '../types/game';
import { weapons } from '../data/weapons';
import { toast } from 'sonner';

const SurvivalGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isShopOpen: false,
    wave: 1,
    coins: 100,
    enemiesKilled: 0,
    waveEnemiesRemaining: 0
  });

  const [player, setPlayer] = useState<Player>({
    x: 400,
    y: 300,
    health: 100,
    maxHealth: 100,
    speed: 3,
    weapon: weapons.pistol,
    armor: 0,
    lastShot: 0
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  
  const gameLoopRef = useRef<number>();
  const keysRef = useRef<{[key: string]: boolean}>({});
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  const startGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: true, wave: 1 }));
    setPlayer(prev => ({ ...prev, health: prev.maxHealth }));
    startWave(1);
    toast("Gra rozpoczęta! Przetrwaj kolejne fale!");
  };

  const startWave = (waveNumber: number) => {
    const enemyCount = Math.min(5 + waveNumber * 2, 20);
    const newEnemies: Enemy[] = [];
    
    for (let i = 0; i < enemyCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 400 + Math.random() * 200;
      newEnemies.push({
        id: i,
        x: 400 + Math.cos(angle) * distance,
        y: 300 + Math.sin(angle) * distance,
        health: 20 + waveNumber * 5,
        maxHealth: 20 + waveNumber * 5,
        speed: 0.5 + waveNumber * 0.1,
        damage: 10 + waveNumber * 2,
        lastAttack: 0,
        type: Math.random() > 0.7 ? 'fast' : 'normal'
      });
    }
    
    setEnemies(newEnemies);
    setGameState(prev => ({ 
      ...prev, 
      wave: waveNumber, 
      waveEnemiesRemaining: enemyCount,
      isShopOpen: false 
    }));
  };

  const openShop = () => {
    setGameState(prev => ({ ...prev, isShopOpen: true, isPaused: true }));
  };

  const closeShop = () => {
    setGameState(prev => ({ ...prev, isShopOpen: false, isPaused: false }));
  };

  const buyWeapon = (weapon: Weapon) => {
    if (gameState.coins >= weapon.price) {
      setGameState(prev => ({ ...prev, coins: prev.coins - weapon.price }));
      setPlayer(prev => ({ ...prev, weapon }));
      toast(`Kupiono ${weapon.name}!`);
    } else {
      toast("Nie masz wystarczająco monet!");
    }
  };

  const upgradeHealth = () => {
    const cost = 50;
    if (gameState.coins >= cost) {
      setGameState(prev => ({ ...prev, coins: prev.coins - cost }));
      setPlayer(prev => ({ 
        ...prev, 
        maxHealth: prev.maxHealth + 25,
        health: Math.min(prev.health + 25, prev.maxHealth + 25)
      }));
      toast("Zdrowie zostało ulepszone!");
    }
  };

  const gameLoop = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const now = Date.now();

    // Player movement
    setPlayer(prev => {
      let newX = prev.x;
      let newY = prev.y;

      if (keysRef.current['w'] || keysRef.current['W']) newY -= prev.speed;
      if (keysRef.current['s'] || keysRef.current['S']) newY += prev.speed;
      if (keysRef.current['a'] || keysRef.current['A']) newX -= prev.speed;
      if (keysRef.current['d'] || keysRef.current['D']) newX += prev.speed;

      // Keep player in bounds
      newX = Math.max(25, Math.min(775, newX));
      newY = Math.max(25, Math.min(575, newY));

      // Shooting
      if (mouseRef.current.down && now - prev.lastShot > prev.weapon.fireRate) {
        const angle = Math.atan2(mouseRef.current.y - newY, mouseRef.current.x - newX);
        
        setBullets(bullets => [...bullets, {
          id: Math.random(),
          x: newX,
          y: newY,
          vx: Math.cos(angle) * prev.weapon.bulletSpeed,
          vy: Math.sin(angle) * prev.weapon.bulletSpeed,
          damage: prev.weapon.damage,
          range: prev.weapon.range,
          distance: 0
        }]);

        return { ...prev, x: newX, y: newY, lastShot: now };
      }

      return { ...prev, x: newX, y: newY };
    });

    // Update bullets
    setBullets(prev => prev.filter(bullet => {
      bullet.x += bullet.vx;
      bullet.y += bullet.vy;
      bullet.distance += Math.sqrt(bullet.vx * bullet.vx + bullet.vy * bullet.vy);
      
      return bullet.distance < bullet.range && 
             bullet.x > 0 && bullet.x < 800 && 
             bullet.y > 0 && bullet.y < 600;
    }));

    // Update enemies
    setEnemies(prev => prev.map(enemy => {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 1) {
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
      }

      // Enemy attack
      if (distance < 30 && now - enemy.lastAttack > 1000) {
        setPlayer(p => ({ 
          ...p, 
          health: Math.max(0, p.health - Math.max(1, enemy.damage - p.armor))
        }));
        enemy.lastAttack = now;
      }

      return enemy;
    }));

    // Bullet-Enemy collision
    setBullets(prevBullets => {
      const remainingBullets: Bullet[] = [];
      
      prevBullets.forEach(bullet => {
        let bulletHit = false;
        
        setEnemies(prevEnemies => prevEnemies.map(enemy => {
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 20 && !bulletHit) {
            bulletHit = true;
            const newHealth = enemy.health - bullet.damage;
            
            if (newHealth <= 0) {
              const coins = 10 + gameState.wave * 2;
              setGameState(gs => ({ 
                ...gs, 
                coins: gs.coins + coins,
                enemiesKilled: gs.enemiesKilled + 1,
                waveEnemiesRemaining: gs.waveEnemiesRemaining - 1
              }));
              return null;
            }
            
            return { ...enemy, health: newHealth };
          }
          return enemy;
        }).filter(Boolean) as Enemy[]);
        
        if (!bulletHit) {
          remainingBullets.push(bullet);
        }
      });
      
      return remainingBullets;
    });

    // Check wave completion
    if (enemies.length === 0 && gameState.waveEnemiesRemaining === 0) {
      openShop();
    }

    // Check game over
    if (player.health <= 0) {
      setGameState(prev => ({ ...prev, isPlaying: false }));
      toast("Koniec gry! Spróbuj ponownie.");
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, player, enemies]);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      }
    };

    const handleMouseDown = () => {
      mouseRef.current.down = true;
    };

    const handleMouseUp = () => {
      mouseRef.current.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="relative">
      {!gameState.isPlaying ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
          <h1 className="text-6xl font-bold mb-4 text-green-400 pixel-font">SURVIVOR</h1>
          <p className="text-xl mb-8 text-gray-300">Przetrwaj kolejne fale przeciwników!</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-xl rounded-lg transition-colors pixel-font"
          >
            ROZPOCZNIJ GRĘ
          </button>
          <div className="mt-8 text-center text-gray-400">
            <p>WSAD - Ruch | Mysz - Celowanie i strzelanie</p>
          </div>
        </div>
      ) : (
        <>
          <GameCanvas
            player={player}
            enemies={enemies}
            bullets={bullets}
          />
          <GameUI
            gameState={gameState}
            player={player}
          />
          {gameState.isShopOpen && (
            <Shop
              coins={gameState.coins}
              onBuyWeapon={buyWeapon}
              onUpgradeHealth={upgradeHealth}
              onClose={closeShop}
              onNextWave={() => {
                closeShop();
                startWave(gameState.wave + 1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SurvivalGame;
