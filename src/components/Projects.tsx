import { useState } from 'react';
import { Wrench, Check, X, ChevronDown, ChevronUp, Star, Users, Lightbulb, ShoppingCart } from 'lucide-react';
import { projects, getComponentById, getBuildableProjects } from '../data/database';

interface ProjectsProps {
  inventory: string[];
  communityInventory: string[];
}

const GREEN = '#3d8b64';
const GREEN_DARK = '#2d6b4f';
const BLUE = '#7eb8d4';
const RUST = '#b45a2c';
const RUST_LIGHT = '#c4632e';

export default function Projects({ inventory, communityInventory }: ProjectsProps) {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'buildable' | 'almost' | 'wishlist'>('all');
  const [showAltBuilds, setShowAltBuilds] = useState<string | null>(null);

  const buildableProjects = getBuildableProjects(inventory);

  const filteredProjects = buildableProjects.filter(({ percentComplete }) => {
    switch (filter) {
      case 'buildable': return percentComplete === 100;
      case 'almost': return percentComplete >= 60 && percentComplete < 100;
      case 'wishlist': return percentComplete < 60;
      default: return true;
    }
  });

  const buildableCount = buildableProjects.filter(p => p.percentComplete === 100).length;
  const almostCount = buildableProjects.filter(p => p.percentComplete >= 60 && p.percentComplete < 100).length;

  const getAlternativeBuilds = (projectId: string) => {
    const current = projects.find(p => p.id === projectId);
    if (!current) return [];
    return projects.filter(p => p.id !== projectId &&
      p.requiredParts.some(part => current.requiredParts.includes(part))
    ).slice(0, 4);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="steel-panel p-4" style={{ borderBottom: `1px solid rgba(180, 90, 44, 0.2)` }}>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: RUST_LIGHT }}>
          <Wrench className="w-5 h-5" />
          Project Finder
        </h2>
        <p className="text-sm text-slate-400 mt-1">See what you can build with your parts</p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => setFilter('buildable')}
            className="p-2 rounded-lg text-center transition-all"
            style={filter === 'buildable' ? {
              background: 'rgba(61, 139, 100, 0.15)',
              border: '1px solid rgba(61, 139, 100, 0.4)'
            } : {
              background: 'rgba(15, 17, 21, 0.5)',
              border: '1px solid transparent'
            }}
          >
            <p className="text-lg font-bold" style={{ color: GREEN }}>{buildableCount}</p>
            <p className="text-[10px] text-slate-400">Ready to Build</p>
          </button>
          <button
            onClick={() => setFilter('almost')}
            className="p-2 rounded-lg text-center transition-all"
            style={filter === 'almost' ? {
              background: 'rgba(180, 90, 44, 0.15)',
              border: '1px solid rgba(180, 90, 44, 0.4)'
            } : {
              background: 'rgba(15, 17, 21, 0.5)',
              border: '1px solid transparent'
            }}
          >
            <p className="text-lg font-bold" style={{ color: RUST_LIGHT }}>{almostCount}</p>
            <p className="text-[10px] text-slate-400">Almost There</p>
          </button>
          <button
            onClick={() => setFilter('all')}
            className="p-2 rounded-lg text-center transition-all"
            style={filter === 'all' ? {
              background: 'rgba(126, 184, 212, 0.15)',
              border: '1px solid rgba(126, 184, 212, 0.4)'
            } : {
              background: 'rgba(15, 17, 21, 0.5)',
              border: '1px solid transparent'
            }}
          >
            <p className="text-lg font-bold" style={{ color: BLUE }}>{projects.length}</p>
            <p className="text-[10px] text-slate-400">All Projects</p>
          </button>
        </div>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <Lightbulb className="w-12 h-12 text-slate-700" />
            <p className="text-slate-500">No projects match this filter</p>
          </div>
        ) : (
          filteredProjects.map(({ project, missing, have, percentComplete }) => (
            <div
              key={project.id}
              className="rounded-xl border transition-all"
              style={percentComplete === 100 ? {
                background: 'rgba(61, 139, 100, 0.08)',
                border: '1px solid rgba(61, 139, 100, 0.25)'
              } : percentComplete >= 60 ? {
                background: 'rgba(180, 90, 44, 0.08)',
                border: '1px solid rgba(180, 90, 44, 0.2)'
              } : {
                background: 'rgba(30, 34, 40, 0.3)',
                border: '1px solid rgba(100, 116, 139, 0.15)'
              }}
            >
              {/* Project header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{project.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm">{project.name}</h3>
                      {percentComplete === 100 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold" style={{
                          background: 'rgba(61, 139, 100, 0.2)',
                          color: '#4ade80'
                        }}>BUILDABLE</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{project.category} • {project.difficulty}</p>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                        <span>{have.length}/{project.requiredParts.length} parts</span>
                        <span>{percentComplete}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e2228' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${percentComplete}%`,
                            background: percentComplete === 100 ? GREEN :
                              percentComplete >= 60 ? RUST : '#475569'
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Star className="w-3 h-3" style={{ color: '#eab308' }} />
                        {project.communityRating}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Users className="w-3 h-3" />
                        {project.timesBuilt} built
                      </span>
                    </div>
                  </div>

                  {expandedProject === project.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expandedProject === project.id && (
                <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: '1px solid rgba(100, 116, 139, 0.15)' }}>
                  <p className="text-sm text-slate-300">{project.description}</p>

                  {/* Parts you have */}
                  {have.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: GREEN }}>
                        <Check className="w-3 h-3" /> Parts You Have ({have.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {have.map(partId => {
                          const part = getComponentById(partId);
                          if (!part) return null;
                          return (
                            <span key={partId} className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{
                              background: 'rgba(61, 139, 100, 0.15)',
                              color: '#4ade80'
                            }}>
                              {part.icon} {part.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Parts you need */}
                  {missing.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: RUST }}>
                        <X className="w-3 h-3" /> Parts You Need ({missing.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {missing.map(partId => {
                          const part = getComponentById(partId);
                          if (!part) return null;
                          const availableInCommunity = communityInventory.includes(partId);
                          return (
                            <span
                              key={partId}
                              className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                              style={availableInCommunity ? {
                                background: 'rgba(126, 184, 212, 0.12)',
                                color: '#93c5e0',
                                border: '1px solid rgba(126, 184, 212, 0.25)'
                              } : {
                                background: 'rgba(180, 90, 44, 0.08)',
                                color: '#d97706',
                                border: '1px solid rgba(180, 90, 44, 0.2)'
                              }}
                            >
                              {part.icon} {part.name}
                              {availableInCommunity && <span className="text-[9px]">👥</span>}
                            </span>
                          );
                        })}
                      </div>
                      {missing.some(id => communityInventory.includes(id)) && (
                        <p className="text-[10px] mt-1.5 flex items-center gap-1" style={{ color: BLUE }}>
                          <Users className="w-3 h-3" />
                          Parts with 👥 are available from community members!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Optional parts */}
                  {project.optionalParts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Optional Upgrades
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.optionalParts.map(partId => {
                          const part = getComponentById(partId);
                          if (!part) return null;
                          const hasIt = inventory.includes(partId);
                          return (
                            <span
                              key={partId}
                              className="text-xs px-2 py-1 rounded-full"
                              style={hasIt ? {
                                background: 'rgba(167, 139, 250, 0.15)',
                                color: '#c4b5fd'
                              } : {
                                background: 'rgba(30, 34, 40, 0.6)',
                                color: '#64748b'
                              }}
                            >
                              {part.icon} {part.name} {hasIt && '✓'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Instructions preview */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Build Steps
                    </h4>
                    <div className="space-y-1.5">
                      {project.instructions.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[10px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{
                            background: '#1e2228',
                            color: '#64748b'
                          }}>
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alternative builds */}
                  <div>
                    <button
                      onClick={() => setShowAltBuilds(showAltBuilds === project.id ? null : project.id)}
                      className="text-xs flex items-center gap-1 font-medium"
                      style={{ color: '#a78bfa' }}
                    >
                      <Lightbulb className="w-3 h-3" />
                      Alternative Builds from Same Parts
                      {showAltBuilds === project.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showAltBuilds === project.id && (
                      <div className="mt-2 space-y-2">
                        {getAlternativeBuilds(project.id).map(alt => (
                          <div key={alt.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(30, 34, 40, 0.5)' }}>
                            <span className="text-lg">{alt.icon}</span>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-slate-100">{alt.name}</p>
                              <p className="text-[10px] text-slate-500">{alt.category}</p>
                            </div>
                            <span className="text-[10px] text-slate-500">
                              {alt.requiredParts.filter(p => inventory.includes(p)).length}/{alt.requiredParts.length}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {percentComplete === 100 ? (
                    <button className="w-full py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(145deg, ${GREEN_DARK}, ${GREEN})`,
                        boxShadow: `0 2px 10px rgba(61, 139, 100, 0.2), inset 0 1px 1px rgba(255,255,255,0.1)`
                      }}>
                      <Check className="w-4 h-4" />
                      Start Building!
                    </button>
                  ) : missing.length > 0 ? (
                    <button className="w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                      style={{
                        background: 'rgba(126, 184, 212, 0.1)',
                        border: '1px solid rgba(126, 184, 212, 0.25)',
                        color: '#93c5e0'
                      }}>
                      <ShoppingCart className="w-4 h-4" />
                      Find Missing Parts in Community
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
