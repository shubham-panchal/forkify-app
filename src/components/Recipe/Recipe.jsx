import React, { useContext, useEffect, useState } from "react";
import classes from "./Recipe.module.scss";
import { imageKeyMapping } from "../../assets/imageKeyMapping";
import { MyContext } from "../../context/context";
import Fraction from "fraction.js";
import Loader from "../Loader/Loader";
const apiHost = import.meta.env.VITE_API_HOST;

const Recipe = ({ selectedRecipe }) => {
  const { state, dispatch } = useContext(MyContext);
  const [recipeDetails, setRecipeDetails] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [ingredientsStatus, setIngredientsStatus] = useState({});

  useEffect(() => {
    getSelectedRecipeDetails();
    setIngredientsStatus({});
  }, [selectedRecipe]);

  useEffect(() => {
    setRecipeDetails(state?.selected_receipe);
  }, [state?.selected_receipe]);

  const getSelectedRecipeDetails = async () => {
    try {
      setShowLoader(true);
      if (selectedRecipe && selectedRecipe?.id) {
        const url = `${apiHost}/${selectedRecipe?.id}`;
        const res = await fetch(url)
          .then((res) => res.json())
          .then((data) => {
            if (data?.status === "success" && data?.data?.recipe) {
              dispatch({
                type: "SET_SELECTED_RECIPE",
                payload: data?.data?.recipe,
              });
            }
          })
          .catch((err) => console.error(err));
        setShowLoader(false);
      }
    } catch (err) {
      setShowLoader(false);
      console.error(err);
    }
  };

  const handleDirectionsCTA = (url) => {
    window.open(url, { target: "blank" });
  };

  const handleIngredientsStatus = (index) => {
    setIngredientsStatus((prev) => ({ ...prev, [index]: prev[index] ? 0 : 1 }));
  };

  return showLoader ? (
    <Loader />
  ) : (
    <div className={classes?.recipe_component}>
      <div className={classes?.recipe_image_wrapper}>
        <img
          src={recipeDetails?.image_url}
          className={classes?.recipe_image}
          alt="recipe image"
        />
        <div className={classes?.recipe_name}>
          <span>{recipeDetails?.title}</span>
        </div>
      </div>
      <div className={classes?.recipe_details}>
        <div className={classes?.details}>
          <img
            src={imageKeyMapping?.iconClock}
            alt=""
            className={classes?.details_text_icon}
          />
          <span
            className={`${classes?.details_text} ${classes?.details_text_bold}`}
          >
            {recipeDetails?.cooking_time}
          </span>
          <span className={classes?.details_text}>Minutes</span>
        </div>
        <div className={classes?.details}>
          <img
            src={imageKeyMapping?.iconMultiUser}
            alt=""
            className={classes?.details_text_icon}
          />
          <span
            className={`${classes?.details_text} ${classes?.details_text_bold}`}
          >
            {recipeDetails?.servings}
          </span>
          <span className={classes?.details_text}>servings</span>
          <div className={classes?.details_btn_wrapper}>
            <div
              className={classes?.details_btn}
              onClick={() =>
                dispatch({ type: "DECREMENT_SERVINGS", recipeDetails })
              }
            >
              <img src={imageKeyMapping?.iconMinus} alt="-" />
            </div>
            <div
              className={classes?.details_btn}
              onClick={() =>
                dispatch({ type: "INCREMENT_SERVINGS", recipeDetails })
              }
            >
              <img src={imageKeyMapping?.iconAdd} alt="+" />
            </div>
          </div>
        </div>
        <div
          className={` ${classes?.user_generated_icon} ${
            recipeDetails?.key === `baa4ab44-b14c-436e-b10f-af3b426ac8cc`
              ? ""
              : classes?.hidden
          }`}
        >
          <img
            src={imageKeyMapping?.iconUser}
            alt="user icon"
            className={classes?.icon}
          />
        </div>
        <div
          className={classes?.bookmark_icon}
          onClick={() =>
            dispatch({ type: "BOOKMARK_RECIPE", payload: recipeDetails })
          }
        >
          <img
            src={
              recipeDetails?.bookmarked
                ? imageKeyMapping?.iconBookmarkWhiteFilled
                : imageKeyMapping?.iconBookmark
            }
            alt="bookmark icon"
            className={classes?.icon}
          />
        </div>
      </div>
      <div className={classes?.recipe_ingredients}>
        <div className={classes?.heading}>Recipe ingredients</div>
        <div className={classes?.ingredients_list}>
          {recipeDetails?.ingredients?.map((data, index) => (
            <div
              className={`${classes?.list_item} ${
                ingredientsStatus[index] ? classes?.strike : ""
              }`}
              key={index}
              onClick={() => handleIngredientsStatus(index)}
            >
              <div className={classes?.icon_tick}>
                <img src={imageKeyMapping?.iconTick} alt="tick icon" />
              </div>
              <div className={classes?.ingredient_quantity}>
                {data?.quantity
                  ? new Fraction(data?.quantity).toFraction()
                  : ""}
              </div>
              <div className={classes?.ingredient_desc}>
                <span className={classes?.unit}>{data?.unit}</span>{" "}
                {data?.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={classes?.how_to_cook_block}>
        <div className={classes?.heading_3}>How to cook it</div>
        <div className={classes?.directions_text}>
          This recipe was carefully designed and tested by{" "}
          <span className={classes?.publisher}>{recipeDetails?.publisher}</span>{" "}
          . Please check out directions at their website.
        </div>
        <div
          className={classes?.directions_cta}
          onClick={() => handleDirectionsCTA(recipeDetails?.source_url)}
        >
          directions{" "}
          <img
            src={imageKeyMapping?.iconRightWhite}
            alt="right arrow"
            className={classes?.cta_icon}
          />
        </div>
      </div>
    </div>
  );
};

export default Recipe;
