import { useFormik } from "formik";
import BackButton from "../../components/common/BackButton";
import {
  IBankInfo,
  ISystemConfig,
  bankInfoValidationSchema,
  fetchPanNote,
  fetchTrainerBankInfo,
  getBankInfoInitialValues,
  handleSubmitTrainerBankInfo,
} from "./BankInfoController";
import ICTextInput from "../../core-component/ICTextInput";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICButton from "../../core-component/ICButton";
import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import { useNavigate } from "react-router-dom";
import ICCommonModal from "../../components/common/ICCommonModel";
import CustomEditor from "../product-services/Web/CustomEditor";
import { infoIcon } from "../../assets/icons/SvgIconList";

const BankInfoView = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [bankInfo, setBankInfo] = useState<IBankInfo | null>(null);
  const [panNote, setPanNote] = useState<ISystemConfig | undefined>();
  const [showPanNote, setShowPanNote] = useState(false);

  const fetchInitial = async () => {
    await Promise.all([
      fetchPanNote(setPanNote),
      fetchTrainerBankInfo(setBankInfo),
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitial();
  }, []);

  const formik = useFormik({
    validationSchema: bankInfoValidationSchema(t),
    initialValues: getBankInfoInitialValues(bankInfo),
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await handleSubmitTrainerBankInfo(values, bankInfo?.id || null, navigate);
      formik.setSubmitting(false);
    },
  });

  return (
    <div className="flex flex-col pb-3 overflow-hidden h-svh md:h-[calc(100vh-76px)]">
      <div className="comman-padding">
        <BackButton />
      </div>
      <div className="flex justify-center w-full flex-1 overflow-y-scroll remove-scrollbar-width">
        <div className="w-full md:max-w-96 comman-padding">
          {isLoading ? (
            <Loader />
          ) : (
            <div className="top">
              <div className="comman-black-lg">{t("bank_info")}</div>
              {bankInfo && (
                <>
                  <div className="comman-black-text pt-1 top">
                    <span className="font-semibold">{t("acc_no")}</span>:{" "}
                    {bankInfo.beneficiary_account_number}
                  </div>
                  <div className="comman-black-text pt-1">
                    <span className="font-semibold">{t("pan_number")}</span>:{" "}
                    {bankInfo.pan_number}
                  </div>
                </>
              )}
              <div className="top">
                <ICTextInput
                  name={"beneficiary_name"}
                  autoComplete="off"
                  placeholder={t("beneficiary_name")}
                  value={formik.values.beneficiary_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.beneficiary_name
                      ? formik.errors.beneficiary_name
                      : undefined
                  }
                />
              </div>
              <div className="top">
                <ICTextInput
                  name={"beneficiary_account_number"}
                  type="password"
                  autoComplete="new-password"
                  placeholder={t("beneficiary_account_number")}
                  value={formik.values.beneficiary_account_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.beneficiary_account_number
                      ? formik.errors.beneficiary_account_number
                      : undefined
                  }
                />
              </div>
              <div className="top">
                <ICTextInput
                  name={"re_type_beneficiary_account_number"}
                  placeholder={t("re_type_beneficiary_account_number")}
                  value={formik.values.re_type_beneficiary_account_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.re_type_beneficiary_account_number
                      ? formik.errors.re_type_beneficiary_account_number
                      : undefined
                  }
                />
              </div>
              <div className="top">
                <ICTextInput
                  name={"ifsc_code"}
                  placeholder={t("ifsc_code")}
                  value={formik.values.ifsc_code}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.ifsc_code
                      ? formik.errors.ifsc_code
                      : undefined
                  }
                />
              </div>
              <div className="top flex flex-row  items-center">
                <ICTextInput
                  name={"pan_number"}
                  type="password"
                  placeholder={t("pan_number")}
                  value={formik.values.pan_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.pan_number
                      ? formik.errors.pan_number
                      : undefined
                  }
                />
                <div className="ml-2">
                  <div
                    className="size-5 cursor-pointer"
                    onClick={() => setShowPanNote(true)}
                  >
                    {infoIcon}
                  </div>
                </div>
              </div>
              <div className="top">
                <ICTextInput
                  name={"re_type_pan_number"}
                  placeholder={t("re_type_pan_number")}
                  value={formik.values.re_type_pan_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={
                    formik.touched.re_type_pan_number
                      ? formik.errors.re_type_pan_number
                      : undefined
                  }
                />
              </div>
              <div className="top">
                <ICButton
                  children={t("save")}
                  onClick={() => formik.handleSubmit()}
                  loading={formik.isSubmitting}
                  className={`mr-2 ${
                    formik.isSubmitting
                      ? "cursor-not-allowed comman-disablebtn"
                      : `comman-btn`
                  }`}
                  disabled={formik.isSubmitting}
                ></ICButton>
              </div>
            </div>
          )}
        </div>
      </div>
      <ICCommonModal
        title={
          panNote?.user_friendly_name
            ? panNote?.user_friendly_name
            : t("pan_number")
        }
        content={
          <div>
            {panNote && panNote.config_value && (
              <CustomEditor serviceDesc={panNote.config_value} />
            )}
          </div>
        }
        isModalShow={showPanNote}
        setIsModalShow={setShowPanNote}
      />
    </div>
  );
};

export default BankInfoView;
