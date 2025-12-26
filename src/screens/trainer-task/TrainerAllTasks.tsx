import React, { useEffect, useRef, useState } from "react";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { ISession, fetchTrainerSessionsApi } from "./TrainerTaskController";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { IPagination } from "../../data/AppInterface";
import { TScrollEvent } from "../../data/AppType";
import Loader from "../../components/common/Loader";
import ICCheckbox from "../../core-component/ICCheckbox";
import { useNavigate } from "react-router-dom";
import TrainerListComponent from "./TrainerListComponent";
import BackButton from "../../components/common/BackButton";

const TrainerAllTasks = () => {
  let timer: NodeJS.Timeout;
  const listInnerRef = useRef<HTMLDivElement>(null);
  const { t } = UseTranslationHook();
  const [sessionList, setSessionList] = useState<ISession[]>([]);
  const [showHistorical, setShowHistorical] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });
  useEffect(() => {
    fetchSession(false, pagination, showHistorical);
  }, [showHistorical]);

  const fetchSession = (
    isAppend: boolean,
    paginationPayload: IPagination,
    showHistorical: boolean
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      fetchTrainerSessionsApi(
        isAppend,
        sessionList,
        setSessionList,
        paginationPayload,
        setPagination,
        setLoading,
        showHistorical
      );
    }, 500);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 1 >= scrollHeight;

      if (
        isNearBottom &&
        sessionList &&
        pagination.total_count > sessionList.length
      ) {
        fetchSession(
          true,
          {
            ...pagination,
            current_page: pagination.current_page + 1,
          },
          showHistorical
        );

        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener(
        "scroll",
        onScroll as unknown as EventListener
      );
      return () => {
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
      };
    }
  }, [pagination]);

  return (
    <div className="comman-padding flex-1 overflow-hidden flex flex-col h-svh md:h-[calc(100vh-76px)]">
      <div className="cursor-pointer">
        <BackButton />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="flex justify-center top flex-1 overflow-y-scroll">
          <div className="md:w-3/4 lg:w-1/2 w-full" ref={listInnerRef}>
            <ICCheckbox
              id={`checkbox`}
              name="framework_consent"
              checked={showHistorical}
              onChange={(e) => setShowHistorical(e.target.checked)}
              label={t("show_historical_record")}
            />
            <TrainerListComponent
              sessionList={sessionList}
              fetchSession={fetchSession}
              showHistorical={showHistorical}
              pagination={pagination}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAllTasks;
