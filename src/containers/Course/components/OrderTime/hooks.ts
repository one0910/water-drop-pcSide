import { useCourseInfo, useEditCourseInfo } from "@/services/course"
import { IOrderTime, IWeekCourse, TWeek } from "@/utils/type"
import { useMemo } from "react"
import { DAYS, isWorkDay } from "./constants"

export const useOrderTime = (id: string, currentDayKey: TWeek) => {
  const { data, loading, refetch } = useCourseInfo(id) //這裡改成用useQuery的部份來取得資料
  const [edit, editLoading] = useEditCourseInfo()


  //在後端取得該課程達細資料後，從該資料將預約時間抽出來，設置一個orderTime變數給這個<EditableProTable/>這個組件做渲染
  const orderTime = useMemo(() => {
    if (!data?.reducibleTime) {
      return []
    }
    return (data.reducibleTime).find(item => item.week === currentDayKey)?.orderTime || []
  }, [data, currentDayKey])


  //按下刪除的按鈕時
  const onDeleteHandler = (key: number) => {
    const newData = orderTime.filter(item => item.key !== key)
    onSaveHandler(newData)
  }

  //按下保存按鈕或是刪除的按鈕後，將資料送至後端更新
  const onSaveHandler = (ot: IOrderTime[]) => {
    const rt = [...(data?.reducibleTime || [])]

    //reducibleTime裡面包含整個星期的所有資料，所以先用findIndex及currentDay.key,來尋找現在更新的是tab上星期幾的資料
    const index = rt.findIndex(item => item.week === currentDayKey)
    /**
    若有尋找到該編輯的資料是在哪個星期幾,則再將其資料做更新，
    由於帶進來的資料ot，已是在按下保存後該星期幾的所有預時間資料，所以直接將orderTime的資料全部帶入ot以進行更新
    */
    if (index > -1) {
      rt[index] = {
        week: currentDayKey,
        orderTime: ot
      }
    } else {
      //若該星期幾的tab裡沒有資料，則透過push將資料加進去
      rt.push({
        week: currentDayKey,
        orderTime: ot
      })
    }
    edit(id, { reducibleTime: rt }, () => refetch())
  }

  //按下全工作日(一~五)同步的按鈕
  const allWorkDaySyncHandler = () => {
    const rt: IWeekCourse[] = []
    DAYS.forEach((item) => {
      console.log(`item => `, item)
      if (isWorkDay(item.key)) {
        rt.push({
          week: item.key,
          orderTime
        })
      }
    })
    edit(id, { reducibleTime: rt }, () => refetch())
  }

  //按下全週作日(一~日)同步的按鈕
  const allWeekSyncHandler = () => {
    const rt: IWeekCourse[] = [];
    DAYS.forEach((item) => {
      rt.push({
        week: item.key,
        orderTime,
      });
    });
    edit(id, { reducibleTime: rt }, () => refetch())
  }
  return {
    orderTime,
    loading: loading || editLoading,
    onDeleteHandler,
    onSaveHandler,
    allWeekSyncHandler,
    allWorkDaySyncHandler
  }
}
