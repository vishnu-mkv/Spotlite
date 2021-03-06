import './song.css';
import React from 'react'
import {Link} from 'react-router-dom';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {useDataLayerValue} from "../../data/DataLayer";

function Song({index, track, activateLink, playTrack}) {

    const images = track.album.images;
    const [{}, dispatch] = useDataLayerValue();

    let findSmallImage = (images) => {
        let min = images[0];
        images.forEach((image) => {
            min = image.width < min.width ? image : min;
        })
        return min;
    }

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
        <div className="Song">
            <div className="play-div">
                <p className="song_no">{index + 1}</p>
                <button className="play"><PlayArrowIcon onClick={() => playTrack ? playTrack(index) : playOnlyMe()}/>
                </button>
            </div>
            <div className="info">
                <img className="track_img" src={findSmallImage(images).url} alt=""/>
                <div>
                    <h3 className="song_name">{track.name}</h3>
                    <small className="artist">
                        {track.artists.map((artist, index) =>
                            <Link to={"/view/artist/" + artist.id}>
                                {artist.name}{index < track.artists.length - 1 && ', '}
                            </Link>
                        )}
                    </small>
                </div>
            </div>
            <div className="album">
                { activateLink ?
                    <Link to={"/view/album/"+track.album.id}>{ track.album.name }</Link>:
                    <p>{ track.album.name }</p>
                }
            </div>
            <div className="duration">
                <p>{ mins }:{seconds }</p>
            </div>
        </div>
    )
}

export default Song;
