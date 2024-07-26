import { APIBuilder } from '@/api/lib/fetcher'
import { QueryClient } from '@tanstack/react-query'
import { ProjectInfoResponse } from './model'

export const projectService = {
  async projectInfo(client: QueryClient) {
    return (
      APIBuilder.get('/project/info')
        // .withCredentials(client)
        .build()
        .call<ProjectInfoResponse>()
    )
  },
}
