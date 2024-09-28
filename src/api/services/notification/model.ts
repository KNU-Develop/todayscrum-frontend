import { ProjectInviteStatus } from '../project/model'

export interface Member {
  id: number
  name: string
  imageUrl: string
  email: string
}
export enum NotificationType {
  Comment = '댓글', // 댓글 알림
  Mention = '멘션', // 게시글 언급 알림
  EventInvite = 'EVENT_INVITE', // 일정 초대 알림
  ProjectInvite = '초대', // 프로젝트 초대 알림
  ProjectExit = 'PROJECT_EXIT', // 프로젝트 탈퇴 알림
  MeetingReminder = 'MEETING_REMINDER', // 회의 시작 알림
}
export interface Notification {
  id: number
  type: NotificationType
  title: string // 알림 내용
  read: boolean // 읽음 여부
  createdAt: Date // 알림 시간
  choice: ProjectInviteStatus
  originTable: string
  originId: string
}
export interface NotificationResponse<T> {
  code: number
  message: string
  result: T | []
}
export interface InputNotification {
  id?: number
  read: boolean
  choice?: ProjectInviteStatus
}
