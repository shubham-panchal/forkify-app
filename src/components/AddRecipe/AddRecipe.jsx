import React, { useState } from "react";
import classes from "./AddRecipe.module.scss";
import { useForm, useFieldArray } from "react-hook-form";
import { ADD_RECIPE_FORM_FIELDS } from "../../app_constants/app_constatnts";
import { imageKeyMapping } from "../../assets/imageKeyMapping";
const apiKey = import.meta.env.VITE_API_KEY;
const apiHost = import.meta.env.VITE_API_HOST;

const AddRecipe = ({ onCloseAction }) => {
  const [success, setSuccess] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      source_url: "",
      image_url: "",
      publisher: "",
      cooking_time: 0,
      servings: 0,
      ingredients: [{ name: "" }],
    },
  });

  const {
    fields: ingredientFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "ingredients", // This should match the name in defaultValues
  });

  const onSubmit = async (data) => {
    try {
      // console.log("Submitted Data:", data);
      let payload = { ...data };
      let newIngredients = data?.ingredients?.map((ing) => {
        let val = ing?.name?.trim()?.split(",");
        return {
          quantity: val[0] || "",
          unit: val[1] || "",
          description: val[2] || "",
        };
      });
      payload["cooking_time"] = Number(payload["cooking_time"]);
      payload["servings"] = Number(payload["servings"]);
      payload["ingredients"] = newIngredients;
      const url = `${apiHost}/?key=${apiKey}`;

      // console.log("PAYLOAD", payload);
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (err) {
      setSuccess(false);
    }
  };
  return (
    <div className={classes?.add_recipe_component}>
      <div className={classes?.modal}>
        <div className={classes?.close_icon} onClick={onCloseAction}>
          &#10006;
        </div>
        {!success ? (
          <>
            <div className={classes?.form_container}>
              <form
                onSubmit={(e) => handleSubmit(onSubmit)(e)}
                className={classes?.form}
              >
                <div className={classes?.fields_wrapper}>
                  <h3>RECEIPE DATA</h3>
                  {ADD_RECIPE_FORM_FIELDS?.map((field) => (
                    <div className={classes?.input_wrapper} key={field?.id}>
                      <label className={classes?.label}>{field?.label}</label>
                      <input
                        type={field?.type}
                        name={field?.name}
                        className={classes?.input_box}
                        {...register(field?.name, {
                          required: `Field is required`,
                          // pattern: { value: "", message: "" },
                        })}
                      />
                      {errors[field?.name] && (
                        <div className={classes?.error_message}>
                          {errors[field?.name]?.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {/* Render Ingredients Field Array */}
                <div className={classes?.fields_wrapper}>
                  <h3>INGREDIENTS</h3>
                  {ingredientFields.map((item, index) => (
                    <div className={classes?.input_wrapper} key={item.id}>
                      <label className={classes?.label}>
                        Ingredient {index + 1}
                      </label>
                      <div className={classes?.i}>
                        <input
                          className={classes?.input_box}
                          {...register(`ingredients[${index}].name`, {
                            required: "Ingredient is required",
                          })}
                          defaultValue={item.name}
                          placeholder="Format: 'Quantity,Unit,Description'"
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className={classes?.remove_icon}
                        >
                          &#10006;
                        </button>
                      </div>
                      {errors.ingredients?.[index]?.name && (
                        <div className={classes?.error_message}>
                          {errors.ingredients[index].name.message}
                        </div> // Show error for ingredient
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" className={classes?.btn_submit}>
                  Submit
                </button>
                <button
                  type="button"
                  className={classes?.btn_add}
                  onClick={() => append({ name: "" })}
                >
                  Add Ingredient
                </button>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className={classes?.success_message}>
              <img src={imageKeyMapping?.smileyIcon} alt="smiley" />
              Recipe was successfully uploaded!
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddRecipe;
