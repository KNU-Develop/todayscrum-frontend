import {
  MutationOptions,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { CustomQueryOptions } from '@/api/type'
import { BoardService } from './service'
import { BoardDto, BoardResponse, InputBoard } from './model'

export const BoardOptions = {
  BoardListInfo: (client: QueryClient, uid: string) => ({
    queryKey: ['boardList', uid],
    queryFn: () => BoardService.boardListInfo(client, uid),
  }),
  BoardInfo: (client: QueryClient, uid: string) => ({
    queryKey: ['board', uid],
    queryFn: () => BoardService.boardInfo(client, uid),
  }),
  AddBoard: (client: QueryClient, uid: string) => ({
    mutationFn: (dto: InputBoard) => BoardService.addBoard(client, uid, dto),
  }),
  DeleteBoard: (client: QueryClient) => ({
    mutationFn: (uid: string) => BoardService.deleteBoard(client, uid),
  }),
  UpdateBoard: (client: QueryClient) => ({
    mutationFn: (dto: InputBoard) => BoardService.updateBoard(client, dto),
  }),
}

export const useBoardListQuery = (
  uid: string,
  options: CustomQueryOptions<BoardResponse<BoardDto[]>> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<BoardResponse<BoardDto[]>>({
    ...BoardOptions.BoardListInfo(queryClient, uid),
    ...options,
  })
}
export const useBoardQuery = (
  uid: string,
  options: CustomQueryOptions<BoardResponse<BoardDto>> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<BoardResponse<BoardDto>>({
    ...BoardOptions.BoardInfo(queryClient, uid),
    ...options,
  })
}
export const useAddBoardMutation = (
  uid: string,
  options: MutationOptions<BoardResponse<string>, Error, InputBoard> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<BoardResponse<string>, Error, InputBoard>({
    ...BoardOptions.AddBoard(queryClient, uid),
    ...options,
  })
}
export const useDeleteBoardMutation = (
  options: MutationOptions<BoardResponse<null>, Error, string> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<BoardResponse<null>, Error, string>({
    ...BoardOptions.DeleteBoard(queryClient),
    ...options,
  })
}
export const useUpdateBoardMutation = (
  options: MutationOptions<BoardResponse<null>, Error, InputBoard> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<BoardResponse<null>, Error, InputBoard>({
    ...BoardOptions.UpdateBoard(queryClient),
    ...options,
  })
}
