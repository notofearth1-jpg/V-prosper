import React, { useEffect, useState } from "react";
import {
  IAppContent,
  fetchContentManagementApi,
} from "../about/AboutController";
import BackButton from "../../components/common/BackButton";
import CustomEditor from "../product-services/Web/CustomEditor";
import { APP_CONTENT_TYPE } from "../../utils/AppEnumerations";

const TermsServiceView = () => {
  const [terms, setTerms] = useState<IAppContent>();
  useEffect(() => {
    fetchContentManagementApi(setTerms, APP_CONTENT_TYPE.TermsOfService);
  }, []);
  return (
    <div>
      {terms && (
        <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
          <div className="flex mb-3">
            <div>
              <BackButton />
            </div>
            <div className=" pl-5 pt-1 comman-black-big">
              <p>{terms.type}</p>
            </div>
          </div>

          <div className="comman-grey flex-1 overflow-y-scroll remove-scrollbar-width">
            <p>
              <CustomEditor serviceDesc={terms?.value} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsServiceView;
