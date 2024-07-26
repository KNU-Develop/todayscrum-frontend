import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import { AddScheduleDTO, DefaultResponse, ScheduleResponse } from './model'

export const scheduleService = {
  async getSchedules(client: QueryClient) {
    return (
      APIBuilder.get('/schedule/list')
        // .withCredentials(client)
        .build()
        .call<ScheduleResponse>()
    )
  },

  async addSchedule(client: QueryClient, dto: AddScheduleDTO) {
    return (
      APIBuilder.post('/schedule/list')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },
}
