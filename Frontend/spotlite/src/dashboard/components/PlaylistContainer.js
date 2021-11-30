import React from 'react';
import {Link} from 'react-router-dom';
import "./PlaylistContainer.css";

function PlaylistContainer({image, name, url}) {
    return (
        <div className="playlistContainer">
            <Link to={url}>
                {image}
                <p>{name.substr(0, 20) + (name.length > 20 ? '...' : '')}</p>
            </Link>  
        </div>
    )
}

export default PlaylistContainer;
