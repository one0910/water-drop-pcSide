import { ICourse } from '@/utils/type';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { getColumns } from './contants';
import { useCourses } from '@/services/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import EditCourse from './components/EditCourse';
import OrderTime from './components/OrderTime';
import ConsumeCard from './components/ConsumeCard';


/**
*
*/
const Course = () => {
  const actionRef = useRef<ActionType>();
  const { refetch } = useCourses();
  const [curId, setCurId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [showOrderTime, setShowOrderTime] = useState(false);
  const [showCard, setShowCard] = useState(false)

  //當按下"新增或編輯"按鈕時
  const onClickAddHandler = (id?: string) => {
    if (id) {
      setCourseId(id);
    } else {
      setCourseId('');
    }
    setShowInfo(true);
  }

  //當按下"可約時間"的按鈕時
  const onOrderTimeHandler = (id: string) => {
    setCourseId(id);
    setShowOrderTime(true);
  }

  const onCardHandler = (id: string) => {
    setCurId(id);
    setShowCard(true);
  };

  //這裡設置一個當按下EditCourse裡的Drawer組件的關閉按鈕時，關閉Drawer並且refetch資料
  const closeAndRefetchHandler = (isReload?: boolean) => {
    /**
    這裡的isReload會從useEditCourseInfo裡的callback
    ->送回給組件EditCourse的onClose
    ->再送回給這裡的closeAndRefetchHandler
    ->這裡再藉由isReload來判斷是否ProTable組件要reload*/

    setShowInfo(false);
    if (isReload) {
      /** 只要ProTable執行reload，就會再重新去執行它屬裡的request裡的refetch，
      所以不需要再去執行refetch({})一次*/
      actionRef.current?.reload();
    }
  };

  return (
    <PageContainer header={{ title: '當前店下開設的課程' }}>
      <ProTable<ICourse>
        columns={getColumns({
          onEditHandler: onClickAddHandler,
          onOrderTimeHandler,
          onCardHandler
        })}
        actionRef={actionRef}
        rowKey={(record) => record.id}
        pagination={{ pageSize: DEFAULT_PAGE_SIZE }}
        toolBarRender={() => [
          <Button key="add" onClick={() => onClickAddHandler()} type="primary" icon={<PlusOutlined />}>
            新增
          </Button>,
        ]}
        request={refetch}
      />
      {/* 下面這樣的寫法有個有個好處是當showInfo或showOrderTime存在時，才會去渲染EditCourse及OrderTime的組件
        相較於將showInfo寫在屬性裡，EditCours並不會在外層先被渲染，而是有條件時才會被渲染
      */}
      {showInfo && <EditCourse id={courseId} onClose={closeAndRefetchHandler} />}
      {showOrderTime && <OrderTime id={courseId} onClose={() => setShowOrderTime(false)} />}
      {showCard && <ConsumeCard id={curId} onClose={() => setShowCard(false)} />}
    </PageContainer>
  );
};

export default Course;
