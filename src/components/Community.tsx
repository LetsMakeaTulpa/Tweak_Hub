import { useState } from 'react';
import { Users, MessageCircle, Send, ShoppingBag, Repeat, MapPin, Globe, Heart, Bell, Search } from 'lucide-react';
import { communityUsers, getComponentById, getRarityColor, UserProfile } from '../data/database';

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
      case 'trade': return 'text-blue-400 bg-blue-500/20';
      case 'selling': return 'text-emerald-400 bg-emerald-500/20';
      case 'request': return 'text-yellow-400 bg-yellow-500/20';
      case 'showoff': return 'text-pink-400 bg-pink-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-orange-900/50 to-red-900/50 border-b border-orange-500/20">
        <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Community
        </h2>
        <p className="text-sm text-gray-400 mt-1">Trade, chat & discover parts nearby</p>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 bg-black/20 rounded-lg p-1">
          {[
            { id: 'feed', label: 'Feed', icon: MessageCircle },
            { id: 'trades', label: 'Trades', icon: Repeat },
            { id: 'nearby', label: 'Nearby', icon: MapPin },
            { id: 'chat', label: 'Chat', icon: Send },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500/30 text-orange-300'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
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
            <div className="bg-gray-800/50 border border-gray-700/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🔧</span>
                <span className="text-sm text-white font-medium">Your Post</span>
              </div>
              <textarea
                placeholder="What are you working on? Trading? Looking for parts?"
                className="w-full bg-black/30 border border-gray-700/50 rounded-lg p-2 text-sm text-white placeholder-gray-500 resize-none h-16 focus:outline-none focus:border-orange-500/50"
              />
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">🔄 Trade</button>
                  <button className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">💰 Sell</button>
                  <button className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full">🔍 ISO</button>
                </div>
                <button className="px-3 py-1 bg-orange-500 rounded-full text-xs font-bold text-white">Post</button>
              </div>
            </div>

            {/* Posts */}
            {posts.map(post => (
              <div key={post.id} className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{post.author.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{post.author.username}</span>
                      <span className="text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded-full">Lv.{post.author.level}</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{post.timestamp}</span>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${getTypeColor(post.type)}`}>
                    {getTypeIcon(post.type)}
                    {post.type}
                  </span>
                </div>

                <p className="text-sm text-gray-300 mb-2">{post.content}</p>

                {/* Parts mentioned */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.parts.map(partId => {
                    const part = getComponentById(partId);
                    if (!part) return null;
                    return (
                      <span key={partId} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full flex items-center gap-1">
                        {part.icon} {part.name}
                      </span>
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-700/30">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1 text-xs ${post.liked ? 'text-pink-400' : 'text-gray-500 hover:text-pink-400'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.liked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Reply
                  </button>
                  {post.type === 'trade' || post.type === 'selling' ? (
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-emerald-400 ml-auto">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Make Offer
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-400 ml-auto">
                      <Bell className="w-3.5 h-3.5" />
                      I Have This
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trades Tab */}
        {activeTab === 'trades' && (
          <div className="p-4 space-y-3">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for parts to trade..."
                className="w-full pl-9 pr-4 py-2 bg-black/30 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Active trades */}
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Trades Near You</h3>
            {communityUsers.filter(u => u.tradesOpen).map(user => (
              <div
                key={user.id}
                className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-3 cursor-pointer hover:bg-gray-800/50 transition-all"
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{user.username}</span>
                      {user.online && <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>}
                    </div>
                    <p className="text-xs text-gray-500">{user.bio.slice(0, 50)}...</p>
                  </div>
                  <span className="text-xs text-orange-400">↔ Trade</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {user.parts.slice(0, 4).map(partId => {
                    const part = getComponentById(partId);
                    if (!part) return null;
                    return (
                      <span key={partId} className="text-[10px] bg-gray-700/50 text-gray-400 px-1.5 py-0.5 rounded-full">
                        {part.icon} {part.name}
                      </span>
                    );
                  })}
                  {user.parts.length > 4 && (
                    <span className="text-[10px] text-gray-500">+{user.parts.length - 4} more</span>
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
            <div className="relative h-48 bg-gray-800/50 rounded-xl border border-gray-700/30 overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(249,115,22,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(234,88,12,0.2) 0%, transparent 40%)',
              }}></div>
              {/* Grid */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)',
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${user.online ? 'bg-orange-500/30 border-2 border-orange-400 animate-pulse' : 'bg-gray-700/50 border border-gray-600'}`}>
                    {user.avatar}
                  </div>
                  <p className="text-[9px] text-gray-400 text-center mt-0.5 whitespace-nowrap">{user.username}</p>
                </div>
              ))}
              {/* You marker */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 border-2 border-blue-400 flex items-center justify-center text-lg animate-pulse">
                  📍
                </div>
                <p className="text-[9px] text-blue-400 text-center mt-0.5">You</p>
              </div>
            </div>

            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tinkers Nearby ({communityUsers.length})</h3>
            <div className="space-y-2">
              {communityUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-3 bg-gray-800/30 border border-gray-700/20 rounded-xl cursor-pointer hover:bg-gray-800/50"
                  onClick={() => setSelectedUser(user)}
                >
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{user.username}</span>
                      {user.online && <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>}
                    </div>
                    <p className="text-[10px] text-gray-500">Level {user.level} • {user.parts.length} parts</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-orange-400">0.{Math.floor(Math.random() * 9) + 1} mi</p>
                    <p className="text-[10px] text-gray-500">{user.tradesOpen ? 'Trading' : 'Not trading'}</p>
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
              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-3 cursor-pointer hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👑</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">JunkYardKing</span>
                      <span className="text-[10px] text-gray-500">2m</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">Hey! I have those stepper motors if you're still interested</p>
                  </div>
                  <span className="w-5 h-5 bg-orange-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">2</span>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-3 cursor-pointer hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧙‍♀️</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">CircuitWitch</span>
                      <span className="text-[10px] text-gray-500">1h</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">Want to meet up this weekend to swap parts?</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 border border-gray-700/20 rounded-xl p-3 cursor-pointer hover:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💡</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">NeonDreamer</span>
                      <span className="text-[10px] text-gray-500">3h</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">Check out my new LED matrix build! 🌈</p>
                  </div>
                </div>
              </div>

              {/* Group chat */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Group Chats</h3>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-3 cursor-pointer hover:bg-purple-500/15">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔧</span>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-white">NYC Tinkerers</span>
                      <p className="text-xs text-gray-400 truncate">ScrapBot: Anyone got spare servos?</p>
                    </div>
                    <span className="text-[10px] text-gray-500">24 members</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
                />
                <button className="px-3 py-2 bg-orange-500 rounded-lg text-white">
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
          <div className="bg-gray-900 border-t border-gray-700 rounded-t-2xl w-full max-w-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{selectedUser.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{selectedUser.username}</h3>
                  {selectedUser.online && <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>}
                </div>
                <p className="text-sm text-gray-400">Level {selectedUser.level} • {selectedUser.xp} XP</p>
              </div>
            </div>
            <p className="text-sm text-gray-300">{selectedUser.bio}</p>

            {/* Their parts */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Parts They Have ({selectedUser.parts.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.parts.map(partId => {
                  const part = getComponentById(partId);
                  if (!part) return null;
                  return (
                    <span key={partId} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded-full border border-emerald-500/20">
                      {part.icon} {part.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Their wants */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Looking For ({selectedUser.wants.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.wants.map(partId => {
                  const part = getComponentById(partId);
                  if (!part) return null;
                  const youHave = inventory.includes(partId);
                  return (
                    <span key={partId} className={`text-xs px-2 py-1 rounded-full border ${
                      youHave
                        ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
                        : 'bg-gray-800 text-gray-400 border-gray-700/30'
                    }`}>
                      {part.icon} {part.name} {youHave && '🎯'}
                    </span>
                  );
                })}
              </div>
              {selectedUser.wants.some(w => inventory.includes(w)) && (
                <p className="text-[10px] text-yellow-400 mt-1.5">🎯 = You have this part! Perfect trade match!</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              {selectedUser.tradesOpen && (
                <button className="flex-1 py-2.5 bg-orange-500/20 border border-orange-500/30 rounded-xl text-orange-300 text-sm font-medium flex items-center justify-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Propose Trade
                </button>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2.5 bg-gray-800 rounded-xl text-gray-400 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
