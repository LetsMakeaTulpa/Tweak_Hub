import { useState, useEffect } from 'react';
import { ScanLine, Package, Wrench, Globe, User, Zap, Bell } from 'lucide-react';
import Scanner from './components/Scanner';
import Inventory from './components/Inventory';
import Projects from './components/Projects';
import Community from './components/Community';
import Profile from './components/Profile';

type Tab = 'scanner' | 'inventory' | 'projects' | 'community' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('scanner');
  const [inventory, setInventory] = useState<string[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [scansCompleted, setScansCompleted] = useState(0);
  const [projectsBuilt, setProjectsBuilt] = useState(0);
  const [tradesCompleted, setTradesCompleted] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  // Load saved state
  useEffect(() => {
    const saved = localStorage.getItem('tweakhub_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setInventory(state.inventory || []);
        setXp(state.xp || 0);
        setLevel(state.level || 1);
        setScansCompleted(state.scansCompleted || 0);
        setProjectsBuilt(state.projectsBuilt || 0);
        setTradesCompleted(state.tradesCompleted || 0);
        setShowWelcome(false);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save state
  useEffect(() => {
    const state = { inventory, xp, level, scansCompleted, projectsBuilt, tradesCompleted };
    localStorage.setItem('tweakhub_state', JSON.stringify(state));
  }, [inventory, xp, level, scansCompleted, projectsBuilt, tradesCompleted]);

  const handlePartsFound = (partIds: string[]) => {
    setInventory(prev => [...prev, ...partIds]);
    setScansCompleted(prev => prev + 1);
    const newXp = xp + (partIds.length * 10);
    setXp(newXp);

    // Level up check
    const xpForNext = level * 200;
    if (newXp >= xpForNext) {
      setLevel(prev => prev + 1);
      showNotification(`🎉 Level Up! You're now level ${level + 1}!`);
    } else {
      showNotification(`+${partIds.length * 10} XP! ${partIds.length} parts cataloged`);
    }
  };

  const handleRemovePart = (partId: string) => {
    setInventory(prev => {
      const idx = prev.indexOf(partId);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        return next;
      }
      return prev;
    });
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'scanner', label: 'Scan', icon: ScanLine },
    { id: 'inventory', label: 'Parts', icon: Package },
    { id: 'projects', label: 'Build', icon: Wrench },
    { id: 'community', label: 'Social', icon: Globe },
    { id: 'profile', label: 'Me', icon: User },
  ];

  // Community inventory (all parts from community users)
  const communityInventory = [
    'motor_dc', 'motor_stepper', 'servo', 'arduino_nano', 'esp32', 'led_rgb', 'oled_screen',
    'pir_sensor', 'temp_sensor', 'aluminum_sheet', 'gear_set', 'bearing_set', 'raspberry_pi',
    'tft_screen', 'camera_module', 'gps_module', 'lora_module', 'solar_panel', 'lipo_battery',
    'nfc_module', 'microphone', 'mp3_module', 'speaker', 'rotary_encoder', 'sd_card',
  ];

  if (showWelcome) {
    return (
      <div className="min-h-screen brushed-steel flex items-center justify-center p-4">
        <div className="max-w-sm w-full text-center space-y-6">
          {/* Logo with industrial styling */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #2d6b4f 0%, #3d8b64 50%, #2d6b4f 100%)',
                boxShadow: '0 0 30px rgba(61, 139, 100, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
              }}>
              {/* Brushed texture overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.05) 2px)'
              }}></div>
              <span className="text-5xl relative z-10">🔧</span>
              {/* Rust corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 opacity-40" style={{
                background: 'radial-gradient(circle at bottom right, #b45a2c, transparent 70%)'
              }}></div>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center animate-bounce"
              style={{ background: 'linear-gradient(135deg, #7eb8d4, #5a9ab5)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black text-slate-100">
              Tweak<span style={{ color: '#3d8b64' }}>Hub</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              Scan. Catalog. Build. Trade.
            </p>
          </div>

          <div className="space-y-3 text-left steel-panel rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">📷</span>
              <div>
                <p className="text-sm font-medium text-slate-100">Scan Anything</p>
                <p className="text-xs text-slate-500">Point at electronics, appliances, junk</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🧩</span>
              <div>
                <p className="text-sm font-medium text-slate-100">Auto-Catalog Parts</p>
                <p className="text-xs text-slate-500">Every component identified automatically</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-medium text-slate-100">Discover Projects</p>
                <p className="text-xs text-slate-500">See what you can build with what you have</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl">🤝</span>
              <div>
                <p className="text-sm font-medium text-slate-100">Trade & Connect</p>
                <p className="text-xs text-slate-500">Find parts from nearby tinkerers</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-[1.02] active:scale-95 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, #2d6b4f 0%, #3d8b64 50%, #2d6b4f 100%)',
              boxShadow: '0 4px 20px rgba(61, 139, 100, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)'
            }}
          >
            {/* Brushed texture */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)'
            }}></div>
            <span className="relative z-10">Start Tinkering</span>
          </button>

          <p className="text-[10px] text-slate-600">
            Like a recipe app for electronics junk. Find ingredients everywhere.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen brushed-steel flex flex-col overflow-hidden">
      {/* Top bar - brushed steel with green accent */}
      <div className="steel-panel px-4 py-2 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid rgba(61, 139, 100, 0.2)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl">🔧</span>
          <h1 className="text-sm font-black text-slate-100">
            Tweak<span style={{ color: '#3d8b64' }}>Hub</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(126, 184, 212, 0.15)', border: '1px solid rgba(126, 184, 212, 0.25)' }}>
            <Zap className="w-3 h-3" style={{ color: '#7eb8d4' }} />
            <span className="text-xs font-bold" style={{ color: '#93c5e0' }}>Lv.{level}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(100, 116, 139, 0.15)', border: '1px solid rgba(100, 116, 139, 0.2)' }}>
            <Package className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-300">{new Set(inventory).size}</span>
          </div>
          <button className="relative p-1.5 text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-[#1a1d23]" style={{ background: '#b45a2c' }}></span>
          </button>
        </div>
      </div>

      {/* Notification toast */}
      {notification && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-medium shadow-xl animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #1e2228, #1a1d23)',
            border: '1px solid rgba(61, 139, 100, 0.3)',
            color: '#4ade80',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 10px rgba(61, 139, 100, 0.2)'
          }}>
          {notification}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'scanner' && (
          <Scanner onPartsFound={handlePartsFound} inventory={inventory} />
        )}
        {activeTab === 'inventory' && (
          <Inventory
            inventory={inventory}
            onRemovePart={handleRemovePart}
            onViewProjects={() => setActiveTab('projects')}
          />
        )}
        {activeTab === 'projects' && (
          <Projects inventory={inventory} communityInventory={communityInventory} />
        )}
        {activeTab === 'community' && (
          <Community inventory={inventory} />
        )}
        {activeTab === 'profile' && (
          <Profile
            inventory={inventory}
            xp={xp}
            level={level}
            scansCompleted={scansCompleted}
            projectsBuilt={projectsBuilt}
            tradesCompleted={tradesCompleted}
          />
        )}
      </div>

      {/* Bottom navigation - industrial steel */}
      <div className="steel-panel flex-shrink-0" style={{ borderTop: '1px solid rgba(100, 116, 139, 0.2)' }}>
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center py-2 pt-3 transition-all relative ${
                activeTab === tab.id
                  ? ''
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={activeTab === tab.id ? { color: '#3d8b64' } : {}}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'drop-shadow-[0_0_6px_rgba(61,139,100,0.5)]' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ background: '#3d8b64' }}></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
