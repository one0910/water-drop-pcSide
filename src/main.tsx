import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { client } from './utils/apollo.ts'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { routes } from './routers/menus.tsx'
import UserInfo from './components/UserInfo/index.tsx'
import Layout from './components/Layout/index.tsx'
import Login from './containers/Login/index.tsx'
import { ROUTE_COMPONENT } from './routers/index.tsx'
import { ConfigProvider } from 'antd/lib/index'
import zhTW from 'antd/locale/en_US';
import 'dayjs/locale/zh-tw';


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <ConfigProvider locale={zhTW}>
      <BrowserRouter>
        <UserInfo>
          <Routes>
            <Route path='/login' element={<Login />}></Route>
            {/* React route可以定義嵌套的路由，如下的ROUTE_CONFIG在iterate出每個路由的資料，
          都會被加載進Layout組件，可以想像ROUTE_CONFIG裡的路由資料都是Layout組件的children，
          然後透過useOutlet()的hook，就可以將組件Layout裡內容顯現出來
          */}
            <Route path='/' element={<Layout />}>
              {routes.map((route) => {
                const Component = ROUTE_COMPONENT[route.key]
                return (
                  <Route
                    path={route.path}
                    element={<Component />}
                    key={route.path}
                  />
                )
              })}
            </Route>
          </Routes>
        </UserInfo>
      </BrowserRouter>
    </ConfigProvider>

  </ApolloProvider>
)
