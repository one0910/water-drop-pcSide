import { IOrderTime, TWeek } from '@/utils/type';
import { ProColumns } from '@ant-design/pro-components';
import { Popconfirm, Space } from 'antd';

export interface IDay {
  key: TWeek;
  label: string;
}

export interface IWeekCourse {
  week: TWeek;
  orderTime: IOrderTime[];
}

export const DAYS: IDay[] = [
  {
    key: 'monday',
    label: '星期一',
  },
  {
    key: 'tuesday',
    label: '星期二',
  },
  {
    label: '星期三',
    key: 'wednesday',
  },
  {
    label: '星期四',
    key: 'thursday',
  },
  {
    label: '星期五',
    key: 'friday',
  },
  {
    label: '星期六',
    key: 'saturday',
  },
  {
    label: '星期日',
    key: 'sunday',
  },
];

export const getColumns = (onDeleteHandler: Function): ProColumns[] => [
  {
    title: '序號',
    dataIndex: 'key',
    width: 50,
    editable: false,
    align: 'center',
  },
  {
    title: '開始時間',
    dataIndex: 'startTime',
    valueType: 'time',
    width: 160,
    align: 'center',
  },
  {
    title: '結束時間',
    dataIndex: 'endTime',
    valueType: 'time',
    width: 160,
    align: 'center',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 150,
    align: 'center',
    render: (_text, record, _, action) => (
      <Space>
        <a
          key="edit"
          //按下編輯的按鈕後
          onClick={() => {
            //可以用ant design內建的功能action，來執行一些功能，如下面的startEditable，就可以用來執行編輯的功能
            action?.startEditable(record.key || '');
          }}
        >
          編輯
        </a>
        <Popconfirm
          title="提醒"
          description="確認要刪除嗎?"
          onConfirm={() => onDeleteHandler(record.key)}
        >
          <a
            key="delete"
          >
            删除
          </a>
        </Popconfirm>
      </Space>
    ),
  },
];

export const isWorkDay = (day: string) => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day);

export const getMaxKey = (orderTime: IOrderTime[] | undefined): number => {
  //1.這裡會引入該日期的所有orderTime，然後透過map把它的key全部拉出來
  const keys = orderTime?.map((item) => item.key) || [];
  if (keys.length === 0) {
    return 0;
  }
  //2.透過Math.max將keys裡的最大值抽出來
  return Math.max(...keys);
};