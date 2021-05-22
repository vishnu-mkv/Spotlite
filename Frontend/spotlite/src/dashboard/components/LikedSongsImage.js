import "./LikedSongsImage.css"
import FavoriteIcon from '@material-ui/icons/Favorite';
import React from 'react'

function LikedSongsImage({height, width, fontSize}) {
    return (
        <div className="icon" style={{"height": height, "width": width}}>
            <FavoriteIcon style={{"font-size":fontSize}}/>
        </div>
    )
}

export default LikedSongsImage;
