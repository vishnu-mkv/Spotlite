import React from 'react'
import './Navbar.css';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import {Link} from "react-router-dom";
import {useDataLayerValue} from '../../data/DataLayer';
import PersonIcon from '@material-ui/icons/Person';

function Navbar() {

    //FIXME I'm not responsive

    const [{user},] = useDataLayerValue();

    return (
        <div className="Navbar">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt=""/>
            <ul className="links">
                <Link to="/">
                    <li>
                        <HomeIcon/>
                        <strong>Home</strong>
                    </li>
                </Link>
                <Link to="/search">
                    <li>
                        <SearchIcon/>
                        <strong>Search</strong>
                    </li>
                </Link>
                <li id="user">
                    {user &&
                    [user.images.length ? <img src={user.images[0].url} alt=""/> : <PersonIcon/>,
                        <strong>{user.display_name}</strong>]
                    }
                </li>
            </ul>
        </div>
    )
}

export default Navbar;
