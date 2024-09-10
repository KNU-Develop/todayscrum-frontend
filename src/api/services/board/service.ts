import { QueryClient } from '@tanstack/react-query'
import { APIBuilder } from '@/api/lib/fetcher'
import { BoardDto, BoardResponse, InputBoard } from './model'

export const BoardService = {
  async boardListInfo(client: QueryClient, uid: string) {
    return APIBuilder.get(`/project/${uid}/board`)
      .withCredentials(client)
      .build()
      .call<BoardResponse<BoardDto[] | []>>()
  },

  async boardInfo(client: QueryClient, uid: string) {
    return APIBuilder.get(`/project/{projectId}/board/${uid}`)
      .withCredentials(client)
      .build()
      .call<BoardResponse<BoardDto>>()
  },

  async addBoard(client: QueryClient, uid: string, dto: InputBoard) {
    return APIBuilder.post(`/project/${uid}/board`)
      .withCredentials(client)
      .build()
      .call<BoardResponse<string>>({ body: JSON.stringify(dto) })
  },

  async updateBoard(client: QueryClient, dto: InputBoard) {
    return APIBuilder.put(`/project/{projectId}/board/${dto.id}`)
      .withCredentials(client)
      .build()
      .call<BoardResponse<null>>({ body: JSON.stringify(dto) })
  },

  async deleteBoard(client: QueryClient, uid: string) {
    return APIBuilder.delete(`/project/{projectId}/board/${uid}`)
      .withCredentials(client)
      .build()
      .call<BoardResponse<null>>()
  },
}
