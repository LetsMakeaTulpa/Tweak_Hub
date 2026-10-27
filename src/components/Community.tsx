import { useState } from 'react';
import { MessageCircle, Send, ShoppingBag, Repeat, MapPin, Globe, Heart, Bell, Search } from 'lucide-react';
import { communityUsers, getComponentById, UserProfile } from '../data/database';

interface CommunityProps {
  inventory: string[];
}

interface Post {
  id: string;
  author: UserProfile;
  type: 'trade' | 'selling' | 'request' | 'showoff';
  content: string;
  parts: string[];
  timestamp: string;
  likes: number;
  liked: boolean;
}

const GREEN = '#3d8b64';
const BLUE = '#7eb8d4';
const RUST = '#b45a2c';
const RUST_LIGHT = '#c4632e';

const mockPosts: Post[] = [
  {
    id: 'p1',
    author: communityUsers[0],
    type: 'trade',
    content: 'Looking to trade stepper motors for a Raspberry Pi or camera module. Got extras from printer salvages!',
    parts: ['motor_stepper'],
    timestamp: '2m ago',
    likes: 5,
    liked: false,
  },
  {
    id: 'p2',
    author: communityUsers[1],
    type: 'selling',
    content: 'Selling my ESP32-CAM module. Used once for a project. $8 or trade for LoRa module.',
    parts: ['wifi_camera'],
    timestamp: '15m ago',
    likes: 3,
    liked: false,
  },
  {
    id: 'p3',
    author: communityUsers[3],
    type: 'showoff',
    content: 'Just finished my LED matrix display! Used parts from 3 different scans. The WiFi control is so smooth 🌈',
    parts: ['led_rgb', 'esp32'],
    timestamp: '1h ago',
    likes: 12,
    liked: true,
  },
  {
    id: 'p4',
    author: communityUsers[4],
    type: 'request',
    content: 'ISO: Any servo motors or stepper motors? Working on a plant watering system and need precise control.',
    parts: ['servo'],
    timestamp: '2h ago',
    likes: 2,
    liked: false,
  },
  {
    id: 'p5',
    author: communityUsers[2],
    type: 'trade',
    content: 'Got a ton of mechanical parts - gears, bearings, springs. Would trade for anything camera or display related.',
    parts: ['gear_set', 'bearing_set', 'spring_set'],
    timestamp: '3h ago',
    likes: 7,
    liked: false,
  },
];

export default function Community({ inventory }: CommunityProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'trades' | 'nearby' | 'chat'>('feed');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [chatMessage, setChatMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trade': return <Repeat className="w-3.5 h-3.5" />;
      case 'selling': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'request': return <Bell className="w-3.5 h-3.5" />;
      case 'showoff': return <Heart className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trade': return { bg: 'rgba(126, 184, 212, 0.15)', color: '#93c5e0' };
      case 'selling': return { bg: 'rgba(61, 139, 100, 0.15)', color: '#4ade80' };
      case 'request': return { bg: 'rgba(180, 90, 44, 0.15)', color: '#d97706' };
      case 'showoff': return { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6' };
      default: return { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8' };
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header - warm rust/forge theme */}
      <div className="steel-panel p-4" style={{ borderBottom: `1px solid rgba(180, 90, 44, 0.2)` }}>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: RUST_LIGHT }}>
          <Globe className="w-5 h-5" />
          Community
        </h2>
        <p className="text-sm text-slate-400 mt-1">Trade, chat & discover parts nearby</p>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 rounded-lg p-1" style={{ background: 'rgba(15, 17, 21, 0.5)' }}>
          {[
            { id: 'feed', label: 'Feed', icon: MessageCircle },
            { id: 'trades', label: 'Trades', icon: Repeat },
            { id: 'nearby', label: 'Nearby', icon: MapPin },
            { id: 'chat', label: 'Chat', icon: Send },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 py-2 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all"
              style={activeTab === tab.id ? {
                background: 'rgba(180, 90, 44, 0.2)',
                color: '#d97706'
              } : {
                color: '#64748b'
              }}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="p-4 space-y-3">
            {/* New post input */}
            <div className="rounded-xl p-3" style={{ background: 'rgba(30, 34, 40, 0.4)', border: '1px solid rgba(100, 116, 139, 0.15)' }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔧</span>
                <span className="text-sm text-slate-100 font-medium">Your Post</span>
              </div>
              <textarea
                placeholder="What are you working on? Trading? Looking for parts?"
                className="w-full rounded-lg p-2 text-sm text-slate-100 placeholder-slate-500 resize-none h-16 focus:outline-none"
                style={{ background: 'rgba(15, 17, 21, 0.5)', border: '1px solid rgba(100, 116, 139, 0.15)' }}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(126, 184, 212, 0.12)', color: '#93c5e0' }}>🔄 Trade</button>
                  <button className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(61, 139, 100, 0.12)', color: '#4ade80' }}>💰 Sell</button>
                  <button className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(180, 90, 44, 0.12)', color: '#d97706' }}>🔍 ISO</button>
                </div>
                <button className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: RUST }}>Post</button>
              </div>
            </div>

            {/* Posts */}
            {posts.map(post => {
              const typeStyle = getTypeColor(post.type);
              return (
                <div key={post.id} className="rounded-xl p-4" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{post.author.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-100">{post.author.username}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: '#1e2228', color: '#64748b' }}>Lv.{post.author.level}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{post.timestamp}</span>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ background: typeStyle.bg, color: typeStyle.color }}>
                      {getTypeIcon(post.type)}
                      {post.type}
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 mb-2">{post.content}</p>

                  {/* Parts mentioned */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.parts.map(partId => {
                      const part = getComponentById(partId);
                      if (!part) return null;
                      return (
                        <span key={partId} className="text-xs px-2 py-1 rounded-full flex items-center gap-1" style={{ background: 'rgba(30, 34, 40, 0.6)', color: '#94a3b8' }}>
                          {part.icon} {part.name}
                        </span>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2" style={{ borderTop: '1px solid rgba(100, 116, 139, 0.1)' }}>
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1 text-xs transition-colors"
                      style={{ color: post.liked ? '#f472b6' : '#64748b' }}
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-current' : ''}`} />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Reply
                    </button>
                    {post.type === 'trade' || post.type === 'selling' ? (
                      <button className="flex items-center gap-1 text-xs text-slate-500 ml-auto transition-colors" style={{ color: '#64748b' }}>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Make Offer
                      </button>
                    ) : (
                      <button className="flex items-center gap-1 text-xs text-slate-500 ml-auto transition-colors" style={{ color: '#64748b' }}>
                        <Bell className="w-3.5 h-3.5" />
                        I Have This
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div className="p-4 space-y-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for parts to trade..."
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                style={{ background: 'rgba(15, 17, 21, 0.5)', border: '1px solid rgba(100, 116, 139, 0.2)' }}
              />
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Trades Near You</h3>
            {communityUsers.filter(u => u.tradesOpen).map(user => (
              <div
                key={user.id}
                className="rounded-xl p-3 cursor-pointer transition-all"
                style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{user.username}</span>
                      {user.online && <span className="w-2 h-2 rounded-full" style={{ background: GREEN }}></span>}
                    </div>
                    <p className="text-xs text-slate-500">{user.bio.slice(0, 50)}...</p>
                  </div>
                  <span className="text-xs" style={{ color: RUST_LIGHT }}>↔ Trade</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.parts.slice(0, 4).map(partId => {
                    const part = getComponentById(partId);
                    if (!part) return null;
                    return (
                      <span key={partId} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(30, 34, 40, 0.6)', color: '#64748b' }}>
                        {part.icon} {part.name}
                      </span>
                    );
                  })}
                  {user.parts.length > 4 && (
                    <span className="text-[10px] text-slate-500">+{user.parts.length - 4} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Nearby Tab */}
        {activeTab === 'nearby' && (
          <div className="p-4">
            {/* Map placeholder */}
            <div className="relative h-48 rounded-xl overflow-hidden mb-4" style={{
              background: '#0f1115',
              border: '1px solid rgba(100, 116, 139, 0.15)'
            }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: `radial-gradient(circle at 30% 40%, rgba(180, 90, 44, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(61, 139, 100, 0.2) 0%, transparent 40%)`,
              }}></div>
              {/* Grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}></div>
              {/* User dots */}
              {communityUsers.map((user, idx) => (
                <div
                  key={user.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${20 + idx * 15}%`,
                    top: `${30 + (idx % 3) * 20}%`,
                  }}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${user.online ? 'animate-pulse' : ''}`}
                    style={user.online ? {
                      background: 'rgba(180, 90, 44, 0.2)',
                      border: `2px solid ${RUST}`
                    } : {
                      background: 'rgba(30, 34, 40, 0.5)',
                      border: '1px solid rgba(100, 116, 139, 0.3)'
                    }}>
                    {user.avatar}
                  </div>
                  <p className="text-[9px] text-slate-400 text-center mt-0.5 whitespace-nowrap">{user.username}</p>
                </div>
              ))}
              {/* You marker */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg animate-pulse"
                  style={{ background: 'rgba(126, 184, 212, 0.2)', border: `2px solid ${BLUE}` }}>
                  📍
                </div>
                <p className="text-[9px] text-center mt-0.5" style={{ color: BLUE }}>You</p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tinkers Nearby ({communityUsers.length})</h3>
            <div className="space-y-2">
              {communityUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">{user.username}</span>
                      {user.online && <span className="w-2 h-2 rounded-full" style={{ background: GREEN }}></span>}
                    </div>
                    <p className="text-[10px] text-slate-500">Level {user.level} • {user.parts.length} parts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px]" style={{ color: RUST_LIGHT }}>0.{Math.floor(Math.random() * 9) + 1} mi</p>
                    <p className="text-[10px] text-slate-500">{user.tradesOpen ? 'Trading' : 'Not trading'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="p-4 space-y-2 flex-1 overflow-y-auto">
              {/* Chat conversations */}
              <div className="rounded-xl p-3 cursor-pointer transition-all" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">JunkYardKing</span>
                      <span className="text-[10px] text-slate-500">2m</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">Hey! I have those stepper motors if you're still interested</p>
                  </div>
                  <span className="w-5 h-5 rounded-full text-[10px] text-white flex items-center justify-center font-bold" style={{ background: RUST }}>2</span>
                </div>
              </div>

              <div className="rounded-xl p-3 cursor-pointer transition-all" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧙‍♀️</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">CircuitWitch</span>
                      <span className="text-[10px] text-slate-500">1h</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">Want to meet up this weekend to swap parts?</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl p-3 cursor-pointer transition-all" style={{ background: 'rgba(30, 34, 40, 0.3)', border: '1px solid rgba(100, 116, 139, 0.12)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-100">NeonDreamer</span>
                      <span className="text-[10px] text-slate-500">3h</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">Check out my new LED matrix build! 🌈</p>
                  </div>
                </div>
              </div>

              {/* Group chat */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Group Chats</h3>
                <div className="rounded-xl p-3 cursor-pointer transition-all" style={{
                  background: 'linear-gradient(135deg, rgba(180, 90, 44, 0.08), rgba(126, 184, 212, 0.05))',
                  border: '1px solid rgba(180, 90, 44, 0.15)'
                }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-100">NYC Tinkerers</span>
                      <p className="text-xs text-slate-400 truncate">ScrapBot: Anyone got spare servos?</p>
                    </div>
                    <span className="text-[10px] text-slate-500">24 members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat input */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(100, 116, 139, 0.15)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                  style={{ background: 'rgba(30, 34, 40, 0.5)', border: '1px solid rgba(100, 116, 139, 0.15)' }}
                />
                <button className="px-3 py-2 rounded-lg text-white" style={{ background: RUST }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50" onClick={() => setSelectedUser(null)}>
          <div className="rounded-t-2xl w-full max-w-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}
            style={{ background: '#1a1d23', borderTop: '1px solid rgba(100, 116, 139, 0.2)' }}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selectedUser.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-100">{selectedUser.username}</h3>
                  {selectedUser.online && <span className="w-2.5 h-2.5 rounded-full" style={{ background: GREEN }}></span>}
                </div>
                <p className="text-sm text-slate-400">Level {selectedUser.level} • {selectedUser.xp} XP</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">{selectedUser.bio}</p>

            {/* Their parts */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Parts They Have ({selectedUser.parts.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.parts.map(partId => {
                  const part = getComponentById(partId);
                  if (!part) return null;
                  return (
                    <span key={partId} className="text-xs px-2 py-1 rounded-full" style={{
                      background: 'rgba(61, 139, 100, 0.1)',
                      color: '#4ade80',
                      border: '1px solid rgba(61, 139, 100, 0.2)'
                    }}>
                      {part.icon} {part.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Their wants */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Looking For ({selectedUser.wants.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.wants.map(partId => {
                  const part = getComponentById(partId);
                  if (!part) return null;
                  const youHave = inventory.includes(partId);
                  return (
                    <span key={partId} className="text-xs px-2 py-1 rounded-full" style={youHave ? {
                      background: 'rgba(180, 90, 44, 0.1)',
                      color: '#d97706',
                      border: '1px solid rgba(180, 90, 44, 0.25)'
                    } : {
                      background: 'rgba(30, 34, 40, 0.6)',
                      color: '#64748b',
                      border: '1px solid rgba(100, 116, 139, 0.15)'
                    }}>
                      {part.icon} {part.name} {youHave && '🎯'}
                    </span>
                  );
                })}
              </div>
              {selectedUser.wants.some(w => inventory.includes(w)) && (
                <p className="text-[10px] mt-1.5" style={{ color: RUST_LIGHT }}>🎯 = You have this part! Perfect trade match!</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{
                background: 'rgba(126, 184, 212, 0.12)',
                border: '1px solid rgba(126, 184, 212, 0.25)',
                color: '#93c5e0'
              }}>
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              {selectedUser.tradesOpen && (
                <button className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{
                  background: 'rgba(180, 90, 44, 0.12)',
                  border: '1px solid rgba(180, 90, 44, 0.25)',
                  color: '#d97706'
                }}>
                  <Repeat className="w-4 h-4" />
                  Propose Trade
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 rounded-xl text-slate-400 text-sm"
              style={{ background: '#1e2228', border: '1px solid rgba(100, 116, 139, 0.15)' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
