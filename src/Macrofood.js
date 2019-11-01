import React, {Component} from 'react';
import uuid from 'uuid/v4';
import './Macrofood.css';
import Header from './Header';
import Total from './Total';
import Meal from './Meal';

const dbRecipes = require('./recipes.json');
const dbRecipes2 = require('./recipes2.json');

const apiId = '163dbcc0';
const apiKey = 'de904e389374c9ea442b9119d63509b2';

class Macrofood extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      spinner: 'Loading...',
      finishedLoading: false,
      totalCaloriesPerServing: 0,
      macrosInG: {fat: 0, carbs: 0, protein: 0},
      macros: {fat: 0, carbs: 0, protein: 0},
      totalFatPerServing: 0,
      totalCarbsPerServing: 0,
      totalProteinPerServing: 0,
    }
  }

  componentDidMount() {
    this.fetchMeals(this.props.query);
  }

  // fetch data from dbRecipies.json and dbRecipies2.json
  fetchMeals = (query = 'vegetarian') => {
    let newMeals = [];

    if (query === 'chicken') {
      newMeals = dbRecipes.hits.map(meal => ({...meal, selected: false, id: uuid()}));
    } else if (query === 'vegetarian') {
      newMeals = dbRecipes2.hits.map(meal => ({...meal, selected: false, id: uuid()}));
    }
    
    this.addMeals(newMeals);
  }

  // fetch data from real API
  // fetchMeals = async (query) => {
  //   const baseURL = `https://api.edamam.com/search?q=${query}&app_id=${apiId}&app_key=${apiKey}`;
  //   let newMeals = [];

  //   try {
  //     const data = await fetch(baseURL);
  //     const recipes = await data.json();
  //     newMeals = recipes.hits.map(meal => ({...meal, selected: false, id: uuid()}));
  //   } catch (e) {
  //     console.log('Something went wrong with fetching', e);
  //   }
    
  //   this.addMeals(newMeals);
  // }
  
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
  
      return {meals: [...combinedMeals], finishedLoading: true};
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    const searchElement = document.querySelector('.search__input')
    const searchText = searchElement.value.trim();
    this.fetchMeals(searchText);
    searchElement.value = '';
    searchElement.focus();
    
  }

  toggleSelected = (id) => {
    this.setState(prevState => {

      const foundMealIndex = prevState.meals.findIndex(meal => meal.id === id);
      const copy = JSON.parse(JSON.stringify(prevState.meals));
      copy[foundMealIndex].selected = !copy[foundMealIndex].selected;
      
      return {
        meals: copy,
        totalCaloriesPerServing: this.getTotalCaloriesPerServing(copy),
        macrosInG: {fat: this.getTotalFatPerServing(copy), carbs: this.getTotalCarbsPerServing(copy), protein: this.getTotalProteinPerServing(copy)},
        macros: {fat: 9 * this.getTotalFatPerServing(copy) / this.getTotalCaloriesPerServing(copy), carbs: 4 * this.getTotalCarbsPerServing(copy) / this.getTotalCaloriesPerServing(copy), protein: 4 * this.getTotalProteinPerServing(copy) / this.getTotalCaloriesPerServing(copy)},
      };
    });
  }

  handleSelect = (id, selected) => {
    console.log('this meal was clicked from Menu component', id, selected);
    this.toggleSelected(id);
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
        <Header handleSearch={this.handleSearch}/>
        {this.state.macrosInG.carbs === 0 ? ''
        : <Total totalCaloriesPerServing={this.state.totalCaloriesPerServing} macrosInG={this.state.macrosInG} macros={this.state.macros} />
        }

        <div className="main">
          {mealsHTML}
        </div>
      </div>
    );
  }
}

export default Macrofood;
