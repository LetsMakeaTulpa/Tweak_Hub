import { useState, useEffect } from 'react';
import { Camera, Scan, CheckCircle, X, Zap, Package, ChevronRight } from 'lucide-react';
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

    // Simulate scanning with progress
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
    // Pick a random device
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    setDetectedDevice(randomDevice);

    // Get components for this device
    const deviceComponents = randomDevice.components
      .map(id => components.find(c => c.id === id))
      .filter(Boolean) as Component[];

    setRevealedParts(deviceComponents);

    // Determine which are new
    const newOnes = deviceComponents.filter(c => !inventory.includes(c.id));
    setNewParts(newOnes);

    // Calculate XP
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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-emerald-900/50 to-cyan-900/50 border-b border-emerald-500/20">
        <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <Scan className="w-5 h-5" />
          Part Scanner
        </h2>
        <p className="text-sm text-gray-400 mt-1">Scan any device to identify and catalog its components</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {!scanning && !scanComplete && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            {/* Scanner Viewfinder */}
            <div className="relative w-64 h-64 border-2 border-emerald-500/50 rounded-2xl flex items-center justify-center bg-black/30">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>
              </div>
              <div className="text-center">
                <Camera className="w-16 h-16 text-emerald-500/50 mx-auto" />
                <p className="text-emerald-500/70 text-sm mt-2">Point at device</p>
              </div>
              {/* Scanning line animation */}
              <div className="absolute left-2 right-2 h-0.5 bg-emerald-400/60 animate-pulse" style={{ top: '50%' }}></div>
            </div>

            <button
              onClick={startScan}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-bold text-white text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                SCAN DEVICE
              </span>
            </button>

            <p className="text-xs text-gray-500 text-center max-w-xs">
              Found something interesting? Point your camera at any electronic device, appliance, or machine to identify and catalog all its components.
            </p>
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="relative w-64 h-64 border-2 border-emerald-500 rounded-2xl flex items-center justify-center bg-black/30 overflow-hidden">
              {/* Animated scan line */}
              <div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent transition-all duration-100"
                style={{ top: `${scanProgress}%` }}
              ></div>
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              <div className="text-center z-10">
                <Scan className="w-12 h-12 text-emerald-400 animate-pulse mx-auto" />
                <p className="text-emerald-400 font-mono text-sm mt-2">ANALYZING...</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-64">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Scanning...</span>
                <span>{scanProgress}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-100 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {scanComplete && detectedDevice && (
          <div className="space-y-4">
            {/* Device identified */}
            <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{detectedDevice.icon}</span>
                <div>
                  <h3 className="font-bold text-white text-lg">{detectedDevice.name}</h3>
                  <p className="text-sm text-gray-400">{detectedDevice.type}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300">{detectedDevice.description}</p>
            </div>

            {/* XP Gained */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-400 font-bold">+{xpGained} XP earned!</span>
              {newParts.length > 0 && (
                <span className="text-yellow-300 text-sm ml-auto">{newParts.length} new parts!</span>
              )}
            </div>

            {/* Parts found */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Components Found ({revealedParts.length})
              </h4>
              <div className="space-y-2">
                {revealedParts.map((part, idx) => {
                  const isNew = newParts.includes(part);
                  return (
                    <div
                      key={part.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isNew
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-gray-800/50 border-gray-700/30'
                      }`}
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <span className="text-xl">{part.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">{part.name}</span>
                          {isNew && (
                            <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                          )}
                        </div>
                        <span className={`text-xs ${getRarityColor(part.rarity)}`}>{part.rarity}</span>
                      </div>
                      <span className="text-xs text-gray-500">${part.estimatedValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={addToInventory}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all active:scale-95"
              >
                <CheckCircle className="w-5 h-5" />
                Add to Inventory
              </button>
              <button
                onClick={resetScan}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-all active:scale-95"
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
