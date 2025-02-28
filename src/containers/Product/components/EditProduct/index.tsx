import UploadImage from '@/components/OSSImageUpload';
import { Button, Col, Divider, Drawer, Form, Input, InputNumber, Row, Space, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';
import { useEditProductInfo, useProductInfo } from '@/services/product';
import TypeSelect from '@/components/TypeSelect';

interface IProps {
  id?: string;
  onClose: (isReload?: boolean) => void;
}


/**
* 新增/編輯商品
*/
const EditProduct = ({ id = '', onClose }: IProps) => {
  const [form] = Form.useForm();
  const [edit, editLoading] = useEditProductInfo();
  const { data, loading, refetch } = useProductInfo(id);
  const [open, setOpen] = useState(true);


  //當按下"送出"的按鈕時
  const onSubmitHandler = async () => {
    const values = await form.validateFields();
    if (values) {
      const newValues = {
        ...values,
        coverUrl: values.coverUrl[0].url,
        bannerUrl: values.bannerUrl[0].url,
      };
      edit(id, newValues, onClose, refetch);
    }
  }

  return (
    <Drawer
      title={id ? '編輯商品' : '新增商品'}
      width={900}
      open={open}
      onClose={() => setOpen(false)}
      afterOpenChange={(open) => !open && onClose()}
      extra={(
        <Space>
          <Button onClick={() => onClose()}>取消</Button>
          <Button loading={editLoading} onClick={onSubmitHandler} type="primary">
            送出
          </Button>
        </Space>
      )}
    >
      <Spin spinning={loading}>
        {
          (data || !id) && <Form form={form} initialValues={data} >
            <Row gutter={20}>
              <Col span={18}>
                <Form.Item
                  style={{ width: '100%' }}
                  label="名稱"
                  name="name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="商品分類"
                  name="type"
                  rules={[{ required: true }]}
                >
                  <TypeSelect />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={6}>
                <Form.Item
                  label="庫存總額"
                  name="stock"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="原價"
                  name="originalPrice"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="優惠價"
                  name="preferentialPrice"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="每人限購數量"
                  name="limitBuyNumber"
                  rules={[{ required: true }]}
                >
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="商品簡介"
              name="desc"
              rules={[{ required: true }]}
            >
              <TextArea
                maxLength={200}
                rows={5}
                allowClear
                showCount
              />
            </Form.Item>
            <Divider>圖片設置</Divider>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  name="coverUrl"
                  label="商品封面圖：圖片長寬要求比例為 16:9"
                  rules={[{ required: true }]}
                  labelCol={{
                    span: 24,
                  }}
                >
                  <UploadImage
                    maxCount={1}
                    imgCropAspect={16 / 9}
                    label="替換商品圖"
                    storePath='/products'
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="bannerUrl"
                  label="商品 Banner ：圖片長寬要求比例為 16:9 "
                  rules={[{ required: true }]}
                  labelCol={{
                    span: 24,
                  }}
                >
                  <UploadImage
                    maxCount={1}
                    imgCropAspect={16 / 9}
                    label="商品Banner圖"
                    storePath='/products'
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        }


      </Spin>
    </Drawer>
  );
};

export default EditProduct;
