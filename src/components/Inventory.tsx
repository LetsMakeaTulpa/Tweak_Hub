import { useState } from 'react';
import { Package, Search, TrendingUp, Trash2 } from 'lucide-react';
import { components, getComponentById, getRarityColor, Component } from '../data/database';

interface InventoryProps {
  inventory: string[];
  onRemovePart: (partId: string) => void;
  onViewProjects: () => void;
}

const GREEN = '#3d8b64';
const GREEN_DARK = '#2d6b4f';
const BLUE = '#7eb8d4';
const RUST = '#b45a2c';

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
      <div className="steel-panel p-4" style={{ borderBottom: `1px solid rgba(126, 184, 212, 0.2)` }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: BLUE }}>
            <Package className="w-5 h-5" />
            My Parts
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(126, 184, 212, 0.15)', color: '#93c5e0' }}>
              {uniqueCount} unique
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(15, 17, 21, 0.6)', border: '1px solid rgba(100, 116, 139, 0.1)' }}>
            <p className="text-lg font-bold text-slate-100">{filteredParts.length}</p>
            <p className="text-[10px] text-slate-500 uppercase">Total Parts</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(15, 17, 21, 0.6)', border: '1px solid rgba(100, 116, 139, 0.1)' }}>
            <p className="text-lg font-bold" style={{ color: GREEN }}> ${totalValue.toFixed(0)}</p>
            <p className="text-[10px] text-slate-500 uppercase">Est. Value</p>
          </div>
          <div className="rounded-lg p-2 text-center" style={{ background: 'rgba(15, 17, 21, 0.6)', border: '1px solid rgba(100, 116, 139, 0.1)' }}>
            <p className="text-lg font-bold" style={{ color: '#a78bfa' }}>{new Set(filteredParts.map(p => p.category)).size}</p>
            <p className="text-[10px] text-slate-500 uppercase">Categories</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search parts or tags..."
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
            style={{ background: 'rgba(15, 17, 21, 0.6)', border: '1px solid rgba(100, 116, 139, 0.2)' }}
            onFocus={(e) => e.target.style.borderColor = `rgba(126, 184, 212, 0.4)`}
            onBlur={(e) => e.target.style.borderColor = 'rgba(100, 116, 139, 0.2)'}
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 py-2 overflow-x-auto flex gap-2" style={{ borderBottom: '1px solid rgba(100, 116, 139, 0.1)' }}>
        {categories.slice(0, 8).map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all"
            style={filterCategory === cat ? {
              background: 'rgba(126, 184, 212, 0.15)',
              color: '#93c5e0',
              border: '1px solid rgba(126, 184, 212, 0.3)'
            } : {
              background: 'rgba(30, 34, 40, 0.5)',
              color: '#64748b',
              border: '1px solid rgba(100, 116, 139, 0.15)'
            }}
          >
            {cat === 'all' ? 'All' : cat}
          </button>
        ))}
      </div>

      {/* Parts list */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedParts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <Package className="w-16 h-16 text-slate-700" />
            <p className="text-slate-500">No parts yet. Start scanning!</p>
            <p className="text-xs text-slate-600">Scan devices to build your parts collection</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedParts.map((part) => (
              <div
                key={part.id}
                className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.01]"
                style={{
                  background: 'rgba(30, 34, 40, 0.4)',
                  border: '1px solid rgba(100, 116, 139, 0.15)'
                }}
                onClick={() => setSelectedPart(part)}
              >
                <span className="text-2xl">{part.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-100 truncate">{part.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs ${getRarityColor(part.rarity)}`}>{part.rarity}</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{part.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">${part.estimatedValue}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemovePart(part.id); }}
                    className="p-1 rounded transition-colors hover:bg-red-500/10"
                    style={{ color: '#64748b' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = RUST)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
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
        <div className="p-4" style={{ borderTop: '1px solid rgba(100, 116, 139, 0.15)', background: 'rgba(26, 29, 35, 0.8)' }}>
          <button
            onClick={onViewProjects}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #5a4a8a, #7c6aaf)',
              boxShadow: '0 4px 15px rgba(124, 106, 175, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)'
            }}
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
          <div className="rounded-t-2xl w-full max-w-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}
            style={{ background: '#1a1d23', borderTop: `1px solid rgba(100, 116, 139, 0.2)` }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selectedPart.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-100">{selectedPart.name}</h3>
                <span className={`text-sm ${getRarityColor(selectedPart.rarity)}`}>{selectedPart.rarity}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300">{selectedPart.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedPart.tags.map(tag => (
                <span key={tag} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(30, 34, 40, 0.8)', color: '#94a3b8' }}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: 'rgba(15, 17, 21, 0.6)' }}>
                <p className="text-xs text-slate-500">Category</p>
                <p className="text-sm text-slate-100">{selectedPart.category}</p>
              </div>
              <div className="rounded-lg p-3" style={{ background: 'rgba(15, 17, 21, 0.6)' }}>
                <p className="text-xs text-slate-500">Est. Value</p>
                <p className="text-sm" style={{ color: GREEN }}>${selectedPart.estimatedValue}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPart(null)}
              className="w-full py-3 rounded-xl text-slate-300 font-medium"
              style={{ background: '#1e2228', border: '1px solid rgba(100, 116, 139, 0.2)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
