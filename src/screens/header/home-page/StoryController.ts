import React from "react";
import { toastError } from "../../../utils/AppFunctions";
import { GET_ALL_HIGHLIGHTS } from "../../../services/Endpoints";
import { IAppMedia } from "../../../data/AppInterface";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { TReactSetState } from "../../../data/AppType";
export interface IStory {
  id: number;
  highlight_text: string;
  cancellation_charge_percentage: number;
  end_date: string;
  upload_datetime: string;
  app_media: IAppMedia[];
}
export const fetchHighlightsApi = async (
  setHighlights: TReactSetState<IStory[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const highlightList = await GET_ALL_HIGHLIGHTS();

    if (highlightList && highlightList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setHighlights(highlightList.data.item);
    } else {
      toastError(highlightList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.highlightList?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
