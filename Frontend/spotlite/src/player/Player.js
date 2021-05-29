import './player.css';
import {default as SpotifyPlayer} from 'react-spotify-web-playback';
import {useDataLayerValue} from "../data/DataLayer";

import React, {useEffect} from 'react'

function Player() {

    const [{accessToken, user, isPlaying, currentlyPlayingList}, dispatch] = useDataLayerValue();

    useEffect(() => {
        dispatch({
            type: 'SET_IS_PLAYING',
            isPlaying: true
        });
    }, [currentlyPlayingList]);

    if (!accessToken || !user) return null;

    if (!currentlyPlayingList) return null;

    // if(user.product !== "premium") return null;

    return (<div className="player">
            <SpotifyPlayer token={accessToken}
                           uris={currentlyPlayingList.uris}
                           play={isPlaying}
                           offset={currentlyPlayingList.offset}
                           callback={state => {
                               if (!isPlaying) dispatch({type: 'SET_IS_PLAYING', isPlaying: state.isPlaying});
                           }}
                           styles={{
                               color: '#fff',
                               bgColor: '#141414',
                               sliderColor: '#1db954',
                               trackArtistColor: '#696969',
                               trackNameColor: '#fff',
                           }}
            />
        </div>
    )
}

export default Player;
