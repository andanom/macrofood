import React from 'react';
import './Meal.css';

const Meal = (props) => {
    const {id, selected, label, image, servings, ingredientLines, calories, fat, carbs, protein} = props;

    return(
      <article className={"Meal" + (selected ? " Meal-selected" : "")} onClick={() => props.handleSelect(id, selected)}>
        <h2 className="Meal__label">{label}</h2>
        <img className="Meal__img" src={image} alt={label} />
        <p className="ingredientLines">{ingredientLines}</p>
        <ul className="Meal__macro-list">
          <li className="servings">number of servings: {servings}</li>
          <li className="calories">calories: {Math.round(calories)}g</li>
          <li className="fat">fat: {Math.round(fat)}g</li>
          <li className="carbs">carbs: {Math.round(carbs)}g</li>
          <li className="protein">protein: {Math.round(protein)}g</li>
        </ul>
      </article>
    );
  
};

export default Meal;
