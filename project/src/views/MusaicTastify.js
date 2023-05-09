import {useEffect, useState} from "react";
import '../App.css';
import axios from 'axios';
import Plot from 'react-plotly.js';
import GenericSection from '../components/sections/GenericSection';
import Button from "../components/elements/Button"
import { stackOrderDescending } from "d3";
import ArtistSelect from '../components/elements/ArtistSelect';
import { SectionSplitProps } from '../utils/SectionProps';
import classNames from 'classnames';
import SectionHeader from '../components/sections/partials/SectionHeader';



//import Scatterplot from "~/Users/danielkrill/cse/musaic/project/src/components/elements/Scatterplot";
const propTypes = {
    ...SectionSplitProps.types
}

const defaultProps = {
    ...SectionSplitProps.defaults
}


const App = (
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
) => {
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
        title: 'Analyze Your Music Taste',
        paragraph: "🤔 are you really as classy as you say you are? 🤔"
    };


    const CLIENT_ID = "617bb37b7d4a4dfb89e88d56d6074af3"
    const REDIRECT_URI = "http://musaic.netlify.app/taste"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SERVER_NAME = "https://musaic-server-flask.herokuapp.com"
    const SCOPE = "user-top-read"

    const [token, setToken] = useState("")
    const [searchKey, setSearchKey] = useState("")
    const [artist, setArtist] = useState({ "pop_score" : 0, "mood_score" : 0 , "name": ""})
    const [scores, setScores] = useState({ "pop_score": { "long_term": 0, "medium_term": 0, "short_term": 0 }, "mood_score": { "long_term": 0, "medium_term": 0, "short_term": 0 } })


    var show_graph = false;
    // const getToken = () => {
    //     let urlParams = new URLSearchParams(window.location.hash.replace("#","?"));
    //     let token = urlParams.get('access_token');
    // }

    const [masterList, setMasterList] = useState([]);

    useEffect(() => {
        fetch(SERVER_NAME + '/get-artists',
            { method: "GET" }).then(response => response.json().then((dataf) => {
                console.log(dataf.optionList);
                setMasterList(dataf.optionList);
            })
            );
    }, []);

    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        // getToken()


        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const showArtist = (newlist) => {
        const tempglist = [];
        console.log(newlist.id);
        fetch(SERVER_NAME + "/get-artist/" + newlist.id, {method: "GET"})
        .then(
            response => response.json()
            .then(
                (dataf) => {
                    var temp_dict = {"pop_score" : dataf.pop_score, "mood_score" : dataf.mood_score, "name": dataf.name}
                    setArtist(temp_dict);
                    console.log(artist);
                }
            )
        )
        show_graph = true;

    }

    const showArtistGraph = () => {
        return (
            <Plot
            data={[
                {
                    x: [artist.mood_score],
                    y: [artist.pop_score],
                    type: 'scatter',
                    mode: 'markers',
                    marker: { color: 'blue' },
                    text: [artist.name]

                },
            ]}
            layout={{
                width: 500,
                height: 500,
                title: artist.name + "'s Music Type",
                xaxis: {
                    title: 'Danceability',
                    range: [0, 1] // set the range of the x axis
                },
                yaxis: {
                    title: 'Popularity',
                    range: [0, 100] // set the range of the x axis
                }
            }}
            />
        )
    }



    const showGraph = () => {


        return (
            <GenericSection>
                {scores ?
                    <Plot
                        data={[
                            {
                                x: [scores.mood_score.long_term, scores.mood_score.medium_term, scores.mood_score.short_term],
                                y: [scores.pop_score.long_term, scores.pop_score.medium_term, scores.pop_score.short_term],
                                type: 'scatter',
                                mode: 'markers',
                                marker: { color: 'red' },
                                text: ['all time', 'medium term', 'recent listening']
                               
                            },
                        ]}
                        layout={{   width: 500, 
                                    height: 500,
                                    title: 'Your Music Taste',
                            xaxis: {
                                title: 'Danceability',
                                range: [0, 2] // set the range of the x axis
                            },
                            yaxis: {
                                title: 'Popularity',
                                range: [0, 100] // set the range of the x axis
                            }
                        }}
                    />
                : <a>bonk</a>
            }

            </GenericSection>
            )
        

        return (<a>bonk</a>)


    
        
    }

    function onGet() {
        const url = SERVER_NAME + "/user-info";
        var headers = {}

        var params = {
            data : token
        }

        axios.post('https://musaic-server-flask.herokuapp.com/user-info', params)
            .then(function (response) {
                console.log(response);
                setScores(response.data)
                //Perform action based on response
            })
            .catch(function (error) {
                console.log(error);
                //Perform action based on error
            });


        console.log("scores here")
        console.log(scores)

    }

    return (
        <div className="App">
            <section {...props} > 
            <header className="App-header">
                <h1>  </h1>
            </header>
            <div className = {innerClasses}>
            <SectionHeader data={sectionHeader} className="center-content" />

            <div className={splitClasses}>

            <div className="split-item">
                <div className="split-item-content center-content-mobile">
                    <div className="center-content mt-0 mb-12">

                        {!token ?
                            <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}>Fucking prove it</a>
                            : <Button onClick={logout}>Logout</Button>}

                        {token ?
                            <div>
                                <form onSubmit={onGet}>
                                    <Button type={"submit"}>Show me them dots</Button>
                                </form>
                            </div>

                            : <h2></h2>
                        }
                    </div>
               
                    <div className="center-content mt-0 mb-12">
                        {showGraph()}
                    </div>
                </div>
                <div className="split-item-content center-content-mobile" display="flex"/>

                <div className="split-item-content center-content-mobile" display="flex">
                    <div className="center-content mt-0 mb-12">
                        <ArtistSelect props={masterList} update={showArtist} />
                    </div>
                    <div className="center-content mt-0 mb-12">
                        {showArtistGraph()}
                    </div>
                </div>
            </div>
            </div>
            </div>
            </section>
        </div>
    );
}

export default App;