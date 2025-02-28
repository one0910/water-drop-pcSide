import { useState } from 'react';

import style from './index.module.less';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Card, Input, Pagination, Popconfirm, Result, Tag } from 'antd';
import { useDeleteTeacher, useTeachers } from '@/services/teacher';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CreateTeacher from './CreateTeacher';

/**
*
*/
const Teacher = ({ }) => {
  const { data, page, refetch } = useTeachers();
  const [delHandler, delLoading] = useDeleteTeacher();
  const [show, setShow] = useState(false);
  const [curId, setCurId] = useState<string>('');

  const closeAndRefetchHandler = (isReload?: boolean) => {
    setShow(false);
    if (isReload) {
      refetch();
    }
  };

  //當按下搜尋的按鈕時
  const onSearchHandler = (name: string) => {
    refetch({
      name,
    });
  };

  //按下新增或編輯的按鈕
  const editInfoHandler = (id?: string) => {
    if (id) {
      setCurId(id);
    } else {
      setCurId('');
    }
    setShow(true);
  }

  //按刪除的按鈕
  const onDeleteHandler = (id: string) => {
    delHandler(id, refetch);
  };

  //按下分頁的按鈕時
  const onPageChangeHandler = (pageNum: number, pageSize: number) => {
    refetch({
      page: {
        pageNum,
        pageSize,
      },
    });
  };

  return (
    <div className={style.container}>
      <PageContainer
        header={{
          title: '教師管理',
        }}
      >
        <Card>
          <Input.Search
            placeholder="請輸入教師名字進行搜索"
            className={style.teacherSearch}
            onSearch={onSearchHandler}
            enterButton
            allowClear
          />
          <Button
            className={style.addButton}
            type="primary"
            onClick={() => editInfoHandler()}
          >
            新增
          </Button>
        </Card>
        {data?.length === 0 && <Result title="暫無教師數據" />}
        {data?.map((item: any) => (
          <ProCard
            key={item.id}
            className={style.card}
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => editInfoHandler(item.id)}
              />,
              <Popconfirm
                title="提醒"
                description="確認要刪除嗎?"
                okButtonProps={{ loading: delLoading }}
                onConfirm={() => onDeleteHandler(item.id)}
              >
                <DeleteOutlined key="del" />
              </Popconfirm>,
            ]}
          >
            <div
              className={style.avatar}
              style={{ backgroundImage: `url(${item.photoUrl})` }}
            />
            <div className={style.content}>
              <div className={style.name}>{item.name}</div>
              <div>
                {item.tags.split(',').map((it: string) => (
                  <Tag
                    key={it}
                    color="green"
                  >
                    {it}
                  </Tag>
                ))}
              </div>
              <div className={style.education}>{item.education}</div>
              <div className={style.seniority}>{item.seniority}</div>
            </div>
          </ProCard>
        ))}
        <div className={style.page}>
          <Pagination
            pageSize={page?.pageSize}
            current={page?.pageNum}
            total={page?.total}
            onChange={onPageChangeHandler}
          />
        </div>
        {show && (<CreateTeacher id={curId} onClose={closeAndRefetchHandler} />)}
      </PageContainer>
    </div>
  );
};

export default Teacher;
