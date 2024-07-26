export const enum ProjectInviteStatus {
  Invited = '초대완료',
  Acceped = '수락',
  Denied = '거절',
}

interface ProjectUserInfo {
  uid: string
  avatar: string | undefined
  name: string
}

export interface ProjectInfo {
  uid: string
  title: string
  subTitle: string
  user: ProjectUserInfo[]
  startDate: string
  endDate: string
}

export interface ProjectInfoResponse {
  code: string
  result: ProjectInfo[]
}
