import { gql } from '@apollo/client';

//取得消費卡的API
export const GET_CARDS = gql`
  query getCards($courseId: String!) {
    getCards(courseId: $courseId){
      code
      message
      data {
        id
        name
        type
        time
        validityDay
        course {
          id
          name
        }
      }
    }
  }
`;

//新增及更新消費卡的API
export const COMMIT_CARD = gql`
  mutation commitCardInfo($params: CardInput!, $courseId: String!, $id: String!) {
    commitCardInfo(params: $params, courseId: $courseId, id: $id) {
      code
      message
    }
  }
`;

//刪除消費卡的API
export const DELETE_CARD = gql`
  mutation softDeleteCard($id: String!) {
    softDeleteCard(id: $id) {
      code
      message
    }
  }
`;