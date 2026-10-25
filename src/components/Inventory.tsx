import { useState } from 'react';
import { Package, Search, Filter, TrendingUp, Trash2, Eye } from 'lucide-react';
import { components, getComponentById, getRarityColor, getRarityBg, Component } from '../data/database';

interface InventoryProps {
  inventory: string[];
  onRemovePart: (partId: string) => void;
  onViewProjects: () => void;
}

export default function Inventory({ inventory, onRemovePart, onViewProjects }: InventoryProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedPart, setSelectedPart] = useState<Component | null>(null);

  const categories = ['all', ...new Set(components.map(c => c.category))];

  const filteredParts = inventory
    .map(id => getComponentById(id))
    .filter(Boolean) as Component[];

  const searchedParts = filteredParts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(search.toLowerCase()) ||
      part.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || part.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = filteredParts.reduce((sum, p) => sum + p.estimatedValue, 0);
  const uniqueCount = new Set(inventory).size;

  const rarityOrder = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
  const sortedParts = [...searchedParts].sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-blue-500/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
            <Package className="w-5 h-5" />
            My Parts
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
              {uniqueCount} unique
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-white">{filteredParts.length}</p>
            <p className="text-[10px] text-gray-400 uppercase">Total Parts</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-emerald-400">${totalValue.toFixed(0)}</p>
            <p className="text-[10px] text-gray-400 uppercase">Est. Value</p>
          </div>
          <div className="bg-black/20 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-purple-400">{new Set(filteredParts.map(p => p.category)).size}</p>
            <p className="text-[10px] text-gray-400 uppercase">Categories</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parts or tags..."
            className="w-full pl-9 pr-4 py-2 bg-black/30 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 py-2 overflow-x-auto flex gap-2 border-b border-gray-800">
        {categories.slice(0, 8).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:bg-gray-700/50'
            }`}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Parts list */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedParts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <Package className="w-16 h-16 text-gray-700" />
            <p className="text-gray-500">No parts yet. Start scanning!</p>
            <p className="text-xs text-gray-600">Scan devices to build your parts collection</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedParts.map((part) => (
              <div
                key={part.id}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${getRarityBg(part.rarity)}`}
                onClick={() => setSelectedPart(part)}
              >
                <span className="text-2xl">{part.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white truncate">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${getRarityColor(part.rarity)}`}>{part.rarity}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{part.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">${part.estimatedValue}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemovePart(part.id); }}
                    className="p-1 hover:bg-red-500/20 rounded text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      {inventory.length > 0 && (
        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
          <button
            onClick={onViewProjects}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/20 transition-all active:scale-95"
          >
            <TrendingUp className="w-5 h-5" />
            See What You Can Build
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              {inventory.length} parts
            </span>
          </button>
        </div>
      )}

      {/* Part detail modal */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50" onClick={() => setSelectedPart(null)}>
          <div className="bg-gray-900 border-t border-gray-700 rounded-t-2xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selectedPart.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedPart.name}</h3>
                <span className={`text-sm ${getRarityColor(selectedPart.rarity)}`}>{selectedPart.rarity}</span>
              </div>
            </div>
            <p className="text-sm text-gray-300">{selectedPart.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedPart.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-white">{selectedPart.category}</p>
              </div>
              <div className="bg-black/30 rounded-lg p-3">
                <p className="text-xs text-gray-500">Est. Value</p>
                <p className="text-sm text-emerald-400">${selectedPart.estimatedValue}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPart(null)}
              className="w-full py-3 bg-gray-800 rounded-xl text-gray-300 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
