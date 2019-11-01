import React from 'react';
import './Total.css'
const Total = (props) => (
  <section className="Total">
    {/* <h2 className="Total__title">Total macro:</h2> */}
    
    <p className="Total__calories">Calories: {props.totalCaloriesPerServing}</p>

    <div className="Total__fcp-container">
      <div className="Total__fat">
        <p className="Total__fat__title">Fat</p>
        <p className="Total__fat__g">{props.macrosInG.fat}g</p>
        <p className="Total__fat__percentage">{Math.round(100 * props.macros.fat)}%</p>      
      </div>
      <div className="Total__carbs">
        <p className="Total__carbs__title">Carbs</p>
        <p className="Total__carbs__g">{props.macrosInG.carbs}g</p>
        <p className="Total__carbs__percentage">{Math.round(100 * props.macros.carbs)}%</p>      
      </div>
      <div className="Total__protein">
        <p className="Total__protein__title">Protein</p>
        <p className="Total__protein__g">{props.macrosInG.protein}g</p>
        <p className="Total__protein__percentage">{Math.round(100 * props.macros.protein)}%</p>
      </div>
    </div>
  </section>
);

export default Total;