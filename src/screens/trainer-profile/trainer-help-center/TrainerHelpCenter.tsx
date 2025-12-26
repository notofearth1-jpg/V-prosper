import React, { useEffect, useRef, useState } from "react";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import { crossRemove, searchIcon } from "../../../assets/icons/SvgIconList";
import ICTextInput from "../../../core-component/ICTextInput";
import {
  ITrainerHelpCenter,
  ITrainerHelpCenterTopic,
  getTrainerHelpCategories,
  getTrainerSystemHelp,
} from "./TrainerHelpCenterController";
import { TOnChangeInput } from "../../../data/AppType";
import BackButton from "../../../components/common/BackButton";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { useNavigate } from "react-router-dom";
import { routeTrainer } from "../../../routes/RouteTrainer";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { USER_ROLE } from "../../../utils/AppEnumerations";
import { userRoute } from "../../../routes/RouteUser";
import TrainerHelpCenterSkeleton from "./trainer-help-center-skeleton/TrainerHelpCenterSkeleton";

const TrainerHelpCenter = () => {
  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);
  const [searchText, setSearchText] = useState<string>("");
  const [helpCategory, setHelpCategory] = useState<ITrainerHelpCenter[]>([]);
  const [systemHelp, setSystemHelp] = useState<ITrainerHelpCenterTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const userRole = Number(localStorageUtils.getRole());
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const handleInputChange = (event: TOnChangeInput) => {
    setSearchText(event.target.value);
  };

  const handleClearInput = () => {
    setSearchText("");
    setSystemHelp([]);
  };

  useEffect(() => {
    getTrainerHelpCategories(setHelpCategory, setLoading);
  }, []);

  useEffect(() => {
    if (searchText !== "") {
      getTrainerSystemHelp(setSystemHelp, searchText, setSearchLoading);
    } else {
      setSystemHelp([]);
      getTrainerHelpCategories(setHelpCategory, setLoading);
    }
  }, [searchText]);

  return (
    <div className="overflow-hidden">
      <div className="comman-padding !pb-0">
        <BackButton />
      </div>
      <div className="comman-padding overflow-hidden h-[calc(svh-44px)] md:h-[calc(100vh-120px)] flex justify-center">
        <div className={`md:w-3/4 lg:w-1/2 w-full h-full  flex flex-col`}>
          <div className="flex items-center">
            <div className="search-container flex-1 ">
              <div className="search-icon">
                <div className="search-icon">{searchIcon}</div>
              </div>
              <ICTextInput
                type="text"
                className="w-full common-search pl-10 flex items-center comman-grey"
                placeholder={t("search_topic")}
                value={searchText}
                onChange={handleInputChange}
              />
              {searchText && (
                <div
                  className="help-cross-icon w-10 h-10 cursor"
                  onClick={handleClearInput}
                >
                  <div>{crossRemove}</div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-y-scroll flex-1 remove-scrollbar-width">
            {loading
              ? [...Array(5)].map((_, index) => (
                  <TrainerHelpCenterSkeleton key={index} />
                ))
              : !searchText &&
                helpCategory.length > 0 &&
                systemHelp.length === 0 && (
                  <div>
                    {helpCategory
                      .sort(
                        (a, b) =>
                          parseFloat(a.display_sequence) -
                          parseFloat(b.display_sequence)
                      )
                      .map((item, index) => (
                        <div
                          className="top flex items-center booking-info cursor"
                          key={index}
                          onClick={() => {
                            navigate(
                              userRole === USER_ROLE.Trainer
                                ? routeTrainer.helpTopic
                                : userRoute.helpTopic,
                              {
                                state: { id: item.id },
                              }
                            );
                          }}
                        >
                          <div className="mx-3 flex flex-col items-center">
                            <div className="comman-black-big">
                              <p>{item?.category_title}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

            {systemHelp.length > 0 && (
              <div className=" top justify-center flex-col">
                {systemHelp
                  .sort(
                    (a, b) =>
                      parseFloat(a.display_sequence) -
                      parseFloat(b.display_sequence)
                  )
                  .map((item, index) => (
                    <div
                      className="top flex items-center booking-info cursor"
                      key={index}
                      onClick={() => {
                        navigate(
                          userRole === USER_ROLE.Trainer
                            ? routeTrainer.helpTopicDetails
                            : userRoute.helpTopicDetails,
                          {
                            state: { id: item.id },
                          }
                        );
                      }}
                    >
                      <div className="mx-3 flex flex-col items-center">
                        <div className="comman black-big">
                          <p>{item?.topic}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerHelpCenter;
