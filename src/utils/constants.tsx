import { Tag } from 'antd';
export const AUTH_TOKEN = 'auth_token'
export const DEFAULT_PAGE_SIZE = 10;
export const LOCAL_CURRENT_ORG = 'LOCAL_CURRENT_ORG'
export const DAY_FORMAT = 'YYYY-MM-DD';

// 消費卡類型
export const CARD_TYPE = {
  TIME: 'time', // 次卡
  DURATION: 'duration', // 時長卡
};

export const getCardName = (type: string) => {
  switch (type) {
    case CARD_TYPE.TIME:
      return <Tag color="blue">次卡</Tag>;
    case CARD_TYPE.DURATION:
      return <Tag color="green">時長卡</Tag>;
    default:
      return '-';
  }
};

// 預約課程的狀態
export const SCHEDULE_STATUS = {
  CANCEL: 'CANCEL',
};