import api from './api';

export const messageService = {
  sendMessage: async (receiverId, messageText) => {
    const response = await api.post('/messages', { receiverId, message: messageText });
    return response.data;
  },
  getChatHistory: async (otherUserId) => {
    const response = await api.get(`/messages?otherUserId=${otherUserId}`);
    return response.data;
  },
  getRecentMessages: async () => {
    const response = await api.get('/messages');
    return response.data;
  }
};
