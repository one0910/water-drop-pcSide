import { useProductTypes } from '@/services/product';
import { Select } from 'antd';

interface IProps {
  value?: string;
  onChange?: (val: string) => void;
}

/**
*  商品分類選擇器
*/
const TypeSelect = ({ value = undefined, onChange = () => { } }: IProps) => {
  const { loading, data } = useProductTypes();

  const onChangeHandler = (val: string) => {
    onChange?.(val);
  };

  return (
    <Select
      placeholder="請選擇分類"
      value={value}
      onChange={onChangeHandler}
      loading={loading}
    >
      {data?.map((item) => (
        <Select.Option
          key={item.key}
          value={item.key}
        >
          {item.title}
        </Select.Option>
      ))}
    </Select>
  );
};



export default TypeSelect;
