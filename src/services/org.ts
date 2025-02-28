import { DEFAULT_PAGE_SIZE } from './../utils/constants';
import { COMMIT_ORG, DEL_ORG, GET_ORG, GET_ORGS, GET_SAMPLE_ORGS } from './../graphql/org';
import { useMutation, useQuery } from '@apollo/client'
import { TBaseOrganization, TOrgQuery, TOrgsQuery } from '@/utils/type';
import { message } from 'antd';

/**
  *這裡是門市API接口的hook，
  這裡所設計的hook可以讓compponent層去對後端的門市資料做增刪改查
*/

//取得所以門市的hook
export const useOrganizations = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  isSample = false
) => {
  const { loading, data, refetch } = useQuery<TOrgsQuery>(
    isSample ? GET_SAMPLE_ORGS : GET_ORGS,
    {
      variables: {
        page: {
          pageNum,
          pageSize
        }
      }
    })
  return {
    loading,
    refetch,
    page: data?.getOrganizations.page,
    data: data?.getOrganizations.data,
  }
}

//取得某一門市的詳細資料的hook
export const useOrganization = (id: string) => {
  const { loading, data, refetch } = useQuery<TOrgQuery>(GET_ORG, {
    variables: {
      id,
    },
  });

  return {
    loading,
    refetch,
    data: data?.getOrganizationInfo.data,
  };
};


//編輯門市的hook
export const useEditInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_ORG);

  const handleEdit = async (
    id: number,
    params: TBaseOrganization,
    refetch?: () => void
  ) => {
    try {
      const res = await edit({
        variables: {
          id,
          params,
        },
      });
      message.info(res.data.commitOrganization.message);
      if (refetch) { refetch() }
    } catch (error: any) {
      message.error(error[0].message);
    }
  };
  return [handleEdit, loading];
};

//刪除門市的hook
export const useDeleteOrg = (): [handleEdit: Function, loading: boolean] => {
  const [deleteOrg, { loading }] = useMutation(DEL_ORG);
  const handleDelete = async (
    id: number,
    refetch?: () => void
  ) => {

    try {
      const result = await deleteOrg({
        variables: {
          id,
        },
      });
      message.info(result.data.deleteOrganization.message);
      if (refetch) { refetch() }
    } catch (error: any) {
      message.error('刪除失敗');
    }
  };
  return [handleDelete, loading];
};