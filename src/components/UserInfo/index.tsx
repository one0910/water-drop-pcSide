
import { connect, useGetUser } from '@/hooks/userHooks';
import { IPropChild } from '@/utils/type';
import { Spin } from 'antd';

/**
*1.建立UserInfo組件的目的，就是要去拿用戶資料的
*/
const UserInfo = ({ children }: IPropChild) => {
  const { loading } = useGetUser()
  return (
    <Spin spinning={loading}>
      <div>
        {children}
      </div>
    </Spin>
  )
};

/**
 *1.connect 是由 connectFactory(KEY, DEFAULT_VALUE) 生成的，這是一個高階函數 (HOC)。
 *2.這個函數只能接受 React 組件作為參數，因為它的核心邏輯就是將組件包裝進上下文的 Provider 中。
 *3.這種設計限制是合理且必要的，確保了上下文系統的邏輯清晰且易於維護。
*/
export default connect(UserInfo);
