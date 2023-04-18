import React from "react";
import InputMusifyFile from "../components/elements/InputMusifyFile";
import MusicInput from "../components/sections/MusicInput";
import classNames from 'classnames';
import { SectionSplitProps } from '../utils/SectionProps';
import SectionHeader from '../components/sections/partials/SectionHeader';
import Image from '../components/elements/Image';
import HeroMusify from '../components/sections/HeroMusify';

const propTypes = {
  ...SectionSplitProps.types
}

const defaultProps = {
  ...SectionSplitProps.defaults
}

const MusaicMusify = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  invertMobile,
  invertDesktop,
  alignTop,
  imageFill,
  ...props
}) => {

// const MusaicMusify = () => {

  const outerClasses = classNames(
    'features-split section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'features-split-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const splitClasses = classNames(
    'split-wrap',
    invertMobile && 'invert-mobile',
    invertDesktop && 'invert-desktop',
    alignTop && 'align-top'
  );

  const sectionHeader = {
    title: 'Musify an Image!',
    paragraph: "Upload a favorite image, sit back, and relax! Musaic will do the work for you.",
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          {/* <HeroMusify className="illustration-section-01" /> */}

          <p></p>
          <SectionHeader data={sectionHeader} className="center-content" />

          <MusicInput className="center-content"/>
          </div>
      </div>
    </section>
  );
}

export default MusaicMusify;
