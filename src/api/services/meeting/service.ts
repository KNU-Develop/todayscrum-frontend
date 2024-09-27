import { QueryClient } from '@tanstack/react-query'
import { RecommedMeetingDto, RecommedMeetingResponse } from './model'
import { APIBuilder } from '@/api/lib/fetcher'

export const meetingService = {
  async recommedMeetingTimes(client: QueryClient, dto: RecommedMeetingDto) {
    return APIBuilder.post('/recommend/three-days')
      .withCredentials(client)
      .build()
      .call<RecommedMeetingResponse>({ body: JSON.stringify(dto) })
  },
}
