import { LOCAL_CURRENT_ORG } from '@/utils/constants';

//取得目前存在Local Storage裡，key為LOCAL_CURRENT_ORG的資料
export const currentOrg = () => {
  try {
    const res = JSON.parse(localStorage.getItem(LOCAL_CURRENT_ORG) || '')
    return res
  } catch (error) {
    return undefined
  }
}