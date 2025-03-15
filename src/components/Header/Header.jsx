import React, { useContext, useState } from "react";
import classes from "./Header.module.scss";
import { imageKeyMapping } from "../../assets/imageKeyMapping";
import Search from "../Search/Search";
import { MyContext } from "../../context/context";
import AddRecipe from "../AddRecipe/AddRecipe";

const Header = ({ onSubmit }) => {
  const { state } = useContext(MyContext);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showAddRecipeModal, setShowAddReceipeModal] = useState(false);
  return (
    <div className={classes?.header_component}>
      <div className={classes?.logo}>
        <img src={imageKeyMapping?.logo} alt="logo" />
      </div>
      <div className={classes?.search_container}>
        <Search onSubmit={onSubmit} />
      </div>
      <div className={classes?.nav}>
        <div
          className={classes?.navlinks}
          onClick={() => setShowAddReceipeModal(true)}
        >
          <img
            src={imageKeyMapping?.iconNotes}
            alt="nav icon"
            className={classes?.nav_icon}
          />
          Add Recipe
        </div>
        <div
          className={classes?.navlinks}
          onClick={() => setShowBookmarks((prev) => !prev)}
        >
          <img
            src={imageKeyMapping?.iconBookmarkOrange}
            alt="nav icon"
            className={classes?.nav_icon}
          />
          Bookmarks
        </div>
      </div>
      {showBookmarks && (
        <div className={classes?.bookmarks_container}>
          {state?.bookmarked?.length ? (
            <div className={classes?.recipe_list}>
              {state?.bookmarked?.map((data) => (
                <div className={`${classes?.recipes}`} key={data?.id}>
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
          ) : (
            <div className={classes?.no_bookmarks}>
              No bookmarks yet. Find a nice recipe and bookmark it ;)
            </div>
          )}
        </div>
      )}
      {showAddRecipeModal && (
        <AddRecipe onCloseAction={() => setShowAddReceipeModal(false)} />
      )}
    </div>
  );
};

export default Header;
