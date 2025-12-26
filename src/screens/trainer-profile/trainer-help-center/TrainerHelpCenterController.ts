import { TReactSetState } from "../../../data/AppType";
import {
  GET_ALL_HELP_CATEGORIES,
  GET_ALL_SYSTEM_HELP,
  GET_ALL_SYSTEM_HELP_BY_ID,
  GET_SYSTEM_HELP_TOPIC_BY_ID,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { toastError } from "../../../utils/AppFunctions";

export interface ITrainerHelpCenter {
  id: number;
  category_title: string;
  display_sequence: string;
}

export interface ITrainerHelpCenterTopic {
  id: number;
  topic: string;
  display_sequence: string;
  help_category: ITrainerHelpCenter;
}

export interface ITrainerHelpCenterTopicDetails {
  id: number;
  topic: string;
  display_sequence: string;
  help_category: ITrainerHelpCenter;
  help_description: string;
  help_video_url: string;
  is_active: string;
  reference_links: string[];
  tags: string[];
  target_audiance: string;
}

export const getTrainerHelpCategories = async (
  trainerHelpCategories: TReactSetState<ITrainerHelpCenter[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerHelpCategoriesList = await GET_ALL_HELP_CATEGORIES();

    if (
      trainerHelpCategoriesList &&
      trainerHelpCategoriesList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerHelpCategories(trainerHelpCategoriesList.data.item);
    } else {
      toastError(
        trainerHelpCategoriesList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerHelpCategoriesList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const getTrainerSystemHelp = async (
  trainerSystemHelpData: TReactSetState<ITrainerHelpCenterTopic[]>,
  query: string,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerSystemHelpList = await GET_ALL_SYSTEM_HELP(query);

    if (
      trainerSystemHelpList &&
      trainerSystemHelpList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerSystemHelpData(trainerSystemHelpList.data.item);
    } else {
      toastError(
        trainerSystemHelpList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerSystemHelpList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const getTrainerSystemHelpTopicById = async (
  trainerHelpTopics: TReactSetState<ITrainerHelpCenterTopic[]>,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerSystemHelpListById = await GET_ALL_SYSTEM_HELP_BY_ID(id);

    if (
      trainerSystemHelpListById &&
      trainerSystemHelpListById.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerHelpTopics(trainerSystemHelpListById.data.item);
    } else {
      toastError(
        trainerSystemHelpListById.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerSystemHelpListById.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const getTrainerSystemHelpTopicDetailsById = async (
  trainerHelpTopics: TReactSetState<ITrainerHelpCenterTopicDetails | undefined>,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerSystemHelpTopicDetailsById = await GET_SYSTEM_HELP_TOPIC_BY_ID(
      id
    );

    if (
      trainerSystemHelpTopicDetailsById &&
      trainerSystemHelpTopicDetailsById.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerHelpTopics(trainerSystemHelpTopicDetailsById.data);
    } else {
      toastError(
        trainerSystemHelpTopicDetailsById.message ||
          MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerSystemHelpListById.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};
