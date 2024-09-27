export interface RecommedMeetingDto {
  projectId: string
}

export interface RecommedMeetingTime {
  startTime: string
  endTime: string
  attendeeCount: number
}

export interface RecommedMeetingResponse {
  code: string
  message: string
  result: RecommedMeetingTime[]
}
