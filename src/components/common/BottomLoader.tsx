import React from "react";

const BottomLoader = () => {
    return (
        <div className="h-52 w-full flex items-center justify-center">
            <img src={require("../../assets/image/loader-1.gif")} alt="Lodding" />
        </div>
    );
};

export default BottomLoader;
