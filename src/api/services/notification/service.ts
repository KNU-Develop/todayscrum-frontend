import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import { InputNotification, Notification, NotificationResponse } from './model'

export const NotificationService = {
  async notificationListInfo(client: QueryClient) {
    return APIBuilder.get('/notice')
      .withCredentials(client)
      .build()
      .call<NotificationResponse<Notification[]>>()
  },
  async notificationPost(
    client: QueryClient,
    uid: string,
    dto: InputNotification,
  ) {
    return APIBuilder.post(`/notice/${uid}`)
      .withCredentials(client)
      .build()
      .call<NotificationResponse<null>>({ body: JSON.stringify(dto) })
  },
}
