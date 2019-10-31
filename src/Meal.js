import React, {Component} from 'react';
import './Meal.css';

class Meal extends Component {
  constructor(props) {
    super(props);

  }

  // handleSelect = () => {
  //   console.log('this was clicked', this.props.label);
  // }

  render() {
    const {id, selected, label, image, servings, ingredientLines, calories, fat, carbs, protein} = this.props;
    return(
      <article className={"Meal" + (selected ? " Meal-selected" : "")} onClick={() => this.props.handleSelect(id)}>
        <h2 className="Meal__label">{label}</h2>
        <img src={image} alt={label} />
        <p className="ingredientLines">{ingredientLines}</p>
        <p className="servings">number of servings: {servings}</p>
        <p className="calories">calories: {calories}</p>
        <p className="fat">fat: {fat}</p>
        <p className="carbs">carbs: {carbs}</p>
        <p className="protein">protein: {protein}</p>
      </article>
    );
  }
}

export default Meal;