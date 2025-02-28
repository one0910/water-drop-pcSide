import { GET_USER } from '@/graphql/user';
import { useQuery } from '@apollo/client';
import { useAppContext, connectFactory } from '@/utils/contextFactory';
import { IUser } from '@/utils/type';
import { useLocation, useNavigate } from 'react-router-dom';

const KEY = 'userInfo'
const DEFAULT_VALUE = {}


export const useUserContext = () => useAppContext<IUser>(KEY)
export const connect = connectFactory(KEY, DEFAULT_VALUE)

/**
這邊自定義的hook useGetUser，主要是用來當完成登入的程序後，
保持其所有頁面裡store資料都是一致的，就算網頁refresh, store的資料也是一致的
  1.所有頁面都會至後端獲取使用者資料
  2.取得資料後再將資料寫入到store
*/
export const useGetUser = () => {
  const { setStore } = useUserContext();
  const location = useLocation()
  const navigate = useNavigate()
  const { loading, refetch } = useQuery<{ getUserInfo: IUser }>(GET_USER, {
    //@apollo/client 在 3.8.0的版本以後，不會再refetch後而執行onCompleted，要解決這問題，notifyOnNetworkStatusChange必須設定成true
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data.getUserInfo) {
        const { id, tel, name, desc, avatar } = data.getUserInfo
        setStore({
          id, tel, name, desc, avatar, refetchHandler: refetch
        })

        //只要有取得用戶資料，就無法再進入login頁面
        if (location.pathname.startsWith('/login')) {
          navigate(`/`)
        }
        return
      }
      //只要在後端沒有取得用戶資料，一律都進login頁面，就算是進到沒有路由的Page404，也會轉跳到Login頁面
      setStore({ refetchHandler: refetch }) //這裡的設置邏輯是只要在登錄頁面，就會在store設置refetch
      if (location.pathname !== '/login') {
        navigate(`/login?orgUrl=${location.pathname}`)
      }
    },
    onError: () => {
      //只要在後端沒有取得用戶資料，一律都進login頁面，就算是進到沒有路由的Page404，也會轉跳到Login頁面
      setStore({ refetchHandler: refetch })  //這裡的設置邏輯是只要在登錄頁面，就會在store設置refetch
      if (location.pathname !== '/login') {
        navigate(`/login?orgUrl=${location.pathname}`)
      }
    }
  })

  return { loading, refetch }
}