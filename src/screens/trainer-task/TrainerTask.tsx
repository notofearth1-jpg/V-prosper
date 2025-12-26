import React, { useEffect, useState } from "react";
import TrainerBottomNavbar from "../header/TrainerBottomNavbar";
import DatePickerCustom from "./DatePicker";
import { ISession, fetchTrainerSessionsApi } from "./TrainerTaskController";
import Loader from "../../components/common/Loader";
import { dateFormat, getLocalDate } from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import usePaginationHook from "../../hooks/UsePaginationHook";
import TrainerListComponent from "./TrainerListComponent";

const TrainerTask = () => {
  let timer: NodeJS.Timeout;
  const { t } = UseTranslationHook();
  const [sessionList, setSessionList] = useState<ISession[]>([]);
  const [sessionDateList, setSessionDateList] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    dateFormat(getLocalDate(), 3) as string
  );
  const currentDate = getLocalDate().toISOString().split("T")[0];

  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: 100,
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });

  useEffect(() => {
    fetchSession();
  }, [selectedDate]);

  const fetchSession = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await fetchTrainerSessionsApi(
        false,
        sessionList,
        setSessionList,
        pagination,
        setPagination,
        setLoading,
        true,
        setSessionDateList,
        selectedDate
      );
    }, 500);
  };

  return (
    <div className="comman-padding container mx-auto h-svh md:h-[calc(100vh-76px)] flex justify-center">
      <div className="w-full md:w-3/4 lg:w-1/2 h-full overflow-hidden flex-col flex ">
        <div className="w-full flex justify-center">
          <DatePickerCustom
            sessionDateList={sessionDateList}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        </div>

        <div className="top flex-1 overflow-hidden flex flex-col mb-[60px] md:mb-0">
          <div className="comman-black-big">
            <p>
              {` ${currentDate === selectedDate ? t("todays") : selectedDate}
              ${sessionList.length > 1 ? t("tasks") : t("task")}
              ${sessionList && `(${sessionList.length})`}`}
            </p>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="overflow-y-scroll flex-1">
              <TrainerListComponent
                sessionList={sessionList}
                fetchSession={fetchSession}
                showHistorical={true}
                pagination={pagination}
              />
            </div>
          )}
        </div>
      </div>

      <TrainerBottomNavbar taskActive />
    </div>
  );
};

export default TrainerTask;
