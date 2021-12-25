import React, {useEffect, useState} from 'react';
import './body.css';
import {useDataLayerValue} from '../../data/DataLayer';
import LikedSongsImage from './LikedSongsImage';
import Image from './Image';
import PlaylistContainer from './PlaylistContainer';
import SpotifyApi from 'spotify-web-api-js';

const spotify = new SpotifyApi();

function Body() {
    const [{playlists, likedPlaylists, accessToken, user},] = useDataLayerValue();
    const [recent, setRecent] = useState(null);
    const [recentAlbums, setRecentAlbums] = useState(null);

    useEffect(() => {
        if (!accessToken) return;
        spotify.setAccessToken(accessToken);

        spotify.getMyRecentlyPlayedTracks({limit: 10})
            .then(data => {
                let recentAlbumsTemp = []
                data.items.forEach(item => {
                    recentAlbumsTemp.push(item.track.album);
                });
                setRecentAlbums(recentAlbumsTemp);
                setRecent(data);
            })
            .catch(err => console.log(err));


    }, [accessToken]);

    useEffect(() => {
        if (!recent) return;

        //removing duplicate recently played albums
        let albums = [];
        let recentAlbumsTemp = []
        for (let i = 0; i < recent.items.length; i++) {
            let track = recent.items[i].track;
            let albumId = track.album.id;
            if (!albums.includes(albumId)) {
                recentAlbumsTemp.push(track.album);
                albums.push(albumId);
            }
        }
        setRecentAlbums(recentAlbumsTemp);

    }, recent);

    return (
        <div className="body content" id="dashboard">
            <h1>Welcome {user?.display_name.split(" ")[0]} !</h1>
            <h2>Your Library</h2>
            <div className="liked">
                <PlaylistContainer name="Liked Songs" url="/view/liked"
                                   image={<LikedSongsImage height="6em" width="6em" fontSize="3em"/>}/>

                {
                    likedPlaylists ?
                        likedPlaylists.map(playlist => (

                            <PlaylistContainer name={playlist.album.name} url={"/view/album/" + playlist.album.id}
                                               image={<Image url={playlist.album.images[1].url}/>}/>

                        )) : []
                }
            </div>
            <h2>Your playlists</h2>
            <div className="my-playlist">
                {
                    playlists &&
                    playlists.map(playlist => (

                        <PlaylistContainer name={playlist.name} url={"/view/playlist/" + playlist.id}
                                           image={<Image url={playlist.images[0].url}/>}/>

                    ))
                }
            </div>
            <h2>Recently played</h2>
            <div className="my-recent">
                {
                    recentAlbums &&
                    recentAlbums.map(playlist => (

                        <PlaylistContainer name={playlist.name} url={"/view/album/" + playlist.id}
                                           image={<Image url={playlist.images[0].url}/>}/>

                    ))
                }
            </div>

        </div>
    )
}

export default Body;
