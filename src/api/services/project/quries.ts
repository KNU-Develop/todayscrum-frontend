import { CustomQueryOptions } from '@/api/type'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { ProjectInfoResponse } from './model'
import { projectService } from './service'

export const projectOptions = {
  projectInfo: (client: QueryClient) => ({
    queryKey: ['projectList'],
    queryFn: () => projectService.projectInfo(client),
  }),
}

export const useProjectInfoQuery = (
  options: CustomQueryOptions<ProjectInfoResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ProjectInfoResponse>({
    ...projectOptions.projectInfo(queryClient),
    ...options,
  })
}
