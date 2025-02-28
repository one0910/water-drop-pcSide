import { useLazyQuery, useMutation } from '@apollo/client';
import { COMMIT_CARD, DELETE_CARD, GET_CARDS } from '@/graphql/card';
import { useQuery } from '@apollo/client';
import { ICard } from '@/utils/type';
import { message } from 'antd';

//獲取消費卡的接口
export const useCards = (courseId: string) => {
  const { data, loading, refetch } = useQuery(GET_CARDS, {
    variables: {
      courseId,
    },
  });

  return {
    loading,
    data: data?.getCards.data,
    refetch,
  };
};


//更新消費卡的接口
export const useEditCardInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_CARD);

  const handleEdit = async (
    id: string,
    courseId: string,
    params: ICard,
    callback: () => void,
  ) => {
    const res = await edit({
      variables: {
        id: id === 'new' ? '' : id,
        params,
        courseId,
      },
    });
    if (res.data.commitCardInfo.code === 200) {
      message.success(res.data.commitCardInfo.message);
      callback();
      return;
    }
    message.error(res.data.commitCardInfo.message);
  };

  return [handleEdit, loading];
};

//相較於useCards使用useQuery去自動取得cards的資料，在這裡使用useLazyQuery去手動取得cards的資料
export const useLazyCards = () => {
  const [get, { data, loading }] = useLazyQuery(GET_CARDS);

  const getCards = (courseId: string) => {
    get({
      variables: {
        courseId,
      },
    });
  };

  return {
    loading,
    data: data?.getCards.data,
    getCards,
  };
};

//刪除消費卡的接口
export const useDeleteCard = (): [handleEdit: Function, loading: boolean] => {
  const [del, { loading }] = useMutation(DELETE_CARD);

  const delHandler = async (id: number, callback: () => void) => {
    const res = await del({
      variables: {
        id,
      },
    });
    if (res.data.softDeleteCard.code === 200) {
      message.success(res.data.softDeleteCard.message);
      callback();
      return;
    }
    message.error(res.data.softDeleteCard.message);
  };

  return [delHandler, loading];
};
