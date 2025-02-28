import { gql } from '@apollo/client';
export const SEND_CODE_MSG = gql`
  mutation sendCodeMsg($tel:String!){
    sendCodeMsg(tel:$tel){
      code
      message
      returnCode
    }
  }
`
export const LOGIN = gql`
  mutation Login($tel:String!,$code:String!){
    login(tel:$tel,code:$code){
      code
      message
      data
    }
  }
`