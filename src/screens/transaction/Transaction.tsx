import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/common/BackButton";
import { filterIcon } from "../../assets/icons/SvgIconList";
import ICImage from "../../core-component/ICImage";
import { TReactSetState, TScrollEvent } from "../../data/AppType";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { useNavigate } from "react-router-dom";
import {
  IFilters,
  ITransaction,
  fetchTransactionApi,
  getStatusClass,
} from "./TransactionController";
import {
  PAGINATION_PER_PAGE_ROWS,
  TRANSACTION_FOR_LABEL,
  TRANSACTION_STATUS_LABEL,
} from "../../utils/AppConstants";
import usePaginationHook from "../../hooks/UsePaginationHook";
import moment from "moment";
import VerticalBuffer from "../../components/common/VerticalBuffer";
import {
  CURRENCY,
  PAYMENT_TRANSACTION_STATUS,
  TRANSACTION_FOR,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_LABEL,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import CustomDatePicker from "../../components/common/CustomDatePicker";
import { getLocalDate } from "../../utils/AppFunctions";
import ICButton from "../../core-component/ICButton";
import { userRoute } from "../../routes/RouteUser";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import TransactionViewSkeleton from "./transaction-skeleton/TransactionViewSkeleton";
import ICCommonModal from "../../components/common/ICCommonModel";
import { IPagination } from "../../data/AppInterface";
import { routeTrainer } from "../../routes/RouteTrainer";
import NoData from "../../components/common/NoData";

const Transactions = () => {
  const userRole = Number(localStorageUtils.getRole());
  const [loading, setLoading] = useState(true);
  const [transactionList, setTransactionList] = useState<ITransaction[]>([]);
  const [buffer, setBuffer] = useState(false);
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<number | null>(
    null
  );
  const [transactionFor, setTransactionFor] = useState("");
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Twenty),
      current_page: 1,
      sort_by: "",
      order_by: "DESC",
    },
  });
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const listInnerRef = useRef<HTMLDivElement>(null);
  let timer: NodeJS.Timeout;
  const navigate = useNavigate();

  const fetchTransaction = async (
    objPagination: IPagination,
    setLoading: TReactSetState<boolean>,
    append = false
  ) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fetchTransactionApi(
        setTransactionList,
        setLoading,
        setPagination,
        objPagination,
        transactionList,
        transactionType,
        transactionFor,
        fromDate ? moment(fromDate).format("YYYY-MM-DD") : undefined,
        toDate ? moment(toDate).format("YYYY-MM-DD") : undefined,
        transactionStatus ? transactionStatus : undefined,
        append
      );
    }, 500);
  };

  const handelTransactionType = (type: string) => {
    setTransactionType(type);
  };

  const handelTransactionFor = (type: string) => {
    setTransactionFor(type);
  };

  const handelTransactionSatus = (type: number | null) => {
    setTransactionStatus(type);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight + 1 >= scrollHeight;
      if (
        !loading &&
        isNearBottom &&
        transactionList &&
        transactionList.length > 0 &&
        pagination.total_count > transactionList.length
      ) {
        fetchTransaction(
          {
            ...pagination,
            current_page: pagination.current_page + 1,
          },
          setBuffer,
          true
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
    }

    return () => {
      if (listInnerElement)
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
    };
  }, [pagination, transactionList]);

  useEffect(() => {
    const storedFilters = localStorageUtils.getFilters();

    if (storedFilters) {
      const {
        transactionType,
        transactionFor,
        fromDate,
        toDate,
        transactionStatus,
      } = JSON.parse(storedFilters);

      setTransactionFor(transactionFor);
      setTransactionType(transactionType);
      setFromDate(fromDate ? new Date(fromDate) : null);
      setToDate(toDate ? new Date(toDate) : null);
      setTransactionStatus(
        transactionStatus ? Number(transactionStatus) : null
      );

      fetchTransactionApi(
        setTransactionList,
        setLoading,
        setPagination,
        pagination,
        transactionList,
        transactionType,
        transactionFor,
        fromDate ? moment(fromDate).format("YYYY-MM-DD") : undefined,
        toDate ? moment(toDate).format("YYYY-MM-DD") : undefined,
        transactionStatus ? transactionStatus : undefined
      );
    } else {
      fetchTransaction(pagination, setLoading);
    }
  }, []);

  const { t } = UseTranslationHook();

  const handleEditClick = () => {
    setIsBottomDivVisible(true);
  };

  const clearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setTransactionType("");
    setTransactionFor("");
    setTransactionStatus(null);

    localStorageUtils.removeFilters();
  };

  const applyFilters = () => {
    setLoading(true);
    fetchTransactionApi(
      setTransactionList,
      setLoading,
      setPagination,
      { ...pagination, current_page: 1 },
      transactionList,
      transactionType,
      transactionFor,
      fromDate ? moment(fromDate).format("YYYY-MM-DD") : undefined,
      toDate ? moment(toDate).format("YYYY-MM-DD") : undefined,
      transactionStatus ? transactionStatus : undefined
    );
    setIsBottomDivVisible(false);

    localStorageUtils.setFilters(
      JSON.stringify({
        transactionType,
        transactionFor,
        fromDate,
        toDate,
        transactionStatus,
      })
    );
  };

  const handleFromDateChange = (date: Date) => {
    setFromDate(date);
  };

  const handleToDateChange = (date: Date) => {
    setToDate(date);
  };

  const getImageSource = (entityType: string) => {
    if (entityType === TRANSACTION_FOR.Booking) {
      return require("../../assets/image/booking.png");
    } else if (entityType === TRANSACTION_FOR.LibraryContent) {
      return require("../../assets/image/library.png");
    } else if (entityType === TRANSACTION_FOR.Subscription) {
      return require("../../assets/image/subscription.png");
    } else if (entityType === TRANSACTION_FOR.Event) {
      return require("../../assets/image/event.png");
    } else if (entityType === TRANSACTION_FOR.LibraryDirectory) {
      return require("../../assets/image/libraryDirectory.png");
    }
  };

  const handelClear = () => {
    setIsBottomDivVisible(false);
  };

  const transactionFilter = (
    <>
      <div className="!font-bold comman-black-big text-xl">
        {t("transaction_type")}
      </div>
      <div className="flex items-center top">
        <div
          className={`comman-black-text transaction-type cursor  ${
            transactionType === TRANSACTION_TYPE_LABEL.Debit ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionType(TRANSACTION_TYPE_LABEL.Debit);
          }}
        >
          {TRANSACTION_TYPE.Credit}
        </div>

        <div
          className={`comman-black-text transaction-type cursor ml-2 ${
            transactionType === TRANSACTION_TYPE_LABEL.Credit ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionType(TRANSACTION_TYPE_LABEL.Credit);
          }}
        >
          {TRANSACTION_TYPE.Debit}
        </div>
      </div>
      <div className="!font-bold comman-black-big top">
        {t("transaction_for")}
      </div>
      <div className="flex items-center top flex-wrap gap-2">
        {userRole === USER_ROLE.Customer && (
          <div
            className={`comman-black-text transaction-type cursor  ${
              transactionFor === TRANSACTION_FOR.Booking ? "active" : ""
            }`}
            onClick={() => {
              handelTransactionFor(TRANSACTION_FOR.Booking);
            }}
          >
            {t(TRANSACTION_FOR_LABEL[TRANSACTION_FOR.Booking])}
          </div>
        )}
        <div
          className={`comman-black-text transaction-type cursor  ${
            transactionFor === TRANSACTION_FOR.LibraryContent ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionFor(TRANSACTION_FOR.LibraryContent);
          }}
        >
          {t(TRANSACTION_FOR_LABEL[TRANSACTION_FOR.LibraryContent])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor  ${
            transactionFor === TRANSACTION_FOR.LibraryDirectory ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionFor(TRANSACTION_FOR.LibraryDirectory);
          }}
        >
          {t(TRANSACTION_FOR_LABEL[TRANSACTION_FOR.LibraryDirectory])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor  ${
            transactionFor === TRANSACTION_FOR.Event ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionFor(TRANSACTION_FOR.Event);
          }}
        >
          {t(TRANSACTION_FOR_LABEL[TRANSACTION_FOR.Event])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor  md:mt-0 mt-2 ${
            transactionFor === TRANSACTION_FOR.Subscription ? "active" : ""
          }`}
          onClick={() => {
            handelTransactionFor(TRANSACTION_FOR.Subscription);
          }}
        >
          {t(TRANSACTION_FOR_LABEL[TRANSACTION_FOR.Subscription])}
        </div>
      </div>

      <div className="!font-bold comman-black-big top">
        {t("transaction_status")}
      </div>
      <div className="flex items-center top flex-wrap ">
        <div
          className={`comman-black-text transaction-type cursor ${
            transactionStatus === PAYMENT_TRANSACTION_STATUS.Initiated
              ? "active"
              : ""
          }`}
          onClick={() => {
            handelTransactionSatus(PAYMENT_TRANSACTION_STATUS.Initiated);
          }}
        >
          {t(TRANSACTION_STATUS_LABEL[PAYMENT_TRANSACTION_STATUS.Initiated])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor ml-2 ${
            transactionStatus === PAYMENT_TRANSACTION_STATUS.Captured
              ? "active"
              : ""
          }`}
          onClick={() => {
            handelTransactionSatus(PAYMENT_TRANSACTION_STATUS.Captured);
          }}
        >
          {t(TRANSACTION_STATUS_LABEL[PAYMENT_TRANSACTION_STATUS.Captured])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor ml-2 ${
            transactionStatus === PAYMENT_TRANSACTION_STATUS.Refunded
              ? "active"
              : ""
          }`}
          onClick={() => {
            handelTransactionSatus(PAYMENT_TRANSACTION_STATUS.Refunded);
          }}
        >
          {t(TRANSACTION_STATUS_LABEL[PAYMENT_TRANSACTION_STATUS.Refunded])}
        </div>
        <div
          className={`comman-black-text transaction-type cursor ml-2 ${
            transactionStatus === PAYMENT_TRANSACTION_STATUS.Failed
              ? "active"
              : ""
          }`}
          onClick={() => {
            handelTransactionSatus(PAYMENT_TRANSACTION_STATUS.Failed);
          }}
        >
          {t(TRANSACTION_STATUS_LABEL[PAYMENT_TRANSACTION_STATUS.Failed])}
        </div>
      </div>

      <div className="!font-bold comman-black-big top">{t("custom_range")}</div>
      <div className="top flex items-center">
        <div>
          <p className="comman-black-lg">{t("from")}</p>
          <div className="border-2">
            <CustomDatePicker
              selectedDate={fromDate}
              onChange={handleFromDateChange}
              showIcon
              maxDate={toDate ? toDate : getLocalDate()}
            />
          </div>
        </div>
        <div>
          <p className="comman-black-lg">{t("to")}</p>
          <div className="border-2">
            <CustomDatePicker
              selectedDate={toDate}
              onChange={handleToDateChange}
              showIcon
              maxDate={getLocalDate()}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center w-full justify-between top mb-0 md:mb-7">
        <ICButton
          type="button"
          className={`cursor px-6 py-3 text-sm font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca] focus:outline-none w-full comman-btn uppercase`}
          onClick={clearFilters}
        >
          <div className="flex items-center justify-center">
            <p className="font-bold ml-2 !text-[14px]">{t("clear_filter")}</p>
          </div>
        </ICButton>
        <ICButton
          type="button"
          className={`cursor px-6 py-3 !text-[14px] font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca] focus:outline-none w-full comman-btn uppercase ml-2`}
          onClick={() => {
            applyFilters();
          }}
        >
          <div className="flex items-center justify-center">
            <p className="font-bold ml-2">{t("apply_filter")}</p>
          </div>
        </ICButton>
      </div>
    </>
  );

  return (
    <>
      <div className="overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
        <div className="flex items-center justify-between  comman-padding">
          <BackButton />
          <div className="h-7 w-7 cursor" onClick={handleEditClick}>
            {filterIcon}
          </div>
        </div>
        <div
          className="flex flex-col items-center flex-1 overflow-auto"
          ref={listInnerRef}
        >
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div key={index}>
                <TransactionViewSkeleton />
              </div>
            ))
          ) : (
            <div className="md:w-3/4 lg:w-1/2 w-full">
              {transactionList && transactionList.length > 0 ? (
                <div>
                  {transactionList.map((item, index) => (
                    <div
                      className="booking-card mb-5 cursor"
                      key={index}
                      onClick={() => {
                        navigate(
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.transactionDetails
                            : userRoute.transactionDetails,
                          {
                            state: { id: item.id },
                          }
                        );
                      }}
                    >
                      <div className="comman-padding">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-3">
                            <div className="h-15 w-15">
                              <ICImage
                                height={60}
                                width={60}
                                src={getImageSource(item.entity_type)}
                                className="!h-10 w-10"
                                scaled={false}
                              />
                            </div>
                            <div className="text-wrap flex flex-col justify-center">
                              <div className="comman-black-lg">
                                {item.service_title}
                              </div>
                              <div className="comman-grey flex space-x-2">
                                <div>
                                  {moment(
                                    item.transaction_initiate_date
                                  ).format("DD MMM YYYY")}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <p className="comman-black-lg">
                              {CURRENCY.INR}
                              {item.transaction_amount}
                            </p>
                            <p
                              className={`flex justify-end ${getStatusClass(
                                item.payment_transaction_status
                              )}`}
                            >
                              {item.payment_transaction_status_label}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {buffer && (
                    <div className="flex justify-center items-center">
                      <VerticalBuffer />
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[75svh]">
                  <NoData
                    title={t("no_transaction")}
                    height={200}
                    width={200}
                  />
                </div>
              )}
              <ICCommonModal
                title={t("filter_transaction")}
                content={transactionFilter}
                isModalShow={isBottomDivVisible}
                setIsModalShow={setIsBottomDivVisible}
                handleCloseButton={handelClear}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Transactions;
