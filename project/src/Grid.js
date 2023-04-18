import React, { useState, useRef, useEffect } from "react";
import { useLocation, Switch } from 'react-router-dom';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';


import Art from "./views/art";
import Home from "./views/Home"

import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"


import Input from "./components/elements/Input"
import Button from "./components/elements/Button"
import Switch1 from "./components/elements/Switch"
import AlbumSearch from "./components/elements/AlbumSearch"
import MusicInput from './components/sections/MusicInput';

import LayoutDefault from './layouts/LayoutDefault';

//import Stack from '@mui/material/Stack';
//import Slider from '@mui/material/Slider';



function Grid() {

    const [data, setdata] = useState({
            song: [],
            result: "",
        });

    function valuetext(value) {
      return `${value}°C`;
    }

    const marks = [
      {
        value: 0,
        label: '0°C',
      },
      {
        value: 100,
        label: '100°C',
      },
    ];

      const childRef = useRef();
      let location = useLocation();
      //console.log(location)

      useEffect(() => {
        const page = location.pathname;
        document.body.classList.add('is-loaded')
        childRef.current.init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        // fetch('http://db8.cse.nd.edu:/grid', {method: "POST", body:"body"}).then(response => response.json().then((data) => {
        //         // Setting a data from api
        //         setdata({
        //             song: data.song,
        //             result: data.result,
        //         });
        //     })
        // );
    }, [location]);

      return (

        <ScrollReveal
          ref={childRef}
          children={() => (
            // <div>
            //   {/* <Header/> */}

            //   {/* <FormLabel/> */}
            //   {/* <Input type="text" placeholder="enter an album, artist, or song" /> */}

            //   <div class="form-group">
            //       <Input type="text" placeholder="enter an album, artist, or song"/>
            //       <Button color="primary" onClick={testFunction}>search</Button>
            //   </div>

            //   {/* <img
            //     src={data.song[5]}
            //     alt="new"
            //   /> */}
            //   {/* <Home /> */}
            //   {/* <Footer/> */}
            // </div>

            <>
            {/* <Header/> */}
            <div className="row">
            <AlbumSearch/>
            </div>
            {/* <Footer/> */}
            </>


          )} />
      );
}


export default Grid;
