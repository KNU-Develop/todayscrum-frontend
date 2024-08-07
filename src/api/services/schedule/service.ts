import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import {
  AddScheduleDTO,
  DefaultResponse,
  DeleteScheduleResponse,
  DeleteScheduleType,
  EditScheduleDTO,
  ScheduleDetailResponse,
  ScheduleListResponse,
} from './model'

export const scheduleService = {
  async getScheduleList(
    client: QueryClient,
    startDate: string,
    endDate: string,
  ) {
    return (
      APIBuilder.get(`/schedules?startDate=${startDate}&endDate=${endDate}`)
        // .withCredentials(client)
        .build()
        .call<ScheduleListResponse>()
    )
  },

  async getScheduleDtail(client: QueryClient, id: string) {
    return (
      APIBuilder.get(`/schedule/${id}`)
        // .withCredentials(client)
        .build()
        .call<ScheduleDetailResponse>()
    )
  },

  async addSchedule(client: QueryClient, dto: AddScheduleDTO) {
    return (
      APIBuilder.post('/schedule')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },

  async editSchedule(client: QueryClient, id: string, dto: EditScheduleDTO) {
    return (
      APIBuilder.patch('/schedule/${id}')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },

  async deleteSchedule(
    client: QueryClient,
    id: string,
    deleteType: DeleteScheduleType,
  ) {
    return (
      APIBuilder.delete(`/schedule/${id}?type=${deleteType}`)
        // .withCredentials(client)
        .build()
        .call<DeleteScheduleResponse>()
    )
  },
}
