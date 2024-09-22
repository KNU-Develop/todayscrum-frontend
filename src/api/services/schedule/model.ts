export enum ScheduleVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export enum DeleteScheduleType {
  THIS = 'THIS',
  BEFORE = 'BEFORE',
  ALL = 'ALL',
}

export interface ScheduleInfo {
  id: string
  title: string
  startDate: string
  endDate: string
  visible: ScheduleVisibility
  projectId: string 
  inviteList: string[]
}

// export interface RepeatInfo {
//   gap: number,
//   cycleType: 'DAY'|'WEEK'|'MONTH'|'YEAR',
//   days?: string[],
//   cnt: number,
// }

export interface ScheduleDetailResponse {
  code: number
  msg: string
  result: {
    title: string
    content: string
    visible: ScheduleVisibility
    startDate: string
    endDate: string
    // repeat?: RepeatInfo,
    projectId: string
    inviteList: string[]
  }
}
export interface ScheduleListResponse {
  code: number
  result: ScheduleInfo[]
}

export interface AddScheduleDTO {
  title: string
  content: string
  visible: ScheduleVisibility
  startDate: string
  endDate: string
  // repeat?: RepeatInfo,
  projectId: string | null
  inviteList: string[]
}

export interface EditScheduleDTO {
  title: string
  content: string
  visible: ScheduleVisibility
  startDate: string
  endDate: string
  // repeat?: RepeatInfo;
  projectId: string | null
  inviteList: string[]
}

export interface DeleteScheduleResponse {
  code: number
  message: string
  data: null
}

export interface DefaultResponse {
  code: string
}
