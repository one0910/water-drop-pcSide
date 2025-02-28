
import style from './index.module.less';
import { Select } from 'antd';
import _ from 'lodash';
import { useCoursesForSample } from '@/services/course';

interface IProps {
  onSelected: (val: string) => void;
}

/**
* 課程選擇搜索器
*/
const CourseSearch = ({ onSelected }: IProps) => {
  const { search, data, loading } = useCoursesForSample();

  const onSearchHandler = _.debounce((name: string) => {
    search(name);
  }, 500);

  const onChangeHandler = (option_value: string) => {
    //再把option所帶的value id透過onSelected帶回到上層組件ConsumeCard
    onSelected(option_value)
  };

  return (
    <Select
      className={style.select}
      placeholder="請搜索課程"
      onSearch={onSearchHandler}
      onChange={onChangeHandler}
      filterOption={false}
      loading={loading}
      showSearch
    >
      {
        data?.map((item) => (
          <Select.Option key={item.id} value={item.id}>
            {item.name}
          </Select.Option>
        ))
      }
    </Select>
  );
};

export default CourseSearch;
