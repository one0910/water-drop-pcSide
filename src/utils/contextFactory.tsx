import React, { Context, createContext, useContext, useMemo, useState } from "react";
import { IPropChild } from "./type";

interface IStore<T> {
  key: string
  store: T
  setStore: (payload: Partial<T>) => void
}


function getCxtProvider<T>(
  key: string,
  defaultValue: T,
  AppContext: Context<IStore<T>>
) {
  return ({ children }: IPropChild) => {
    const [store, setStore] = useState(defaultValue)

    /**
     下面使用useMemo，主要是要避免不必要的 Provider 重新渲，React 的 Context 依賴於 Provider 提供的值 (value
      如果 value 的引用每次都改變，即使實際內容沒有變化，也會觸發所有消費者 (Consumer) 組件的重渲染，所以使用
      useMemo可以有以下2個作用
     *1.只有當 store 改變時，useMemo 才會生成新的 value。
     *2.否則，value 的引用保持不變，從而避免不必要的重渲染。
    */
    const value = useMemo(() => ({
      key,
      store,
      //下面這種寫法，稱為增量更新，也就是進來的payload資料它不會蓋掉原本的preState裡的資料，它們兩個會合併
      setStore: (payload = {}) => setStore((preState) => {
        return {
          ...preState,
          ...payload
        }
      })
    }), [store])

    return (
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
  }
}
const cxcCache: Record<string, Cxt> = {}

/**
 下面的定義的Class Cxt,它的作用是
 *1.創建實例（通過 new Cxt(...)）
 *2.定義類型（用來描述某個變數的類型），像是下面let CurentCxt: Cxt的寫法，
  所以在 TypeScript 中，類 (Class) 不僅僅是用來創建實例的，還可以用來作為類型使用
*/
class Cxt<T = any> {
  defaultState: IStore<T>;
  AppContext: Context<IStore<T>>;
  Provider: (({ children }: IPropChild) => JSX.Element);

  constructor(key: string, defaultValue: T) {
    this.defaultState = {
      key,
      store: defaultValue,
      setStore: () => { }
    }
    this.AppContext = createContext(this.defaultState)
    this.Provider = getCxtProvider(key, defaultValue, this.AppContext)
    cxcCache[key] = this
  }
}

export function useAppContext<T>(key: string) {
  const cxt = cxcCache[key] as Cxt<T>
  const app = useContext(cxt.AppContext)
  return {
    store: app.store,
    setStore: app.setStore
  }
}

export function connectFactory<T>(
  key: string,
  defaultValue: T
) {
  //傳入一個key及defaultValue，再跟Child組件包裹在一起，就可以實現自動組件的Provider
  const cxt = cxcCache[key]
  let CurentCxt: Cxt<T> //這個寫法是用來聲明變數 CurentCxt，它的類型必須是 Cxt 的實例
  if (cxt) {
    CurentCxt = cxt
  } else {
    CurentCxt = new Cxt<T>(key, defaultValue)
  }
  //下面這個就是一個HOC的寫法，輸入一個組件，最後輸出一個組件(Function進->Funtion出)
  return (Child: React.FunctionComponent<any>) => (props: any) => (
    <CurentCxt.Provider>
      <Child {...props} />
    </CurentCxt.Provider>
  )
}