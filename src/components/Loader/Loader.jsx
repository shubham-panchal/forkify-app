import React from "react";
import classes from "./Loader.module.scss";
import { imageKeyMapping } from "../../assets/imageKeyMapping";

const Loader = () => {
  return (
    <div className={classes?.loader_component}>
      <img
        src={imageKeyMapping?.loaderIcon}
        className={classes?.loader}
        alt="loader icon"
      />
    </div>
  );
};

export default Loader;
