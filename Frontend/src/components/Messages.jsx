import React, { useEffect, useState, useContext, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services/messageService';
import { roommateService } from '../services/roommateService';
import { AuthContext } from '../context/AuthContext';
import { Send, User as UserIcon, Loader, Search, Paperclip } from 'lucide-react';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [chats, setChats] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);

  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchChats = async () => {
    try {
      const allMsgs = await messageService.getRecentMessages();
      const partnerMap = new Map();
      
      allMsgs.forEach(msg => {
        const partner = msg.sender.id === user.id ? msg.receiver : msg.sender;
        if (!partnerMap.has(partner.id)) {
          partnerMap.set(partner.id, {
            user: partner,
            lastMessage: msg.message,
            timestamp: msg.createdAt,
            online: true
          });
        }
      });

      const backendList = Array.from(partnerMap.values());
      setChats(backendList);
    } catch (error) {
      console.error("Error fetching chat histories:", error);
      setChats([]);
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

  const initTargetUser = async () => {
    if (targetUserId) {
      const partnerId = parseInt(targetUserId);
      const existing = chats.find(c => c.user.id === partnerId);
      if (existing) {
        setSelectedUser(existing.user);
      } else {
        try {
          setLoadingMessages(true);
          const history = await messageService.getChatHistory(partnerId);
          if (history.length > 0) {
            const first = history[0];
            const partner = first.sender.id === user.id ? first.receiver : first.sender;
            setSelectedUser(partner);
            setMessages(history);
          } else {
            const roommates = await roommateService.searchRoommates();
            const rmAd = roommates.find(rm => rm.user.id === partnerId);
            if (rmAd) {
              setSelectedUser(rmAd.user);
            } else {
              setSelectedUser({ id: partnerId, name: `User #${partnerId}`, email: '' });
            }
          }
        } catch (error) {
          console.error("Error resolving target user:", error);
        } finally {
          setLoadingMessages(false);
        }
      }
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  useEffect(() => {
    if (chats.length > 0 || targetUserId) {
      initTargetUser();
    }
  }, [chats, targetUserId]);

  useEffect(() => {
    if (!selectedUser) return;
    
    fetchMessages(selectedUser.id);
    
    const interval = setInterval(() => {
      fetchMessages(selectedUser.id);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' && !attachedFile) return;

    setSending(true);
    let finalMessage = newMessage;
    if (attachedFile) {
      finalMessage += ` [Attached File: ${attachedFile.name}]`;
    }

    try {
      const sent = await messageService.sendMessage(selectedUser.id, finalMessage);
      setMessages([...messages, sent]);
      setNewMessage('');
      setAttachedFile(null);
      fetchChats();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const triggerAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  // Filter conversations based on search input
  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page-layout-new">
      {/* Left Sidebar: Conversations List */}
      <div className="messages-sidebar-new">
        <div className="sidebar-header-messages-new">
          <h3>Chats</h3>
          <div className="search-bar-messages-new">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="messages-contacts-list-new">
          {loadingChats ? (
            <div className="loading-placeholder-new">
              <Loader className="spin-animation" size={24} />
              <span>Loading chats...</span>
            </div>
          ) : filteredChats.length > 0 ? (
            filteredChats.map(chat => (
              <div 
                key={chat.user.id} 
                onClick={() => setSelectedUser(chat.user)}
                className={`contact-row-new ${selectedUser?.id === chat.user.id ? 'active' : ''}`}
              >
                <div className="contact-avatar-new-wrapper">
                  <img 
                    src={chat.user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                    alt={chat.user.name}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(chat.user.name.charAt(0));
                    }}
                  />
                  <span className={`status-dot-new ${chat.online ? 'online' : 'offline'}`}></span>
                </div>
                <div className="contact-info-new">
                  <div className="contact-name-row-new">
                    <h4>{chat.user.name}</h4>
                    <span className="contact-time-new">
                      {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-chats-placeholder-new">
              <span>No conversations found</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Area: Active Chat Area */}
      <div className="chat-workspace-new">
        {selectedUser ? (
          <>
            {/* Chat Window Header */}
            <div className="chat-header-new">
              <div className="chat-partner-avatar-new">
                <img 
                  src={selectedUser.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt={selectedUser.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=" + encodeURIComponent(selectedUser.name.charAt(0));
                  }}
                />
              </div>
              <div className="chat-partner-details-new">
                <h4>{selectedUser.name}</h4>
                <div className="chat-partner-status-row">
                  <span className={`status-text-dot ${chats.find(c => c.user.id === selectedUser.id)?.online ? 'online' : 'offline'}`}></span>
                  <span>{chats.find(c => c.user.id === selectedUser.id)?.online ? 'Active Now' : 'Offline'}</span>
                </div>
              </div>
            </div>

            {/* Scrollable Message History Area */}
            <div className="chat-flow-container-new">
              {loadingMessages ? (
                <div className="loading-placeholder-new">
                  <Loader className="spin-animation" size={24} />
                  <span>Loading messages...</span>
                </div>
              ) : (
                <>
                  {messages.map(msg => {
                    const isOwnMessage = msg.sender.id === user?.id || (msg.sender.id !== selectedUser.id && msg.sender.id !== 101 && msg.sender.id !== 102 && msg.sender.id !== 103);
                    return (
                      <div key={msg.id} className={`message-bubble-row-new ${isOwnMessage ? 'own' : 'partner'}`}>
                        <div className="message-bubble-new">
                          <p>{msg.message}</p>
                          <span className="message-timestamp-new">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Bottom Input bar */}
            <form onSubmit={handleSendMessage} className="chat-input-bar-new">
              <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange}
              />
              <button 
                type="button" 
                onClick={triggerAttachment} 
                className={`chat-attachment-btn-new ${attachedFile ? 'attached' : ''}`}
                title={attachedFile ? `Attached: ${attachedFile.name}` : "Attach file"}
              >
                <Paperclip size={20} />
              </button>
              
              <div className="input-wrapper-messages">
                <input 
                  type="text" 
                  placeholder={attachedFile ? `File attached: ${attachedFile.name} (Type a message to send)` : "Type a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={sending}
                />
                {attachedFile && (
                  <button type="button" onClick={() => setAttachedFile(null)} className="clear-attachment-btn">
                    ×
                  </button>
                )}
              </div>

              <button type="submit" disabled={sending || (newMessage.trim() === '' && !attachedFile)} className="chat-send-btn-new">
                {sending ? (
                  <Loader size={18} className="spin-animation" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected-new">
            <div className="bubble-chat-illustration-new">
              <UserIcon size={48} />
            </div>
            <h3>Select a Conversation</h3>
            <p>Choose an active chat from the sidebar or contact an owner/roommate directly to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
