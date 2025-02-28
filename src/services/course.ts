import { COMMIT_COURSE, GET_COURSE, GET_COURSES } from "@/graphql/course"
import { DEFAULT_PAGE_SIZE } from "@/utils/constants"
import { TBaseCourse, TCourseQuery, TCoursesQuery } from "@/utils/type"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { message } from "antd"

//取得多筆課程資料的hook - 用於課程列表
export const useCourses = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const { loading, data, refetch } = useQuery<TCoursesQuery>(GET_COURSES,
    {
      skip: true, //如果設置了 skip: true，則會跳過首次執行，但需要手動調用 refetch 來觸發請求
      variables: {
        page: {
          pageNum,
          pageSize
        }
      }
    })
  const refetchHandler = async (params: {
    name?: string;
    pageSize?: number;
    current?: number;
  }) => {
    const { data: res, errors } = await refetch({
      name: params.name,
      page: {
        pageNum: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      },
    });

    if (errors) {
      return {
        success: false,
      };
    }
    return {
      total: res?.getCourses.page.total,
      data: res?.getCourses.data,
      success: true,
    };
  };

  return {
    loading,
    refetch: refetchHandler,
    page: data?.getCourses.page,
    data: data?.getCourses.data,
  }
}


export const useCoursesForSample = () => {
  const [get, { data, loading }] = useLazyQuery<TCoursesQuery>(GET_COURSES);

  const searchHandler = (name: string) => {
    get({
      variables: {
        name,
        page: {
          pageNum: 1,
          pageSize: DEFAULT_PAGE_SIZE,
        },
      },
    });
  };

  return {
    loading,
    data: data?.getCourses.data,
    search: searchHandler,
  };
};

//使用useLazyQuery取得某一筆課程詳細資料
export const useCourse = () => {
  // const { data, refetch } = useQuery(GET_COURSE, {
  //   skip: true
  // })

  /**
 - useQuery通常是用組件掛載時立即執行查詢，也就是組件在初始化時加要載資料需要自動執行，例如：展示一個列表頁面，這時就可以用useQuery
 - 但若是在組件加載時我想要手動的去觸發API請求，則可以使用useLazyQuery的寫法，
   useLazyQuery並不需要像useQuey一樣手動去觸發refect才能取得資料，它的get可以直接取得資料
  */
  const [get, { loading }] = useLazyQuery(GET_COURSE);
  const getCourse = async (id: string) => {
    const res = await get({
      variables: {
        id,
      },
    });
    return res.data.getCourseInfo.data;
  };

  return { getCourse, loading };
};

//使用useQuery取得某一筆課程詳細資料(主要是要使用refetch來自動更新)
export const useCourseInfo = (id: string) => {
  const { data, refetch, loading } = useQuery<TCourseQuery>(GET_COURSE, {
    // skip: true,
    variables: {
      id
    }
  })

  return { data: data?.getCourseInfo.data, refetch, loading };
};

//新增及修改課程資料的hook
export const useEditCourseInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_COURSE);

  const handleEdit = async (
    id: number,
    params: TBaseCourse,
    callback: (isReload: boolean) => void,
    refetch: () => void
  ) => {
    const res = await edit({
      variables: {
        id,
        params,
      },
    });
    if (res.data.commitCourseInfo.code === 200) {
      message.success(res.data.commitCourseInfo.message);
      callback(true);
      refetch();
      return;
    }
    message.error(res.data.commitCourseInfo.message);
  };

  return [handleEdit, loading];
};
