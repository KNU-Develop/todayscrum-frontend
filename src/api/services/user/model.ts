export enum UserStatus {
  SocialLoginCompleted = 'SOCIAL_LOGIN_COMPLETED',
  Registered = 'REGISTERED',
  Withdrawn = 'WITHDRAWN',
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
    phone: string
    address: string
    tool: {}
    stack: string[]
    MBTI: string
    imageUrl: string
  }
}

export interface UserSignUpDTO {
  name: string
  phone: string
  requiredTermsAgree: boolean
  marketingEmailOptIn: boolean
}

export interface UserOptionalInfoDTO {
  tool: {}
  address: string
  stack: string[]
  MBTI: string
}

export interface EditUserInfoDTO {
  email: string
  name: string
  phone: string
  address: string
  tool: {}
  stack: string[]
  MBTI: string
  imageUrl: string
}

export interface DefaultResponse {
  code: string
}
