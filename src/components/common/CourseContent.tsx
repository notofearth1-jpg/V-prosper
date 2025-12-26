import { useState } from "react";
import { linkShareIcon, watchIcon } from "../../assets/icons/SvgIconList";
import { ISCC } from "../../screens/booking/booking-cancellation/BookingCancellationController";
import { commonRoute } from "../../routes/RouteCommon";
import { userRoute } from "../../routes/RouteUser";
import { encryptData } from "../../utils/AppFunctions";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import UseTranslationHook from "../../hooks/UseTranslationHook";

interface ICourseContentProps {
  content: ISCC[];
  hideContent?: boolean;
}

const CourseContent: React.FC<ICourseContentProps> = ({
  content,
  hideContent = false,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const userId = localStorageUtils.getUserId();
  const { t } = UseTranslationHook();

  const handleExpend = (id: number) => {
    if (hideContent) return;
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const handleClick = (id: number, isFolder: boolean = false) => {
    const url = `${
      isFolder ? commonRoute.folderDetail : userRoute.libraryDetails
    }?id=${encryptData(
      id.toString() + "|hst" + `|${userId}` + `|${id.toString()}`
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div>
      <ul className="w-full course-list">
        {content.length > 0 &&
          content.map((data, index) => (
            <li
              key={index}
              className={`${expandedId === data.id ? "bg-white" : ""} ${
                hideContent ? "show-content" : ""
              } top custom-border`}
            >
              <div
                className={`question course-list-title ${
                  expandedId === data.id ? "active" : ""
                }`}
                onClick={() => handleExpend(data.id)}
              >
                <h3
                  className={`comman-black-text  !text-xl ${
                    expandedId === data.id ? "!text-white" : ""
                  }`}
                >
                  {data.content_title}
                </h3>
              </div>
              <div
                className="answer text-justify"
                style={{
                  maxHeight: expandedId === data.id ? "1000px" : "0",
                }}
              >
                {data.library_content &&
                  data.library_content.length > 0 &&
                  data.library_content.map((libContent, idx) => (
                    <div className="mt-2" key={idx}>
                      <li className="comman-grey !flex items-center justify-between p-[20px] custom-border-bottom">
                        <div className="flex items-center">
                          <p className="comman-grey">{libContent.title}</p>
                          <div className="flex items-center whitespace-nowrap ml-3">
                            <div className="w-5 h-5">{watchIcon}</div>
                            <span className="ml-2">
                              {data?.content_delivery_time} {t("m")}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-5 cursor`}
                          onClick={() => handleClick(libContent.id)}
                        >
                          {linkShareIcon}
                        </div>
                      </li>
                    </div>
                  ))}
                {data.library_directory &&
                  data.library_directory.length > 0 &&
                  data.library_directory.map((libDir, idx) => (
                    <div
                      className="flex items-center justify-between px-4 mt-2 py-4"
                      key={idx}
                    >
                      <div className="flex items-center">
                        <p className="comman-grey">{libDir.title}</p>
                        <div className="flex items-center whitespace-nowrap ml-3">
                          <div className="w-5 h-5">{watchIcon}</div>
                          <span className="ml-2">
                            {data?.content_delivery_time} {t("m")}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-5 cursor`}
                        onClick={() => handleClick(libDir.id, true)}
                      >
                        {linkShareIcon}
                      </div>
                    </div>
                  ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CourseContent;
