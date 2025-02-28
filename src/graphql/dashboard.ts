import { gql } from '@apollo/client';

/*自動建立課程的API 
(也就會選擇完日期後，會自動將日期相對應的星期幾課程加上去，所以我們這裡稱自動排課API)*/
export const AUTO_CREATE_SCHEDULE = gql`
mutation autoCreateSchedule($startDay: String!, $endDay: String!) {
  autoCreateSchedule(startDay: $startDay, endDay: $endDay) {
    code
    message
  }
}
`;

//取得該門市分店當日的排課表的API
export const GET_SCHEDULES = gql`
query getSchedules($today: String!) {
  getSchedules(today: $today){
    code
    message
    data {
      id
      startTime
      endTime
      limitNumber
      scheduleRecords {
        id
        status
        student {
          id
          name
          avatar
        }
      }
      course {
        id
        name
        coverUrl
        teachers {
          id
          name
          photoUrl
        }
      }
    }
    page {
      total
    }
  }
}
`;