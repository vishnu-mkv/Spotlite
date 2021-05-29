import './song.css';
import './AlbumTrack.css';
import React from 'react'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {useDataLayerValue} from "../../data/DataLayer";


function AlbumTrack({track, index, playTrack}) {

    const [{}, dispatch] = useDataLayerValue();

    let duration = track.duration_ms;
    let mins = Math.floor(duration / 60000);
    let seconds = Math.floor((duration % 60000) / 1000).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });

    function playOnlyMe() {
        dispatch({
            type: 'SET_CURRENTLY_PLAYING_LIST',
            currentlyPlayingList: {uris: [track.uri], offset: 0}
        });
    }

    return (
        <div className="Song album-track">
            <div className="play-div">
                <p className="song_no">{index + 1}</p>
                <button className="play" onClick={() => playTrack ? playTrack(index) : playOnlyMe()}><PlayArrowIcon/>
                </button>
            </div>
            <div className="info">
                <div>
                    <h3 className="song_name">{track.name}</h3>
                    <small className="artist">{track.artists.map((artist) => artist.name).join(", ")}</small>
                </div>
            </div>
            <div className="duration">
                <p>{ mins }:{seconds }</p>
            </div>
        </div>
    )
}

export default AlbumTrack;
