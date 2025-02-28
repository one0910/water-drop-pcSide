import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUserInfo {
    getUserInfo{
      id
      tel
      name
      desc
      avatar
    }
  }
`
export const GET_USERS = gql`
query getUsers($page:PageInput!) {
  getUsers(page:$page){
    code
    message
    data{
      avatar
      name
      id
      createdAt
      account
      tel	
    }
    page{
      pageNum
      pageSize
      total
    }
  }
}`

export const UPDATE_USER = gql`
  mutation UpdateUserInfo($id: String!,$params: UserInput!){
    updateUserInfo(id:$id,params:$params){
      code
      message
  }
}`

