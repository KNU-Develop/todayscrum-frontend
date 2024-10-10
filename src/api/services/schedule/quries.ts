import {
  MutationOptions,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { scheduleService } from './service'
import {
  AddScheduleDTO,
  DefaultResponse,
  DeleteScheduleType,
  EditScheduleDTO,
  ScheduleDetailResponse,
  ScheduleListResponse,
} from './model'
import { CustomQueryOptions } from '@/api/type'

export const scheduleOptions = {
  getScheduleList: (
    client: QueryClient,
    startDate: string,
    endDate: string,
  ) => ({
    queryKey: ['schedules', startDate, endDate],
    queryFn: () => scheduleService.getScheduleList(client, startDate, endDate),
  }),
  getScheduleDetail: (client: QueryClient, id: string) => ({
    queryKey: ['schedule', id],
    queryFn: () => scheduleService.getScheduleDetail(client, id),
  }),
  useAddSchedule: (client: QueryClient, dto: AddScheduleDTO) => ({
    mutationFn: () => scheduleService.addSchedule(client, dto),
  }),
  useEditSchedule: (client: QueryClient, id: string) => ({
    mutationFn: (dto: EditScheduleDTO) =>
      scheduleService.editSchedule(client, id, dto),
  }),
  useDeleteSchedule: (
    client: QueryClient,
    id: string,
    type: DeleteScheduleType,
  ) => ({
    mutationFn: () => scheduleService.deleteSchedule(client, id, type),
  }),
}

export const useScheduleListQuery = (
  startDate: string,
  endDate: string,
  options: CustomQueryOptions<ScheduleListResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ScheduleListResponse>({
    ...scheduleOptions.getScheduleList(queryClient, startDate, endDate),
    ...options,
  })
}

export const useScheduleDetailQuery = (
  id: string,
  options: CustomQueryOptions<ScheduleDetailResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ScheduleDetailResponse>({
    ...scheduleOptions.getScheduleDetail(queryClient, id),
    ...options,
  })
}

export const useAddScheduleMutation = (
  dto: AddScheduleDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...scheduleOptions.useAddSchedule(queryClient, dto),
    ...options,
  })
}

export const useEditScheduleMutation = (
  id: string,
  options: MutationOptions<DefaultResponse, Error, EditScheduleDTO> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<DefaultResponse, Error, EditScheduleDTO>({
    ...scheduleOptions.useEditSchedule(queryClient, id),
    ...options,
  })
}

export const useDeleteScheduleMutation = (
  id: string,
  deleteType: DeleteScheduleType,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...scheduleOptions.useDeleteSchedule(queryClient, id, deleteType),
    ...options,
  })
}
