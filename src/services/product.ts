import { useMemo } from 'react';
import { message } from 'antd';
import {
  TBaseProduct, TProductQuery, TProductsQuery, TProductTypeQuery
} from '@/utils/type';
import { useQuery, useMutation } from '@apollo/client';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import {
  GET_PRODUCTS, GET_PRODUCT, COMMIT_PRODUCT, DELETE_PRODUCT, GET_PRODUCT_TYPES,
} from '@/graphql/product';

//取得多筆商品資料的hook
export const useProducts = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const { loading, data, refetch } = useQuery<TProductsQuery>(GET_PRODUCTS, {
    skip: true,
    variables: {
      page: {
        pageNum,
        pageSize,
      },
    },
  });

  const refetchHandler = async (params: {
    name?: string;
    pageSize?: number;
    current?: number;
  }) => {
    const { data: res, errors } = await refetch({
      name: params.name,
      page: {
        pageNum: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      },
    });

    if (errors) {
      return {
        success: false,
      };
    }
    return {
      total: res?.getProducts.page.total,
      data: res?.getProducts.data,
      success: true,
    };
  };

  return {
    loading,
    refetch: refetchHandler,
    page: data?.getProducts.page,
    data: data?.getProducts.data,
  };
};

//新增及修改商品資料的hook
export const useEditProductInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_PRODUCT);

  const handleEdit = async (
    id: number,
    params: TBaseProduct,
    callback: (isReload: boolean) => void,
    refetch?: () => void
  ) => {
    const res = await edit({
      variables: {
        id,
        params,
      },
    });
    if (res.data.commitProductInfo.code === 200) {
      message.success(res.data.commitProductInfo.message);
      callback(true);
      refetch?.()
      return;
    }
    message.error(res.data.commitProductInfo.message);
  };

  return [handleEdit, loading];
};

//使用useQuery取得某一筆商品詳細資料(主要是要使用refetch來自動更新)
export const useProductInfo = (id?: string) => {
  const { data, loading, refetch } = useQuery<TProductQuery>(GET_PRODUCT, {
    skip: !id,
    variables: {
      id,
    },
  });

  const newData = useMemo(() => ({
    ...data?.getProductInfo.data,
    coverUrl: [{ url: data?.getProductInfo.data.coverUrl }],
    bannerUrl: [{ url: data?.getProductInfo.data.bannerUrl }],
  }), [data]);
  return { data: data?.getProductInfo.data ? newData : undefined, loading, refetch };
};

//刪除商品資料的hook
export const useDeleteProduct = (): [handleEdit: Function, loading: boolean] => {
  const [del, { loading }] = useMutation(DELETE_PRODUCT);

  const delHandler = async (id: string, callback: () => void) => {
    const res = await del({
      variables: {
        id,
      },
    });
    if (res.data.softDeleteProduct.code === 200) {
      message.success(res.data.softDeleteProduct.message);
      callback();
      return;
    }
    message.error(res.data.softDeleteProduct.message);
  };

  return [delHandler, loading];
};

//獲取商品分類的hook
export const useProductTypes = () => {
  const { data, loading } = useQuery<TProductTypeQuery>(GET_PRODUCT_TYPES);

  return {
    data: data?.getProductTypes.data || [],
    loading,
  };
};
