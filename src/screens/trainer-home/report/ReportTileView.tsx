import NumberSpinnerAnimation from "../../../components/NumberSpinnerAnimation";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
export interface IReportTileView {
  title: string;
  total: number;
  className?: string;
  growth?: number;
  currency_sign?: boolean;
}
const ReportTileView = ({
  title,
  total,
  className,
  growth,
  currency_sign = false,
}: IReportTileView) => {
  const { t } = UseTranslationHook();

  return (
    <div
      className={`rounded-2xl comman-padding flex flex-col h-32 sm:h-40 ${
        className ? className : ""
      }`}
    >
      <h4 className="comman-black-text !font-semibold h-8 sm:h-12">{title}</h4>
      <h1 className="common-black-xl mx-auto">
        {currency_sign && "₹"}
        <NumberSpinnerAnimation number={total} />
      </h1>
      {growth && (
        <p
          className={`
          comman-black-text
          ${
            Number(growth) === 0
              ? ""
              : growth < 0
              ? "!text-red-500"
              : "!text-green-500"
          }  mt-auto mx-auto`}
        >
          {Number(growth) === 0 ? "" : growth > 0 ? "+" : "-"}{" "}
          {<NumberSpinnerAnimation number={Math.abs(growth)} />}%{" "}
          {t("from_previous_month")}
        </p>
      )}
    </div>
  );
};
export default ReportTileView;
