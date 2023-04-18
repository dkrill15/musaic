import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function AlbumThumbnail(props) {
    return (
        <div>
            <img src={props.url}/>
            <p>{props.album}</p>
            <p>{props.artist}</p>
        </div>
    )
}

export default AlbumThumbnail;