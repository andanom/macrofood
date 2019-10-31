import React, {Component} from 'react';
const dbRecipes = require('./recipes.json');

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meals: [],
      mealsSelected: [],
      spinner: 'Loading...',
      finishedLoading: false,
    }
  }

  componentDidMount() {
    this.fetchMeals(this.props.query);
  }

  fetchMeals = (query) => {
    query = 'salt';
    this.setState({meals: dbRecipes, finishedLoading: true})  
  }

  render() {
    const mealsHTML = this.state.finishedLoading ?
      this.state.meals.hits[0].recipe.label
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
