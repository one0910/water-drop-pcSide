import { useGoTo } from '@/hooks';
import { useUserContext } from '@/hooks/userHooks';
import { Button, Result } from 'antd';
import { useEffect } from 'react';

/**
* 請選擇門店
*/
const NoOrg = ({ }) => {
  const { store } = useUserContext()
  const { go } = useGoTo()
  useEffect(() => {
    if (store.currentOrg) {
      go()
    }
  }, [store.currentOrg])

  return (
    <Result
      status="404"
      title="請選擇門店"
      subTitle="所有的管理行為都是基於您選擇的門店進行篩選的"
      extra={<Button type="primary" href='/'>返回首頁</Button>}
    />
  );
};

export default NoOrg;
