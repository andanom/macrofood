import React, {Component} from 'react';
import Meal from './Meal';
import uuid from 'uuid/v4';
const dbRecipes = require('./recipes.json');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      spinner: 'Loading...',
      finishedLoading: false,
    }
  }

  componentDidMount() {
    this.fetchMeals(this.props.query);
  }

  fetchMeals = (query) => {
    query = 'salt';
    const dbRecipesWithSelection = dbRecipes.hits.map(meal => {
      return {...meal, selected: false, id: uuid()};
    });
    // console.log(dbRecipesWithSelection);
    // this.setState({meals: dbRecipes.hits, finishedLoading: true})  
    this.setState({meals: dbRecipesWithSelection, finishedLoading: true})  
  }

  handleSelect = (label) => {

    console.log('this meal was clicked from Menu component', label);
  }

  render() {
    const mealsHTML = this.state.finishedLoading ?
      <div className="testing">
        {this.state.meals.map(meal => (
          <Meal
            key={meal.id}
            id={meal.id}
            selected={meal.selected}
            label={meal.recipe.label}
            image={meal.recipe.image}
            servings={meal.recipe.yield}
            ingredientLines={meal.recipe.ingredientLines}
            calories={meal.recipe.calories}
            fat={meal.recipe.digest[0].total}
            carbs={meal.recipe.digest[1].total}
            protein={meal.recipe.digest[2].total}
            handleSelect={this.handleSelect}
          />
        ))}
        
      </div>

      : this.state.spinner;

    return (
      <div className="container">
        <header className="Menu">
          <h1 className="Menu__title">Menu</h1>
          <p className="Menu__description">
            Choose the meals you want:
          </p>
        </header>

        <div className="main">
          {mealsHTML}
        </div>
    
      </div>
    );
  }
}

export default Menu;
