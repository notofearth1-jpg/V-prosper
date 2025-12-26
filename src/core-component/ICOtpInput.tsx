import React, { useState, ChangeEvent } from "react";
import OTPInput from "react-otp-input";

interface OtpInputCommonProps {
  value: string;
  onChange: (otp: string) => void;
  numInputs: number;
  // Add any additional props specific to the OTPInput component
}

const ICOtpInput: React.FC<OtpInputCommonProps> = ({
  value,
  onChange,
  numInputs,
}) => {
  return (
    <OTPInput
      inputType="number"
      shouldAutoFocus
      value={value}
      onChange={onChange}
      numInputs={numInputs}
      renderInput={(props) => <input {...props} />}
      inputStyle={{
        marginRight: "20px",
        border: "1px solid var(--input-hover-border-color)",
        outline: "none",
        height: "42px",
        width: "42px",
        borderRadius: "10px",
      }}
    />
  );
};

export default ICOtpInput;
