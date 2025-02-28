import { Button, Space } from 'antd';
import { ICourse } from "@/utils/type";
import { ProColumns } from "@ant-design/pro-components";

interface IProps {
  onEditHandler: (id: string) => void
  onOrderTimeHandler: (id: string) => void
  onCardHandler: (id: string) => void
}

export const getColumns: ({ onEditHandler, onOrderTimeHandler }: IProps) => ProColumns<ICourse, 'text'>[] = ({
  onEditHandler,
  onOrderTimeHandler,
  onCardHandler
}) => {
  return [
    {
      title: '課程標題',
      dataIndex: 'name',
      ellipsis: true,
      copyable: true
    },
    {
      title: '限制人數',
      dataIndex: 'limitNumber',
      width: 75,
      search: false,
    },
    {
      title: '持續時長',
      dataIndex: 'duration',
      width: 75,
      search: false,
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
            <Button
              key="edit"
              type="link"
              onClick={() => onEditHandler(entity.id)}
            >
              編輯
            </Button>
            <Button
              key="orderTime"
              type="link"
              onClick={() => onOrderTimeHandler(entity.id)}
            >
              可約時間
            </Button>
            <Button
              key="card"
              type="link"
              onClick={() => onCardHandler(entity.id)}
            >
              關聯消費卡
            </Button>
          </Space>
        )
      },
    },
  ];
}