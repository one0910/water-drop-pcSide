import { PageContainer, ProList } from '@ant-design/pro-components';
import { useState } from 'react';
import { Button, Popconfirm, Tag } from 'antd';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useDeleteOrg, useOrganizations } from '@/services/org';
import EditOrg from './components/EditOrg';

import style from './index.module.less';
/**
*門店管理頁面
*/
const Org = () => {
  const { loading, data, page, refetch } = useOrganizations();

  const [showEdit, setShowEdit] = useState(false);
  const [curId, setCurId] = useState('');
  const [deleteInfo, delLoading] = useDeleteOrg()

  const editInfoHandler = (id: string) => {
    setCurId(id);
    setShowEdit(true);
  };

  //加入某個門市資料
  const addInfoHandler = () => {
    setCurId('');
    setShowEdit(true);
  };

  //刪除某個門市資料
  const deleteInfoHandler = (id: string) => {
    deleteInfo(id, refetch)
  };

  //關閉Drwaer時
  const onCloseHandler = () => {
    setShowEdit(false);
    refetch();
  };

  const onPageChangeHandler = (pageNum: number, pageSize: number) => {
    refetch({
      page: {
        pageNum,
        pageSize,
      },
    });
  };

  const dataSource = data?.map((item: any) => ({
    ...item,
    key: item.id,
    subTitle:
      <div>{item.tags?.split(',').map((tag: any) => {
        return (<Tag key={tag} color="#5BD8A6">{'tag'}</Tag>)
      })}
      </div>,
    actions: [
      <Button type="link" onClick={() => editInfoHandler(item.id)}>編輯</Button>,
      <Popconfirm
        title="提醒"
        okButtonProps={{
          loading: delLoading,
        }}
        description={`確定要删除 ${item.name} 嗎？`}
        onConfirm={() => deleteInfoHandler(item.id)}

      >
        <Button type="link">删除</Button>
      </Popconfirm>,
    ],
    content: item.address,
  }));

  return (
    <div className={style.container}>
      <PageContainer
        loading={loading}
        header={{
          title: '門店管理',
        }}
        extra={[
          <Button key="1" type="primary" onClick={addInfoHandler}>新增門店</Button>,
        ]}
      >
        <ProList<any>
          pagination={{
            defaultPageSize: DEFAULT_PAGE_SIZE,
            showSizeChanger: false,
            total: page?.total,
            onChange: onPageChangeHandler,
          }}
          grid={{ gutter: 0, column: 2 }}
          showActions="always"
          rowSelection={false}
          metas={{
            title: {
              dataIndex: 'name',
            },
            subTitle: {},
            type: {},
            avatar: {
              dataIndex: 'logo',
            },
            content: {
              dataIndex: 'address',
            },
            actions: {
              cardActionProps: 'extra',
            },
          }}
          dataSource={dataSource}
        />
        {showEdit && (
          <EditOrg
            id={curId}
            onClose={onCloseHandler}
          />
        )}
      </PageContainer>
    </div>
  );
};

export default Org;
