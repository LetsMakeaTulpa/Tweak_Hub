import { useState } from 'react';
import { TrendingUp, Package, Eye, EyeOff, Settings, Award, Target, Star, Zap, MapPin, Share2 } from 'lucide-react';
import { components, getComponentById, getRarityColor } from '../data/database';

interface ProfileProps {
  inventory: string[];
  xp: number;
  level: number;
  scansCompleted: number;
  projectsBuilt: number;
  tradesCompleted: number;
}

const GREEN = '#3d8b64';
const GREEN_DARK = '#2d6b4f';
const BLUE = '#7eb8d4';
const RUST = '#b45a2c';

export default function Profile({ inventory, xp, level, scansCompleted, projectsBuilt, tradesCompleted }: ProfileProps) {
  const [profileVisible, setProfileVisible] = useState(true);
  const [activeSection, setActiveSection] = useState<'stats' | 'badges' | 'settings'>('stats');

  const xpForNextLevel = level * 200;
  const xpProgress = (xp % xpForNextLevel) / xpForNextLevel * 100;

  const uniqueParts = new Set(inventory).size;
  const totalParts = inventory.length;
  const totalValue = inventory.reduce((sum, id) => {
    const part = getComponentById(id);
    return sum + (part?.estimatedValue || 0);
  }, 0);

  const rarityCounts = {
    common: inventory.filter(id => getComponentById(id)?.rarity === 'common').length,
    uncommon: inventory.filter(id => getComponentById(id)?.rarity === 'uncommon').length,
    rare: inventory.filter(id => getComponentById(id)?.rarity === 'rare').length,
    epic: inventory.filter(id => getComponentById(id)?.rarity === 'epic').length,
    legendary: inventory.filter(id => getComponentById(id)?.rarity === 'legendary').length,
  };

  const badges = [
    { id: 'first_scan', name: 'First Scan', icon: '🔍', description: 'Complete your first device scan', earned: scansCompleted >= 1 },
    { id: 'scavenger', name: 'Scavenger', icon: '🗑️', description: 'Scan 10 different devices', earned: scansCompleted >= 10 },
    { id: 'hoarder', name: 'Hoarder', icon: '📦', description: 'Collect 20 unique parts', earned: uniqueParts >= 20 },
    { id: 'maker', name: 'Maker', icon: '🔨', description: 'Build your first project', earned: projectsBuilt >= 1 },
    { id: 'trader', name: 'Trader', icon: '🤝', description: 'Complete 5 trades', earned: tradesCompleted >= 5 },
    { id: 'rare_finds', name: 'Rare Finds', icon: '💎', description: 'Find a rare component', earned: rarityCounts.rare > 0 },
    { id: 'legendary', name: 'Legendary', icon: '👑', description: 'Find a legendary component', earned: rarityCounts.legendary > 0 },
    { id: 'social', name: 'Social Butterfly', icon: '🦋', description: 'Connect with 10 community members', earned: false },
    { id: 'master', name: 'Master Tinkerer', icon: '🏆', description: 'Reach level 50', earned: level >= 50 },
    { id: 'collector', name: 'Collector', icon: '🎯', description: 'Collect every type of component', earned: uniqueParts >= components.length },
    { id: 'generous', name: 'Generous', icon: '🎁', description: 'Give 10 parts to community', earned: false },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', description: 'Scan in 5 different locations', earned: false },
  ];

  const earnedBadges = badges.filter(b => b.earned).length;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="steel-panel p-4" style={{ borderBottom: `1px solid rgba(61, 139, 100, 0.2)` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: GREEN }}>
            <TrendingUp className="w-5 h-5" />
            Profile
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProfileVisible(!profileVisible)}
              className="p-2 rounded-lg transition-colors"
              style={{ background: 'rgba(15, 17, 21, 0.5)', color: '#64748b' }}
            >
              {profileVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(15, 17, 21, 0.5)', color: '#64748b' }}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl relative overflow-hidden"
            style={{
              background: `linear-gradient(145deg, ${GREEN_DARK}, ${GREEN})`,
              boxShadow: `0 4px 15px rgba(61, 139, 100, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
            }}>
            {/* Brushed texture */}
            <div className="absolute inset-0 opacity-15" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)'
            }}></div>
            <span className="relative z-10">🔧</span>
            {/* Rust corner */}
            <div className="absolute bottom-0 right-0 w-6 h-6 opacity-40" style={{
              background: `radial-gradient(circle at bottom right, ${RUST}, transparent 70%)`
            }}></div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100">TweakMaster</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(61, 139, 100, 0.2)', color: '#4ade80' }}>
                Level {level}
              </span>
              <span className="text-xs text-slate-500">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1">
            <span>Level {level}</span>
            <span>{xpForNextLevel - (xp % xpForNextLevel)} XP to Level {level + 1}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e2228' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${xpProgress}%`, background: `linear-gradient(90deg, ${GREEN_DARK}, ${GREEN}, ${BLUE})` }}
            ></div>
          </div>
        </div>

        {/* Visibility status */}
        <div className={`mt-3 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg w-fit ${
          profileVisible ? '' : ''
        }`} style={profileVisible ? {
          background: 'rgba(61, 139, 100, 0.08)',
          color: '#4ade80',
          border: '1px solid rgba(61, 139, 100, 0.2)'
        } : {
          background: 'rgba(30, 34, 40, 0.5)',
          color: '#64748b',
          border: '1px solid rgba(100, 116, 139, 0.15)'
        }}>
          {profileVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {profileVisible ? 'Visible to nearby tinkerers' : 'Hidden from others'}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex" style={{ borderBottom: '1px solid rgba(100, 116, 139, 0.15)' }}>
        {[
          { id: 'stats', label: 'Stats', icon: TrendingUp },
          { id: 'badges', label: `Badges (${earnedBadges})`, icon: Award },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className="flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            style={activeSection === tab.id ? {
              color: GREEN,
              borderBottom: `2px solid ${GREEN}`
            } : {
              color: '#64748b'
            }}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'stats' && (
          <div className="space-y-4">
            {/* Main stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <Package className="w-6 h-6 mx-auto mb-1" style={{ color: BLUE }} />
                <p className="text-2xl font-bold text-slate-100">{uniqueParts}</p>
                <p className="text-[10px] text-slate-500 uppercase">Unique Parts</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <Zap className="w-6 h-6 mx-auto mb-1" style={{ color: '#eab308' }} />
                <p className="text-2xl font-bold text-slate-100">{scansCompleted}</p>
                <p className="text-[10px] text-slate-500 uppercase">Scans Done</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <Target className="w-6 h-6 mx-auto mb-1" style={{ color: GREEN }} />
                <p className="text-2xl font-bold text-slate-100">{projectsBuilt}</p>
                <p className="text-[10px] text-slate-500 uppercase">Projects Built</p>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <Star className="w-6 h-6 mx-auto mb-1" style={{ color: '#a78bfa' }} />
                <p className="text-2xl font-bold text-slate-100">{tradesCompleted}</p>
                <p className="text-[10px] text-slate-500 uppercase">Trades Done</p>
              </div>
            </div>

            {/* Collection value */}
            <div className="rounded-xl p-4" style={{
              background: `linear-gradient(135deg, rgba(61, 139, 100, 0.08), rgba(126, 184, 212, 0.05))`,
              border: '1px solid rgba(61, 139, 100, 0.15)'
            }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Collection Value</p>
                  <p className="text-2xl font-bold" style={{ color: GREEN }}>${totalValue.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Parts</p>
                  <p className="text-2xl font-bold text-slate-100">{totalParts}</p>
                </div>
              </div>
            </div>

            {/* Rarity breakdown */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Rarity Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(rarityCounts).map(([rarity, count]) => (
                  <div key={rarity} className="flex items-center gap-3">
                    <span className={`text-xs w-16 capitalize ${getRarityColor(rarity)}`}>{rarity}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#1e2228' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${totalParts > 0 ? (count / totalParts) * 100 : 0}%`,
                          background: rarity === 'common' ? '#64748b' :
                            rarity === 'uncommon' ? '#4ade80' :
                            rarity === 'rare' ? BLUE :
                            rarity === 'epic' ? '#a78bfa' : '#eab308'
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories Discovered</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(inventory.map(id => getComponentById(id)?.category).filter(Boolean))).map(cat => (
                  <span key={cat} className="text-xs px-2 py-1 rounded-full" style={{
                    background: 'rgba(30, 34, 40, 0.5)',
                    color: '#94a3b8',
                    border: '1px solid rgba(100, 116, 139, 0.15)'
                  }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'badges' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">Earn badges by scanning, building, and trading!</p>
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className="p-3 rounded-xl border text-center transition-all"
                  style={badge.earned ? {
                    background: 'rgba(61, 139, 100, 0.08)',
                    border: '1px solid rgba(61, 139, 100, 0.25)'
                  } : {
                    background: 'rgba(30, 34, 40, 0.2)',
                    border: '1px solid rgba(100, 116, 139, 0.1)',
                    opacity: 0.5
                  }}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-bold text-slate-100 mt-1">{badge.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{badge.description}</p>
                  {badge.earned && (
                    <span className="text-[10px] mt-1 inline-block" style={{ color: '#4ade80' }}>✓ Earned</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Privacy</h3>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div>
                  <p className="text-sm text-slate-100">Show Profile on Map</p>
                  <p className="text-[10px] text-slate-500">Let nearby users see your location</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all" style={{ background: profileVisible ? GREEN : '#334155' }}>
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1" style={{ transform: profileVisible ? 'translateX(16px)' : 'translateX(0)' }}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div>
                  <p className="text-sm text-slate-100">Open to Trades</p>
                  <p className="text-[10px] text-slate-500">Allow others to propose trades</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all" style={{ background: GREEN }}>
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1" style={{ transform: 'translateX(16px)' }}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div>
                  <p className="text-sm text-slate-100">Share Parts List</p>
                  <p className="text-[10px] text-slate-500">Show your inventory to community</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all" style={{ background: profileVisible ? GREEN : '#334155' }}>
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1" style={{ transform: profileVisible ? 'translateX(16px)' : 'translateX(0)' }}></div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notifications</h3>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div>
                  <p className="text-sm text-slate-100">Trade Requests</p>
                  <p className="text-[10px] text-slate-500">Get notified about trade offers</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all" style={{ background: GREEN }}>
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1" style={{ transform: 'translateX(16px)' }}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div>
                  <p className="text-sm text-slate-100">Nearby Scans</p>
                  <p className="text-[10px] text-slate-500">Alert when rare parts scanned nearby</p>
                </div>
                <button className="w-10 h-6 rounded-full transition-all" style={{ background: '#334155' }}>
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1"></div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</h3>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4" />
                  <span>Location: New York, NY</span>
                </div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <p className="text-xs text-slate-500">Member since: January 2024</p>
                <p className="text-xs text-slate-500 mt-1">App Version: 1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
