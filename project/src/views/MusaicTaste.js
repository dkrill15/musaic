import React from "react";
import Grid from "../Grid"
import Plot from 'react-plotly.js';
import { useState } from 'react';

import GenericSection from '../components/sections/GenericSection';
import Button from "../components/elements/Button"



var SERVER_NAME = 'http://localhost:5014'

function MusaicTaste () {


  const [user_data, setdata] = useState({
    scores: { "mood_score": { "long_term": 0, "medium_term": 0, "short_term": 0 }, "pop_score": { "long_term": 0, "medium_term": 0, "short_term": 0 } }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(`You tried to search for: ${search}`)


    fetch(SERVER_NAME + '/taste', { method: "GET"});
    
    // .then(response => response.json().then((fetch_data) => {
    //     // Setting a data from api
    //     setdata({
    //       scores: fetch_data
    //     });
    //   }))
    // }
  
  }

    //console.log(user_data.scores.mood_score.long_term)





  function onGet() {
    const url = SERVER_NAME + "/user-info";
    var headers = {}

    fetch(url, {
      method: "GET",
      mode: 'cors',
      headers: headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.error)
        }
        console.log("here");
        return response;

        
      })
      .then(data => {
        console.log(data);
      })
      .catch(function (error) {
        console.log("you sick");
      });
  }

  return (
    <GenericSection>

      <form onSubmit={handleSubmit}>
          <Button color="primary" type="submit">{user_data.scores.mood_score.long_term}</Button>
      </form>

    <Plot
      data={[
        {
          x: [user_data.scores.mood_score.long_term, user_data.scores.mood_score.short_term, user_data.scores.mood_score.medium_term],
          y: [2, 6, 3],
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'red' },
        },
        { type: 'bar', x: [1, 2, 3], y: [2, 5, 3] },
      ]}
      layout={{ width: 320, height: 240, title: 'A Fancy Plot' }}
    />
    </GenericSection>

  );
};
  
export default MusaicTaste;