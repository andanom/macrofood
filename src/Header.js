import React from 'react';
import './Header.css'

const Header = (props) => (
  <header className="Header">
    <h1 className="Header__title">Meals Macro Calulator</h1>
    <p className="Header__description">
      Find the meals you like and calculate the macronutrients
    </p>
    <form className="search">
      <input className="search__input" type="text" name="search" placeholder="Search for a meal" />
      <button onClick={props.handleSearch} className="btn btn-search" type="submit">Search</button>
    </form>
  </header>
);

export default Header;