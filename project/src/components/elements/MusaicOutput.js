import React from 'react';

var SERVER_NAME = "http://localhost:5014"

function MusaicOutput(props) {
    if(props.path) {
        return (
            <img src= "http://localhost:5014/get-musaic-outfile"/>
        )
    }
    else {
        console.log("hide it")
        return (<img src="http://localhost:5014/get-default-img"/>)
    }
}
export default React.memo(MusaicOutput);
