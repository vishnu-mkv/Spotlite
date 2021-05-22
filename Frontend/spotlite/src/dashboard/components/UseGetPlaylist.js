import SpotifyApi from 'spotify-web-api-js';
import React, { useState, useEffect } from 'react'
import { useDataLayerValue } from '../../data/DataLayer';
const spotify = new SpotifyApi();


function UseGetPlaylist(id, type) {
    const [{ accessToken, likedSongs, user}, ] = useDataLayerValue();
    const [playlist, setPlaylist] = useState([]);  

    spotify.setAccessToken(accessToken);

    useEffect(() => {
        
        if(type==="liked"){
            setPlaylist({
                name : "Liked Songs",
                collabrative: false,
                tracks: {
                    items: likedSongs,
                    total: likedSongs.length,
                },
                owner : {
                    display_name : user.display_name
                },
                type : "playlist",
            });
        }

        else if(id && type==="playlist") {
            spotify.getPlaylist(id)
            .then((data) => {
                console.log(data);
                setPlaylist(data);
            })
            .catch(err => console.log(err));
        }

        else if(id && type==="album") {
            spotify.getAlbum(id, {limit:50, offset:0})
            .then((data) => setPlaylist(data))
            .catch(err => console.log(err));
        }
    
    }, [])
    return playlist;
}

export default UseGetPlaylist;
