import { useState } from 'react';
import { Camera, Scan, CheckCircle, X, Zap, Package } from 'lucide-react';
import { devices, components, Device, Component, getRarityColor } from '../data/database';

interface ScannerProps {
  onPartsFound: (partIds: string[]) => void;
  inventory: string[];
}

export default function Scanner({ onPartsFound, inventory }: ScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [detectedDevice, setDetectedDevice] = useState<Device | null>(null);
  const [revealedParts, setRevealedParts] = useState<Component[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [newParts, setNewParts] = useState<Component[]>([]);

  const startScan = () => {
    setScanning(true);
    setScanComplete(false);
    setScanProgress(0);
    setRevealedParts([]);
    setNewParts([]);
    setXpGained(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        return prev + 2;
      });
    }, 60);
  };

  const completeScan = () => {
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    setDetectedDevice(randomDevice);

    const deviceComponents = randomDevice.components
      .map(id => components.find(c => c.id === id))
      .filter(Boolean) as Component[];

    setRevealedParts(deviceComponents);

    const newOnes = deviceComponents.filter(c => !inventory.includes(c.id));
    setNewParts(newOnes);

    const xp = deviceComponents.length * 10 + newOnes.length * 25;
    setXpGained(xp);

    setScanning(false);
    setScanComplete(true);
  };

  const addToInventory = () => {
    const partIds = revealedParts.map(c => c.id);
    onPartsFound(partIds);
    setScanComplete(false);
    setDetectedDevice(null);
    setRevealedParts([]);
  };

  const resetScan = () => {
    setScanComplete(false);
    setDetectedDevice(null);
    setRevealedParts([]);
    setNewParts([]);
    setScanProgress(0);
  };

  const GREEN = '#3d8b64';
  const GREEN_DARK = '#2d6b4f';
  const BLUE = '#7eb8d4';
  const RUST = '#b45a2c';

  return (
    <div className="flex flex-col h-full">
      {/* Header - steel panel with green accent */}
      <div className="steel-panel p-4" style={{ borderBottom: `1px solid rgba(61, 139, 100, 0.2)` }}>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: GREEN }}>
          <Scan className="w-5 h-5" />
          Part Scanner
        </h2>
        <p className="text-sm text-slate-400 mt-1">Scan any device to identify and catalog its components</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!scanning && !scanComplete && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {/* Scanner Viewfinder - industrial style */}
            <div className="relative w-64 h-64 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #0f1115 0%, #1a1d23 100%)',
                border: `2px solid rgba(61, 139, 100, 0.4)`,
                boxShadow: `inset 0 0 30px rgba(61, 139, 100, 0.1), 0 0 20px rgba(61, 139, 100, 0.1)`
              }}>
              {/* Corner brackets - industrial */}
              <div className="absolute top-0 left-0 w-8 h-8" style={{ borderTop: `3px solid ${GREEN}`, borderLeft: `3px solid ${GREEN}` }}></div>
              <div className="absolute top-0 right-0 w-8 h-8" style={{ borderTop: `3px solid ${GREEN}`, borderRight: `3px solid ${GREEN}` }}></div>
              <div className="absolute bottom-0 left-0 w-8 h-8" style={{ borderBottom: `3px solid ${GREEN}`, borderLeft: `3px solid ${GREEN}` }}></div>
              <div className="absolute bottom-0 right-0 w-8 h-8" style={{ borderBottom: `3px solid ${GREEN}`, borderRight: `3px solid ${GREEN}` }}></div>
              
              {/* Rust spots on corners */}
              <div className="absolute top-1 right-1 w-4 h-4 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${RUST}, transparent 70%)` }}></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${RUST}, transparent 70%)` }}></div>

              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto" style={{ color: 'rgba(61, 139, 100, 0.4)' }} />
                <p className="text-sm mt-2" style={{ color: 'rgba(61, 139, 100, 0.6)' }}>Point at device</p>
              </div>
              {/* Scanning line */}
              <div className="absolute left-2 right-2 h-0.5 animate-pulse" style={{ top: '50%', background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}></div>
            </div>

            <button
              onClick={startScan}
              className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${GREEN_DARK} 0%, ${GREEN} 50%, ${GREEN_DARK} 100%)`,
                boxShadow: `0 4px 20px rgba(61, 139, 100, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)`
              }}
            >
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)'
              }}></div>
              <span className="flex items-center gap-2 relative z-10">
                <Zap className="w-5 h-5" />
                SCAN DEVICE
              </span>
            </button>

            <p className="text-xs text-slate-500 text-center max-w-xs">
              Found something interesting? Point your camera at any electronic device, appliance, or machine to identify and catalog all its components.
            </p>
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="relative w-64 h-64 rounded-2xl flex items-center justify-center overflow-hidden"
              style={{
                background: '#0f1115',
                border: `2px solid ${GREEN}`,
                boxShadow: `0 0 30px rgba(61, 139, 100, 0.2)`
              }}>
              {/* Animated scan line */}
              <div
                className="absolute left-0 right-0 h-1 transition-all duration-100"
                style={{ top: `${scanProgress}%`, background: `linear-gradient(90deg, transparent, ${GREEN}, transparent)` }}
              ></div>
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: `linear-gradient(rgba(61,139,100,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(61,139,100,0.3) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }}></div>
              <div className="text-center z-10">
                <Scan className="w-12 h-12 animate-pulse mx-auto" style={{ color: GREEN }} />
                <p className="font-mono text-sm mt-2" style={{ color: GREEN }}>ANALYZING...</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-64">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Scanning...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1e2228' }}>
                <div
                  className="h-full transition-all duration-100 rounded-full"
                  style={{ width: `${scanProgress}%`, background: `linear-gradient(90deg, ${GREEN_DARK}, ${GREEN}, ${BLUE})` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {scanComplete && detectedDevice && (
          <div className="space-y-4 animate-fade-in">
            {/* Device identified */}
            <div className="rounded-xl p-4" style={{
              background: `linear-gradient(135deg, rgba(61, 139, 100, 0.1), rgba(126, 184, 212, 0.05))`,
              border: `1px solid rgba(61, 139, 100, 0.25)`
            }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{detectedDevice.icon}</span>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">{detectedDevice.name}</h3>
                  <p className="text-sm text-slate-400">{detectedDevice.type}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">{detectedDevice.description}</p>
            </div>

            {/* XP Gained - powder blue accent */}
            <div className="rounded-lg p-3 flex items-center gap-2" style={{
              background: 'rgba(126, 184, 212, 0.08)',
              border: '1px solid rgba(126, 184, 212, 0.2)'
            }}>
              <Zap className="w-5 h-5" style={{ color: BLUE }} />
              <span className="font-bold" style={{ color: '#93c5e0' }}>+{xpGained} XP earned!</span>
              {newParts.length > 0 && (
                <span className="text-sm ml-auto" style={{ color: '#7eb8d4' }}>{newParts.length} new parts!</span>
              )}
            </div>

            {/* Parts found */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: GREEN }} />
                Components Found ({revealedParts.length})
              </h4>
              <div className="space-y-2">
                {revealedParts.map((part, idx) => {
                  const isNew = newParts.includes(part);
                  return (
                    <div
                      key={part.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isNew ? '' : ''
                      }`}
                      style={{
                        background: isNew ? 'rgba(61, 139, 100, 0.08)' : 'rgba(30, 34, 40, 0.5)',
                        border: isNew ? '1px solid rgba(61, 139, 100, 0.25)' : '1px solid rgba(100, 116, 139, 0.15)'
                      }}
                    >
                      <span className="text-xl">{part.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-100 truncate">{part.name}</span>
                          {isNew && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{
                              background: 'rgba(61, 139, 100, 0.2)',
                              color: '#4ade80'
                            }}>NEW</span>
                          )}
                        </div>
                        <span className={`text-xs ${getRarityColor(part.rarity)}`}>{part.rarity}</span>
                      </div>
                      <span className="text-xs text-slate-500">${part.estimatedValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={addToInventory}
                className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-95 relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, ${GREEN_DARK}, ${GREEN})`,
                  boxShadow: `0 4px 15px rgba(61, 139, 100, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
                }}
              >
                <CheckCircle className="w-5 h-5" />
                Add to Inventory
              </button>
              <button
                onClick={resetScan}
                className="px-4 py-3 rounded-xl text-slate-300 transition-all active:scale-95"
                style={{ background: '#1e2228', border: '1px solid rgba(100, 116, 139, 0.2)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
