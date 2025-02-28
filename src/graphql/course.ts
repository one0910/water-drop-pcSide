import { gql } from "@apollo/client";

//獲取多筆課程資料 - 課程列表用
export const GET_COURSES = gql`
query getCourses($page:PageInput!,$name:String) {
  getCourses(page:$page,name:$name){
    code
    message
    data{
      id
      name
			duration
      limitNumber
    }
    page{
      pageNum
      pageSize
      total
    }
  }
}
`
//獲取某一筆課程詳細資料
export const GET_COURSE = gql`
  query getCourseInfo($id: String!) {
    getCourseInfo(id: $id){
      code
      message
      data {
        id
        name
        desc
        group
        coverUrl
        baseAbility
        limitNumber
        duration
        reserveInfo
        refundInfo
        otherInfo
        teachers {
          id
          name
          photoUrl
        }
        reducibleTime{
          week
          orderTime{
            startTime
            endTime
            key
          }
        } 
      }
    }
  }
`;

//新增/編輯課程
export const COMMIT_COURSE = gql`
  mutation commitCourseInfo($params:PartialCourseInput!,$id:String) {
    commitCourseInfo(params:$params,id:$id){
      code
      message
    }
  }
`;
