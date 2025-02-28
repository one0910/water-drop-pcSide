import { useUserContext } from '@/hooks/userHooks';
import { PageContainer } from '@ant-design/pro-components';
import { useOrganization } from '@/services/org';
import { Button, Calendar, Card, Col, DatePicker, Row, message } from 'antd';
import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DAY_FORMAT } from '@/utils/constants';
import { useAutoCreateSchedule } from '@/services/dashboard';
import style from './index.module.less';
import Schedule from './components/Schedule';

const { RangePicker } = DatePicker;

/**
*
*/
const Home = () => {
  const [range, setRange] = useState<[string, string]>(['', '']);
  const { store } = useUserContext();
  const { data: org } = useOrganization(store.currentOrg || '');
  const [run, loading] = useAutoCreateSchedule();
  const [day, setDay] = useState<string>(dayjs().format(DAY_FORMAT));

  if (!org) {
    return null;
  }

  //按下開始排課的按鈕時
  const startScheduleHandler = () => {
    console.log(`range => `, range)
    if (!range[0]) {
      message.error('請選擇時間區間');
      return;
    }
    run(...range);
  };

  //組件RangePicker在選擇完日期後，會有days的日期參數的引數可以使用
  const onRangeChangeHandler = (days: (Dayjs | null)[] | null) => {
    if (!days || !days[0] || !days[1]) {
      return;
    }
    //透過RangePicker取得的日期後再將其轉換成YYYY-MM-DD的日期格式其儲存在range裡
    setRange([days[0].format(DAY_FORMAT), days[1].format(DAY_FORMAT)]);
  };

  return (
    <div className={style.container}>
      <PageContainer
        content={org.address}
        header={{ title: org.name }}
      >
        <Row gutter={20}>
          <Col flex="auto">
            <Card
              title={`${day} 的課程`}
              className={style.container}
              extra={
                (
                  <span>
                    <RangePicker
                      placeholder={['開始日期', '結束日期']}
                      onChange={(days) => onRangeChangeHandler(days)}
                    />
                    <Button
                      loading={loading}
                      type="link"
                      onClick={startScheduleHandler}
                    >
                      開始排课
                    </Button>
                  </span>
                )
              }
            >
              <Schedule day={day} />
            </Card>
          </Col>
          <Col flex="300px">
            <Calendar
              fullscreen={false}
              onChange={(d) => setDay(d.format(DAY_FORMAT))}
            />
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

export default Home;
