import { getRouteByKey, ROUTE_CONFIG, ROUTE_KEY, routes } from '@/routers/menus';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useEffect, useMemo } from "react"

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title
  }, [])
}

//通用頁面跳轉器，目的是將React Router的useNavigate包裝起來，提供更直觀的go和back 方法
export const useGoTo = () => {
  const navigate = useNavigate()
  const back = () => navigate(-1)

  //go可以直接路徑參數（pageKey）進行導航，減少重複查找路由的麻煩。
  const go = (
    pageKey?: string,
    params?: Record<string, string | number>
  ) => {
    //如果go()沒帶路徑參數(pageKey)進來，則直接進首頁
    if (!pageKey) {
      navigate('/')
      return
    }
    //在menus.tsx的地方設計了一個getRouteByKey()，它可以回傳路由相關訊息,

    const route = getRouteByKey(pageKey)
    if (route && route.path) {
      //如果go()沒帶參數進來，則直接進路徑(path)的頁面
      if (!params) {
        navigate(`/${route.path}`)
        return
      }

      /**
      這裡url的設計目的是將帶從go()進來的的params換轉換, 例如page/:id params: { id: 1 } 轉換成/page/1
      這種設計對於動態頁面（如用戶詳情、文章詳情等）非常有用。
      */
      const url = route.path.replace(
        /\/:(\w+)/g,
        (exp1: string) => `/${params[exp1]}`
      )
      navigate(`/${url}`)
    }
  }
  return { back, go }
}

//取得當前URL匹配的路由
export const useMatchRoute = () => {
  const location = useLocation()
  const route = useMemo(
    () => routes.find((item) => matchPath(`/${item.path}`, location.pathname)),
    [location.pathname]
  )
  return route
}

//這邊做一個用來判斷路由路徑是否為'org'的hook
export const useIsOrgRoute = () => {
  const curRoute = useMatchRoute();
  if (curRoute?.path === ROUTE_CONFIG[ROUTE_KEY.ORG].path) {
    return true;
  }
  return false;
};
