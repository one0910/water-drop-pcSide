import { IProduct } from '@/utils/type';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { getColumns } from './contants';
// import { useProducts } from '@/services/product';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import EditProduct from './components/EditProduct';
import ConsumeCard from './components/ConsumeCard';
import { useDeleteProduct, useEditProductInfo, useProducts } from '@/services/product';


/**
*
*/
const Product = () => {
  const actionRef = useRef<ActionType>();
  const { refetch, loading } = useProducts();
  const [delHandler, delLoading] = useDeleteProduct();
  const [curId, setCurId] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showCard, setShowCard] = useState(false)
  const [edit, editLoading] = useEditProductInfo();

  //當按下"新增或編輯"按鈕時
  const onClickAddHandler = (id?: string) => {
    if (id) {
      setCurId(id);
    } else {
      setCurId('');
    }
    setShowInfo(true);
  }

  const onCardHandler = (id: string) => {
    setCurId(id);
    setShowCard(true);
  };

  //當按下刪除的按鈕
  const onDeleteHandler = (id: string) => {
    delHandler(id, () => actionRef.current?.reload());
  }

  //這裡設置一個當按下EditProduct裡的Drawer組件的關閉按鈕時，關閉Drawer並且refetch資料
  const closeAndRefetchHandler = (isReload?: boolean) => {
    setShowInfo(false);
    if (isReload) {
      actionRef.current?.reload();
    }
  };

  //上、下架的設置
  const onStatusChangeHandler = (id: string, status: string) => {
    edit(
      id,
      { status },
      () => actionRef.current?.reload()
    );
  };

  return (
    <PageContainer header={{ title: '當前門店下的商品' }}>
      <ProTable<IProduct>
        rowKey={(record) => record.id}
        form={{
          ignoreRules: false,
        }}
        loading={delLoading || loading || editLoading}
        actionRef={actionRef}
        columns={getColumns({
          onEditHandler: onClickAddHandler,
          onCardHandler,
          onDeleteHandler,
          onStatusChangeHandler
        })}
        search={{
          resetText: '重設',
          searchText: '搜尋'
        }}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
        }}
        toolBarRender={() => [
          <Button key="add" onClick={() => onClickAddHandler()} type="primary" icon={<PlusOutlined />}>
            新增
          </Button>,
        ]}
        request={refetch}
      />
      {showInfo && <EditProduct id={curId} onClose={closeAndRefetchHandler} />}
      {showCard && <ConsumeCard id={curId} onClose={() => setShowCard(false)} />}
    </PageContainer>
  );
};

export default Product;
