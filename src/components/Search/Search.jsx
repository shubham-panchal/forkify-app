import React, { useContext, useEffect, useReducer, useState } from "react";
import classes from "./Search.module.scss";
import { imageKeyMapping } from "../../assets/imageKeyMapping";
import { MyContext } from "../../context/context";
const apiKey = import.meta.env.VITE_API_KEY;
const apiHost = import.meta.env.VITE_API_HOST;

const Search = ({ onSubmit }) => {
  const [searchInput, setSearchInput] = useState("");
  const { dispatch } = useContext(MyContext);

  const handleInput = (e) => {
    try {
      e.target.value = e.target?.value?.replace(/[^A-Za-z\s]/g, "");
      setSearchInput(e.target?.value?.trim() || "");
    } catch (err) {
      console.error({ err });
    }
  };

  const handleSearch = async (e) => {
    try {
      e.preventDefault();
      if (searchInput?.trim()?.length) {
        onSubmit(true);
        const url = `${apiHost}?search=${searchInput}&key=${apiKey}`;
        const res = await fetch(url);

        if (res.ok) {
          // Check if the response is successful
          const data = await res.json(); // Parse the JSON from the response body
          // console.log(data, "Response Data");

          // Assuming your API returns the results in a `recipes` field
          dispatch({ type: "SET_RECIPES_JSON", payload: data?.data?.recipes });
          dispatch({
            type: "UPDATE_RESULT_COUNT",
            payload: data?.results,
          });
          // updateRecipesData(data?.data?.recipes || []); // Update state with the data or an empty array
        } else {
          console.error("Error: Failed to fetch data from the API");
        }
        onSubmit(false);
      }
    } catch (err) {
      onSubmit(false);
      console.error("Error:", err);
    }

    setSearchInput(""); // Reset search input field
  };

  return (
    <div className={classes?.search_component}>
      <form className={classes?.form}>
        <input
          type="text"
          onInput={(e) => handleInput(e)}
          className={classes?.input_box}
          value={searchInput}
          placeholder="Search over 1,000,000 recipes..."
          autoFocus={true}
        />
        <button
          type="submit"
          className={classes?.search_cta}
          onClick={(e) => handleSearch(e)}
        >
          <img
            src={imageKeyMapping?.iconSearchWhite}
            alt="search"
            className={classes?.search_icon}
          />
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
