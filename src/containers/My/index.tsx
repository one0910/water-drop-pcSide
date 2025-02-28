import UploadImage from '@/components/OSSImageUpload';
import { UPDATE_USER } from '@/graphql/user';
import { useUserContext } from '@/hooks/userHooks';
import { PageContainer, ProForm, ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { useMutation } from '@apollo/client';
import { Col, Form, message, Row } from 'antd';
import { useEffect, useRef } from 'react';

/**
*
*/
const My = ({ }) => {
  const formRef = useRef<ProFormInstance>()
  const { store } = useUserContext()
  const [messageApi, contextHolder] = message.useMessage();
  const [updateUserInfo] = useMutation(UPDATE_USER)
  useEffect(() => {
    if (!store.tel) return;
    formRef.current?.setFieldsValue({
      tel: store.tel,
      name: store.name,
      desc: store.desc,
      avatar: [{ url: store.avatar }],
    });
  }, [store]);
  return (
    <PageContainer>
      {contextHolder}
      <ProForm
        layout='horizontal'
        formRef={formRef}
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none'
            }
          }
        }}
        onFinish={async (values) => {
          console.log(`values.avatar=> `, values.avatar)
          const res = await updateUserInfo({
            variables: {
              id: store.id,
              params: {
                name: values.name,
                desc: values.desc,
                avatar: values.avatar[0]?.url || '',
              },
            },
          });
          if (res.data.updateUserInfo.code === 200) {
            store.refetchHandler?.();
            messageApi.success(res.data.updateUserInfo.message);
            return;
          }
          message.error(res.data.updateUserInfo.message);
        }}
      >
        <Row gutter={20}>
          <Col>
            <ProFormText
              name='tel'
              label='手機號'
              tooltip='不能修改'
              disabled
            ></ProFormText>
            <ProFormText
              name='name'
              label='匿稱'
              placeholder='請輸入匿稱'
            ></ProFormText>
            <ProFormTextArea
              name='desc'
              label='簡介'
              placeholder='請輸入簡介訊息'
            />
          </Col>
          <Col>
            <Form.Item name='avatar'>
              <UploadImage label='更改頭像' storePath='/profile' />
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};

export default My;
