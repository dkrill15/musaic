import React from 'react';

function MusaicOutput(props) {
    if(props.path) {
        return (
            <img src="http://db8.cse.nd.edu:5014/get-musaic-outfile"/>
        )
    }
    else {
        console.log("hide it")
        return(<img src="http://db8.cse.nd.edu:5014/get-default-img"/>)
    }
}
export default React.memo(MusaicOutput);
