import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Notification } from '../types';
import toast from 'react-hot-toast';

export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', []);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only 50 notifications
    
    // Show toast notification
    toast(notification.message, {
      icon: getNotificationIcon(notification.type),
      duration: 4000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}

function getNotificationIcon(type: Notification['type']): string {
  switch (type) {
    case 'achievement': return '🏆';
    case 'reminder': return '⏰';
    case 'insight': return '💡';
    case 'social': return '👥';
    case 'system': return '⚙️';
    default: return '📢';
  }
}