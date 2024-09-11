import {
  MutationOptions,
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { CommentService } from './service'
import { Comment, CommentResponse, InputComment } from './model'
import { CustomQueryOptions } from '@/api/type'

const CommentQueryOptions = {
  commentList: (client: QueryClient, uid: string) => ({
    queryKey: ['commentList', uid],
    queryFn: () => CommentService.commentListInfo(client, uid),
  }),
  addComment: (client: QueryClient, uid: string) => ({
    mutationFn: (dto: InputComment) =>
      CommentService.addComment(client, uid, dto),
  }),
  updateComment: (client: QueryClient, uid: string) => ({
    mutationFn: (dto: InputComment) =>
      CommentService.updateComment(client, uid, dto),
  }),
  deleteComment: (client: QueryClient) => ({
    mutationFn: (uid: string) => CommentService.deleteComment(client, uid),
  }),
}

export const useCommentListQuery = (
  uid: string,
  options: CustomQueryOptions<CommentResponse<Comment[]>> = {},
) => {
  const queryClient = useQueryClient()

  return useQuery<CommentResponse<Comment[]>>({
    ...CommentQueryOptions.commentList(queryClient, uid),
    ...options,
  })
}
export const useAddCommentMutation = (
  uid: string,
  options: MutationOptions<CommentResponse<string>, Error, InputComment> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<CommentResponse<string>, Error, InputComment>({
    ...CommentQueryOptions.addComment(queryClient, uid),
    ...options,
  })
}
export const useUpdateCommentMutation = (
  uid: string,
  options: MutationOptions<CommentResponse<null>, Error, InputComment> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<CommentResponse<null>, Error, InputComment>({
    ...CommentQueryOptions.updateComment(queryClient, uid),
    ...options,
  })
}
export const useDeleteCommentMutation = (
  options: MutationOptions<CommentResponse<null>, Error, string> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation<CommentResponse<null>, Error, string>({
    ...CommentQueryOptions.deleteComment(queryClient),
    ...options,
  })
}
