import { useState } from 'react';
import { Wrench, Check, X, ChevronDown, ChevronUp, Star, Users, Lightbulb, ShoppingCart } from 'lucide-react';
import { projects, getComponentById, getBuildableProjects, getRarityColor, Project } from '../data/database';

interface ProjectsProps {
  inventory: string[];
  communityInventory: string[]; // all parts available in community
}

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

  // Find alternative builds - projects that share parts with the current one
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
      <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
        <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Project Finder
        </h2>
        <p className="text-sm text-gray-400 mt-1">See what you can build with your parts</p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => setFilter('buildable')}
            className={`p-2 rounded-lg text-center transition-all ${filter === 'buildable' ? 'bg-emerald-500/20 border border-emerald-500/50' : 'bg-black/20 border border-transparent'}`}
          >
            <p className="text-lg font-bold text-emerald-400">{buildableCount}</p>
            <p className="text-[10px] text-gray-400">Ready to Build</p>
          </button>
          <button
            onClick={() => setFilter('almost')}
            className={`p-2 rounded-lg text-center transition-all ${filter === 'almost' ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-black/20 border border-transparent'}`}
          >
            <p className="text-lg font-bold text-yellow-400">{almostCount}</p>
            <p className="text-[10px] text-gray-400">Almost There</p>
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`p-2 rounded-lg text-center transition-all ${filter === 'all' ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-black/20 border border-transparent'}`}
          >
            <p className="text-lg font-bold text-purple-400">{projects.length}</p>
            <p className="text-[10px] text-gray-400">All Projects</p>
          </button>
        </div>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
            <Lightbulb className="w-12 h-12 text-gray-700" />
            <p className="text-gray-500">No projects match this filter</p>
          </div>
        ) : (
          filteredProjects.map(({ project, missing, have, percentComplete }) => (
            <div
              key={project.id}
              className={`rounded-xl border transition-all ${
                percentComplete === 100
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : percentComplete >= 60
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-gray-800/30 border-gray-700/30'
              }`}
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
                      <h3 className="font-bold text-white text-sm">{project.name}</h3>
                      {percentComplete === 100 && (
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">BUILDABLE</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{project.category} • {project.difficulty}</p>

                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>{have.length}/{project.requiredParts.length} parts</span>
                        <span>{percentComplete}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            percentComplete === 100 ? 'bg-emerald-500' :
                            percentComplete >= 60 ? 'bg-yellow-500' : 'bg-gray-600'
                          }`}
                          style={{ width: `${percentComplete}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Star className="w-3 h-3 text-yellow-500" />
                        {project.communityRating}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Users className="w-3 h-3" />
                        {project.timesBuilt} built
                      </span>
                    </div>
                  </div>

                  {expandedProject === project.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </div>
              </div>

              {/* Expanded details */}
              {expandedProject === project.id && (
                <div className="px-4 pb-4 border-t border-gray-700/30 pt-3 space-y-3">
                  <p className="text-sm text-gray-300">{project.description}</p>

                  {/* Parts you have */}
                  {have.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Parts You Have ({have.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {have.map(partId => {
                          const part = getComponentById(partId);
                          if (!part) return null;
                          return (
                            <span key={partId} className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full flex items-center gap-1">
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
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1">
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
                              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                availableInCommunity
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-red-500/10 text-red-300 border border-red-500/20'
                              }`}
                            >
                              {part.icon} {part.name}
                              {availableInCommunity && <span className="text-[9px]">👥</span>}
                            </span>
                          );
                        })}
                      </div>
                      {missing.some(id => communityInventory.includes(id)) && (
                        <p className="text-[10px] text-blue-400 mt-1.5 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          Parts with 👥 are available from community members!
                        </p>
                      )}
                    </div>
                  )}

                  {/* Optional parts */}
                  {project.optionalParts.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
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
                              className={`text-xs px-2 py-1 rounded-full ${
                                hasIt ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-500'
                              }`}
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
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Build Steps
                    </h4>
                    <div className="space-y-1.5">
                      {project.instructions.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[10px] bg-gray-800 text-gray-400 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-gray-300">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alternative builds (like lego box back) */}
                  <div>
                    <button
                      onClick={() => setShowAltBuilds(showAltBuilds === project.id ? null : project.id)}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                    >
                      <Lightbulb className="w-3 h-3" />
                      Alternative Builds from Same Parts
                      {showAltBuilds === project.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {showAltBuilds === project.id && (
                      <div className="mt-2 space-y-2">
                        {getAlternativeBuilds(project.id).map(alt => (
                          <div key={alt.id} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                            <span className="text-lg">{alt.icon}</span>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-white">{alt.name}</p>
                              <p className="text-[10px] text-gray-500">{alt.category}</p>
                            </div>
                            <span className="text-[10px] text-gray-500">
                              {alt.requiredParts.filter(p => inventory.includes(p)).length}/{alt.requiredParts.length}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {percentComplete === 100 ? (
                    <button className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Start Building!
                    </button>
                  ) : missing.length > 0 ? (
                    <button className="w-full py-2.5 bg-blue-600/20 border border-blue-500/30 rounded-lg font-medium text-blue-300 text-sm flex items-center justify-center gap-2">
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
