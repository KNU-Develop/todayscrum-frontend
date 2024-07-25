import { QueryClient } from '@tanstack/react-query'

import { APIBuilder } from '../../lib/fetcher'

import {
  DefaultResponse,
  EditUserInfoDTO,
  UserInfoResponse,
  UserOptionalInfoDTO,
  UserSignUpDTO,
} from './model'

export const userService = {
  async userInfo(client: QueryClient) {
    return (
      APIBuilder.get('/user/info')
        // .withCredentials(client)
        .build()
        .call<UserInfoResponse>()
    )
  },
  async userSignUp(client: QueryClient, dto: UserSignUpDTO) {
    return (
      APIBuilder.post('/user/signup')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },
  async userOptionalInfo(client: QueryClient, dto: UserOptionalInfoDTO) {
    return (
      APIBuilder.post('/user/optional')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },
  async userEdit(client: QueryClient, dto: EditUserInfoDTO) {
    return (
      APIBuilder.post('/user/info')
        // .withCredentials(client)
        .build()
        .call<DefaultResponse>({ body: JSON.stringify(dto) })
    )
  },
}
