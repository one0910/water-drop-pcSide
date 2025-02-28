import { CARD_TYPE } from '@/utils/constants';
import { ProColumns } from '@ant-design/pro-components';
import { Popconfirm, Space } from 'antd';

export const getColumns = (onDeleteHandler: Function): ProColumns[] => [
  {
    title: '序號',
    dataIndex: 'key',
    width: 50,
    editable: false,
    align: 'center',
    render: (_d, _r, index) => index + 1,
  },
  {
    title: '名稱',
    dataIndex: 'name',
    align: 'center',
    width: '30%',
  },
  {
    title: '有效期（天）',
    dataIndex: 'validityDay',
    valueType: 'digit',
    width: 110,
    align: 'center',
  },
  {
    title: '類型',
    dataIndex: 'type',
    valueType: 'select',
    width: 120,
    align: 'center',
    request: async () => [
      {
        value: CARD_TYPE.TIME,
        label: '次卡',
      },
      {
        value: CARD_TYPE.DURATION,
        label: '時長卡',
      },
    ],
  },
  {
    title: '次數',
    dataIndex: 'time',
    valueType: 'digit',
    width: 100,
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
          onClick={() => {
            action?.startEditable(record.id || '');
          }}
        >
          编辑
        </a>
        <Popconfirm
          title="提醒"
          description="確認要删除吗？"
          onConfirm={() => onDeleteHandler(record.id)}
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
