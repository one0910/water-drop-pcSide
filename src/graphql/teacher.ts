import { gql } from '@apollo/client';

//獲取教師資料 - 教師列表用API
export const GET_TEACHERS = gql`
  query getTeachers(
    $page: PageInput!,
    $name: String
    ) {
    getTeachers(page: $page, name: $name) {
      code
      message
      page {
        pageNum
        pageSize
        total
      }
      data {
        id
        name
        photoUrl
        teacherTime
        education
        seniority
        experience
        carryPrize
        tags
      }
    }
  }
`;

//新增/編輯教師API
export const COMMIT_TEACHER = gql`
  mutation commitTeacherInfo($id: String!, $params: TeacherInput!) {
    commitTeacherInfo(id: $id, params: $params) {
      code
      message
    }
  }
`;

//獲取某一筆教師詳細資料API
export const QUERY_TEACHER = gql`
  query getTeacherInfo($id: String!) {
    getTeacherInfo(id: $id) {
      code
      message
      data {
        id
        name
        photoUrl
        teacherTime
        education
        seniority
        experience
        carryPrize
        tags
      }
    }
  }
`;


//軟刪除教師API
export const DELETE_TEACHER = gql`
  mutation softDeleteTeacher($id: String!) {
    softDeleteTeacher(id: $id) {
      code
      message
    }
  }
`;
