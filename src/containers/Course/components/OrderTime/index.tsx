import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Button, Col, Drawer, Row, Space, Tabs } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import { ChromeOutlined, RedoOutlined } from '@ant-design/icons';
import { IOrderTime } from '@/utils/type';
import { DAYS, getColumns, getMaxKey, IDay, isWorkDay } from './constants';
import { useOrderTime } from './hooks';
import style from './index.module.less'

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
}
/**
*可約時間
*/
const OrderTime = ({ id, onClose }: IProps) => {
  const [currentDay, setCurrentDay] = useState<IDay>(DAYS[0]);
  useEffect(() => {
  }, [])
  //拉一個hooks出來，將所有要用到的功能另外封裝，以方便重復使用，也讓程式碼更簡潔
  const {
    orderTime,
    loading,
    onDeleteHandler,
    onSaveHandler,
    allWeekSyncHandler,
    allWorkDaySyncHandler
  } = useOrderTime(id, currentDay.key)

  //切換星期幾的Tab時
  const onTabChangeHandler = (key: string) => {
    const current = DAYS.find((item) => item.key === key) as IDay
    setCurrentDay(current)
  }


  return (
    <Drawer
      title="編輯預約時間"
      width={720}
      open
      onClose={() => onClose()}
      forceRender
    >
      <Tabs
        type='card'
        items={DAYS}
        onChange={onTabChangeHandler}
      />
      <EditableProTable<IOrderTime>
        headerTitle={(
          <Space>
            選擇
            <span className={style.name}>{currentDay.label}</span>
            的課開放預約的時間
          </Space>
        )}
        loading={loading}
        rowKey={(record) => record.key}
        //屬性recordCreatorProps的作用就是新建一行資料
        recordCreatorProps={{
          record: () => ({
            key: getMaxKey(orderTime) + 1,
            startTime: '12:00:00',
            endTime: '12:30:00',
          })
        }}
        columns={getColumns(onDeleteHandler)}
        value={orderTime}
        editable={{
          //當按下保存的按鈕時
          onSave: async (rowKey, rowData) => {
            //ant design會讓該列資料帶有index屬性，目前我們並不需要，所以透過lodash的_.omit()方法將index刪除
            const data = _.omit(rowData, 'index')
            if (orderTime) {
              let newData = []
              //編輯既有資料
              if (orderTime?.findIndex(item => item.key === rowKey) > -1) {
                newData = orderTime?.map(item => item.key === rowKey ? data : { ...item });
              } else {
                //增加新資料
                newData = [...orderTime, data]
              }
              onSaveHandler(newData)
            }
          },
          //當按下刪除的按鈕時
          onDelete: async (key) => {
            onDeleteHandler(key as number);
          },
        }}
      />
      <Row gutter={20} className={style.buttons}>
        <Col span={12}>
          <Button
            icon={<RedoOutlined />}
            style={{ width: '100%' }}
            type="primary"
            disabled={!isWorkDay(currentDay.key)}
            onClick={allWorkDaySyncHandler}
          >
            全工作日(一~五)同步
          </Button>
        </Col>
        <Col span={12}>
          <Button
            icon={<ChromeOutlined />}
            style={{ width: '100%' }}
            type="primary"
            danger
            // disabled={!isWorkDay(currentDay.key)}
            onClick={allWeekSyncHandler}
          >
            全週作日(一~日)同步
          </Button>
        </Col>
      </Row>
    </Drawer>
  );
};

export default OrderTime;
