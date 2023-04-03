import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Testimonial = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: 'Rated 10/10 in Customer Satisfaction.',
    paragraph: 'in our opinion.'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          <SectionHeader data={sectionHeader} className="center-content" />
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-right" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Musaic, uh, changed the way I, uh, listen to music. When I open my, uh, music app and see rows of playlists with Musaics as covers, I almost want to, uh, cry tears of joy. The, uh, elation of being able to see what's in my playlist just by its beautiful Musaic cover is unlike anything I've ever experienced in my entire, uh, life.
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">Barack Obama</span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">44th President of the United States</a>
                  </span>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — I Musified this picture of my dog and sent it to every Apple employee, just to test the waters. I got dozens of replies in minutes. "Is this our tech?" "How did you do that?" I could only laugh and respond, "Friend, I wish we made this." I continue to wish that every day.
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">Tim Cook</span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">CEO of Apple</a>
                  </span>
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-left" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Musaic is onto some really otherworldly stuff. I've got them hung up all around my mansions. I'm pretty sure my bathrooms together have about 10 Musaics printed out with that huuuge FatHead vinyl sticker stuff. They're sick. I only use my own albums for the pictures too - it helps keep me humble and see how far I've come.
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">Jaden Smith</span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">Actor and Musician</a>
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;