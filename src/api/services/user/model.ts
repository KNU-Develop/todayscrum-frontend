export enum UserStatus {
  LOGIN = 'LOGIN',
  JOIN = 'JOIN',
  WITHDRAW = 'WITHDRAW',
}

export const mbtiOptions = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
].map((value) => ({ value, label: value }))

export const toolList = ['Github', 'Figma', 'Notion']

export interface UserInfoResponse {
  code: string
  result: {
    id: string
    email: string
    status: UserStatus
    onboardingCompleted: boolean
    name: string
    contact: string
    location: string
    tools: [{ toolName: string; email: string }]
    stackNames: string[]
    mbti: string
    imageUrl: string
    color: string
  }
}

export interface UserSignUpDTO {
  name: string
  email: string
  contact: string
  requiredTermsAgree: boolean
  marketingEmailOptIn: boolean
}

export interface UserOptionalInfoDTO {
  tools: {}
  location: string
  stacks: string[]
  mbti: string | null
}

export interface EditUserInfoDTO {
  email: string
  name: string
  contact: string
  location: string
  tools: {}
  stacks: string[]
  mbti: string | null
  imageUrl: string
}

export interface EditUserColorDTO {
  color: string
}
export interface DefaultResponse {
  code: string
}
