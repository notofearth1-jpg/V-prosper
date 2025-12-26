import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import UseTranslationHook from "../../../../hooks/UseTranslationHook";
import { infoIcon } from "../../../../assets/icons/SvgIconList";
import Loader from "../../../../components/common/Loader";
import {
  IAlternateMobileNumber,
  validationSchemaAlternativeMobileNumber,
} from "./AlternateMobileController";
import ICTextInput from "../../../../core-component/ICTextInput";
import { handleNumericInput } from "../../../../utils/AppFunctions";
import ICButton from "../../../../core-component/ICButton";
import { IDDL } from "../../../blog-post/BlogPostController";
import { getUserRelation } from "../../../user/user-alternative-mobile/UserAlternativeMobileController";
import ICDropDown from "../../../../core-component/ICDropDown";

interface IAlternativeMobileProps {
  initialValues: IAlternateMobileNumber;
  onSubmit: (values: IAlternateMobileNumber) => Promise<void>;
  selectedRelation: string;
  setSelectedRelation: React.Dispatch<React.SetStateAction<string>>;
}

const AlternativeMobile: React.FC<IAlternativeMobileProps> = ({
  onSubmit,
  initialValues,
  selectedRelation,
  setSelectedRelation,
}) => {
  const { t } = UseTranslationHook();
  const validationSchema = validationSchemaAlternativeMobileNumber(t);
  const [selectedRelationId, setSelectedRelationId] = useState<number | null>(
    null
  );
  const [relation, setRelation] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await onSubmit({ ...values, relation_id: selectedRelationId });
      formik.setSubmitting(false);
    },
  });

  const handleOptionClick = (option: string, selected_id: number) => {
    formik.setFieldValue("relation_id", selected_id);
    setSelectedRelationId(selected_id);
    setSelectedRelation(option);
  };

  useEffect(() => {
    getUserRelation(setRelation, setLoading, t);
  }, []);

  useEffect(() => {
    if (initialValues.relation_id) {
      const storedRelationId = initialValues.relation_id;
      const selectedRelation = relation.find(
        (data) => data.data_value === parseInt(storedRelationId.toString(), 10)
      );
      if (selectedRelation) {
        setSelectedRelationId(selectedRelation.data_value);
        setSelectedRelation(selectedRelation.display_value);
      }
    }
  }, [relation]);

  return (
    <>
      <div className="relative">
        <ICDropDown
          label={t("select_relation")}
          selected={selectedRelationId ? selectedRelationId : undefined}
          className={"w-full"}
          options={relation.map((data, index) => ({
            label: data.display_value,
            value: data.data_value,
          }))}
          onSelect={(option) => handleOptionClick(option.label, option.value)}
        />
      </div>
      <div className="mt-2">
        <ICTextInput
          type="text"
          textClass="mobile-number-spacing"
          placeholder={t("alternate_mobile_number")}
          name="alternate_phone"
          value={formik.values.alternate_phone}
          onChange={(event) => {
            handleNumericInput(event);
            formik.setFieldValue(
              "alternate_phone",
              event.target.value ? Number(event.target.value) : undefined
            );
          }}
          onBlur={formik.handleBlur}
        />
        {formik.errors.alternate_phone && (
          <div className="text-skin-error mt-1">
            {formik.errors.alternate_phone}
          </div>
        )}
      </div>

      <div className="grid grid-cols-12 text-justify space-x-1.5 top">
        <div className="h-4 w-4 col-span-1">{infoIcon}</div>
        <div className="comman-grey col-span-11">
          {t("alternative_number_note")}
        </div>
      </div>
      <div className="top">
        <ICButton
          type="button"
          children={t("submit")}
          loading={formik.isSubmitting}
          className={`uppercase ${
            !formik.isValid || !selectedRelationId
              ? "cursor-not-allowed comman-disablebtn"
              : "comman-btn"
          }`}
          onClick={() => formik.handleSubmit()}
          disabled={
            !formik.isValid || formik.isSubmitting || !selectedRelationId
          }
        />
      </div>
    </>
  );
};

export default AlternativeMobile;
