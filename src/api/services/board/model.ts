import { Comment } from '../comment/model'

export const enum BoardCategory {
  issue = '이슈',
  feadback = '피드백',
}
export const enum BoardProgress {
  done = '완료',
  progress = '진행중',
  problem = '긴급',
}
export interface InputBoard {
  id?: string
  title: string
  content: string
  category: BoardCategory
  progress: BoardProgress
  mastersId: number[] | []
}
export interface BoardDto {
  id: string
  title: string
  content: string
  userName: string
  category: BoardCategory
  progress: BoardProgress
  masters: MasterDto[] | []
  createdAt: string
  comments: Comment[] | []
}
export interface MasterDto {
  id: number
  name: string
  email: string
  logo: string
}

export interface BoardResponse<T> {
  code: number
  result: T | [] | null
}

export interface BoardProps {
  items: BoardDto[]
  SelectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
}
