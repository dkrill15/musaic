import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useState } from 'react';

import GenericSection from '../sections/GenericSection';

import Button from "./Button"
import Input from "./Input"


import ImageTile from "./ImageTile"

import MusaicOutput from "./MusaicOutput"

import CreateHeader from "../sections/CreateHeader"


// const gridStyle = {
//   display: 'grid',
//   gridAutoRows: '300px',
//   gridAutoColumns: '300px',
// }

let cart = [];
let join_cart = [];

let musaic_path = undefined

function AlbumSearch() {
  const [search, setSearch] = useState("");

  const [data, setdata] = useState({
    song: [],
    result: "",
    musaic_path: 0,
    updated: new Date(),
  });

  const addToCart = (album_data, song_data) => {
    // console.log('before:', cart, album_data);

    // make sure we have less than 9 before trying to add
    if(cart.length < 9) {

      // compare against everything currently in the cart to make sure this is new
      for(let i = 0; i < cart.length; i++) {
        if (cart[i] == album_data) {
          console.log('Error adding to cart: album is already in cart!')
          return;
        }
      }

      // if we're here, we have less than 9 and it's not already there
      // update the cart data with the new album
      cart.push(album_data);
      join_cart.push([album_data, song_data]);
    } else {
      console.log('Error adding to cart: cart is full! (>= 9 items)');
      return;
    }

    setdata({
      song: data.song,
      result: data.result,
      musaic_path: data.musaic_path,
      updated: new Date(),
    });

    console.log("Updated Cart:", cart);
    return;
  };

  const removeFromCart = (album_data) => {
    console.log('Removing from cart.')
    console.log('Before:', cart)
    let index = cart.indexOf(album_data)
    cart.splice(index, 1)
    join_cart.splice(index, 1)
    console.log("After:", cart)

    setdata({
      song: data.song,
      result: data.result,
      musaic_path: data.musaic_path,
      updated: new Date(),
    });

    return;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(`You tried to search for: ${search}`)
    setdata({
      song: [],
      result: "",
      musaic_path: 0,
      updated: new Date(),
    })

    fetch('http://10.29.69.172:5014/add?q=' + search + "&num=" + 9, {method: "POST"}).then(response => response.json().then((fetch_data) => {
      // Setting a data from api
        setdata({
          song: fetch_data.song,
          result: fetch_data.result,
          musaic_path: 0,
          updated: new Date(),
        });
      })
    );
  }

  const handleCreate = (event) => {
    event.preventDefault();

    if (cart.length != 9) {
      alert(`You must select 9 songs to create your Musaic.\n Please add ${9-cart.length} more songs to your cart!`);
      return;
    }

    let cartStr = cart.join('~');

    if(musaic_path != undefined) {
      musaic_path = undefined
    }
  
    // let selectSort = document.getElementById("select-sort");

    let sortMethods = document.getElementsByName('sort');
    let arrangeMethods = document.getElementsByName('arrange');
    let sort;
    let arrange;
    
    for(let i = 0; i < sortMethods.length; i++) {
      if(sortMethods[i].checked) {
        sort = sortMethods[i].value;
        break;
      }
    }
    for(let i = 0; i < arrangeMethods.length; i++) {
      if(arrangeMethods[i].checked) {
        arrange = arrangeMethods[i].value;
        break;
      }
    }

    fetch('localhost:5014/create?cart=' + cartStr + "&sort=" + sort + "&arrange=" + arrange, {method: "POST"}).then(response => response.json().then((fetch_data) => {
      console.log(fetch_data.result);
      if(fetch_data.result == "success") {
        musaic_path = fetch_data.path
        setdata({
          song: data.song,
          result: data.result,
          musaic_path: 1,
          updated: new Date(),
        });
      }
    }));

    // alert(`Sort type: ${sort}. Arrange type: ${arrange}\n${cartStr}`);

    return;
  }

  return (
    <GenericSection>
      <h1>Become a <span className="text-color-primary">Muser</span> today.</h1>
      <span className="text-color-primary">Search for songs, artists, or albums...</span>
      <p></p>
      {/* onChange={handleSubmit} */}
      <form class="form-group" onSubmit={handleSubmit}>
          <Input type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size= '50'
            placeholder="Search Musaic"
          />
          <Button color="primary" type="submit">search</Button>
      </form>

      <div style={{display: "grid", gridAutoRows: "1fr 1fr 1fr", gridAutoColumns: "1fr 1fr 1fr"}}>
        <div style={{display: "flex", flexDirection: "row"}}>
          <ImageTile imageURL={data.song[0]} audio={data.song[9]}  albumID={data.song[18]} onClick={() => addToCart(data.song[0], data.song[9])}></ImageTile>
          <ImageTile imageURL={data.song[1]} audio={data.song[10]} albumID={data.song[19]} onClick={() => addToCart(data.song[1], data.song[10])}></ImageTile>
          <ImageTile imageURL={data.song[2]} audio={data.song[11]} albumID={data.song[20]} onClick={() => addToCart(data.song[2], data.song[11])}></ImageTile>
        </div>

        <div style={{display: "flex", flexDirection: "row"}}>
          <ImageTile imageURL={data.song[3]} audio={data.song[12]} albumID={data.song[21]} onClick={() => addToCart(data.song[3], data.song[12])}></ImageTile>
          <ImageTile imageURL={data.song[4]} audio={data.song[13]} albumID={data.song[22]} onClick={() => addToCart(data.song[4], data.song[13])}></ImageTile>
          <ImageTile imageURL={data.song[5]} audio={data.song[14]} albumID={data.song[23]} onClick={() => addToCart(data.song[5], data.song[14])}></ImageTile>
        </div>

        <div style={{display: "flex", flexDirection: "row"}}>
          <ImageTile imageURL={data.song[6]} audio={data.song[15]} onClick={() => addToCart(data.song[6], data.song[15])}></ImageTile>
          <ImageTile imageURL={data.song[7]} audio={data.song[16]} onClick={() => addToCart(data.song[7], data.song[16])}></ImageTile>
          <ImageTile imageURL={data.song[8]} audio={data.song[17]} onClick={() => addToCart(data.song[8], data.song[17])}></ImageTile>
        </div>
      </div>

      <h1>My Cart</h1>
      <div style={{width: "50%", height:"auto", display: "flex",flexDirection: "row", justifyContent: "flex-start"}} id="cart-cont">
        {join_cart.map((item) => {
          return <ImageTile imageURL={item[0]} audio={item[1]} onClick={() => removeFromCart(item[0])}></ImageTile>
        })}
      </div>

      <form class="form-group" onSubmit={handleCreate}>
          <div id="select-sort" style={{display: "flex", flexDirection: "column", color: "white"}}>
            <p><span className="text-color-primary">Select Sorting Method</span></p>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="hue" id="hue"/>
                  <label for="hue">Hue</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="sat" id="sat"/>
                  <label for="sat">Saturation</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="bright" id="bright"/>
                  <label for="bright">Brightness</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="hsb" id="hsb"/>
                  <label for="hsb">Overall HSB</label>
                </div>
              </div>
              <div style={{display: "flex", flexDirection: "column", marginLeft: "1em"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="stdev_hue" id="stdev_hue"/>
                  <label for="stdev_hue">Std. Dev. of Hue</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="stdev_sat" id="stdev_sat"/>
                  <label for="stdev_sat">Std. Dev. of Saturation</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="stdev_bright" id="stdev_bright"/>
                  <label for="stdev_bright">Std. Dev. of Brightness</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="sort" value="stdev_hsb" id="stdev_hsb"/>
                  <label for="stdev_hsb">Std. Dev. of Overall HSB</label>
                </div>
              </div>
            </div>
          </div>
          <div id="select-arrange" style={{display: "flex", flexDirection: "column", color: "white"}}>
            <p><span className="text-color-primary">Select Arrangement Direction</span></p>
            <div style={{display: "flex", flexDirection: "row"}}>
              <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="up" id="up"/>
                  <label for="up">Up</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="down" id="down"/>
                  <label for="down">Down</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="left" id="left"/>
                  <label for="left">Left</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="right" id="right"/>
                  <label for="right">Right</label>
                </div>
              </div>

              <div style={{display: "flex", flexDirection: "column", marginLeft: "1em"}}>
                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="up-right" id="up-right"/>
                  <label for="up-right">Up & Right</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="up-left" id="up-left"/>
                  <label for="up-left">Up & Left</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="down-right" id="down-right"/>
                  <label for="down-right">Down & Right</label>
                </div>

                <div style={{display: "flex", flexDirection: "row"}}>
                  <input type="radio" name="arrange" value="down-left" id="down-left"/>
                  <label for="down-left">Down & Left</label>
                </div>
              </div>
            </div>
          </div>
          <Button color="primary" type="submit" style={{marginLeft: "1em"}}>Create!!!</Button>
      </form>

      <h1>My Result</h1>
      <MusaicOutput className="center-content" path={data.musaic_path}></MusaicOutput>
    </GenericSection>
  )
}

export default AlbumSearch;
