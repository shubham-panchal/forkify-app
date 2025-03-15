import React, { useReducer } from "react";
import { createContext, useState } from "react";
import { initialState, recipeReducer } from "../reducer/recipe-reducer";

// creating context
export const MyContext = createContext();

// creating provider
export const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState);
  const [recipesData, setRecipesData] = useState([]);

  const updateRecipesData = (newState) => {
    setRecipesData(newState);
  };

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  );
};
