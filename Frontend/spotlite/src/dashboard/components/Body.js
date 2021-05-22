import React from 'react';
import './body.css';
import {useDataLayerValue} from '../../data/DataLayer';
import LikedSongsImage from './LikedSongsImage';
import Image from './Image';
import PlaylistContainer from './PlaylistContainer';
import {Link} from 'react-router-dom';

function Body() {
    const [{ playlists, likedPlaylists, likedSongs }, dispatch] = useDataLayerValue();


    return (
        <div className="body content">
            <div className="liked">
                
                <PlaylistContainer name="Liked Songs" url="/view/liked" image = {<LikedSongsImage height="125px" width="125px" fontSize="48px"/>}/>

                {
                    likedPlaylists?
                    likedPlaylists.map(playlist => (
                        
                        <PlaylistContainer name={playlist.album.name} url={"/view/album/"+playlist.album.id} image={<Image url= {playlist.album.images[1].url}/>} />
                        
                        )):[]
                }
            </div>
            <Link to="/view/playlist/6GttiyEgL9JO7XpLFm6Fgr">Click Here</Link>

        </div>
    )
}

export default Body;
