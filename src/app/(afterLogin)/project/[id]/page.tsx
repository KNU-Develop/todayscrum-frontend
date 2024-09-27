'use client'

import ProjectContainer from '@/components/ProjectContainer/ProjectContainer'
import { usePathname } from 'next/navigation'
import { useRecommedMeetingTimesQuery } from '@/api'
import { useOneProjectInfoQuery } from '@/api/services/project/quries'
import { ChevronRight } from 'lucide-react'

const getNextThreeDays = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString());
  }
  return dates;
};

const formatDate = (dateTimeString: string) => {
  const date = new Date(dateTimeString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  };
  return date.toLocaleDateString('ko-KR', options);
};

const formatTimeRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, 
  };
  const formattedStartTime = start.toLocaleTimeString('ko-KR', options);
  const formattedEndTime = end.toLocaleTimeString('ko-KR', options);
  return `${formattedStartTime} ~ ${formattedEndTime}`;
};

const groupByDate = (meetings: any[]) => {
  return meetings.reduce((group: any, meeting: any) => {
    const meetingDate = formatDate(meeting.startTime);
    if (!group[meetingDate]) {
      group[meetingDate] = [];
    }
    group[meetingDate].push(meeting);
    return group;
  }, {});
};

const Page = () => {
  const path = usePathname();
  const id = path.split('/').pop() || null;

  const { data: projectData, isLoading: projectLoading } = useOneProjectInfoQuery(id as string, {
    enabled: !!id,
  });

  const { data: meetingData, isLoading: meetingLoading } = useRecommedMeetingTimesQuery({
    projectId: id!,
  });

  if (projectLoading || meetingLoading) {
    return <div>Loading...</div>;
  }

  if (!projectData || !projectData.result || !meetingData) {
    return <div>프로젝트 정보를 불러오지 못했습니다.</div>;
  }

  const date = meetingData.result.length > 0 ? formatDate(meetingData.result[0].startTime) : '';
  const maxAttendeeCount = projectData.result.users.length;
  let groupedMeetings = groupByDate(meetingData.result);
  const nextThreeDays = getNextThreeDays().map((date) => formatDate(date));
  return (
    <>
      <ProjectContainer data={projectData.result} />
  
      <div className="flex flex-col gap-3 p-[10px]">
        <p className="text-body">회의 추천 일정</p>
        
        {nextThreeDays.map((date) => (
          <div key={date} className="mb-4">
            <p className="text-semibold px-[8px] py-[6px]">{date}</p> 
            {groupedMeetings[date]?.length > 0 ? (
              groupedMeetings[date].map((meeting: any, index: number) => (
                <div key={index}>
                  <div className="flex text-small px-[16px] py-[6px] gap-[8px] items-center">
                    <span>
                      {formatTimeRange(meeting.startTime, meeting.endTime)}
                    </span>
                    <span className="text-detail pl-[30px] text-slate-500">
                      {meeting.attendeeCount}/{maxAttendeeCount}인 참석
                    </span>
                    <ChevronRight size={16}/>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-small px-[16px] py-[6px] ">회의 가능한 시간이 없습니다</p>  
            )}
          </div>
        ))}
      </div>
    </>
  ); 
};

export default Page;
