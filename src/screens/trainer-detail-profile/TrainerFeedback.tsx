import React, { useState } from "react";
import { ITrainerFeedback } from "./TrainerDetailsProfileController";
import {
  dateFormat,
  getStarColors,
  trailingDotAddition,
} from "../../utils/AppFunctions";
import { editProfileIcon, StarIcon } from "../../assets/icons/SvgIconList";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import ICSweetAlertModal from "../../core-component/ICSweetAlertModal";
import UseTranslationHook from "../../hooks/UseTranslationHook";

interface ITranierFeedBackProps {
  trainerFeedbacks: ITrainerFeedback;
  openEditModal: (comment: string, ratings: number) => void;
  deleteFeedback: () => void;
}

const TrainerFeedback = ({
  trainerFeedbacks,
  openEditModal,
  deleteFeedback,
}: ITranierFeedBackProps) => {
  const [isExpendText, setExpendText] = useState(false);
  const userId = localStorageUtils.getUserId();
  const { t } = UseTranslationHook();
  return (
    <div>
      <div key={trainerFeedbacks.id}>
        {/* upperdiv name,three dots */}
        <div className="flex justify-between items-center">
          <div className="">
            <p className="!text-md mr-2 !font-bold capitalize comman-black-big">
              {trainerFeedbacks.user_name}
            </p>
            <p className="!text-xs comman-grey">
              {trainerFeedbacks?.modified_date
                ? dateFormat(new Date(trainerFeedbacks?.modified_date))
                : dateFormat(new Date(trainerFeedbacks.created_date))}
            </p>
          </div>
          <div className="flex items-center">
            {Number(userId) === trainerFeedbacks.user_id ? (
              <div className="flex  items-center justify-center text-center">
                <p
                  className="cursor w-6 h-6 mr-2"
                  onClick={() =>
                    openEditModal(
                      trainerFeedbacks.comments
                        ? trainerFeedbacks.comments
                        : "",
                      trainerFeedbacks.ratings
                    )
                  }
                >
                  {editProfileIcon}
                </p>
                <div
                  className="w-7 h-7 mr-2 cursor-pointer"
                  title={t("delete_tooltip_icon")}
                >
                  <ICSweetAlertModal
                    title={t("delete_feedback_title")}
                    text={t("delete_feedback_text")}
                    onConfirm={deleteFeedback}
                    itemId={trainerFeedbacks.id}
                  />
                </div>
              </div>
            ) : null}
            <div
              className={`flex items-center pl-1 pr-1 border rounded-md bg-gre justify-center ${getStarColors(
                trainerFeedbacks.ratings
              )}`}
            >
              <div className="w-4 h-4  mr-1 svg-color">{StarIcon}</div>
              <p className="text-lg text-white mr-1">
                {trainerFeedbacks.ratings}
              </p>
            </div>
          </div>
        </div>
        <p
          onClick={() => setExpendText(!isExpendText)}
          className="mt-2 mb-3 comman-black-text cursor"
        >
          {isExpendText
            ? trainerFeedbacks.comments
            : trailingDotAddition(
                trainerFeedbacks.comments ? trainerFeedbacks.comments : "",
                160
              )}
        </p>
        <div className="h-0.5 w-full bg-gray-200" />
      </div>
    </div>
  );
};

export default TrainerFeedback;
