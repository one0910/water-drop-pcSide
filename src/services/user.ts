import { GET_USERS } from '@/graphql/user';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { TUserQuery } from '@/utils/type';
import { useQuery } from '@apollo/client';
export const useUsers = (pageNum = 1, pageSize = DEFAULT_PAGE_SIZE) => {
  const { loading, error, data, refetch } = useQuery<TUserQuery>(
    GET_USERS,
    {
      variables: {
        page: {
          pageNum,
          pageSize,
        },
      },
    },
  );

  return {
    loading,
    error,
    refetch,
    page: data?.getUsers.page,
    data: data?.getUsers.data,
  };
};
