
import { Select, Space } from 'antd';
import { useOrganizations } from '@/services/org';
import _ from 'lodash';
import { useUserContext } from '@/hooks/userHooks';
import { LOCAL_CURRENT_ORG } from '@/utils/constants';
import { useEffect } from 'react';
import { useGoTo } from '@/hooks';
import { ROUTE_KEY } from '@/routers/menus';
import { currentOrg } from '@/utils';

/**
*門店選擇器
*/
const OrgSelect = ({ }) => {
  const { data, refetch } = useOrganizations(1, 10, true)
  const { go } = useGoTo()
  const { setStore } = useUserContext()


  useEffect(() => {
    if (currentOrg()?.value) {
      setStore({
        currentOrg: currentOrg()?.value,
      });
    } else {
      go(ROUTE_KEY.NO_ORG);
    }
  }, []);

  const onSearchHandler = _.debounce((name: string) => {
    /**
    透過_.debounce防抖機制，可以將onChange設置為500毫秒後才執行，
    也就是500毫秒後才會進行下面refetch的邏輯
    然後從後端refech回來的資料, 透過data顯示在<Select.Option>裡
    */
    refetch({
      name
    })
  }, 500)

  /**
  當select欄位裡的值變更時，除了上面的onSearch去後端refech資料外，
  這裡同樣將被選到option裡的資料valuse資料重新寫入至localStorage
  */
  const onChangeHandler = (data: { value: string, label: string }) => {
    setStore({
      currentOrg: data.value,
    });
    localStorage.setItem(LOCAL_CURRENT_ORG, JSON.stringify(data));
  };
  return (
    <Space>
      選擇門店:
      <Select
        style={{ width: 200, height: '100%' }}
        placeholder='請選擇門店'
        showSearch
        onSearch={onSearchHandler}
        /**
        filterOption 這選項是用來決定<Select.Option>裡面的資料是要怎麼篩選，
        * 設置為treu則表示我篩選資料的方式是從既有的<Select.Option>裡面value和label來篩選的
        <Select.Option value="1">門店A</Select.Option>
        <Select.Option value="2">門店B</Select.Option>
        <Select.Option value="3">門店C</Select.Option>
        例如我已經有上面3筆的資料了, 然後從我上面3筆的value和label去做資料篩選
        * 設置為false則表示我不從既有的<Select.Option>裡面value和label來篩選,而把控制權交由onSearch來處理
          這時就可以搭配onSearch去後端refecth資料, 然後將資料返回到<Select.Option>裡
        */
        filterOption={false}
        defaultValue={currentOrg()}
        onChange={onChangeHandler}
        /**labelInValue屬性是讓select在觸發onChange時，它retrn的data不再僅是選中的select.Option的value，
        而是帶有label、value、key、title屬性的物件*/
        labelInValue
        //告訴 Select 使用 Select.Option 的 children 作為顯示的 label，如下所示，Select.Option的children就是item.name
        optionLabelProp="children"
      >
        {data?.map(item => {
          return (
            <Select.Option
              key={item.id}
              value={item.id}
            >
              {item.name}
            </Select.Option>
          )
        })}
      </Select>
    </Space>
  );
};

export default OrgSelect;
