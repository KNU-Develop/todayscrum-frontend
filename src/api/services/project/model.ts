import { StringDecoder } from 'string_decoder'

export const enum ProjectInviteStatus {
  Invited = '전송',
  Acceped = '수락',
  Denied = '거절',
}
export const enum ProjectUserRole {
  Master = 'MASTER',
  Writer = 'WRITER',
  Owner = 'OWNER',
  Guest = 'GUEST',
}

export interface ProjectUserInfo {
  id: string
  imageUrl: string | undefined
  name: string
  email: string
  contact: string
  stackNames: string[]
  location: string
  tools: tooldto[] | []
  mbti: string
  role: ProjectUserRole
  color: string
  choice: ProjectInviteStatus
}
interface tooldto {
  toolName: string
  email: string
}

export interface ProjectInfo {
  id: string
  title: string
  overview: string
  users: ProjectUserInfo[]
  startDate: string
  endDate: string
  color: string
}

export interface ProjectListInfoResponse {
  code: string
  result: ProjectInfo[] | undefined
}

export interface ProjectInfoResponse {
  code: string
  result: ProjectInfo | undefined
}

export interface TeamInfoResponse {
  code: string
  result: TeamInfo[]
}

export interface TeamInfo {
  id: string
  name: string
  email: string
  choice: ProjectInviteStatus
  role: ProjectUserRole
  location: string
  mbti: string
  imageUrl: string
  color: string
  attend?: string
}

export interface InviteTeamDto {
  email: string
}

export interface DeleteTeamDto {
  email: string
}

export interface AddProjectDTO {
  title: string
  overview: string
  startDate: string
  endDate: string
  color: string
}

export interface EditProjectDTO {
  title: string
  overview: string
  startDate: string
  endDate: string
  color: string
}

export interface DefaultResponse {
  code: string
}
