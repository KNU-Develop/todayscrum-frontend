import { authHandlers } from './auth'
import { userHandlers } from './user'
import { scheduleHandlers } from './schedule'

export const handlers = [...authHandlers, ...userHandlers, ...scheduleHandlers]
