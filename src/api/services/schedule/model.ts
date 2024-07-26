export interface Schedule {
  date: number
  time: string
  description: string
  project: string
  isAllday?: boolean
}

export interface Schedules {
  [year: number]: {
    [month: number]: Schedule[]
  }
}

export interface ScheduleResponse {
  code: string
  result: Schedules
}

export interface AddScheduleDTO {
  year: number
  month: number
  schedule: Schedule
}

export interface DefaultResponse {
  code: string
}
