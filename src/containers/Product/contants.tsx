import { Image, Popconfirm, Space } from 'antd';
import { ProColumns } from "@ant-design/pro-components";
import { IProduct } from '@/utils/type';

interface IProps {
  onEditHandler: (id: string) => void;
  onCardHandler: (id: string) => void;
  onDeleteHandler: (id: string) => void;
  onStatusChangeHandler: (id: string, status: string) => void;
}

const PRODUCT_STATUS = {
  LIST: 'LIST',
  UN_LIST: 'UN_LIST',
};

export const getColumns: (props: IProps) => ProColumns<IProduct, 'text'>[] = ({
  onEditHandler,
  onCardHandler,
  onDeleteHandler,
  onStatusChangeHandler
}) => {
  return [
    {
      dataIndex: 'id',
      title: '#',
      valueType: 'indexBorder',
      search: false,
      align: 'center',
      width: 50,
    },
    {
      title: '封面',
      dataIndex: 'coverUrl',
      search: false,
      align: 'center',
      width: 100,
      render: (_, record: IProduct) => <Image src={record.coverUrl} />,
    },
    {
      title: '商品名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此項必填',
          },
        ],
      },
    },
    {
      title: '原價',
      search: false,
      dataIndex: 'originalPrice',
      width: 50,
    },
    {
      title: '優惠價',
      search: false,
      dataIndex: 'preferentialPrice',
      width: 80,
    },
    {
      title: '總庫存量',
      search: false,
      width: 80,
      align: 'center',
      dataIndex: 'stock',
    },
    {
      title: '當前庫存',
      search: false,
      width: 80,
      align: 'center',
      dataIndex: 'curStock',
    },
    {
      title: '每人限購',
      search: false,
      width: 80,
      align: 'center',
      dataIndex: 'limitBuyNumber',
    },
    {
      title: '銷量',
      search: false,
      width: 50,
      align: 'center',
      dataIndex: 'buyNumber',
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'id',
      align: 'center',
      width: 300,
      render: (_text, entity) => {
        return (
          <Space>
            {entity.status === PRODUCT_STATUS.UN_LIST
              ? (
                <a
                  key="list"
                  style={{
                    color: 'blue',
                  }}
                  onClick={() => onStatusChangeHandler(entity.id, PRODUCT_STATUS.LIST)}
                >
                  上架
                </a>
              )
              : (
                <a
                  key="unList"
                  style={{
                    color: 'green',
                  }}
                  onClick={() => onStatusChangeHandler(entity.id, PRODUCT_STATUS.UN_LIST)}
                >
                  下架
                </a>
              )}
            <a
              key="edit"
              onClick={() => onEditHandler(entity.id)}
            >
              編輯
            </a>
            <a
              key="card"
              onClick={() => onCardHandler(entity.id)}
            >
              绑定消费卡
            </a>
            <Popconfirm
              title="提醒"
              description="確認要刪除嗎?"
              onConfirm={() => onDeleteHandler(entity.id)}
            >
              <a
                key="delete"
                type="link"
                style={{
                  color: 'red',
                }}
              >
                删除
              </a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];
}