import { LockOutlined, MobileOutlined } from '@ant-design/icons';
import { LoginFormPage, ProConfigProvider, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Form } from 'antd';
import { Tabs, message, theme } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN, SEND_CODE_MSG } from '@/graphql/auth';
import styles from './index.module.less'
import { AUTH_TOKEN } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { useTitle } from '@/hooks';
import { useUserContext } from '@/hooks/userHooks';

interface IValue {
  tel: string,
  code: string,
  autoLogin: boolean
}

const Page = () => {
  const [getCode] = useMutation(SEND_CODE_MSG)
  const [login] = useMutation(LOGIN)
  const [params] = useSearchParams()
  const { store } = useUserContext()
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const navigate = useNavigate()
  useTitle('登入')

  //點擊"請登入"時
  const loginHandler = async (values: IValue) => {
    const res = await login({ variables: values })
    if (res.data.login.code === 200) {
      //當登錄成功後，就透過refetchHandler再次去執行useHook裡的useQuery，也就是再次去向後端要一次資料使用者資料
      store.refetchHandler?.()

      //當勾選"自動登入"時，則將token寫入到local storage，目的就是當使用者下次瀏覽器關閉時，token仍然存在瀏覽器裡
      if (values.autoLogin) {
        sessionStorage.setItem(AUTH_TOKEN, '')
        localStorage.setItem(AUTH_TOKEN, res.data.login.data)

        //若沒有勾選"自動登入"，則將token寫入到session裡，目的就是使用者下次再重新開瀏覽器時，就需要再重新登入，因為session裡的資料會在瀏覽器關閉後清除
      } else {
        localStorage.setItem(AUTH_TOKEN, '')
        sessionStorage.setItem(AUTH_TOKEN, res.data.login.data)
      }
      messageApi.success(res.data.login.message)

      //登入後，會回到上一頁進來的頁面，若沒有則直接進入首頁('/')
      navigate(params.get('orgUrl') || '/')
      return
    }
    messageApi.error(res.data.login.message)
  }
  return (
    <div className={styles.container}>
      {contextHolder}
      <LoginFormPage
        initialValues={{ tel: '0934153410' }}
        form={form}
        onFinish={loginHandler}
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        logo="https://aliyun-oss-test-water-drop.oss-ap-southeast-1.aliyuncs.com/images/henglogo.png"
        // backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        submitter={{
          searchConfig: {
            submitText: '請登入', // 修改按鈕文字
          },
        }}
        actions={
          <div className={styles.actions}></div>
        }
      >
        <Tabs centered items={[
          { key: "phone", label: '手機號登入' }
        ]}>
        </Tabs>
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: (
              <MobileOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          name="tel"
          placeholder={'手機號'}
          rules={[
            {
              required: true,
              message: '請輸入手機號！',
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: (
              <LockOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          captchaProps={{
            size: 'large',
          }}
          placeholder={'請輸入驗證碼'}
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'獲取驗證碼'}`;
            }
            return '獲取驗證碼';
          }}
          phoneName="tel"
          name="code"
          rules={[
            {
              required: true,
              message: '請輸入驗證碼！',
            },
          ]}

          //點擊"獲取驗證碼"的按鈕時
          onGetCaptcha={async (tel: string) => {
            const res = await getCode({
              variables: {
                tel
              }
            })
            if (res.data.sendCodeMsg.code === 200) {
              messageApi.success(res.data.sendCodeMsg.message);
              form.setFieldsValue({ code: res.data.sendCodeMsg.returnCode })
            } else {
              messageApi.error(res.data.sendCodeMsg.message)
            }
          }}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自動登入
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘記密碼
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider>
      <Page />
    </ProConfigProvider>
  );
};