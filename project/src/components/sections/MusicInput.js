import React, { useState } from "react";
import classNames from 'classnames';
import { SectionSplitProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';
import Image from '../elements/Image';
import PartyPowerSlider from '../elements/PartyPowerSlider';
import Button from '../elements/Button';
import ImageInput from '../elements/ImageInput';
import CatalogMessage from '../elements/CatalogMessage';
import MusifiedImage from '../elements/MusifiedImage';
import UploadAndDisplayImage from '../elements/UploadImage';
import GenreSelect from '../elements/GenreSelect';
import ArtistSelect from '../elements/ArtistSelect';

const propTypes = {
    ...SectionSplitProps.types
}

const defaultProps = {
    ...SectionSplitProps.defaults
}

const MusicInput = ({
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


    const { musicparams } = { musicparams: ["Party Power", "Mood", "Popularity", "Intensity"] }; //use to initialize params
    const musik = { "Party Power": 0, "Mood": 0, "Popularity": 0, "Intensity": 0 };

    //initialize most variables
    const [data, setdata] = React.useState({
        musikp: { "Party Power": 0, "Mood": 0, "Popularity": 0, "Intensity": 0 },
        catalog: [],
        song_length: 0,
        pathto: 0,
        file: "",
    });

    //initialize file variable
    const [file, setFile] = React.useState("");

    const [genreList, setGenreList] = React.useState([]);
    const [artistList, setArtistList] = React.useState([]);

    const [masterList, setMasterList] = React.useState([]);

        React.useEffect(() => {
            fetch('http://db8.cse.nd.edu:5014/getlist',
                {method: "GET"}).then(response => response.json().then((dataf) => {
                    console.log(dataf.optionList);
                    setMasterList(dataf.optionList);
              })
            );
        }, []);


    //setter for query parameters
    const update = (name, value) => {
        const newm = data.musikp;
        newm[name] = value;
        setdata({
            musikp: newm,
            song_length: data.song_length,
            pathto: data.pathto,
        });


        console.log(data.song_length);
        console.log(data.musikp);
    };


    //setter for filename
    const updateFile = (fileName) => {
        setFile(fileName)
        setdata({
            musikp: data.musikp,
            catalog: data.catalog,
            song_length: data.song_length,
            file: data.file,
            pathto: 0,
        });
    };

    const updateGenre = (newlist) => {
        const tempglist = [];
        newlist.forEach((item) =>
            tempglist.push(item.label),
        );
        console.log(tempglist);
        setdata({
            musikp: data.musikp,
            catalog: data.catalog,
            song_length: data.song_length,
            file: data.file,
            pathto: 0,
        });
        setGenreList(tempglist);

    }

    const updateArtist = (newlist) => {
        const tempglist = [];
        newlist.forEach((item) =>
            tempglist.push(item.label),
        );
        console.log(tempglist);
        setdata({
            musikp: data.musikp,
            catalog: data.catalog,
            song_length: data.song_length,
            file: data.file,
            pathto: 0,
        });
        setArtistList(tempglist);

    }

    //searches database given song input and updates length of catalog
    const getSongs = () => {
        console.log(data.musikp)

        fetch('http://db8.cse.nd.edu:5014/searchsong?dance=' + data.musikp["Party Power"] +
            "&mood=" + data.musikp["Mood"] + "&pop=" + data.musikp["Popularity"] + "&energy=" + data.musikp["Intensity"],
            { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ "genres": genreList, "artists": artistList }) }).then(response => response.json().then((dataf) => {
                setdata({
                    musikp: data.musikp,
                    catalog: dataf.catalog,
                    song_length: dataf.catalog.length,
                    file: data.file,
                    pathto: 0,
                });

            })
            );

        console.log(data.song_length);
    };

    //when user clicks genereate image files, makes image files from catalog and then builds mosaic
    const makeFiles = () => {
        fetch('http://db8.cse.nd.edu:5014/filegen?stamp=' + Date.now() + "&target=" + file,
            { method: "POST"}).then(response => response.json().then(() => {
                setdata({
                    musikp: data.musikp,
                    catalog: data.catalog,
                    song_length: data.song_length,
                    file: data.file,
                    pathto: 1,
                });

                console.log(data.pathto);

            })
            );

    };


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

    return (
    <div>
        <section
            {...props}
            className={outerClasses}
        >
            <div className="container">
                <div className={innerClasses}>
                    {/* <p style={{"textAlign": "left"}} className="text-color-primary">
                        <ol >
                            <li>Set the song attributes you want</li>
                            <li>'Get songs' to see how many songs match your criteria</li>
                            <li>Select an image and then upload it</li>
                            <li>MUSIFY your image!</li>
                        </ol>
                    </p> */}
                    <p></p>
                    <div className={splitClasses}>
                    <div style={{"textAlign": "left"}} className="text-color-primary">First, select the <b>song attributes</b> (minimum values), <b>genres</b>, or <b>artists</b> that you want...</div>
                        <div className="split-item">
                            <div className="split-item-content">
                                <div className="center-content">
                                    {musicparams.map((paramm) => (
                                        <PartyPowerSlider name = {paramm} update={update}></PartyPowerSlider>
                                    ))}
                                </div>
                            </div>

                            <div className="split-item-content">
                                    <div className="center-content">
                                    <GenreSelect update_genre={updateGenre} list={masterList.genres}/>
                                    <p></p>
                                    <ArtistSelect update={updateArtist} list={masterList.artists}/>
                                    <p></p>

                                </div>
                            </div>
                        </div>
                    </div>
                    <p></p>
                    <p></p>
                    <p></p>
                    <Button color="primary" onClick = {getSongs}>Get Songs</Button>
                    <p></p>
                    <CatalogMessage size={data.song_length}></CatalogMessage>

                </div>
            </div>
        </section>

        <section
        {...props}
        className={outerClasses}
        >
            <p className="text-color-primary"><b>NEXT, CHOOSE AN IMAGE TO MUSIFY</b></p>
            <ImageInput update={updateFile}></ImageInput>
        </section>

        <section
        {...props}
        className={outerClasses}
        >
            <p> </p>
            <p> </p>
            <p> </p>
            <Button color="primary" onClick = {makeFiles}>MUSIFY!</Button>
        </section>

        <section
        {...props}
        className={outerClasses}
        >
            <div className="container">
                <div className={innerClasses}>
                    <h2 className="center-content mt-0 mb-12">Your MUSAIC awaits...</h2>
                    Be Patient! If your Musiac is too good for our website, please open the image in a new tab.
                    <MusifiedImage className="center-content" path = {data.pathto}></MusifiedImage>

                </div>
            </div>
        </section>
    </div>
    );


}

export default MusicInput;
