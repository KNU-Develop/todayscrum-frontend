import { authHandlers } from './auth'
import { projectHandlers } from './project'
import { userHandlers } from './user'
import { scheduleHandlers } from './schedule'

export const handlers = [...authHandlers, ...userHandlers, ...projectHandlers, ...scheduleHandlers]
