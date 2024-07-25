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

const mailField = z.boolean().optional()

export const formSchemaUserEdit = z.object({
  name: nameField,
  email: emailField,
  phonenumber: phonenumberField,
  address: addressField,
  stack: stackField,
  MBTI: mbtiField,
  entries: entriesField,
  imageUrl: imageUrlField,
})

export const formSchemaSignUp = z.object({
  name: nameField,
  email: emailField,
  phonenumber: phonenumberField,
  use: useField,
  privacy: privacyField,
  mail: mailField,
})

export const formSchemaOptionalInfo = z.object({
  address: addressField,
  stack: stackField,
  MBTI: mbtiField,
  entries: entriesField,
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
