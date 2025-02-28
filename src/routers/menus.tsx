
import { GiftOutlined, HomeOutlined, IdcardOutlined, PicRightOutlined, ShopOutlined, TeamOutlined } from "@ant-design/icons";
import React from "react";

interface IRoute {
  path: string,
  name: string,
  icon?: React.ReactNode,
  hideInMenu?: boolean
}

/**我希望我們每個跳轉都能跳轉到它對應的每個頁面，
所以我們可以給每個頁面定義類型，其實也就是定義它的枚舉值*/
export const ROUTE_KEY = {
  HOME: 'home',
  MY: 'my',
  ORG: 'org',
  COURSE: 'course',
  USER: 'user',
  PRODUCT: 'product',
  TEACHER: 'teacher',
  NO_ORG: 'noOrg',
  PAGE_404: 'p404',
}

export const ROUTE_CONFIG: Record<string, IRoute> = {
  [ROUTE_KEY.HOME]: {
    path: '/',
    name: '首頁',
    hideInMenu: true,
    icon: <HomeOutlined />
  },
  [ROUTE_KEY.MY]: {
    path: 'my',
    name: '個人訊息',
    hideInMenu: true,
    icon: <HomeOutlined />
  },
  [ROUTE_KEY.ORG]: {
    path: 'org',
    name: '門店管理',
    hideInMenu: true,
    icon: <ShopOutlined />
  },
  [ROUTE_KEY.COURSE]: {
    path: 'course',
    name: '課程管理',
    icon: <PicRightOutlined />,
  },
  [ROUTE_KEY.USER]: {
    path: 'user',
    name: '用戶管理',
    icon: <TeamOutlined />
  },

  [ROUTE_KEY.PRODUCT]: {
    path: 'product',
    name: '商品管理',
    icon: <GiftOutlined />,
  },
  [ROUTE_KEY.TEACHER]: {
    path: 'teacher',
    name: '教師管理',
    icon: <IdcardOutlined />,
  },
  [ROUTE_KEY.NO_ORG]: {
    path: 'noOrg',
    name: '請選擇門店提示',
    hideInMenu: true,
  },
  [ROUTE_KEY.PAGE_404]: {
    path: '*',
    hideInMenu: true,
    name: '404',
  }
}

export const routes = Object.keys(ROUTE_CONFIG).map(key => ({ ...ROUTE_CONFIG[key], key }))
export const getRouteByKey = (key: string) => ROUTE_CONFIG[key]
