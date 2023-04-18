import React, { useRef, useEffect } from 'react';
import AppRoute from './utils/AppRoute';
import ScrollReveal from './utils/ScrollReveal';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
} from "react-router-dom";

// Layouts
// import LayoutDefault from './layouts/LayoutDefault';

// Views
import MusaicHome from "./views/MusaicHome";
import MusaicAbout from "./views/MusaicAbout";
import MusaicCreate from "./views/MusaicCreate";
import MusaicMusify from "./views/MusaicMusify";
import Header from './components/layout/Header';

const App = () => {
  const childRef = useRef();
  // let location = useLocation();

  // console.log(childRef, location)

  // useEffect(() => {
  //   const page = location.pathname;
  //   document.body.classList.add('is-loaded')
  //   childRef.current.init();
  //   // trackPage(page);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location]);  

  return (
    <ScrollReveal 
    ref={childRef}
    children={() => (
      <>
        <Router>
          <div className="App">
            <Header/>
            <Switch>
              <Route exact path="/"> <MusaicHome/>   </Route> 
              <Route path="/about" > <MusaicAbout/>  </Route>
              <Route path="/create"> <MusaicCreate/> </Route>
              <Route path="/musify"> <MusaicMusify/> </Route>
            </Switch>
          </div>
        </Router>
      </>
    )}/>
  );
}

export default App;
