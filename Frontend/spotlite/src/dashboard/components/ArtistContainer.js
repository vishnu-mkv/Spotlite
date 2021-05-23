import React from 'react';
import './ArtistContainer.css';
import Avatar from "@material-ui/core/Avatar";
import {Link} from "react-router-dom";

function ArtistContainer({artist}) {
    return artist && (
        <div className="ArtistContainer">
            <Link to={"/view/artist/" + artist.id}>
                <Avatar src={artist.images[artist.images.length - 1]?.url} alt=""/>
                <strong>{artist.name}</strong>
            </Link>
        </div>
    );
}

export default ArtistContainer;