import { Avatar, Descriptions, Result, Space, Spin, Steps, Tooltip } from 'antd';
import style from './index.module.less';
import { useSchedules } from '@/services/dashboard';
import { SCHEDULE_STATUS } from '@/utils/constants';

interface IProps {
  day: string
}

/**
*某一天的課程表
*/
const Schedule = ({ day }: IProps) => {
  const { data, loading } = useSchedules(day)

  //當課程列表上沒有課程時
  if (data?.length === 0) {
    return (
      <Result
        status="warning"
        title="當前還未排課，快去排課吧"
      />
    );
  }

  return (
    <Spin spinning={loading} className={style.container}>
      <Steps
        direction='vertical'
        items={data?.map((item) => ({
          title: `${item.startTime} - ${item.endTime} ${item.course.name}`,
          description: (
            <Descriptions bordered size='small'>
              <Descriptions.Item span={3} label="講師" styles={{ label: { width: 80 } }}>
                <Space>
                  {
                    item.course.teachers.map((teacher) => (
                      <Space key={teacher.id}>
                        <Avatar
                          shape='square'
                          size='small'
                          src={teacher.photoUrl} />{teacher.name}
                      </Space>
                    ))
                  }
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                span={3}
                label={`學員(${item.scheduleRecords.length})`}
              >
                <Avatar.Group
                  max={{
                    count: 10,
                    style: { color: '#f56a00', backgroundColor: '#fde3cf' }
                  }}
                >
                  {
                    item.scheduleRecords.map((sr) => (
                      <Tooltip
                        key={sr.id}
                        title={sr.student.name + (sr.status === SCHEDULE_STATUS.CANCEL ? '：已取消' : '')}
                      >
                        <Avatar
                          key={sr.student.id}
                          src={sr.student.avatar}
                        />
                      </Tooltip>
                    ))
                  }
                  {item.scheduleRecords.length === 0 && <span className={style.noStudentMessage}>暫無學員預約</span>}
                </Avatar.Group>
              </Descriptions.Item>

            </Descriptions>
          )
        }))}
      />
    </Spin>
  );
};

export default Schedule;
