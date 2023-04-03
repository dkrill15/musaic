import React from 'react';

function MusifiedImage(props) {

    if  (props.path) {         console.log("show it")
        return (
        <img src="http://db8.cse.nd.edu:5014/get-image" />
    )
    }
    else {
        console.log("hide it")
        return (<img src="http://db8.cse.nd.edu:5014/get-default-img" />)
    }
}
export default React.memo(MusifiedImage);
