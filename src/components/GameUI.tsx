
import React from 'react';
import { GameState, Player } from '../types/game';
import { Heart, Coins, Zap } from 'lucide-react';

interface GameUIProps {
  gameState: GameState;
  player: Player;
}

const GameUI: React.FC<GameUIProps> = ({ gameState, player }) => {
  return (
    <div className="absolute top-0 left-0 w-full p-4 text-white pixel-font">
      <div className="flex justify-between items-start">
        {/* Left side stats */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 bg-black bg-opacity-70 px-3 py-2 rounded">
            <Heart className="text-red-500" size={20} />
            <span className="text-xl font-bold">
              {player.health}/{player.maxHealth}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 bg-black bg-opacity-70 px-3 py-2 rounded">
            <Coins className="text-yellow-500" size={20} />
            <span className="text-xl font-bold">{gameState.coins}</span>
          </div>

          <div className="flex items-center space-x-2 bg-black bg-opacity-70 px-3 py-2 rounded">
            <Zap className="text-blue-500" size={20} />
            <span className="text-lg">{player.weapon.name}</span>
          </div>
        </div>

        {/* Right side wave info */}
        <div className="text-right">
          <div className="bg-black bg-opacity-70 px-4 py-2 rounded mb-2">
            <div className="text-2xl font-bold text-green-400">
              FALA {gameState.wave}
            </div>
            <div className="text-sm text-gray-300">
              Pozostało: {gameState.waveEnemiesRemaining}
            </div>
          </div>
          
          <div className="bg-black bg-opacity-70 px-4 py-2 rounded">
            <div className="text-sm text-gray-300">Pokonano</div>
            <div className="text-xl font-bold text-red-400">
              {gameState.enemiesKilled}
            </div>
          </div>
        </div>
      </div>

      {/* Controls reminder */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 px-3 py-2 rounded text-sm text-gray-400">
        WSAD - Ruch | Mysz - Celowanie/Strzelanie
      </div>
    </div>
  );
};

export default GameUI;
