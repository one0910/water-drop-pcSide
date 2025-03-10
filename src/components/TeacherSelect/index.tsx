import { useTeachers } from '@/services/teacher';
import { IValue } from '@/utils/type';
import { Select } from 'antd';
import _ from 'lodash';

interface IProps {
  value?: IValue[];
  onChange?: (val: IValue[]) => void;
}

/**
*   教師選擇器
*/
const TeacherSelect = ({ onChange = () => { }, value = [] }: IProps) => {
  const { data, refetch } = useTeachers(1, 10);
  const onSearchHandler = _.debounce((name: string) => {
    refetch({ name })
  }, 500);

  const onChangeHandler = (val: IValue[]) => {
    onChange?.(val);
  };

  return (
    <Select
      style={{ width: '100%' }}
      placeholder="請選擇老師"
      showSearch
      onSearch={onSearchHandler}
      filterOption={false}
      mode="multiple"
      onChange={onChangeHandler}
      labelInValue
      value={value}
    >
      {data?.map((item) => (
        <Select.Option
          key={item.id}
          value={item.id}
        >
          {item.name}
        </Select.Option>
      ))}
    </Select>
  );
};


export default TeacherSelect;
