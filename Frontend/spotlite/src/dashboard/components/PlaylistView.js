import './playlistView.css';
import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom';
import Song from "./Song";
import LikedSongsImage from './LikedSongsImage';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import $ from 'jquery';
import UseGetPlaylist from './UseGetPlaylist';
import UseGetAllData from '../../data/UseGetAllData';
import Image from './Image';
import SpotifyApi from 'spotify-web-api-js';
import {useDataLayerValue} from "../../data/DataLayer";


const spotify = new SpotifyApi()

function PlaylistView({type}) {

    const [{}, dispatch] = useDataLayerValue();
    const {id} = useParams();
    const [artists, setArtists] = useState(null);
    const [name, setName] = useState(null);
    const [count, setCount] = useState(null);
    const [collaborative, setCollaborative] = useState(false);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);

    const playlist = UseGetPlaylist(id, type);
    const nextSongs = type !== 'liked' ? UseGetAllData(spotify, spotify.getPlaylistTracks, id, 100) : [];

    const playPlaylist = (offset) => {
        if (!playlist) return;
        let uris = [];

        for (let i = 0; i < playlist.tracks.items.length; i++) {
            uris.push(playlist.tracks.items[i].track.uri);
        }

        for (let i = 0; i < nextSongs.length; i++) {
            uris.push(nextSongs[i].track.uri);
        }

        dispatch({
            type: 'SET_CURRENTLY_PLAYING_LIST',
            currentlyPlayingList: {uris: uris, offset: offset}
        });
    }


    useEffect(() => {

        if (!playlist || Object.keys(playlist).length === 0) return;
        setCount(playlist.tracks.total);
        setCollaborative(playlist.type === 'playlist' ? playlist.collaborative : false);
        setName(playlist.name);
        setDescription(playlist.description);
        setArtists(playlist.type === 'playlist' ? playlist.owner.display_name : playlist.artists.map(artist => artist.name).join(", "));
        setImage(type==='liked' ? null : type === 'playlist' ? playlist.images[0].url : playlist.images[1].url);
        setDescription(type==='playlist'?playlist.description:null);

    }, [playlist,id,type]);

    useEffect(() => {

        if (!playlist?.tracks) return;
        if (!count) return;
        if (!nextSongs.length) return;
        if (nextSongs.length < count - playlist.tracks.items.length) return;
        playlist.tracks.items.push(...nextSongs);

    }, [nextSongs]);

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

    return (
        
        <div className="playlist content">
            <div id="dock">
                <button className="play-playlist dock-play">
                    <PlayCircleFilledIcon onClick={() => playPlaylist(0)}/>
                </button>
                <h2 id="title-dock">{name}</h2>
            </div>
            <div className="header">
                {image ? <Image url={image}/>: <LikedSongsImage />}
                
                <div className="list-info">
                    <p>{(collaborative && 'COLLABRATIVE PLAYLIST') || (type && type.toUpperCase())}</p>
                    <h2 id="title">{name}</h2>
                    {description && <strong>{description}</strong> }
                    <strong>{count} SONGS - {artists}</strong>
                </div>
                <button className="play-playlist">
                    <PlayCircleFilledIcon onClick={() => playPlaylist(0)}/>
                </button>
            </div>

            {/* song list header */}
            <div className="list-header Song">
                <p id="s_num">#</p>
                <p>TITLE</p>
                {type !== "album" && <p>ALBUM</p>}
                <p><AccessTimeIcon/></p>
            </div>
            {playlist?.tracks?.items?.map((song, index) => (
                <Song track={song.track} index={index} activateLink={true} playTrack={playPlaylist}/>
            ))}

        </div>
        
    ) 
}

export default PlaylistView;
