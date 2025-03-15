export const initialState = {
  all_recipes: [],
  bookmarked: [],
  selected_receipe: {},
};

export const recipeReducer = (state = initialState, action) => {
  switch (action?.type) {
    case "SET_RECIPES_JSON":
      return { ...state, all_recipes: action?.payload || [] };
    case "SET_SELECTED_RECIPE":
      const localStorageBookmarks =
        JSON?.parse(localStorage?.getItem("bookmarks")) || [];

      console.log(localStorageBookmarks, "LSB");
      return {
        ...state,
        selected_receipe: {
          ...action?.payload,
          bookmarked:
            localStorageBookmarks &&
            localStorageBookmarks?.findIndex(
              (r) => r.id === action?.payload?.id
            ) !== -1
              ? true
              : false,
        },
      };
    case "INCREMENT_SERVINGS":
      return {
        ...state,
        selected_receipe: {
          ...state?.selected_receipe,
          servings: state?.selected_receipe?.servings + 1,
          ingredients: getUpdatedIngredientsQuantity(state, "increment"),
        },
      };
    case "DECREMENT_SERVINGS":
      return {
        ...state,
        selected_receipe: {
          ...state?.selected_receipe,
          servings:
            state?.selected_receipe?.servings === 1
              ? 1
              : state?.selected_receipe?.servings - 1,
          ingredients: getUpdatedIngredientsQuantity(state, "decrement"),
        },
      };
    case "BOOKMARK_RECIPE":
      const inBookmarks = state?.bookmarked?.findIndex(
        (r) => r.id === action?.payload?.id
      );
      let newBookmarks = [...state?.bookmarked];
      if (inBookmarks !== -1) {
        newBookmarks = newBookmarks?.filter(
          (r) => r.id !== action?.payload?.id
        );
      } else {
        newBookmarks = [
          ...newBookmarks,
          { ...action?.payload, bookmarked: true },
        ];
      }
      console.log("NEW_BOKMARKS", newBookmarks);
      localStorage?.setItem("bookmarks", JSON?.stringify(newBookmarks));
      return {
        ...state,
        bookmarked: newBookmarks,
        selected_receipe: {
          ...state?.selected_receipe,
          bookmarked:
            newBookmarks?.findIndex((r) => r?.id === action?.payload?.id) !== -1
              ? true
              : false,
        },
      };
    default:
      return state;
  }
};

const getUpdatedIngredientsQuantity = (state, type) => {
  const oldServings = state?.selected_receipe?.servings;
  let newServings =
    type === "increment"
      ? oldServings + 1
      : oldServings === 1
      ? 1
      : oldServings - 1;
  let ingredientsArr = state?.selected_receipe?.ingredients?.map((ing) => ({
    ...ing,
    quantity: (ing?.quantity * newServings) / oldServings,
  }));
  return ingredientsArr;
};
