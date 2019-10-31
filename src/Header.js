import React from 'react';
import './Header.css'

const Header = (props) => (
  <header className="Menu">
    <h1 className="Menu__title">M</h1>
    <p className="Menu__description">
      Choose the meals you want:
    </p>
    <form className="search">
      <input className="search__input" type="text" name="search" placeholder="Search for a meal" />
      <button onClick={props.handleSearch} className="btn btn-search" type="submit">Search</button>
    </form>
  </header>
);

export default Header;