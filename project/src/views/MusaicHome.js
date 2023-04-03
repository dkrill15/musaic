import React, { useRef } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from '../utils/ScrollReveal';

// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';

const MusaicHome = () => {
  const childRef = useRef();

  return (
    <>
      <Hero className="illustration-section-01" />
      {/* <FeaturesTiles /> */}
      <FeaturesSplit/>
      <Testimonial/>
      <Cta split />
    </>
  );
};

export default MusaicHome;
