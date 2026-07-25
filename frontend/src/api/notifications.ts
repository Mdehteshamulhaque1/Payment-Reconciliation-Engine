import { api } from './client'
import type { Notification, NotificationListResponse } from '@/types'

export const notificationsApi = {
  list: (params?: { page?: number; size?: number }) =>
    api.get<NotificationListResponse>('/notifications', { params: params as Record<string, number> }),
  markRead: (id: number) => api.put<Notification>(`/notifications/${id}/read`),
  markAllRead: () => api.put<{ message: string }>('/notifications/read-all'),
}
