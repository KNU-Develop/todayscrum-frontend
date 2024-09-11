import { CustomQueryOptions } from '@/api/type'
import {
  MutationOptions,
  QueryClient,
  useQuery,
  useQueryClient,
  useMutation,
} from '@tanstack/react-query'
import {
  ProjectInfoResponse,
  TeamInfoResponse,
  AddProjectDTO,
  EditProjectDTO,
  InviteTeamDto,
  DeleteTeamDto,
  ProjectListInfoResponse,
  DefaultResponse,
} from './model'
import { projectService } from './service'

export const {
  addProjectInfo,
  deleteProjectInfo,
  deleteTeamInfo,
  editProjectInfo,
  inviteTeamInfo,
  projectInfo,
  oneProjectInfo,
  teamInfo,
} = {
  projectInfo: (client: QueryClient) => ({
    queryKey: ['projectList'],
    queryFn: () => projectService.projectInfo(client),
  }),
  oneProjectInfo: (client: QueryClient, uid: string) => ({
    queryKey: ['project', uid],
    queryFn: () => projectService.oneProjectInfo(client, uid),
  }),
  teamInfo: (client: QueryClient, uid: string) => ({
    queryKey: ['teamList', uid],
    queryFn: () => projectService.teamInfo(client, uid),
  }),
  addProjectInfo: (client: QueryClient, dto: AddProjectDTO) => ({
    mutationFn: () => projectService.addProjectInfo(client, dto),
  }),
  editProjectInfo: (client: QueryClient, dto: EditProjectDTO, uid: string) => ({
    mutationFn: () => projectService.editProjectInfo(client, dto, uid),
  }),
  deleteProjectInfo: (client: QueryClient, uid: string) => ({
    mutationFn: () => projectService.deleteProjectInfo(client, uid),
  }),
  inviteTeamInfo: (client: QueryClient, uid: string, dto: InviteTeamDto) => ({
    mutationFn: () => projectService.inviteTeamInfo(client, uid, dto),
  }),
  deleteTeamInfo: (client: QueryClient, uid: string) => ({
    mutationFn: (dto: DeleteTeamDto) =>
      projectService.deleteTeamInfo(client, uid, dto),
  }),
}

export const useProjectInfoQuery = (
  options: CustomQueryOptions<ProjectListInfoResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ProjectListInfoResponse>({
    ...projectInfo(queryClient),
    ...options,
  })
}
export const useOneProjectInfoQuery = (
  uid: string,
  options: CustomQueryOptions<ProjectInfoResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<ProjectInfoResponse>({
    ...oneProjectInfo(queryClient, uid),
    ...options,
  })
}

export const useTeamInfoQuery = (
  uid: string,
  options: CustomQueryOptions<TeamInfoResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<TeamInfoResponse>({
    ...teamInfo(queryClient, uid),
    ...options,
  })
}

export const useInviteTeamInfo = (
  dto: InviteTeamDto,
  uid: string,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...inviteTeamInfo(queryClient, uid, dto),
    ...options,
  })
}

export const useAddProjectInfo = (
  dto: AddProjectDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...addProjectInfo(queryClient, dto),
    ...options,
  })
}

export const useEditProjectInfo = (
  dto: EditProjectDTO,
  uid: string,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...editProjectInfo(queryClient, dto, uid),
    ...options,
  })
}

export const useDeleteProjectInfo = (
  uid: string,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...deleteProjectInfo(queryClient, uid),
    ...options,
  })
}

export const useDeleteTeamInfo = (
  uid: string,
  options: MutationOptions<DefaultResponse, Error, DeleteTeamDto> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...deleteTeamInfo(queryClient, uid),
    ...options,
  })
}
