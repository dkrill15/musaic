import React from 'react';
import GenericSection from '../components/sections/GenericSection';
// import sections
import Hero from '../components/sections/Hero';
import FeaturesTiles from '../components/sections/FeaturesTiles';
import FeaturesSplit from '../components/sections/FeaturesSplit';
import Testimonial from '../components/sections/Testimonial';
import Cta from '../components/sections/Cta';

const Home = () => {

  return (
    <>
      <Hero className="illustration-section-01" />

      {/* <GenericSection/> */}

      <FeaturesTiles />
      <FeaturesSplit/>
      <Testimonial/>
      <Cta split />
    </>
  );
}

export default Home;
