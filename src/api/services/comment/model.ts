export interface Comment {
  id?: string
  description: string
  user: CommentUser
  createdAt: string
  masterId?: number[] | []
}
export interface CommentUser {
  name: string
  imageUrl: string
}
export interface InputComment {
  description: string
  masterId?: number[] | []
}

export interface CommentResponse<T> {
  code: number
  message: string
  result: T | null
}
