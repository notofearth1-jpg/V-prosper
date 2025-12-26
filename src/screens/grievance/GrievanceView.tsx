import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/common/BackButton";
import { dateFormat, navigationApp } from "../../utils/AppFunctions";
import { addCertificateIcon } from "../../assets/icons/SvgIconList";
import { useNavigate } from "react-router-dom";
import {
  DATE_FORMAT,
  GrievancesStatus,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import { fetchAllGrievance, IGrivance } from "./grievanceController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { userRoute } from "../../routes/RouteUser";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { routeTrainer } from "../../routes/RouteTrainer";
import GrievanceViewSkeleton from "./grievance-skeleton/GrievanceViewSkeleton";
import GrievanceTopView from "./grievance-skeleton/GrievanceTopView";
import NoData from "../../components/common/NoData";
import ICButton from "../../core-component/ICButton";

const GrievanceView = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [grievanceList, setGrievanceList] = useState<IGrivance[] | undefined>(
    []
  );
  const { t } = UseTranslationHook();
  const userRole = Number(localStorageUtils.getRole());
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(50),
      current_page: 1,
      sort_by: "complaint_title",
      order_by: "ASC",
    },
  });
  const fetchall = async () =>
    await fetchAllGrievance(
      setGrievanceList,
      setLoading,
      setPagination,
      pagination,
      t,
      grievanceList
    );

  const listInnerRef = useRef<HTMLDivElement>(null);

  const onScroll = (event: { preventDefault: () => void }) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 1 >= scrollHeight;

      if (
        isNearBottom &&
        grievanceList &&
        pagination.total_count > grievanceList.length
      ) {
        setPagination({ ...pagination, current_page: currentPage + 1 });
        setCurrentPage(currentPage + 1);
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener("scroll", onScroll);
      return () => {
        listInnerElement.removeEventListener("scroll", onScroll);
      };
    }
  }, [pagination]);

  useEffect(() => {
    fetchall();
  }, [currentPage]);

  return (
    <>
      <div className="comman-padding overflow-hidden h-svh flex flex-col md:h-[calc(100vh-76px)]">
        <div>
          <BackButton />
        </div>
        <div
          className="md:flex md:justify-center flex-1 overflow-y-scroll "
          ref={listInnerRef}
        >
          <div className="min-w-full md:min-w-96 max-w-screen-sm cursor">
            <div>
              {loading ? (
                [...Array(1)].map((_, index) => (
                  <GrievanceTopView key={index} />
                ))
              ) : (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <p className="comman-black-big ml-4">
                      {t("grievance_tile")}
                    </p>
                  </div>
                  <ICButton
                    className="!rounded-full !p-0 !w-fit cursor"
                    onClick={() =>
                      navigationApp(
                        navigate,
                        userRole === USER_ROLE.Customer
                          ? userRoute.addUpdateGrievance
                          : userRole === USER_ROLE.Trainer &&
                              routeTrainer.addUpdateGrievance
                      )
                    }
                  >
                    <div className="h-8 w-8 cursor-pointer rounded-full border">
                      {addCertificateIcon}
                    </div>
                  </ICButton>
                </div>
              )}
              <div>
                {grievanceList && !loading && grievanceList.length === 0 ? (
                  <div className="flex justify-center items-center h-[75vh]">
                    <div className="text-center">
                      <NoData
                        title={t("no_grievance")}
                        height={200}
                        width={200}
                      />
                      <p className="mt-2sm">{t("tap_to_add_grievance")}</p>
                    </div>
                  </div>
                ) : (
                  <div>
                    {loading
                      ? [...Array(15)].map((_, index) => (
                          <GrievanceViewSkeleton key={index} />
                        ))
                      : grievanceList &&
                        grievanceList.map((i: any) => (
                          <div
                            key={i.id}
                            className="flex relative justify-between bg-white mt-4 p-4 rounded-lg shadow-inner cursor"
                            onClick={() =>
                              navigate(
                                userRole === USER_ROLE.Customer
                                  ? userRoute.grievanceConversation
                                  : userRole === USER_ROLE.Trainer &&
                                      routeTrainer.grievanceConversation,
                                {
                                  state: {
                                    grievance_id: i.id,
                                    complaint_title: i.complaint_title,
                                    complaint_detail: i.complaint_detail,
                                    grievance_status: i.grievance_status,
                                    booking_id: i.booking_id,
                                  },
                                }
                              )
                            }
                          >
                            <div
                              id="first-div"
                              className="items-center justify-center"
                            >
                              <p className="comman-black-big capitalize">
                                {i?.complaint_title.length > 30
                                  ? i?.complaint_title.substr(0, 47) + "..."
                                  : i?.complaint_title}
                              </p>
                              <p className="comman-grey">
                                {i?.complaint_detail.length > 40
                                  ? i?.complaint_detail.substr(0, 40) + "..."
                                  : i?.complaint_detail}
                              </p>
                            </div>
                            <div
                              id="second-div"
                              className="flex flex-col justify-center"
                            >
                              <p className="comman-black-text">
                                {dateFormat(
                                  new Date(i.complaint_date),
                                  DATE_FORMAT["DD-MM-YYYY"]
                                )}
                              </p>
                              <div className="flex flex-row items-center comman-black-text">
                                <div
                                  className={`w-2 h-2  ${
                                    i.grievance_status === GrievancesStatus[1]
                                      ? "bg-green-500"
                                      : i.grievance_status ===
                                        GrievancesStatus[2]
                                      ? "bg-orange-500"
                                      : "bg-red-500"
                                  } rounded-full m-1 mt-2 ml-0`}
                                ></div>
                                <p className="text-xs mt-1">
                                  {i?.grievance_status
                                    ? i?.grievance_status.replace(
                                        /([A-Z])/g,
                                        " $1"
                                      )
                                    : ""}
                                </p>
                              </div>
                            </div>
                            {i.unread_messages > 0 && (
                              <div className="absolute -top-3 right-0 border  px-[7px] rounded-full bg-skin-primary-button">
                                {i.unread_messages}
                              </div>
                            )}
                          </div>
                        ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrievanceView;
