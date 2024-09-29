import { BoardCategory, BoardProgress } from '@/api/services/board/model'
import { z } from 'zod'

const title = z.string().min(1, {
  message: 'Username must be at least 2 characters.',
})

const period = z.object({
  from: z.date(),
  to: z.date(),
})
const content = z.string()
const mastersId = z.array(z.number()).optional()
const progress = z.enum([
  BoardProgress.done,
  BoardProgress.problem,
  BoardProgress.progress,
])
const category = z.enum([BoardCategory.feadback, BoardCategory.issue])

export const fromCreateBoard = z.object({
  title: title,
  content: content,
  progress: progress,
  category: category,
  mastersId: mastersId,
})
