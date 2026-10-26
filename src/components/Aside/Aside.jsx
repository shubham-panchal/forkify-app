import React, { useContext, useEffect, useState } from "react";
import classes from "./Aside.module.scss";
import { imageKeyMapping } from "../../assets/imageKeyMapping";
import { MyContext } from "../../context/context";
import { RECIPES_PER_PAGE } from "../../app_constants/app_constatnts";
import Loader from "../Loader/Loader";

const Aside = ({ onSelection, showLoader }) => {
  const { state, dispatch } = useContext(MyContext);
  const [filteredRecipesData, setFilteredRecipesData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [startPoint, setStartPoint] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState({});
  const [totalLength, setTotalLength] = useState(0);
  const [loader, setLoader] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  useEffect(() => {
    // console.log(state);
    setTotalLength(state?.all_recipes?.length || 0);
    const fr = state?.all_recipes?.slice(
      RECIPES_PER_PAGE * currentPage - RECIPES_PER_PAGE,
      RECIPES_PER_PAGE * currentPage
    );

    setFilteredRecipesData(fr);
  }, [state, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    if (state?.results >= 0) {
      setIsResultsOpen(true);
    }
  }, [state?.all_recipes, state?.results]);

  useEffect(() => {
    setLoader(showLoader);
  }, [showLoader]);

  // useEffect(() => {
  //   console.log({ filteredRecipesData });
  //   console.log(filteredRecipesData?.length);
  // }, [filteredRecipesData]);

  const handleRecipeSelect = (data) => {
    setSelectedRecipe(data);
    setIsResultsOpen(false);
    // dispatch({ type: "SET_SELECTED_RECIPE", payload: data });
    onSelection(data);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleNext = () => {
    const max = Math.floor(totalLength / RECIPES_PER_PAGE);
    setCurrentPage((prev) => (prev <= max ? prev + 1 : prev));
  };

  return showLoader ? (
    <Loader />
  ) : (
    <div
      className={`${classes?.aside_component} ${
        isResultsOpen ? classes?.results_open : ""
      }`}
    >
      {state?.results >= 0 && (
        <button
          type="button"
          className={classes?.results_toggle}
          aria-expanded={isResultsOpen}
          aria-controls="recipe-results"
          onClick={() => setIsResultsOpen((isOpen) => !isOpen)}
        >
          <span>
            {isResultsOpen ? "Hide results" : `Show results (${totalLength})`}
          </span>
          <span
            className={`${classes?.toggle_icon} ${
              isResultsOpen ? classes?.toggle_icon_open : ""
            }`}
            aria-hidden="true"
          />
        </button>
      )}
      {state?.all_recipes?.length ? (
        <>
          <div id="recipe-results" className={classes?.recipe_list}>
            {filteredRecipesData?.map((data) => (
              <div
                className={`${classes?.recipes} ${
                  data?.id === selectedRecipe?.id ? classes?.active : ""
                }`}
                key={data?.id}
                onClick={() => handleRecipeSelect(data)}
              >
                <div className={classes?.recipe_image}>
                  <img src={data?.image_url} alt="recipe image" />
                </div>
                <div className={classes?.recipe_details}>
                  <div className={classes?.recipe_name}>{data?.title}</div>
                  <div className={classes?.recipe_publisher}>
                    {data?.publisher}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={classes?.pagination_container}>
            <div
              className={`${classes?.pagination_handles} ${
                currentPage - 1 !== 0 ? "" : classes?.vhidden
              }`}
              onClick={handlePrev}
            >
              Page {currentPage - 1}
              <img
                src={imageKeyMapping?.iconLeftOrange}
                alt="previous"
                className={classes?.handle_icon}
              />
            </div>

            <div
              className={`${classes?.pagination_handles} ${
                currentPage <= Math.floor(totalLength / RECIPES_PER_PAGE)
                  ? ""
                  : classes?.vhidden
              }`}
              onClick={handleNext}
            >
              Page {currentPage + 1}
              <img
                src={imageKeyMapping?.iconLeftOrange}
                alt="next"
                className={classes?.handle_icon}
              />
            </div>
          </div>
        </>
      ) : !state?.results ? (
        <div id="recipe-results" className={classes?.no_recipes_text}>
          <img src={imageKeyMapping?.iconDanger} alt="danger" />
          <span>
            No recipes found for your query!
            <br />
            Please try again.
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Aside;
