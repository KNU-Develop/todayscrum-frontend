import {
  MutationOptions,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { scheduleService } from './service'
import { AddScheduleDTO, ScheduleResponse } from './model'
import { CustomQueryOptions } from '@/api/type'

export const scheduleOptions = {
  getSchedules: (client: QueryClient) => ({
    queryKey: ['schedule'],
    queryFn: () => scheduleService.getSchedules(client),
  }),
  addSchedule: (client: QueryClient, dto: AddScheduleDTO) => ({
    mutationFn: () => scheduleService.addSchedule(client, dto),
  }),
}

export const useSchedulesQuery = (
  options: CustomQueryOptions<ScheduleResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ScheduleResponse>({
    ...scheduleOptions.getSchedules(queryClient),
    ...options,
  })
}

export const useAddScheduleMutation = (
  dto: AddScheduleDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...scheduleOptions.addSchedule(queryClient, dto),
    ...options,
  })
}
