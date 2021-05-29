import './playlistView.css';
import React from 'react'
import {Link, useParams} from 'react-router-dom';
import AlbumTrack from "./AlbumTrack";
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import $ from 'jquery';
import UseGetPlaylist from './UseGetPlaylist';
import Image from './Image';
import './AlbumTrack.css';
import {useDataLayerValue} from "../../data/DataLayer";


function AlbumView() {

    const {id} = useParams();
    const album = UseGetPlaylist(id, "album");
    const [{}, dispatch] = useDataLayerValue();

    const playAlbum = (offset) => {
        if (!album) return;
        let uris = [];
        for (let i = 0; i < album.tracks.items.length; i++) {
            uris.push(album.tracks.items[i].uri);
        }
        dispatch({
            type: 'SET_CURRENTLY_PLAYING_LIST',
            currentlyPlayingList: {uris: uris, offset: offset}
        });
    }


    $(document).scroll(function () {
        const y = $(document).scrollTop();
        const anchor = $('.list-header');
        const dock = $('#dock');

        if (anchor.length === 0 || dock.length === 0) return;

        if (anchor.length && y > anchor.offset().top) {
            dock.css('display', 'flex');
        } else {
            dock.css('display', 'none');
        }
    });


    return album && (
        <div className="playlist content">
            <div id="dock">
                <button className="play-playlist dock-play">
                    <PlayCircleFilledIcon onClick={() => playAlbum(0)}/>
                </button>
                <h2 id="title-dock">album.name</h2>
            </div>
            <div className="header">
                <Image url={album.images[0]?.url}/>
                <div className="list-info">
                    <p>ALBUM</p>
                    <h2 id="title">{album?.name}</h2>
                    <strong>{album?.tracks.items?.length} SONGS -
                        {album.artists.map((artist, index) =>
                            <Link to={"/view/artist/" + artist.id}>
                                {artist.name}{index < album.artists.length - 1 && ', '}
                            </Link>
                        )}

                    </strong>
                </div>
                <button className="play-playlist">
                    <PlayCircleFilledIcon onClick={() => playAlbum(0)}/>
                </button>
            </div>
            {/* song list header */}
            <div className="list-header Song album-track">
                <p id="s_num">#</p>
                <p>TITLE</p>
                <p><AccessTimeIcon/></p>
            </div>
            {album?.tracks?.items?.map((song, index) => (
                <AlbumTrack track={song} index={index} playTrack={playAlbum}/>
            ))}
        </div>
    );
}

export default AlbumView;