import {
  MutationOptions,
  QueryCache,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { CustomQueryOptions } from '@/api/type'
import { NotificationService } from './service'
import { InputNotification, Notification, NotificationResponse } from './model'

export const NotificationOptions = {
  NotificationList: (client: QueryClient) => ({
    queryKey: ['notificationList'],
    queryFn: () => NotificationService.notificationListInfo(client),
  }),
  NotificationPost: (client: QueryClient) => ({
    mutationFn: (dto: InputNotification) =>
      NotificationService.notificationPost(client, dto.id || 0, dto),
  }),
}
export const useNotificationListQuery = (
  options: CustomQueryOptions<NotificationResponse<Notification[]>> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<NotificationResponse<Notification[]>>({
    ...NotificationOptions.NotificationList(queryClient),
    ...options,
  })
}
export const useNotificationPost = (
  options: MutationOptions<
    NotificationResponse<null>,
    Error,
    InputNotification
  > = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<NotificationResponse<null>, Error, InputNotification>({
    ...NotificationOptions.NotificationPost(queryClient),
    ...options,
  })
}
