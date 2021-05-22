import './playlistView.css';
import React, { useState, useEffect } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import { useDataLayerValue } from '../../data/DataLayer';
import Song from "./Song";
import AlbumTrack from "./AlbumTrack";
import LikedSongsImage from './LikedSongsImage';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import $ from 'jquery';
import UseGetPlaylist from './UseGetPlaylist';
import UseGetAllData from '../../data/UseGetAllData';
import Image from './Image';
import SpotifyApi from 'spotify-web-api-js';


const spotify = new SpotifyApi()

function PlaylistView({type}) {

    const {id} = useParams();
    const [{ user, accessToken}, ] = useDataLayerValue();
    const [artists, setArtists] = useState(null);
    const [name, setName] = useState(null);
    const [count, setCount] = useState(null);
    const [collaborative, setCollaborative] = useState(false);
    const [description, setDescription] = useState(null);
    const [image, setImage] = useState(null);

    const playlist = UseGetPlaylist(id, type);
    const nextSongs = type !== 'liked' ? UseGetAllData(spotify, type==='playlist'?spotify.getPlaylistTracks:spotify.getAlbumTracks, id, 100):[];

    
    useEffect(() => {

        if (!playlist || Object.keys(playlist).length === 0) return;
        setCount(playlist.tracks.total);
        setCollaborative(playlist.type==='playlist'?playlist.collaborative:false);
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
    
    $(document).scroll(function(){
        var y = $(document).scrollTop();
        var anchor = $('.list-header');
        var dock = $('#dock');

        if(anchor.length == 0 || dock.length == 0) return;

        if(anchor.length && y > anchor.offset().top) {
            dock.css('display', 'flex');
        }else{
            dock.css('display', 'none');
        }
    });

    return (
        
        <div className="playlist content">
            <div id="dock">
                <button className="play-playlist dock-play">
                    <PlayCircleFilledIcon />
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
                    <PlayCircleFilledIcon />
                </button>
            </div>
            
            {/* song list header */}
            <div className={type==="album" ? "list-header Song album-track" : "list-header Song"}>
                <p id="s_num">#</p>
                <p>TITLE</p>
                {type!=="album" && <p>ALBUM</p>}
                <p><AccessTimeIcon /></p>
            </div>
            {type == "album" ? playlist?.tracks?.items?.map((song, index) => (
                <AlbumTrack track={song} index={index}/>
            )): playlist?.tracks?.items?.map((song, index) => (
                <Song track={song.track} index={index}/>
            ))
            }
        </div>
        
    ) 
}

export default PlaylistView;
