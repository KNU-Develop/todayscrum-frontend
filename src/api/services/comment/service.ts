import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import { Comment, CommentResponse, InputComment } from './model'
import { json } from 'stream/consumers'

export const CommentService = {
  async commentListInfo(client: QueryClient, uid: string) {
    return APIBuilder.get(`/project/{projectId}/board/${uid}/comment`)
      .withCredentials(client)
      .build()
      .call<CommentResponse<Comment[]>>()
  },
  async addComment(client: QueryClient, uid: string, dto: InputComment) {
    return APIBuilder.post(`/project/{projectId}/board/${uid}/comment`)
      .withCredentials(client)
      .build()
      .call<CommentResponse<string>>({ body: JSON.stringify(dto) })
  },
  async updateComment(client: QueryClient, uid: string, dto: InputComment) {
    return APIBuilder.put(`/project/{projectId}/board/{boardId}/comment/${uid}`)
      .withCredentials(client)
      .build()
      .call<CommentResponse<null>>({ body: JSON.stringify(dto) })
  },
  async deleteComment(client: QueryClient, uid: string) {
    return APIBuilder.delete(
      `/project/{projectId}/board/{boardId}/comment/${uid}`,
    )
      .withCredentials(client)
      .build()
      .call<CommentResponse<null>>()
  },
}
