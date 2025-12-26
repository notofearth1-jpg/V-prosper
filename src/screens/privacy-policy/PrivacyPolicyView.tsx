import React, { useEffect, useState } from "react";
import {
  IAppContent,
  fetchContentManagementApi,
} from "../about/AboutController";
import BackButton from "../../components/common/BackButton";
import CustomEditor from "../product-services/Web/CustomEditor";
import { APP_CONTENT_TYPE } from "../../utils/AppEnumerations";

const PrivacyPolicyView = () => {
  const [privacy, setPrivacy] = useState<IAppContent>();
  useEffect(() => {
    fetchContentManagementApi(setPrivacy, APP_CONTENT_TYPE.PrivacyPolicy);
  }, []);
  return (
    <div>
      {privacy && (
        <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
          <div className="flex mb-3">
            <div>
              <BackButton />
            </div>
            <div className="  pl-5 pt-1 font-medium ">
              <p className="!font-bold comman-black-big">{privacy.type}</p>
            </div>
          </div>

          <div className="comman-grey flex-1 overflow-y-scroll remove-scrollbar-width">
            <p>
              <CustomEditor serviceDesc={privacy?.value} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacyPolicyView;
