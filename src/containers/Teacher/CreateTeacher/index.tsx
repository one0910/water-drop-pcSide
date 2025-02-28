import { useState, useMemo } from 'react';
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Select, Space, Spin } from 'antd';
import { useEditTeacherInfo, useTeacher } from '@/services/teacher';
import UploadImage from '@/components/OSSImageUpload';
import style from './index.module.less';


const { TextArea } = Input;
interface IProp {
  id: string;
  onClose: (refetch?: boolean) => void;
}

/**
*新增/編輯教師資料
*/
const CreateTeacher = ({ id, onClose }: IProp) => {
  const [form] = Form.useForm();
  const { data, loading } = useTeacher(id);
  const [handleEdit, editLoading] = useEditTeacherInfo();
  const [open, setOpen] = useState(true)

  const initValue = useMemo(() => (data ? {
    ...data,
    tags: data.tags.split(','),
    photoUrl: [{ url: data.photoUrl }],
  } : {}), [data]);

  const onSubmitHandler = async () => {
    const values = await form.validateFields();
    if (values) {
      handleEdit(id, {
        ...values,
        tags: values.tags.join(','),
        photoUrl: values.photoUrl?.[0]?.url,
      }, onClose);
    }
  };

  return (
    <Drawer
      title={id ? '編輯教師資料' : '新增教師資料'}
      open={open}
      onClose={() => setOpen(false)}
      afterOpenChange={(open) => !open && onClose()}
      width="70vw"
      extra={(
        <Space>
          <Button onClick={() => onClose()}>取消</Button>
          <Button loading={editLoading} onClick={onSubmitHandler} type="primary">
            提交
          </Button>
        </Space>
      )}
    >
      <Spin spinning={editLoading || loading}>
        {(data || !id) && (
          <Form
            form={form}
            initialValues={initValue}
            layout="vertical"
          >
            <Form.Item
              label="頭像圖"
              name="photoUrl"
              rules={[{ required: true }]}
            >
              <UploadImage
                maxCount={1}
                label="替換教師圖"
                storePath='/teacher'
              />
            </Form.Item>
            <Row className={style.row} gutter={20}>
              <Col span={16}>
                <Form.Item
                  label="名稱"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="教齡"
                  name="teacherTime"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Row className={style.row} gutter={20}>
              <Col span={11}>
                <Form.Item
                  label="標籤"
                  name="tags"
                  rules={[{ required: true }]}
                >
                  <Select
                    mode="tags"
                  />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item
                  label="資歷"
                  name="seniority"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="學歷"
                  name="education"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="獲獎經歷" name="carryPrize">
              <TextArea
                maxLength={200}
                className={style.textArea}
                allowClear
                showCount
              />
            </Form.Item>
            <Form.Item label="職業經驗" name="experience">
              <TextArea
                maxLength={200}
                className={style.textArea}
                allowClear
                showCount
              />
            </Form.Item>
          </Form>
        )}
      </Spin>
    </Drawer>
  );
};

export default CreateTeacher;
