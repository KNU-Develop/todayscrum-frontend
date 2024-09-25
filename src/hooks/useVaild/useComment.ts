import { BoardCategory, BoardProgress } from '@/api/services/board/model'
import { z } from 'zod'

const description = z.string().min(1, {
  message: 'Username must be at least 2 characters.',
})
const mastersId = z.array(z.string()).optional()

export const fromCreateComment = z.object({
  description: description,
  mastersId: mastersId,
})
