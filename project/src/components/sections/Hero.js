import React, { useState } from 'react';
import classNames from 'classnames';
import { SectionProps } from '../../utils/SectionProps';
import ButtonGroup from '../elements/ButtonGroup';
import Button from '../elements/Button';
import Image from '../elements/Image';

const propTypes = {
  ...SectionProps.types
}

const defaultProps = {
  ...SectionProps.defaults
}

const Hero = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  ...props
}) => {

  const [videoModalActive, setVideomodalactive] = useState(false);



  const outerClasses = classNames(
    'hero section center-content',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'hero-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container-sm">
        <div className={innerClasses}>
          <div className="hero-content">
            <h1 className="mt-0 mb-16 reveal-from-bottom" data-reveal-offset="200">
              Welcome to <span className="text-color-primary">Musaic</span>
            </h1>
            <div className="container-xs">
              <p className="m-0 mb-32 reveal-from-bottom" data-reveal-offset="400">
                Where music and art collide - tastefully.
              </p>
              {/* <div className="reveal-from-bottom" data-reveal-offset="600">
                <ButtonGroup>
                  <Button tag="a" color="primary" wideMobile href="https://cruip.com/">
                    Connect Spotify
                    </Button>
                  <Button tag="a" color="dark" wideMobile href="https://github.com/cruip/open-react-template/">
                    View sample
                    </Button>
                </ButtonGroup>
              </div> */}
            </div>
          </div>
          {/* <div className="hero-figure reveal-from-bottom illustration-element-01" data-reveal-value="20px" data-reveal-delay="800">
            <a>

              <Image
                className="has-shadow"
                src={require('./../../assets/images/bread.webp')}
                alt="Hero"
                width={896}
                height={504} />
            </a>
          </div> */}

        </div>
      </div>
    </section>
  );
}

Hero.propTypes = propTypes;
Hero.defaultProps = defaultProps;

export default Hero;
