import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import PartyPowerSlider from '../elements/PartyPowerSlider';

function VisualFilter() {

    // create variables to store values of three visual elements
    const  { visualparams } = {visualparams: ["Hue", "Saturation", "Brightness"]};

    // initialize values
    const [data, setdata] = React.useState({
        visualp: {"Hue":0, "Saturation":0, "Brightness":0}
    });

    // update the values using sliders
    const update = (name, value) => {
        const newv = data.visualp;
        newv[name] = value;
        setdata({
            visualp: newv,
        });
    }

    // slider for each visual image attribute
    return (
        <div className='slider'>
            <div className='row'>
                {visualparams.map((param) => (
                    <PartyPowerSlider name = {param} update={update}></PartyPowerSlider>
                ))}
            </div>

        </div>
    );
}

export default VisualFilter;