import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import {
  ProjectInfoResponse,
  TeamInfoResponse,
  DefaultResponse,
  AddProjectDTO,
  EditProjectDTO,
  InviteTeamDto,
  DeleteTeamDto,
  ProjectListInfoResponse,
} from './model'

export const projectService = {
  async projectInfo(client: QueryClient) {
    return APIBuilder.get('/project')
      .withCredentials(client)
      .build()
      .call<ProjectListInfoResponse>()
  },

  async oneProjectInfo(client: QueryClient, uid: string) {
    return APIBuilder.get(`/project/${uid}`)
      .withCredentials(client)
      .build()
      .call<ProjectInfoResponse>()
  },

  async addProjectInfo(client: QueryClient, dto: AddProjectDTO) {
    return APIBuilder.post('/project')
      .withCredentials(client)
      .build()
      .call<DefaultResponse>({ body: JSON.stringify(dto) })
  },

  async editProjectInfo(client: QueryClient, dto: EditProjectDTO, uid: string) {
    return APIBuilder.put(`/project/${uid}`)
      .withCredentials(client)
      .build()
      .call<DefaultResponse>({ body: JSON.stringify(dto) })
  },

  async deleteProjectInfo(client: QueryClient, uid: string) {
    return APIBuilder.delete(`/project/${uid}`)
      .withCredentials(client)
      .build()
      .call<DefaultResponse>()
  },

  async teamInfo(client: QueryClient, uid: string) {
    return APIBuilder.get(`/project/${uid}/users`)
      .withCredentials(client)
      .build()
      .call<TeamInfoResponse>()
  },

  async inviteTeamInfo(client: QueryClient, uid: string, dto: InviteTeamDto) {
    return APIBuilder.post(`/project/${uid}`)
      .withCredentials(client)
      .build()
      .call<DefaultResponse>({ body: JSON.stringify(dto) })
  },

  async deleteTeamInfo(client: QueryClient, uid: string, dto: DeleteTeamDto) {
    return APIBuilder.delete(`/project/${uid}/user`)
      .withCredentials(client)
      .build()
      .call<DefaultResponse>({ body: JSON.stringify(dto) })
  },
  async editProjectColor(client: QueryClient, dto: EditProjectDTO, uid: string) {
    return APIBuilder.put(`/project/${uid}`)
      .withCredentials(client)
      .build()
      .call<DefaultResponse>({ body: JSON.stringify(dto) })
  },
}
