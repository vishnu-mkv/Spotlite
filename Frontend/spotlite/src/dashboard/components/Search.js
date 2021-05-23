import React, {useEffect, useState} from 'react';
import SpotifyApi from 'spotify-web-api-js';
import './search.css';
import SearchIcon from '@material-ui/icons/Search';
import {useDataLayerValue} from '../../data/DataLayer';
import Song from './Song';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Image from './Image';
import PlaylistContainer from './PlaylistContainer';
import NoResults from "./NoResults";
import TypeToSearch from "./TypeToSearch";
import ArtistContainer from "./ArtistContainer";

const spotify = new SpotifyApi();

function Search() {
    const [{accessToken},] = useDataLayerValue();
    spotify.setAccessToken(accessToken);

    const [search, setSearch] = useState('');
    const [searchPlaylists, setSearchPlaylists] = useState(null);
    const [searchAlbums, setSearchAlbums] = useState(null);
    const [searchTracks, setSearchTracks] = useState(null);
    const [searchArtists, setSearchArtists] = useState(null);
    const [trackViewLimit, setTrackViewLimit] = useState(5);
    const [playlistViewLimit, setPlaylistViewLimit] = useState(5);
    const [albumViewLimit, setAlbumViewLimit] = useState(5);
    const [artistViewLimit, setArtistViewLimit] = useState(5);

    useEffect(() => {
        //load last search
        setSearch(localStorage.getItem('search-term'));
    }, []);


    useEffect(() => {

        //get search results from here
        if (!accessToken) return;

        //if no search results set to null
        if (!search || search === "") {
            setSearchAlbums(null);
            setSearchPlaylists(null);
            setSearchTracks(null);
            setSearchArtists(null);
            return;
        }
        let cancel = false;

        spotify.search(search, ["album",
            "playlist", "track", "artist"])
        .then(data => {
            if (cancel) return;
            setSearchPlaylists(data.playlists);
            setSearchAlbums(data.albums);
            setSearchTracks(data.tracks);
            setSearchArtists(data.artists);

            //store search term
            localStorage.setItem('search-term', search);

            //reset search results view limits
            //user can choose to see less or more results

            setTrackViewLimit(searchTracks ? (searchTracks.total > 0 ? 5 : 0) : 5);
            setAlbumViewLimit(searchAlbums ? (searchAlbums.total > 0 ? 5 : 0) : 5);
            setPlaylistViewLimit(searchPlaylists ? (searchPlaylists.total > 0 ? 5 : 0) : 5);
            setArtistViewLimit(searchArtists ? (searchArtists.total > 0 ? 5 : 0) : 5);

        });

        return () => cancel = true;
    }, [search, accessToken])


    //if user wants to see more results and no results stored
    //get more from api

    //for tracks
    useEffect(() => {
        if (!search || !searchTracks) return;

        //pre-load extra 5 results
        if (trackViewLimit + 5 <= searchTracks.limit || trackViewLimit - searchTracks.total === 0) return;

        spotify.searchTracks(search, {offset: searchTracks.limit, limit: 5})
            .then(data => {
                searchTracks.items.push(...data.tracks.items);
                // limit defines the no.of.results we have
                searchTracks.limit += data.tracks.limit;
            });

    }, [trackViewLimit])

    // for playlists
    useEffect(() => {
        if (!search || !searchPlaylists) return;

        if (playlistViewLimit + 5 <= searchPlaylists.limit || playlistViewLimit - searchPlaylists.total === 0) return;

        spotify.searchPlaylists(search, {offset: searchPlaylists.limit, limit: 5})
            .then(data => {
                searchPlaylists.items.push(...data.playlists.items);
                searchPlaylists.limit += data.playlists.limit;
            });

    }, [playlistViewLimit])


    //for albums
    useEffect(() => {

        if (!search || !searchAlbums) return;

        if (albumViewLimit + 5 <= searchAlbums.limit || albumViewLimit - searchAlbums.total === 0) return;

        spotify.searchAlbums(search, {offset: searchAlbums.limit, limit: 5})
            .then(data => {
                searchAlbums.items.push(...data.albums.items);
                searchAlbums.limit += data.albums.limit;
            });

    }, [albumViewLimit])

    //for artists
    useEffect(() => {

        if (!search || !searchArtists) return;

        if (artistViewLimit + 5 <= searchArtists.limit || artistViewLimit - searchArtists.total === 0) return;

        spotify.searchArtists(search, {offset: searchArtists.limit, limit: 5})
            .then(data => {
                console.log(data);
                searchArtists.items.push(...data.artists.items);
                searchArtists.limit += data.artists.limit;
            });

    }, [artistViewLimit])

    return (
        <div className="content search">
            <div className="search-header">
                <SearchIcon/>
                <input type="text"
                       placeholder="Search songs, albums, playlists"
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                />
            </div>
            {!search && <TypeToSearch/>}
            {
                searchTracks && (<div className="search-tracks">
                        <h3 className="result-header">Tracks</h3>
                        {(searchTracks.total !== 0 && trackViewLimit > 0) &&
                        (<div className="list-header Song">
                                <p id="s_num">#</p>
                                <p>TITLE</p>
                                <p>ALBUM</p>
                                <p><AccessTimeIcon/></p>
                            </div>
                        )
                        }
                        {searchTracks.total !== 0 && searchTracks.items.slice(0, trackViewLimit).map((track, index) =>
                            <Song index={index} track={track} activateLink={true}/>)}

                        {/* if no results */}
                        {searchTracks.total === 0 && <NoResults/>}

                        <div className="more-track">
                            {
                                searchTracks?.total > 0 && trackViewLimit > 0 && <button
                                    onClick={() => setTrackViewLimit(trackViewLimit > 0 ? trackViewLimit - 5 : trackViewLimit)}
                                >View less tracks</button>
                            }
                            {(trackViewLimit + 5 <= searchTracks.total || (searchTracks.total !== 0 && trackViewLimit === 0)) &&
                            <button
                                onClick={() => setTrackViewLimit(trackViewLimit + 5)}
                            >View more tracks</button>
                            }
                        </div>
                    </div>
                )}
            {
                searchPlaylists && (
                    <div className="search-playlists">
                        <h3 className="result-header">Playlists</h3>
                        {searchPlaylists.total > 0 && (<div className="result-grid">
                            {
                                searchPlaylists.items.slice(0, playlistViewLimit).map(playlist => <PlaylistContainer
                                    image={<Image url={playlist?.images[0]?.url}/>} name={playlist.name}
                                    url={'/view/playlist/' + playlist.id}/>)
                            }
                        </div>)
                        }
                        {searchPlaylists.total === 0 && <NoResults/>}
                        <div className="more-playlist">
                            {
                                searchPlaylists?.total > 0 && playlistViewLimit > 0 && <button
                                    onClick={() => setPlaylistViewLimit(playlistViewLimit ? playlistViewLimit - 5 : playlistViewLimit)}
                                >View less playlists</button>
                            }
                            {(playlistViewLimit + 5 <= searchPlaylists.total || (playlistViewLimit === 0 && searchPlaylists.total !== 0)) &&
                            <button
                                onClick={() => setPlaylistViewLimit(playlistViewLimit + 5)}
                            >View more playlists</button>
                            }
                        </div>
                    </div>
                )
            }
            {
                searchAlbums && (
                    <div className="search-albums">
                        <h3 className="result-header">Albums</h3>
                        {searchAlbums.total > 0 && (<div className="result-grid">
                            {
                                searchAlbums.items.slice(0, albumViewLimit).map(album => <PlaylistContainer
                                    image={<Image url={album?.images[0]?.url}/>} name={album.name}
                                    url={'/view/album/' + album.id}/>)
                            }
                        </div>)
                        }
                        {searchAlbums.total === 0 && <NoResults/>}
                        <div className="more-album">
                            {
                                searchAlbums?.total > 0 && albumViewLimit > 0 && <button
                                    onClick={() => setAlbumViewLimit(albumViewLimit > 0 ? albumViewLimit - 5 : albumViewLimit)}
                                >View less albums</button>
                            }
                            {(albumViewLimit + 5 <= searchAlbums.total || (albumViewLimit === 0 && searchAlbums.total !== 0)) &&
                            <button
                                onClick={() => setAlbumViewLimit(albumViewLimit + 5)}
                            >View more albums</button>
                            }

                        </div>
                    </div>
                )
            }
            {
                searchArtists && (
                    <div className="search-tracks">
                        <h3 className="result-header">Artists</h3>
                        {
                            searchArtists.total > 0 && (<div className="result-grid">
                                {
                                    searchArtists.items.slice(0, artistViewLimit).map(artist => <ArtistContainer
                                        artist={artist}/>)
                                }
                            </div>)
                        }
                        {searchArtists.total === 0 && <NoResults/>}
                        <div className="more-artists">
                            {
                                searchArtists?.total > 0 && artistViewLimit > 0 && <button
                                    onClick={() => setArtistViewLimit(artistViewLimit > 0 ? artistViewLimit - 5 : artistViewLimit)}
                                >View less artists</button>
                            }
                            {(artistViewLimit + 5 <= searchArtists.total || (artistViewLimit === 0 && searchArtists.total !== 0)) &&
                            <button
                                onClick={() => setArtistViewLimit(artistViewLimit + 5)}
                            >View more artists</button>
                            }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Search;
