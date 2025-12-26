import React, { useEffect, useState } from "react";
import { IFaqs } from "../product-services/Web/ProductServiceDetailsWebController";
import { fetchGenFaqsApi } from "./GeneralFaqsController";
import ICAccordion from "../../core-component/ICAccordion";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import BackButton from "../../components/common/BackButton";
import Loader from "../../components/common/Loader";

const GeneralFaqs = () => {
  let timer: NodeJS.Timeout;
  const { t } = UseTranslationHook();
  const [genFaqsList, setGenFaqsList] = useState<IFaqs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchGeneralFaqList();
  }, []);

  const fetchGeneralFaqList = async () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      await fetchGenFaqsApi(setGenFaqsList);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-78px)] flex flex-col">
      <div className="flex  items-center space-x-3">
        <div>
          <BackButton />
        </div>
        <div className="comman-black-lg">{t("general_faqs")}</div>
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {genFaqsList && genFaqsList.length > 0 && (
            <div className="flex-1 overflow-y-scroll remove-scrollbar-width">
              {genFaqsList.map((item, index) => (
                <div className="mt-4" key={index}>
                  <ICAccordion
                    title={item.question}
                    content={
                      <>
                        <div className="comman-grey !leading-relaxed mb-0.5">
                          {item.answer}
                        </div>
                        <p className="link-color comman-grey">
                          {item.reference_links.map((link, index) => (
                            <a key={index} href={link} target="_blank">
                              {link}
                            </a>
                          ))}
                        </p>
                      </>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GeneralFaqs;
