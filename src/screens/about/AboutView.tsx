import React, { useEffect, useState } from "react";
import { IAppContent, fetchContentManagementApi } from "./AboutController";
import CustomEditor from "../product-services/Web/CustomEditor";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import BackButton from "../../components/common/BackButton";
import { APP_CONTENT_TYPE } from "../../utils/AppEnumerations";

const AboutView = () => {
  const { t } = UseTranslationHook();
  const [aboutUs, setAboutUs] = useState<IAppContent>();
  useEffect(() => {
    fetchContentManagementApi(setAboutUs, APP_CONTENT_TYPE.AboutVp);
  }, []);
  return (
    <div>
      {aboutUs && (
        <div className="comman-padding flex flex-col overflow-hidden h-svh md:h-[calc(100vh-76px)]">
          <div className=" flex mb-3">
            <div>
              <BackButton />
            </div>
            <div className=" pl-5 pt-1 font-medium ">
              <p className="!font-bold comman-black-big">{aboutUs.type}</p>
            </div>
          </div>
          <div className="comman-grey flex-1 overflow-y-scroll remove-scrollbar-width">
            <p>
              <CustomEditor serviceDesc={aboutUs?.value} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutView;
