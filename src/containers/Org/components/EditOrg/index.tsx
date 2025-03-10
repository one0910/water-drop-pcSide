import { useMemo } from 'react';
import { Button, Col, Divider, Drawer, Form, Input, Row, Select, Spin, UploadFile } from 'antd';
import UploadImage from '@/components/OSSImageUpload';
import style from './index.module.less'
import { useEditInfo, useOrganization } from '@/services/org';
import { IOrganization } from '@/utils/type';
interface IProp {
  id: string;
  onClose: () => void;
}
/**
*
*/
const EditOrg = ({ id, onClose }: IProp) => {
  const [form] = Form.useForm()
  const { data, loading: queryLoadding, refetch } = useOrganization(id)
  const [edit, editLoading] = useEditInfo();

  //按下儲存按鈕
  const onFinishHandler = async () => {
    const values = await form.validateFields();

    if (values) {
      const formData = {
        ...values,
        logo: values.logo[0].url,
        tags: values.tags.join(','),
        identityCardBackImg: values.identityCardBackImg[0].url,
        identityCardFrontImg: values.identityCardFrontImg[0].url,
        businessLicense: values.businessLicense[0].url,
        orgFrontImg: values?.orgFrontImg?.map((item: UploadFile) => ({ url: item.url })),
        orgRoomImg: values?.orgRoomImg?.map((item: UploadFile) => ({ url: item.url })),
        orgOtherImg: values?.orgOtherImg?.map((item: UploadFile) => ({ url: item.url })),
      } as IOrganization;
      edit(id, formData, refetch)
    }
  };

  const initValue = useMemo(() => {
    if (!data) {
      return {}
    }
    return {
      ...data,
      tags: data.tags?.split(','),
      logo: [{ url: data.logo }],
      identityCardBackImg: [{ url: data.identityCardBackImg }],
      identityCardFrontImg: [{ url: data.identityCardFrontImg }],
      businessLicense: [{ url: data.businessLicense }],
    }
  }, [data])

  if (queryLoadding) {
    return <Spin />
  }

  return (
    <Drawer
      title="編輯門市訊息"
      width={'70vw'}
      onClose={onClose}
      open
      // footerStyle={{ textAlign: 'right' }}
      footer={(
        <Button
          loading={editLoading}
          type="primary"
          onClick={onFinishHandler}
        >
          儲存
        </Button>
      )}
    >
      <Form form={form} initialValues={initValue} layout="vertical">
        <Row className={style.row} gutter={20}>
          <Col span={10}>
            <Form.Item
              style={{ width: '100%' }}
              label="Logo"
              name="logo"
              rules={[{ required: true }]}
            >
              <UploadImage
                maxCount={1}
                label="替换 Logo"
                storePath='/organization'
              />

            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              style={{ width: '100%' }}
              label="名称"
              name="name"
              rules={[{ required: true }]}
            >
              <Input placeholder="请输入门店名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row className={style.row} gutter={20}>
          <Col span={11}>
            <Form.Item
              label="标签"
              name="tags"
              rules={[{ required: true }]}
            >
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="请输入标签"
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              label="手機號"
              name="tel"
              rules={[{ required: true }]}
            >
              <Input placeholder="請輸入手機號" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="經度"
              name="longitude"
              rules={[{ required: true }]}
            >
              <Input placeholder="請輸入經度" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="緯度"
              name="latitude"
              rules={[{ required: true }]}
            >
              <Input placeholder="請輸入緯度" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="地址"
          name="address"
          rules={[{ required: true }]}
        >
          <Input placeholder="請輸入地址" />
        </Form.Item>
        <Form.Item
          label="门店简介"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            maxLength={500}
            rows={5}
            className={style.textArea}
            allowClear
            showCount
          />
        </Form.Item>
        <Row className={style.row} gutter={20}>
          <Col span={8}>
            <Form.Item
              style={{ width: '100%' }}
              label="營業執照"
              name="businessLicense"
              rules={[{ required: true }]}
            >
              <UploadImage
                label="替換營業執照"
                maxCount={1}
                imgCropAspect={3 / 2}
                storePath='/organization'
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              style={{ width: '100%' }}
              label="身份证正面"
              name="identityCardFrontImg"
              rules={[{ required: true }]}
            >
              <UploadImage
                label="替换身份证"
                maxCount={1}
                imgCropAspect={3 / 2}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              style={{ width: '100%' }}
              label="身份证背面"
              name="identityCardBackImg"
              rules={[{ required: true }]}
            >
              <UploadImage
                label="替换身份证"
                maxCount={1}
                imgCropAspect={3 / 2}
              />
            </Form.Item>
          </Col>
        </Row>


        <Divider>门店顶部图：图片长宽要求比例为 2:1，最多上传 5 张 </Divider>
        <Form.Item name="orgFrontImg">
          <UploadImage maxCount={5} imgCropAspect={2 / 1} />
        </Form.Item>
        <Divider>门店室内图：图片长宽要求比例为 2:1，最多上传 5 张 </Divider>
        <Form.Item name="orgRoomImg">
          <UploadImage maxCount={5} imgCropAspect={2 / 1} />
        </Form.Item>
        <Divider>门店其他图：图片长宽要求比例为 2:1，最多上传 5 张 </Divider>
        <Form.Item name="orgOtherImg">
          <UploadImage maxCount={5} imgCropAspect={2 / 1} />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditOrg;
