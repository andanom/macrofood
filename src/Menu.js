import React, {Component} from 'react';
import './Menu.css'
import Meal from './Meal';
import uuid from 'uuid/v4';
const dbRecipes = require('./recipes.json');
const dbRecipes2 = require('./recipes2.json');

const apiId = '163dbcc0';
const apiKey = 'de904e389374c9ea442b9119d63509b2';
const searchQuery = '';
const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${apiId}&app_key=${apiKey}`;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      spinner: 'Loading...',
      finishedLoading: false,
      totalCaloriesPerServing: 0,
      totalFatPerServing: 0,
      totalCarbsPerServing: 0,
      totalProteinPerServing: 0,
    }
  }

  componentDidMount() {
    this.fetchMeals(this.props.query);
  }

  fetchMeals = (query = 'vegetarian') => {
    console.log('Inside fetchMeals with query:', query);

    let newMeals = [];

    if (query === 'chicken') {
      newMeals = dbRecipes.hits.map(meal => {
        return {...meal, selected: false, id: uuid()};
      });
    } else if (query === 'vegetarian') {
      newMeals = dbRecipes2.hits.map(meal => {
        return {...meal, selected: false, id: uuid()};
      });
    }
    
      // console.log('inside fetchmeals chicken', newMeals)
    // const prevMealSelected = this.state.meals.filter(meal => meal.selected)
    // this.setState({meals: newMeals, finishedLoading: true});
    this.addMeals(newMeals);

  }

  addMeals = (newMeals) => {
    
    this.setState(prevState => {
      const prevSelectedMeals = prevState.meals.filter(meal => meal.selected);
      const combinedMeals = [...prevSelectedMeals];
      newMeals.forEach(newMeal => {
        const duplicateMeal = prevSelectedMeals.some(prevSelectedMeal => prevSelectedMeal.recipe.label === newMeal.recipe.label)
        if (!duplicateMeal) {
          combinedMeals.push(newMeal);
        }
      })
      console.log('inside addMeals', combinedMeals);
  
      return {meals: [...combinedMeals], finishedLoading: true};
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    console.log('search was clicked');
    const searchText = document.querySelector('.search__input').value.trim();
    if (searchText !== '') {
      console.log('this was searched', searchText);
      this.fetchMeals(searchText);
    }
  }

  toggleSelected = (id) => {
    this.setState(prevState => {

      const foundMealIndex = prevState.meals.findIndex(meal => meal.id === id);
      const copy = JSON.parse(JSON.stringify(prevState.meals));
      copy[foundMealIndex].selected = !copy[foundMealIndex].selected;
      
      // const totalCalories = this.getTotalCaloriesPerServing(copy);
      return {
        meals: copy,
        totalCaloriesPerServing: this.getTotalCaloriesPerServing(copy),
        totalFatPerServing: this.getTotalFatPerServing(copy),
        totalCarbsPerServing: this.getTotalCarbsPerServing(copy),
        totalProteinPerServing: this.getTotalProteinPerServing(copy),
      };
    });
    //  this.getTotalCaloriesPerServing();
  }

  handleSelect = (id, selected) => {
    console.log('this meal was clicked from Menu component', id, selected);
    this.toggleSelected(id);
   
    // toggleSelected();
    // this.setState(prevState => ({...prevState.meals, prevState.meals}))
  }

  getTotalCaloriesPerServing = (meals) => {
    const totalCalories = meals
      .filter(meal => meal.selected === true)
      .reduce((acc, meal) => acc + meal.recipe.calories/meal.recipe.yield, 0);

    return Math.round(totalCalories);
  }

  getTotalFatPerServing = (meals) => {
    const totalFat = meals
      .filter(meal => meal.selected === true)
      .reduce((acc, meal) => acc + meal.recipe.digest[0].total/meal.recipe.yield, 0);

    return Math.round(totalFat);
  }

  getTotalCarbsPerServing = (meals) => {
    const totalCarbs = meals
      .filter(meal => meal.selected === true)
      .reduce((acc, meal) => acc + meal.recipe.digest[1].total/meal.recipe.yield, 0);

    return Math.round(totalCarbs);
  }

  getTotalProteinPerServing = (meals) => {
    const totalProtein = meals
      .filter(meal => meal.selected === true)
      .reduce((acc, meal) => acc + meal.recipe.digest[2].total/meal.recipe.yield, 0);

    return Math.round(totalProtein);
  }

  render() {
    const mealsHTML = this.state.finishedLoading ?
      <div className="meals">
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

        <form className="search">
          <input className="search__input" type="text" name="search" placeholder="Search for a meal" />
          <button onClick={this.handleSearch} className="btn btn-search" type="submit">Search</button>
        </form>

        <section className="total">
          <h2 className="total">Total:</h2>
          <p className="total__calories">Total Calories: {this.state.totalCaloriesPerServing}</p>
          <p className="total__fat">Total Fat: {this.state.totalFatPerServing}</p>
          <p className="total__carbs">Total Carbs: {this.state.totalCarbsPerServing}</p>
          <p className="total__protein">Total Protein: {this.state.totalProteinPerServing}</p>
          
        </section>
        

        <div className="main">
          {mealsHTML}
        </div>
    
      </div>
    );
  }
}

export default Menu;
