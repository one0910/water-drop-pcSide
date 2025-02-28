import { Button, Result } from 'antd';

/**
*
*/
const Page404 = ({ }) => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="訪問的頁面不存在"
      extra={<Button type="primary" href='/'>返回首頁</Button>}
    />
  );
};

export default Page404;
