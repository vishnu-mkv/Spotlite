import Navbar from './components/Navbar';
import Body from './components/Body';
import Search from './components/Search';
import PlaylistView from './components/PlaylistView';
import './dashoard.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ArtistView from "./components/ArtistView";
import AlbumView from "./components/AlbumView";


function Dashboard() {
    return (
        <Router>
            <Switch>
                <Route path="/view/artist/:id">
                    <div className="dashboard">
                        <Navbar/>
                        <ArtistView/>
                    </div>
                </Route>
                <Route path="/view/playlist/:id">
                    <div className="dashboard">
                        <Navbar/>
                        <PlaylistView type="playlist" key={window.location.pathname}/>
                    </div>
                </Route>
                <Route path="/view/album/:id">
                    <div className="dashboard">
                        <Navbar/>
                        <AlbumView key={window.location.pathname}/>
                    </div>
                </Route>
                <Route path="/view/liked">
                    <div className="dashboard">
                        <Navbar />
                        <PlaylistView type="liked" key={window.location.pathname}/>
                    </div>
                </Route>
                <Route path="/search">
                    <div className="dashboard">
                        <Navbar />
                        <Search />
                    </div>
                </Route>
                <Route path="/">
                    <div className="dashboard">
                        <Navbar />
                        <Body />
                    </div>
                </Route>
            </Switch>
        </Router>
        
    )
}

export default Dashboard;