import { gql } from "@apollo/client";

//獲取商品課程資料 - 課程列表用API
export const GET_PRODUCTS = gql`
  query getProducts($page: PageInput!, $name: String) {
    getProducts(page: $page, name: $name){
    code
    message
    data{
      id
      name
      type
			coverUrl
      bannerUrl
      desc
      originalPrice
      stock
      status
      preferentialPrice
    }
    page{
      pageNum
      pageSize
      total
    }
  }
}
`
//獲取某一筆商品詳細資料API
export const GET_PRODUCT = gql`
query getProductInfo($id:String!) {
  getProductInfo(id:$id){
    code
    message
    data{
      id
      limitBuyNumber
      name
      type
      coverUrl
      bannerUrl
      desc
      status
      originalPrice
      stock
      status
      preferentialPrice
      cards {
          id
          name
          type
          time
          validityDay
          course {
            name
            id
          }
        }
    }
  }
}
`;

//新增/編輯商品API
export const COMMIT_PRODUCT = gql`
  mutation commitProductInfo($params: PartialProductInput!, $id: String) {
    commitProductInfo(params:$params,id:$id){
      code
      message
    }
  }
`;

//軟刪除商品API
export const DELETE_PRODUCT = gql`
  mutation softDeleteProduct($id: String!) {
    softDeleteProduct(id: $id) {
      code
      message
    }
  }
`;

//獲取商品分類API
export const GET_PRODUCT_TYPES = gql`
  query getProductTypes{
    getProductTypes{
      data {
        key
        title
      }
    }
  }
`;
