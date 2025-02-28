import style from './index.module.less';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import { Link, useNavigate, useOutlet } from 'react-router-dom';
import { useUserContext } from '@/hooks/userHooks';
import { ROUTE_KEY, routes } from '@/routers/menus';
import { AUTH_TOKEN } from '@/utils/constants';
import { LogoutOutlined, ShopOutlined } from '@ant-design/icons';
import { useGoTo, useIsOrgRoute } from '@/hooks';
import { Space, Tooltip } from 'antd';
import OrgSelect from '../OrgSelect';


const menuItemRender = (item: MenuDataItem, dom: React.ReactNode) => {
  return (
    <Link to={item.path || '/'}>{dom}</Link>
  )
}

/**
*外層框架
*/
const Layout = () => {
  const outlet = useOutlet()
  const { store } = useUserContext()
  const isOrg = useIsOrgRoute();
  const { go } = useGoTo()
  const aratar = (store.avatar) ? store.avatar : `https://api.dicebear.com/7.x/miniavs/svg?seed=${Math.floor(Math.random() * 1000)}`
  const navigate = useNavigate()
  const logout = () => {
    sessionStorage.setItem(AUTH_TOKEN, '')
    localStorage.setItem(AUTH_TOKEN, '')
    navigate('/login')
    // setStore({
    //   refetchHandler: store.refetchHandler
    // })
  }
  const goToORg = () => {
    go(ROUTE_KEY.ORG)
  }

  return (
    <ProLayout
      layout='mix'
      siderWidth={150}
      avatarProps={{
        src: aratar,
        title: store.name,
        size: 'small',
        onClick: () => go(ROUTE_KEY.MY)
      }}
      links={[
        <Space size={20} onClick={logout}>
          <LogoutOutlined />
          登出
        </Space>
      ]}
      className={style.container}
      logo={<img src='https://aliyun-oss-test-water-drop.oss-ap-southeast-1.aliyuncs.com/images/henglogo.png'></img>}
      title={false}
      onMenuHeaderClick={() => navigate('/')}
      route={{
        path: '/',
        routes: routes
      }}
      actionsRender={() => [
        !isOrg && <OrgSelect />,
        <Tooltip title='門店管理'>
          <ShopOutlined onClick={goToORg} />
        </Tooltip>
      ]}
      menuItemRender={menuItemRender}
    >
      {/* 這裡用一個帶用key屬性的div，然後把outlet包起來，目的在於門店的id有變更時，
      JSX 會強制重新渲染，因為當 key 改變時，React 會認為這是一個全新的元素，因此會銷毀舊的元素並創建新的元素。 */}
      <div key={store.currentOrg}>
        {outlet}
      </div>
    </ProLayout>
  );
};

export default Layout;
