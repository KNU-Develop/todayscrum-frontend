import { http, HttpResponse } from 'msw'
import { AddScheduleDTO, DefaultResponse } from '@/api/services/schedule/model'

export const scheduleHandlers = [
  http.get(`${process.env.NEXT_PUBLIC_API_URL}/schedule/list`, () => {
    return HttpResponse.json({
      code: 'SUCCESS',
      result: {
        2024: {
          7: [
            {
              date: 14,
              time: '하루종일',
              description: '데모데이 준비',
              project: 'A',
            },
            {
              date: 14,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 20,
              time: '오후 4시',
              description: '일정이름입니다',
              project: 'A',
            },
            {
              date: 28,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 28,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 29,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
          ],
          8: [
            {
              date: 1,
              time: '하루종일',
              description: '데모데이 준비',
              project: 'A',
            },
            {
              date: 4,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 11,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 18,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
          ],
          10: [
            {
              date: 1,
              time: '하루종일',
              description: '데모데이 준비',
              project: 'A',
            },
            {
              date: 4,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 11,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 18,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
          ],
          12: [
            {
              date: 1,
              time: '하루종일',
              description: '데모데이 준비',
              project: 'A',
            },
            {
              date: 1,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 11,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
            {
              date: 18,
              time: '오후 4시 ~ 5시',
              description: '일정이름입니다',
              project: 'B',
            },
          ],
        },
        2025: {
          1: [
            {
              date: 1,
              time: '하루종일',
              description: '새해 첫날',
              project: 'C',
            },
          ],
        },
      },
    })
  }),

  http.post(`${process.env.NEXT_PUBLIC_API_URL}/schedule/list`, async (req) => {
    // const dto: AddScheduleDTO = await req.json()
    // const { year, month, schedule } = dto

    // if (!schedules[year]) {
    //   schedules[year] = {}
    // }

    // if (!schedules[year][month]) {
    //   schedules[year][month] = []
    // }

    // schedules[year][month].push(schedule)

    return HttpResponse.json<DefaultResponse>({
      code: 'SUCCESS',
    })
  }),
]
