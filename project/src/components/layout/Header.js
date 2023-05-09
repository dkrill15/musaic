import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { Link } from 'react-router-dom';
import Logo from './partials/Logo';
import {
  Redirect,
  Link
} from "react-router-dom";

import Home from "../../views/MusaicHome";
import About from "../../views/MusaicAbout";
import Create from "../../views/MusaicCreate";
import Musify from "../../views/MusaicMusify";

const propTypes = {
  navPosition: PropTypes.string,
  hideNav: PropTypes.bool,
  hideSignin: PropTypes.bool,
  bottomOuterDivider: PropTypes.bool,
  bottomDivider: PropTypes.bool
}

const defaultProps = {
  navPosition: '',
  hideNav: false,
  hideSignin: false,
  bottomOuterDivider: false,
  bottomDivider: false
}

const Header = ({
  className,
  navPosition,
  hideNav,
  hideSignin,
  bottomOuterDivider,
  bottomDivider,
  ...props
}) => {

  const [isActive, setIsactive] = useState(false);

  const nav = useRef(null);
  const hamburger = useRef(null);

  useEffect(() => {
    isActive && openMenu();
    document.addEventListener('keydown', keyPress);
    document.addEventListener('click', clickOutside);
    return () => {
      document.removeEventListener('keydown', keyPress);
      document.removeEventListener('click', clickOutside);
      closeMenu();
    };
  });

  const openMenu = () => {
    document.body.classList.add('off-nav-is-active');
    nav.current.style.maxHeight = nav.current.scrollHeight + 'px';
    setIsactive(true);
  }

  const closeMenu = () => {
    document.body.classList.remove('off-nav-is-active');
    nav.current && (nav.current.style.maxHeight = null);
    setIsactive(false);
  }

  const keyPress = (e) => {
    isActive && e.keyCode === 27 && closeMenu();
  }

  const clickOutside = (e) => {
    if (!nav.current) return
    if (!isActive || nav.current.contains(e.target) || e.target === hamburger.current) return;
    closeMenu();
  }

  const classes = classNames(
    'site-header',
    bottomOuterDivider && 'has-bottom-divider',
    className
  );

  // FUNCTIONS TO NAVIGATE BETWEEN WEB PAGES //////////////////

  /* Claudia i read online this, so basically useNavigate like doesn't exist in the version
  of react dom that we have and that its not a good function to use in the first place, youre
  supposed to use Redirect() and it does the same thing anyway but better and safer - sam */

  // const navigate = Redirect();
  const navigateToHome = () => {
    // navigate('/');
    return
  };
  const navigateToAbout = () => {
    // navigate('/about');
    return
  };
  const navigateToCreate = () => {
    // navigate('/create');
    return
  };
  const navigateToMusify = () => {
    // navigate('/musify');
    return
  };

  //////////////////////////////////////////

  return (
    <header
      {...props}
      className={classes}
    >
      <div className="container">
        <div className={
          classNames(
            'site-header-inner',
            bottomDivider && 'has-bottom-divider'
          )}>
          <Logo />
          {!hideNav &&
            <>
              <button
                ref={hamburger}
                className="header-nav-toggle"
                onClick={isActive ? closeMenu : openMenu}
              >
                <span className="screen-reader">Menu</span>
                <span className="hamburger">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <nav
                ref={nav}
                className={
                  classNames(
                    'header-nav',
                    isActive && 'is-active'
                  )}>
                <div className="header-nav-inner">
                  <ul className={
                    classNames(
                      'list-reset text-xs',
                      navPosition && `header-nav-${navPosition}`
                    )}>
                    {/* <li>
                      <Link to="home" onClick={navigateToHome}>Home</Link>
                    </li>
                    <li>
                      <Link to="create" onClick={navigateToCreate}>Create</Link>
                    </li>
                    <li>
                      <Link to="musify" onClick={navigateToMusify}>Musify</Link>
                    </li>
                    <li>
                      <Link to="about" onClick={navigateToAbout}>About</Link>
                    </li> */}
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/about">About</Link>
                    </li>
                    <li>
                      <Link to="/create">Create</Link>
                    </li>
                    <li>
                      <Link to="/musify">Musify</Link>
                    </li>
                    <li>
                      <Link to="/taste">Tastify</Link>
                    </li>
                  </ul>
                  {/* {!hideSignin &&
                    <ul
                      className="list-reset header-nav-right"
                    >
                      <li>
                        <Link to="#0" className="button button-primary button-wide-mobile button-sm" onClick={closeMenu}>Sign up</Link>
                      </li>
                    </ul>} */}
                </div>
              </nav>
            </>}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
