import { PageContainer } from '@ant-design/pro-components';
import style from './index.module.less';
import { Card, Pagination, Space } from 'antd';
import { useUsers } from '@/services/user';
import { IUser } from '@/utils/type';
/**
*門店管理頁面
*/
const User = () => {
  const { loading, data, page, refetch } = useUsers();
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
        loading={loading}
        header={{
          title: '用戶管理',
        }}
      >
        <Card>
          {
            data?.map((item: IUser) => (
              <Card
                key={item.id}
                hoverable
                className={style.card}
                cover={(
                  <div
                    className={style.avatar}
                    style={{ backgroundImage: `url(${item.avatar || `https://api.dicebear.com/7.x/miniavs/svg?seed=${item.id}`} )` }}

                  />
                )}
              >
                <Card.Meta
                  title={item.name || '無名氏'}
                  description={<Space>{[item.account || '無帳號', item.tel || '無手機號']}</Space>}
                />
              </Card>
            ))
          }
          <div className={style.page}>
            <Pagination
              pageSize={page?.pageSize}
              current={page?.pageNum}
              total={page?.total}
              onChange={onPageChangeHandler}
            />
          </div>
        </Card>
      </PageContainer>
    </div>
  );
};

export default User;
