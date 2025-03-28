import { AUTO_CREATE_SCHEDULE, GET_SCHEDULES } from '@/graphql/dashboard';
import { TSchedulesQuery } from '@/utils/type';
import { useMutation, useQuery } from '@apollo/client';
import { message } from 'antd';

//自動排課API的hook
export const useAutoCreateSchedule = (): [handleEdit: Function, loading: boolean] => {
  const [run, { loading }] = useMutation(AUTO_CREATE_SCHEDULE);

  const handleRun = async (startDay: string, endDay: string) => {
    const res = await run({
      variables: {
        startDay,
        endDay,
      },
    });
    message.info(res.data.autoCreateSchedule.message);
  };

  return [handleRun, loading];
};

//取得該門市分店當日的排課表API的hook
export const useSchedules = (today: string) => {
  const { data, loading, refetch } = useQuery<TSchedulesQuery>(GET_SCHEDULES, {
    variables: {
      today,
    },
  });

  return {
    loading,
    data: data?.getSchedules.data,
    refetch,
  };
};
