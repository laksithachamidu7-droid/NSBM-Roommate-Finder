import React, { useEffect, useState, useContext, useRef } from 'react';
import { messageService } from '../services/messageService';
import { roommateService } from '../services/roommateService';
import { AuthContext } from '../context/AuthContext';
import { Send, MessageSquare, X, Search, User as UserIcon, Loader } from 'lucide-react';

const ChatDrawer = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch recent conversations & roommates list
  const loadDirectory = async () => {
    if (!user) return;
    setLoadingChats(true);
    try {
      // 1. Get recent conversations
      const allMsgs = await messageService.getRecentMessages();
      const recentMap = new Map();
      allMsgs.forEach(msg => {
        const partner = msg.sender.id === user.id ? msg.receiver : msg.sender;
        if (!recentMap.has(partner.id)) {
          recentMap.set(partner.id, {
            user: partner,
            lastMessage: msg.message,
            timestamp: msg.createdAt,
            online: true
          });
        }
      });

      // 2. Get registered roommates to build a full directory
      const allRoommates = await roommateService.searchRoommates();
      const directory = [];

      // Add recent chats first
      recentMap.forEach(chatVal => {
        directory.push(chatVal);
      });

      // Add other roommates who aren't in recent chats
      allRoommates.forEach(rm => {
        if (rm.user && rm.user.id !== user.id && !recentMap.has(rm.user.id)) {
          directory.push({
            user: rm.user,
            lastMessage: `Roommate preference: ${rm.roomType || 'Room'} in ${rm.preferredCity || 'NSBM'}`,
            timestamp: null,
            online: false
          });
        }
      });

      setChats(directory);
      setRoommates(allRoommates);
    } catch (error) {
      console.error("Error loading chat directory:", error);
    } finally {
      setLoadingChats(false);
    }
  };

  const fetchMessages = async (partnerId) => {
    if (!partnerId) return;
    try {
      const history = await messageService.getChatHistory(partnerId);
      setMessages(history);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Open drawer and load directory on open
  useEffect(() => {
    if (isOpen && user) {
      loadDirectory();
    }
  }, [isOpen, user]);

  // Poll chat messages when a user is selected
  useEffect(() => {
    if (!selectedUser || !isOpen) return;

    fetchMessages(selectedUser.id);
    const interval = setInterval(() => {
      fetchMessages(selectedUser.id);
    }, 4000);

    return () => clearInterval(interval);
  }, [selectedUser, isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle listening for global chat events
  useEffect(() => {
    const handleOpenDrawer = async (e) => {
      const targetId = e.detail?.userId;
      if (!targetId || !user) return;

      setIsOpen(true);
      setLoadingMessages(true);
      try {
        // Resolve selected user
        const history = await messageService.getChatHistory(targetId);
        if (history.length > 0) {
          const first = history[0];
          const partner = first.sender.id === user.id ? first.receiver : first.sender;
          setSelectedUser(partner);
          setMessages(history);
        } else {
          // Check loaded roommates list or fetch
          const rms = roommates.length > 0 ? roommates : await roommateService.searchRoommates();
          const rmAd = rms.find(rm => rm.user && rm.user.id === targetId);
          if (rmAd) {
            setSelectedUser(rmAd.user);
          } else {
            setSelectedUser({ id: targetId, name: `User #${targetId}`, email: '' });
          }
          setMessages([]);
        }
      } catch (error) {
        console.error("Error handling open chat drawer event:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    window.addEventListener('open-chat-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-chat-drawer', handleOpenDrawer);
  }, [user, roommates]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;

    setSending(true);
    const textToSend = newMessage;
    setNewMessage(''); // clear input early for snappy UI

    try {
      const sent = await messageService.sendMessage(selectedUser.id, textToSend);
      setMessages(prev => [...prev, sent]);
      // Update last message in local chats directory
      setChats(prev => prev.map(chat => {
        if (chat.user.id === selectedUser.id) {
          return { ...chat, lastMessage: textToSend, timestamp: sent.createdAt };
        }
        return chat;
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Filter roster list based on search query
  const filteredChats = chats.filter(chat => 
    chat.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <>
      {/* Floating Chat Bubble Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="floating-chat-bubble"
          title="Open messaging chat drawer"
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* Drawer Overlay backdrop */}
      {isOpen && (
        <div className="chat-drawer-overlay" onClick={() => setIsOpen(false)} />
      )}

      {/* Slide-in Drawer Container */}
      <div className={`chat-drawer-container ${isOpen ? 'open' : ''}`}>
        <div className="chat-drawer-header">
          <div className="drawer-header-title">
            <MessageSquare size={20} className="text-blue" />
            <h3>NSBM RoomMate Chat</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="drawer-close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="chat-drawer-layout">
          {/* Left Pane: Roster */}
          <div className="chat-drawer-sidebar">
            <div className="sidebar-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search roommates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sidebar-roster-list">
              {loadingChats ? (
                <div className="roster-loading">
                  <Loader size={20} className="spin-animation text-blue" />
                  <span>Loading directory...</span>
                </div>
              ) : filteredChats.length > 0 ? (
                filteredChats.map(chat => {
                  const isActive = selectedUser?.id === chat.user.id;
                  return (
                    <div 
                      key={chat.user.id}
                      className={`roster-item ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedUser(chat.user)}
                    >
                      <div className="roster-avatar-wrapper">
                        <img 
                          src={chat.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"} 
                          alt={chat.user.name}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80?text=" + encodeURIComponent(chat.user.name?.charAt(0) || 'U');
                          }}
                        />
                        <span className={`status-badge ${chat.online ? 'online' : 'offline'}`} />
                      </div>
                      <div className="roster-meta">
                        <h4 className="roster-name">{chat.user.name}</h4>
                        <p className="roster-snippet">{chat.lastMessage || 'Click to start chatting'}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="roster-empty">
                  <span>No roommates found</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Pane: Active Conversation Box */}
          <div className="chat-drawer-chatbox">
            {selectedUser ? (
              <>
                <div className="chatbox-header">
                  <div className="chatbox-header-avatar">
                    <img 
                      src={selectedUser.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"} 
                      alt={selectedUser.name} 
                    />
                  </div>
                  <div className="chatbox-header-info">
                    <h4>{selectedUser.name}</h4>
                    <span className="online-status">Active now</span>
                  </div>
                </div>

                <div className="chatbox-messages-viewport">
                  {loadingMessages ? (
                    <div className="messages-loading">
                      <Loader size={24} className="spin-animation text-blue" />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map(msg => {
                      const isMe = msg.sender.id === user.id;
                      return (
                        <div key={msg.id} className={`message-bubble-row ${isMe ? 'outgoing' : 'incoming'}`}>
                          <div className={`message-bubble ${isMe ? 'outgoing-bubble' : 'incoming-bubble'}`}>
                            <p>{msg.message}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="messages-empty">
                      <span>No messages yet. Say hi!</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="chatbox-input-toolbar">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sending}
                  />
                  <button type="submit" className="chatbox-send-btn" disabled={sending || newMessage.trim() === ''}>
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="chatbox-placeholder">
                <MessageSquare size={48} className="placeholder-icon text-muted" />
                <p>Select a contact roommate to begin communicating in real-time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatDrawer;
