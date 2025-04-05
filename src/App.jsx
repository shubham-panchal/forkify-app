import React, { useContext, useState } from "react";
import classes from "./App.module.scss";
import Header from "./components/Header/Header";
import Aside from "./components/Aside/Aside";
import Recipe from "./components/Recipe/Recipe";
import { MyContext } from "./context/context";
import { imageKeyMapping } from "./assets/imageKeyMapping";

function App() {
  const [selectedData, setSelectedData] = useState({});
  const { state } = useContext(MyContext);
  const [showLoader, setShowLoader] = useState(false);

  return (
    <div className={classes?.root}>
      <div className={classes?.container}>
        <div className={classes?.header_container}>
          <Header onSubmit={(data) => setShowLoader(data)} />
        </div>
        <div className={classes?.main_container}>
          <div className={classes?.aside_container}>
            <Aside
              showLoader={showLoader}
              onSelection={(data) => setSelectedData(data)}
            />
          </div>
          <div className={classes?.main}>
            {Object.keys(selectedData)?.length ? (
              <Recipe selectedRecipe={selectedData} />
            ) : (
              <div className={classes?.message}>
                <img
                  src={imageKeyMapping?.smileyIcon}
                  alt="smiley"
                  className={classes?.smiley}
                />
                <div className="">
                  {" "}
                  Start by searching for a recipe or <br /> an ingredient. Have
                  fun!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
