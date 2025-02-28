import { Drawer } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import { ICard } from '@/utils/type';
import { getColumns } from './constants';
import { useCards, useDeleteCard, useEditCardInfo } from '@/services/card';

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
}

/**
* 消費卡
*/
const ConsumeCard = ({ id, onClose }: IProps) => {
  const { data, loading, refetch } = useCards(id);
  const [del, delLoading] = useDeleteCard();
  const [edit, editLoading] = useEditCardInfo();

  //接下刪除的按鈕後
  const onDeleteHandler = (key: string) => {
    del(key, refetch);
  };

  //按下保存的按鈕後
  const onSaveHandler = (data: ICard) => {
    edit(
      data.id,
      id,
      {
        name: data.name,
        type: data.type,
        time: data.time,
        validityDay: data.validityDay,
      },
      refetch);
  }

  return (
    <Drawer
      title="關聯消费卡"
      width="90vw"
      open
      onClose={() => onClose()}
    >
      <EditableProTable<ICard>
        headerTitle="請管理該課程的消費卡"
        rowKey="id"
        loading={loading || editLoading || delLoading}
        recordCreatorProps={{
          record: () => ({
            id: 'new',
            name: '',
            type: 'time',
            time: 0,
            validityDay: 0,
          }),
        }}
        value={data}
        columns={getColumns(onDeleteHandler)}
        editable={{
          onSave: async (_rowKey, data) => {
            onSaveHandler(data);
          },
          onDelete: async (key) => {
            onDeleteHandler(key as string);
          },
        }}
      />
    </Drawer>
  );
};

export default ConsumeCard;
