import { useState } from 'react';
import { User, Trophy, Star, Zap, Package, Eye, EyeOff, Settings, Award, Target, TrendingUp, MapPin, Share2 } from 'lucide-react';
import { components, getComponentById, getRarityColor } from '../data/database';

interface ProfileProps {
  inventory: string[];
  xp: number;
  level: number;
  scansCompleted: number;
  projectsBuilt: number;
  tradesCompleted: number;
}

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

  // Rarity breakdown
  const rarityCounts = {
    common: inventory.filter(id => getComponentById(id)?.rarity === 'common').length,
    uncommon: inventory.filter(id => getComponentById(id)?.rarity === 'uncommon').length,
    rare: inventory.filter(id => getComponentById(id)?.rarity === 'rare').length,
    epic: inventory.filter(id => getComponentById(id)?.rarity === 'epic').length,
    legendary: inventory.filter(id => getComponentById(id)?.rarity === 'legendary').length,
  };

  // Badges
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
      <div className="p-4 bg-gradient-to-r from-indigo-900/50 to-violet-900/50 border-b border-indigo-500/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-indigo-400 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProfileVisible(!profileVisible)}
              className="p-2 rounded-lg bg-black/20 text-gray-400 hover:text-white transition-colors"
              title={profileVisible ? 'Hide profile from others' : 'Show profile to others'}
            >
              {profileVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button className="p-2 rounded-lg bg-black/20 text-gray-400 hover:text-white transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-500/20">
            🔧
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">TweakMaster</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded-full font-bold">
                Level {level}
              </span>
              <span className="text-xs text-gray-500">{xp} XP</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-gray-400 mb-1">
            <span>Level {level}</span>
            <span>{xpForNextLevel - (xp % xpForNextLevel)} XP to Level {level + 1}</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Visibility status */}
        <div className={`mt-3 flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg w-fit ${
          profileVisible ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700/30'
        }`}>
          {profileVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {profileVisible ? 'Visible to nearby tinkerers' : 'Hidden from others'}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex border-b border-gray-800">
        {[
          { id: 'stats', label: 'Stats', icon: TrendingUp },
          { id: 'badges', label: `Badges (${earnedBadges})`, icon: Award },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              activeSection === tab.id
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-500 hover:text-gray-300'
            }`}
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
              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-4 text-center">
                <Package className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{uniqueParts}</p>
                <p className="text-[10px] text-gray-400 uppercase">Unique Parts</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-4 text-center">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{scansCompleted}</p>
                <p className="text-[10px] text-gray-400 uppercase">Scans Done</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-4 text-center">
                <Target className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{projectsBuilt}</p>
                <p className="text-[10px] text-gray-400 uppercase">Projects Built</p>
              </div>
              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-4 text-center">
                <Star className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <p className="text-2xl font-bold text-white">{tradesCompleted}</p>
                <p className="text-[10px] text-gray-400 uppercase">Trades Done</p>
              </div>
            </div>

            {/* Collection value */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Collection Value</p>
                  <p className="text-2xl font-bold text-emerald-400">${totalValue.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Parts</p>
                  <p className="text-2xl font-bold text-white">{totalParts}</p>
                </div>
              </div>
            </div>

            {/* Rarity breakdown */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rarity Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(rarityCounts).map(([rarity, count]) => (
                  <div key={rarity} className="flex items-center gap-3">
                    <span className={`text-xs w-16 capitalize ${getRarityColor(rarity)}`}>{rarity}</span>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rarity === 'common' ? 'bg-gray-400' :
                          rarity === 'uncommon' ? 'bg-green-400' :
                          rarity === 'rare' ? 'bg-blue-400' :
                          rarity === 'epic' ? 'bg-purple-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${totalParts > 0 ? (count / totalParts) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories Discovered</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(inventory.map(id => getComponentById(id)?.category).filter(Boolean))).map(cat => (
                  <span key={cat} className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full border border-gray-700/30">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'badges' && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400">Earn badges by scanning, building, and trading!</p>
            <div className="grid grid-cols-2 gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    badge.earned
                      ? 'bg-indigo-500/10 border-indigo-500/30'
                      : 'bg-gray-800/20 border-gray-700/20 opacity-50'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <p className="text-xs font-bold text-white mt-1">{badge.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{badge.description}</p>
                  {badge.earned && (
                    <span className="text-[10px] text-indigo-400 mt-1 inline-block">✓ Earned</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Privacy</h3>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div>
                  <p className="text-sm text-white">Show Profile on Map</p>
                  <p className="text-[10px] text-gray-500">Let nearby users see your location</p>
                </div>
                <button className={`w-10 h-6 rounded-full transition-all ${profileVisible ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${profileVisible ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div>
                  <p className="text-sm text-white">Open to Trades</p>
                  <p className="text-[10px] text-gray-500">Allow others to propose trades</p>
                </div>
                <button className="w-10 h-6 rounded-full bg-indigo-500 transition-all">
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1 translate-x-4"></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div>
                  <p className="text-sm text-white">Share Parts List</p>
                  <p className="text-[10px] text-gray-500">Show your inventory to community</p>
                </div>
                <button className={`w-10 h-6 rounded-full transition-all ${profileVisible ? 'bg-indigo-500' : 'bg-gray-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${profileVisible ? 'translate-x-4' : ''}`}></div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notifications</h3>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div>
                  <p className="text-sm text-white">Trade Requests</p>
                  <p className="text-[10px] text-gray-500">Get notified about trade offers</p>
                </div>
                <button className="w-10 h-6 rounded-full bg-indigo-500 transition-all">
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1 translate-x-4"></div>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div>
                  <p className="text-sm text-white">Nearby Scans</p>
                  <p className="text-[10px] text-gray-500">Alert when rare parts scanned nearby</p>
                </div>
                <button className="w-10 h-6 rounded-full bg-gray-700 transition-all">
                  <div className="w-4 h-4 bg-white rounded-full transition-all mx-1"></div>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account</h3>
              <div className="p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>Location: New York, NY</span>
                </div>
              </div>
              <div className="p-3 bg-gray-800/30 rounded-xl border border-gray-700/20">
                <p className="text-xs text-gray-500">Member since: January 2024</p>
                <p className="text-xs text-gray-500 mt-1">App Version: 1.0.0</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
