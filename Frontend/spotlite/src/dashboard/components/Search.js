import React, {useState, useEffect} from 'react';
import SpotifyApi from 'spotify-web-api-js';
import './search.css';
import SearchIcon from '@material-ui/icons/Search';
import { useDataLayerValue } from '../../data/DataLayer';
import Song from './Song';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Image from './Image';
import PlaylistContainer from './PlaylistContainer';

const spotify = new SpotifyApi();

function Search() {
    const [{ accessToken}, ] = useDataLayerValue();
    spotify.setAccessToken(accessToken);

    const [search, setSearch] = useState(localStorage.getItem('search-term'));
    const [searchPlaylists, setSearchPlaylists] = useState(null);
    const [searchAlbums, setSearchAlbums] = useState(null);
    const [searchTracks, setSearchTracks] = useState(null);
    const [trackViewLimit, setTrackViewLimit] = useState(5);
    const [playlistViewLimit, setPlaylistViewLimit] = useState(5);
    const [albumViewLimit, setAlbumViewLimit] = useState(5);

    useEffect(() => {
        if(!accessToken) return;
        
        if(!search || search==="") {
            setSearchAlbums(null);
            setSearchPlaylists(null);
            setSearchTracks(null);
            return;
        }
        let cancel = false;

        spotify.search(search, ["album",
        "playlist", "track"])
        .then(data => {
            if(cancel) return;
            setSearchPlaylists(data.playlists);
            setSearchAlbums(data.albums);
            setSearchTracks(data.tracks);
            localStorage.setItem('search-term', search);

        });

        return () => cancel = true;
    }, [search, accessToken])
    

    useEffect(() => {
        if(!search || !searchTracks) return;

        if(trackViewLimit <= searchTracks.limit || trackViewLimit - searchTracks.total === 0) return;

        spotify.searchTracks(search, {offset: searchTracks.limit, limit:5})
        .then(data => {
            searchTracks.items.push(...data.tracks.items);
            searchTracks.limit += data.tracks.limit;
            console.log(searchTracks);
        });

    }, [trackViewLimit])

    useEffect(() => {
        if(!search || !searchPlaylists) return;

        if(playlistViewLimit <= searchPlaylists.limit || playlistViewLimit - searchPlaylists.total === 0) return;

        spotify.searchPlaylists(search, {offset: searchPlaylists.limit, limit:5})
        .then(data => {
            searchPlaylists.items.push(...data.playlists.items);
            searchPlaylists.limit += data.playlists.limit;
            console.log(searchPlaylists);
        });

    }, [playlistViewLimit])

    return (
        <div className="content search">
            <div className="search-header">
                <SearchIcon/>
                <input type="text" 
                placeholder="Search songs, albums, playlists"
                value = {search}
                onChange = {e => setSearch(e.target.value)} 
                />
            </div>
            {
            searchTracks && (<div className="search-tracks">
                <h3 className="result-header">Tracks</h3>
                {trackViewLimit > 0 && 
                (<div className="list-header Song">
                    <p id="s_num">#</p>
                    <p>TITLE</p>
                    <p>ALBUM</p>
                    <p><AccessTimeIcon /></p>
                </div>
                )
                }
                {searchTracks.items.slice(0, trackViewLimit).map((track, index) => <Song index={index} track={track} activateLink={true}/> )}
                <div className="more-track">
                    {
                    trackViewLimit > 0 && <button 
                    onClick={() => setTrackViewLimit(trackViewLimit > 0 ? trackViewLimit-5 : trackViewLimit)}
                    >View less tracks</button>
                    }
                    <button 
                    onClick={() => setTrackViewLimit(trackViewLimit+5)}
                    >View more tracks</button>
                    
                </div>
            </div>
            )}
            {
                searchPlaylists && (
                    <div className="search-playlists">
                        <h3 className="result-header">Playlists</h3>
                        <div className="result-grid">
                            {
                                searchPlaylists.items.slice(0, playlistViewLimit).map(playlist => <PlaylistContainer image={<Image url={playlist?.images[0]?.url}/>} name={playlist.name} url={'/view/playlist/'+playlist.id}/>)
                            }
                        </div>
                        <div className="more-playlist">
                            {
                                playlistViewLimit > 0 && <button 
                                onClick={() => setPlaylistViewLimit(playlistViewLimit ? playlistViewLimit-5 : playlistViewLimit)}
                                >View less playlists</button>
                            }
                            <button 
                            onClick={() => setPlaylistViewLimit(playlistViewLimit+5)}
                            >View more playlists</button>
                            
                        </div>
                    </div>
                )
            }
            {
                searchAlbums && (
                    <div className="search-albums">
                        <h3 className="result-header">Albums</h3>
                        <div className="result-grid">
                            {
                                searchAlbums.items.slice(0, albumViewLimit).map(album => <PlaylistContainer image={<Image url={album?.images[0]?.url}/>} name={album.name} url={'/view/album/'+album.id}/>)
                            }
                        </div>
                        <div className="more-album">
                            {
                                albumViewLimit > 0 && <button 
                                onClick={() => setAlbumViewLimit(albumViewLimit > 0 ? albumViewLimit-5:albumViewLimit)}
                                >View less albums</button>
                            }
                            <button 
                            onClick={() => setAlbumViewLimit(albumViewLimit+5)}
                            >View more albums</button>
                            
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Search;
