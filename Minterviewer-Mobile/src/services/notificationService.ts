import { BaseService } from './baseService';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  createdAt?: any;
  redirectTo?: string;
}

export class NotificationService extends BaseService {
  async getNotifications(userId: string): Promise<{ notifications: Notification[] }> {
    return this.get(`/api/notifications/${userId}`);
  }

  async markAsRead(notificationId: string): Promise<{ ok: boolean }> {
    return this.put(`/api/notifications/${notificationId}/read`);
  }

  async markAllAsRead(userId: string): Promise<{ ok: boolean }> {
    return this.put(`/api/notifications/${userId}/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<{ ok: boolean }> {
    return this.delete(`/api/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService();
