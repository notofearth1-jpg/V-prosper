import React from "react";

const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={`h-screen w-full flex items-center justify-center ${
        className ? className : ""
      }`}
    >
      <img src={require("../../assets/image/loader-1.gif")} alt="Lodding" />
    </div>
  );
};

export default Loader;
