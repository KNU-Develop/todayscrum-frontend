import { z } from 'zod'

// 개별 필드 정의
const nameField = z.string().min(2, {
  message: '이름은 2글자 이상이어야 합니다.',
})

const emailField = z.string().email({ message: '유효한 이메일을 입력하세요.' })

const phonenumberField = z.string().refine(
  (value) => {
    const phoneNumber = value.replace(/-/g, '')
    return /^01[0-9]\d{7,8}$/.test(phoneNumber)
  },
  {
    message: '올바른 전화번호를 입력해주세요.',
  },
)

const addressField = z.string()

const stackField = z.string()

const mbtiField = z.string()

const entriesField = z.array(
  z.object({
    tool: z.string(),
    email: emailField,
  }),
)

const imageUrlField = z.string().optional()

const useField = z.boolean().refine((value) => value === true, {
  message: '이 항목을 체크해야 합니다.',
})

const privacyField = z.boolean().refine((value) => value === true, {
  message: '이 항목을 체크해야 합니다.',
})

const marketingField = z.boolean().optional()

const title = z.string().min(1, {
  message: 'Username must be at least 2 characters.',
})

const period = z.object({
  from: z.date(),
  to: z.date(),
})

const type = z.string()

const description = z.string()

const startDate = z.date()
const endDate = z.date().optional()

const visible = z.string().optional()

const projectId = z.string().nullable()

const inviteList = z
  .array(
    z.object({
      email: z.string().email(),
      id: z.number(),
      name: z.string(),
      state: z.string(),
    }),
  )
  .optional()

export const formSchemaUserEdit = z.object({
  name: nameField,
  email: emailField,
  contact: phonenumberField,
  location: addressField,
  stacks: stackField,
  mbti: mbtiField,
  entries: entriesField,
  imageUrl: imageUrlField,
})

export const formSchemaSignUp = z.object({
  name: nameField,
  email: emailField,
  contact: phonenumberField,
  use: useField,
  privacy: privacyField,
  marketing: marketingField,
})

export const formSchemaOptionalInfo = z.object({
  address: addressField,
  stack: stackField,
  MBTI: mbtiField,
  entries: entriesField,
})

export const formSchemaProject = z.object({
  title,
  period,
  description,
})

export const formEmailProject = z.object({
  email: emailField,
})

export const fromSchemaSchedule = z.object({
  type: type,
  title: title,
  content: description,
  period: period,
  visible: visible,
  projectId: projectId,
  inviteList: inviteList,
})

// export const formSchemaRepeatSchedule = z.object({
//   period: period,
//   repeat: repeatField,
//   cycle: cycleField,
//   day: repeatDay,
//   endDate: endDate,
// })

export const formSchemaCheckSchedule = z.object({
  title: title,
  description: description,
  startDate: startDate,
  endDate: endDate,
  visible: visible,
  projectId: projectId,
  inviteList: inviteList,
})

export const formatPhoneNumber = (value: string) => {
  if (!value) return value
  const phoneNumber = value.replace(/[^\d]/g, '')
  const phoneNumberLength = phoneNumber.length

  if (phoneNumberLength < 4) return phoneNumber
  if (phoneNumberLength < 8) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`
}

export type FormSchemas =
  | typeof formSchemaUserEdit
  | typeof formSchemaOptionalInfo
  | typeof formSchemaSignUp
