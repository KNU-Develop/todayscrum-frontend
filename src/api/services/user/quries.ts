import { CustomQueryOptions } from '@/api/type'
import {
  MutationOptions,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  EditUserInfoDTO,
  UserInfoResponse,
  UserOptionalInfoDTO,
  UserSignUpDTO,
} from './model'
import { userService } from './service'

export const userOptions = {
  userInfo: (client: QueryClient) => ({
    queryKey: ['user'],
    queryFn: () => userService.userInfo(client),
  }),
  useSignUp: (client: QueryClient, dto: UserSignUpDTO) => ({
    mutationFn: () => userService.userSignUp(client, dto),
  }),
  useOptional: (client: QueryClient, dto: UserOptionalInfoDTO) => ({
    mutationFn: () => userService.userOptionalInfo(client, dto),
  }),
  userEdit: (client: QueryClient, dto: EditUserInfoDTO) => ({
    mutationFn: () => userService.userEdit(client, dto),
  }),
}

export const useUserInfoQuery = (
  options: CustomQueryOptions<UserInfoResponse> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<UserInfoResponse>({
    ...userOptions.userInfo(queryClient),
    ...options,
  })
}

export const useUserSignUpMutation = (
  dto: UserSignUpDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...userOptions.useSignUp(queryClient, dto),
    ...options,
  })
}

export const useUserOptionalMutation = (
  dto: UserOptionalInfoDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...userOptions.useOptional(queryClient, dto),
    ...options,
  })
}

export const useEditUserMutation = (
  dto: EditUserInfoDTO,
  options: MutationOptions = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    ...userOptions.userEdit(queryClient, dto),
    ...options,
  })
}
