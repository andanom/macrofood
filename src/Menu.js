import React, {Component} from 'react';
import './Menu.css'
import Meal from './Meal';
import Header from './Header'
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
  
      return {meals: [...combinedMeals], finishedLoading: true};
    });
  }

  handleSearch = (e) => {
    e.preventDefault();
    console.log('search was clicked');
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
      
      // const totalCalories = this.getTotalCaloriesPerServing(copy);
      // const total = this.getTotalFatPerServing(copy) + this.getTotalCarbsPerServing(copy) + 
      return {
        meals: copy,
        totalCaloriesPerServing: this.getTotalCaloriesPerServing(copy),
        macrosInG: {fat: this.getTotalFatPerServing(copy), carbs: this.getTotalCarbsPerServing(copy), protein: this.getTotalProteinPerServing(copy)},
        macros: {fat: 9 * this.getTotalFatPerServing(copy) / this.getTotalCaloriesPerServing(copy), carbs: 4 * this.getTotalCarbsPerServing(copy) / this.getTotalCaloriesPerServing(copy), protein: 4 * this.getTotalProteinPerServing(copy) / this.getTotalCaloriesPerServing(copy)},
        // totalFatPerServing: this.getTotalFatPerServing(copy),
        // totalCarbsPerServing: this.getTotalCarbsPerServing(copy),
        // totalProteinPerServing: this.getTotalProteinPerServing(copy),
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

  getPercentage = () => {
    const [fatCalories, carbsCalories, proteinCalories] = [9 * this.totalFatPerServing, 4 * this.totalCarbsPerServing, 4 * this.totalProteinPerServing];
    const totalCalories =  fatCalories + carbsCalories + proteinCalories;
    console.log('fatCaolories', this.totalFatPerServing, fatCalories);
    return { fat: fatCalories/totalCalories, carbs: carbsCalories/totalCalories, protein: proteinCalories/totalCalories};
  }

  render() {
    console.log('total calorie', this.state.totalCaloriesPerServing, this.state.macrosInG, this.state.macros)
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

        <section className="total">
          <h2 className="total">Total:</h2>
          <p className="total__calories">Total Calories: {this.state.totalCaloriesPerServing}</p>
          <p className="total__fat">Total Fat: {this.state.macrosInG.fat}g {Math.round(100 * this.state.macros.fat)}%</p>
          <p className="total__carbs">Total Carbs: {this.state.macrosInG.carbs}g {Math.round(100 * this.state.macros.carbs)}%</p>
          <p className="total__protein">Total Protein: {this.state.macrosInG.protein}g {Math.round(100 * this.state.macros.protein)}%</p>
        </section>
        

        <div className="main">
          {mealsHTML}
        </div>
    
      </div>
    );
  }
}

export default Menu;
