import './ArtistView.css'
import SpotifyApi from "spotify-web-api-js";
import React, {useEffect, useState} from 'react';
import {useDataLayerValue} from '../../data/DataLayer';
import {useParams} from 'react-router-dom';
import Song from "./Song";
import ArtistContainer from "./ArtistContainer";
import './PlaylistContainer';
import './ArtistContainer';
import './search.css';
import Avatar from "@material-ui/core/Avatar";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import PlaylistContainer from "./PlaylistContainer";
import Image from "./Image";

const spotify = new SpotifyApi()

const ArtistView = () => {

    const {id} = useParams();
    const [{accessToken, user},] = useDataLayerValue();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [relatedArtists, setRelatedArtists] = useState(null);
    const [topTracks, setTopTracks] = useState(null);
    const [uniqueAlbumNames, setUniqueAlbumNames] = useState([]);
    const [relatedLimit, setRelatedLimit] = useState(4);
    const [albumLimit, setAlbumLimit] = useState(4);
    spotify.setAccessToken(accessToken);

    const uniqueAlbums = (data) => {
        let arr = [];
        let uniqueNames = [...uniqueAlbumNames];
        for (let i = 0; i < data.items.length; i++) {

            if (!uniqueNames.includes(data.items[i].name)) {
                uniqueNames.push(data.items[i].name);
                arr.push(data.items[i]);
            }
        }
        setUniqueAlbumNames(uniqueNames);
        return arr
    }

    useEffect(() => {
        spotify.setAccessToken(accessToken);
    }, [accessToken]);


    useEffect(() => {

        setUniqueAlbumNames([]);

        spotify.getArtist(id)
            .then(data => {
                setArtist(data);
            });

        spotify.getArtistAlbums(id, {market: user.country})
            .then(data => {
                // there may be duplicate or re uploaded albums
                // with the same name
                // clean that up
                data.items.length && setAlbums({...data, items: uniqueAlbums(data)})
            });

        spotify.getArtistRelatedArtists(id)
            .then(data => data.artists.length && setRelatedArtists(data.artists));

        spotify.getArtistTopTracks(id, user.country)
            .then(data => data.tracks.length && setTopTracks(data.tracks));

    }, [id]);

    useEffect(() => {
        if (!albums) return;
        if (albums.total <= albumLimit) return;
        if (albumLimit >= albums.limit) return;
        if (albumLimit + 5 <= albums.items.length) return;

        spotify.getArtistAlbums(id, {market: user.country, offset: albums.limit, limit: 5})
            .then(data => {
                albums.items.push(...uniqueAlbums(data));
                albums.limit += 5;
            })
    }, [albumLimit]);


    return (
        artist &&
        <div className="ArtistView">
            <div className="artist-header">
                <Avatar src={artist.images[0]?.url}/>
                <div className="artist-info">
                    <h2>{artist.name}</h2>
                    <small>{artist.followers.total} followers</small>
                </div>
            </div>
            <div className="artist-result toptracks">
                <h2>Top Tracks</h2>
                <div className="list-header Song">
                    <p id="s_num">#</p>
                    <p>TITLE</p>
                    <p>ALBUM</p>
                    <p><AccessTimeIcon/></p>
                </div>
                {topTracks?.map((track, index) => <Song index={index} activateLink={true} track={track}/>)}
            </div>
            <div className="artist-result albums">
                <h2>Albums</h2>
                <div className="result-grid">
                    {albums?.items?.slice(0, albumLimit).map(album => <PlaylistContainer name={album.name}
                                                                                         url={'/view/album/' + album.id}
                                                                                         image={<Image
                                                                                             url={album.images[0]?.url}/>}/>)}
                </div>
                <div className="more-album">
                    {
                        (albums?.items.length > 0 && albumLimit > 0) && <button
                            onClick={() => setAlbumLimit(albumLimit - 5)}
                        >View less albums</button>
                    }
                    {(albumLimit + 5 <= albums?.total || (albumLimit === 0 && albums?.total !== 0)) &&
                    <button
                        onClick={() => setAlbumLimit(albumLimit + 5)}
                    >View more albums</button>
                    }
                </div>
            </div>

            {relatedArtists && (<div className="artist-result related">
                <h2>Related Artists</h2>
                <div className="result-grid">
                    {relatedArtists?.slice(0, relatedLimit).map(artist => <ArtistContainer artist={artist}/>)}
                </div>
                <div className="more-artists">
                    {
                        (relatedArtists?.length > 0 && relatedLimit > 0) && <button
                            onClick={() => setRelatedLimit(relatedLimit - 5)}
                        >View less artists</button>
                    }
                    {(relatedLimit + 5 <= relatedArtists?.length || (relatedLimit === 0 && relatedArtists?.length !== 0)) &&
                    <button
                        onClick={() => setRelatedLimit(relatedLimit + 5)}
                    >View more artists</button>
                    }
                </div>

            </div>)}
        </div>

    );
};

export default ArtistView;
