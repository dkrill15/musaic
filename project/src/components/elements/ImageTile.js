import React from 'react';
import { useState } from 'react';

function ImageTile(props) {

    const playSound = (props) => {
        let square=document.getElementById(props);
        square.size = 'massive';
        square.play();
    };
  
    const stopSound = (props) => {
        let square=document.getElementById(props);
        square.pause();
    };

    return (
        <>
            <img style={{width: "33%", zIndex: 4, cursor: "pointer"}} src={props.imageURL} onMouseEnter={() => playSound(props.audio)} onMouseLeave={() => stopSound(props.audio) } onClick={props.onClick}></img>
            {/* change index of audio */}
            <audio id={props.audio} key={props.audio}><source src={props.audio} type="audio/mpeg" /></audio>
        </>
    )
}

export default ImageTile;