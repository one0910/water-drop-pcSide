import { useCourse, useCourseInfo, useEditCourseInfo } from '@/services/course';
import { Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Spin } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect } from 'react';
import UploadImage from '@/components/OSSImageUpload';
import TeacherSelect from '@/components/TeacherSelect';
import { ITeacher, IValue } from '@/utils/type';

interface IProps {
  id?: string;
  onClose: (isReload?: boolean) => void;
}


/**
* 新增/編輯課程
*/
const EditCourse = ({ id = '', onClose }: IProps) => {
  const [form] = Form.useForm();
  const [edit, editLoading] = useEditCourseInfo();
  const { getCourse, loading, } = useCourse()
  const { refetch } = useCourseInfo(id)

  useEffect(() => {
    const init = async () => {
      // 如果有id，則代表是從編輯按鈕進來，並傳送該列資料的id
      if (id) {
        const res = await getCourse(id);
        form.setFieldsValue({
          ...res,
          teachers: res.teachers ? res.teachers.map((item: ITeacher) => ({
            label: item.name,
            value: item.id,
          })) : [],
          coverUrl: res.coverUrl ? [{ url: res.coverUrl }] : [],
        });
      } else {
        form.resetFields();
      }
    }
    init()
  }, [id])

  //當按下"送出"的按鈕時
  const onSubmitHandler = async () => {
    const values = await form.validateFields();
    if (values) {
      edit(
        id,
        {
          ...values,
          teachers: values.teachers?.map((item: IValue) => item.value),
          coverUrl: values.coverUrl[0].url,
        },
        onClose,
        refetch,
      );
    }
  }

  return (
    <Drawer
      title={id ? '編輯課程' : '新增課程'}
      width={720}
      /**
      Drawer預設是一個按需渲染（Lazy Render） 的組件
      當Drawer打開時，它的子內容才會渲染，這樣可以提升性能，避免不必要的內容渲染。
      然而，如果子內容中有需要在初始階段就進行操作的邏輯（例如，Form 的 useForm 綁定），
      按需渲染會導致問題，因為子內容尚未渲染，導致 useForm 和 DOM 元素之間的連結無法建立。
      當 forceRender 設置為 true 時，無論 Drawer 是否打開，其內容都會被預先渲染一次。
      這樣也可以保證 Form 和 useForm 的綁定在任何情況下都正常工作。
      */
      forceRender
      open
      onClose={() => onClose()}
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
        <Form form={form}>
          <Form.Item label="封面圖" name="coverUrl">
            <UploadImage imgCropAspect={2 / 1} maxCount={1} storePath='/course' />
          </Form.Item>
          <Form.Item label='課程名稱' name='name' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="任課老師" name="teachers" rules={[{ required: true }]}>
            <TeacherSelect />
          </Form.Item>
          <Form.Item label='課程描述' name='desc'>
            <TextArea rows={5} showCount />
          </Form.Item>
          <Row gutter={20}>
            <Col>
              <Form.Item label='限制人數' name='limitNumber' rules={[{ required: true }]}>
                <InputNumber min={0} addonAfter='人' />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label='持續時間' name='duration' rules={[{ required: true }]}>
                <InputNumber min={0} addonAfter='分鐘' />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label='適齡人群' name='group' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='適合基礎' name='baseAbility' rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label='預约信息' name='reserveInfo'>
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
          <Form.Item label='退款信息' name='refundInfo'>
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
          <Form.Item label='其他信息' name='otherInfo'>
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default EditCourse;
