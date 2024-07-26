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
              time: '',
              description: '데모데이 준비',
              project: 'A',
              isAllday: true,
            },
            {
              date: 14,
              time: '오후 4:15 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 20,
              time: '오후 4:00',
              description: '일정이름입니다',
              project: 'A',
              isAllday: false,
            },
            {
              date: 28,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 28,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 29,
              time: '오후 4:25 ~ 5:30',
              description: '일정이름입니다',
              project: 'C',
              isAllday: false,
            },
          ],
          8: [
            {
              date: 1,
              time: '',
              description: '데모데이 준비',
              project: 'A',
              isAllday: true,
            },
            {
              date: 4,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'C',
              isAllday: false,
            },
            {
              date: 11,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 18,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
          ],
          10: [
            {
              date: 1,
              time: '',
              description: '데모데이 준비',
              project: 'A',
              isAllday: true,
            },
            {
              date: 4,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 11,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 18,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
          ],
          12: [
            {
              date: 1,
              time: '',
              description: '데모데이 준비',
              project: 'A',
              isAllday: true,
            },
            {
              date: 1,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 11,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
            {
              date: 18,
              time: '오후 4:00 ~ 5:00',
              description: '일정이름입니다',
              project: 'B',
              isAllday: false,
            },
          ],
        },
        2025: {
          1: [
            {
              date: 1,
              time: '',
              description: '새해 첫날',
              project: 'C',
              isAllday: true,
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
