import { Modal, Result, Row, Space, Typography } from 'antd';
import { CheckCard } from '@ant-design/pro-components';
import { useLazyCards } from '@/services/card';
import { useEffect, useMemo, useState } from 'react';
import { useEditProductInfo, useProductInfo } from '@/services/product';
import CourseSearch from '@/components/CourseSearch';
import style from './index.module.less';
import _ from 'lodash';
import { CreditCardOutlined } from '@ant-design/icons';
import { getCardName } from '@/utils/constants';

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
}

/**
* 消費卡
*/
const ConsumeCard = ({ id, onClose }: IProps) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const { data: product, loading: getProductLoading, refetch } = useProductInfo(id);
  const { getCards, data: cards, loading: getCardsLoading } = useLazyCards();
  const [edit, editLoading] = useEditProductInfo();

  //按下確定的按鈕後
  const onOkHandler = () => {
    edit(
      id,
      { cards: selectedCards },
      () => onClose(),
      refetch
    );
  };

  /**
  由於商品本身消費卡是多對多的關係，也就是一個產品可能會綁多個消費卡，而消費卡可能會綁多個產品，
  所以去取得該商品的詳細資訊時，該商品本身可能也會綁多張卡，所以除了選擇的課程所取得的消費卡外(cards)，
  也會有該商品本身所綁定的消費卡，因此透過lodash的unionBy功能將product裡的cards及cards做合併，並將重覆的去除掉
  */
  const newCards = useMemo(
    () => _.unionBy(product?.cards || [], cards, 'id'),
    [cards, product?.cards],
  );

  //當按下"綁定消費卡"後，顯示已綁定的消費卡
  useEffect(() => {
    setSelectedCards(product?.cards?.map((item) => item.id) || []);
  }, [product?.cards]);


  const onSelectedHandler = (courseId: string) => {
    //組件CourseSearch透過onSelected將，將courseId給帶到這裡
    getCards(courseId);
  };


  return (
    <Modal
      title="綁定消费卡"
      width="900"
      open
      onOk={onOkHandler}
      onCancel={() => onClose()}
    >
      <Row justify="end">
        <CourseSearch onSelected={onSelectedHandler} />
      </Row>
      <Row justify={'center'} className={style.content}>
        {newCards.length === 0 && (<Result
          status="warning"
          title="請搜索課程並選擇對應的消費卡"
        />)}
        <CheckCard.Group
          multiple
          loading={getProductLoading || editLoading || getCardsLoading}
          onChange={(value) => {
            setSelectedCards(value as string[])
          }}
          value={selectedCards}
        >
          {
            newCards.map((item) => (
              <CheckCard
                key={item.id}
                value={item.id}
                size="small"
                avatar={<CreditCardOutlined />}
                title={
                  (
                    <>
                      <Space>
                        <Typography.Text
                          ellipsis
                          className={style.name}
                        >
                          {item.course?.name}
                        </Typography.Text>
                        {getCardName(item.type)}
                      </Space>
                      <div>
                        {item.name}
                      </div>
                    </>
                  )
                }
                description={
                  (
                    <Space>
                      <span>次數：{item.time}</span>
                      <span>有效期：{item.validityDay}</span>
                    </Space>
                  )
                }
              />
            ))
          }
        </CheckCard.Group>
      </Row>
    </Modal>
  );
};

export default ConsumeCard;
