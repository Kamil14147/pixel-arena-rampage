
import React from 'react';
import { Weapon } from '../types/game';
import { weapons } from '../data/weapons';
import { X, ShoppingCart, Heart, Shield } from 'lucide-react';

interface ShopProps {
  coins: number;
  onBuyWeapon: (weapon: Weapon) => void;
  onUpgradeHealth: () => void;
  onClose: () => void;
  onNextWave: () => void;
}

const Shop: React.FC<ShopProps> = ({ 
  coins, 
  onBuyWeapon, 
  onUpgradeHealth, 
  onClose, 
  onNextWave 
}) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center pixel-font">
      <div className="bg-gray-900 border-2 border-green-500 rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-400 flex items-center">
            <ShoppingCart className="mr-2" />
            SKLEP
          </h2>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <div className="text-xl text-yellow-400 mb-4">
            Monety: {coins}
          </div>
        </div>

        {/* Weapons */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">BROŃ</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(weapons).map((weapon) => (
              <div
                key={weapon.name}
                className="bg-gray-800 border border-gray-600 rounded p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{weapon.name}</h4>
                  <div className="text-yellow-400 font-bold">{weapon.price}💰</div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <div>Obrażenia: {weapon.damage}</div>
                  <div>Zasięg: {weapon.range}</div>
                  <div>Szybkostrzelność: {Math.round(1000/weapon.fireRate)}/s</div>
                </div>
                <button
                  onClick={() => onBuyWeapon(weapon)}
                  disabled={coins < weapon.price || weapon.price === 0}
                  className={`w-full mt-3 px-3 py-2 rounded font-bold transition-colors ${
                    weapon.price === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : coins >= weapon.price
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {weapon.price === 0 ? 'POSIADANE' : 'KUP'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrades */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4">ULEPSZENIA</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-800 border border-gray-600 rounded p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Heart className="text-red-500 mr-2" size={20} />
                  <h4 className="font-bold text-white">Zwiększ Zdrowie</h4>
                </div>
                <div className="text-yellow-400 font-bold">50💰</div>
              </div>
              <div className="text-sm text-gray-300 mb-3">
                Zwiększa maksymalne zdrowie o 25 punktów
              </div>
              <button
                onClick={onUpgradeHealth}
                disabled={coins < 50}
                className={`px-4 py-2 rounded font-bold transition-colors ${
                  coins >= 50
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                KUP
              </button>
            </div>
          </div>
        </div>

        {/* Next Wave Button */}
        <div className="flex justify-center">
          <button
            onClick={onNextWave}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-lg transition-colors"
          >
            NASTĘPNA FALA
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;
