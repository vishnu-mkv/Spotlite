import Login from './authentication/Login';
import Dashboard from './dashboard/Dashboard';
import SpotifyApi from 'spotify-web-api-js';
import Loading from './Loading';
import UseAuth from './authentication/UseAuth';
import {useEffect} from 'react';
import {useDataLayerValue} from './data/DataLayer';
import Player from './player/Player';
import useGetAllData from './data/UseGetAllData';


const code = new URLSearchParams(window.location.search).get('code');
const spotify = new SpotifyApi();

function App() {

    const [{accessToken}, dispatch] = useDataLayerValue();
    var _accessToken = accessToken, _playlists = [], _likedSongs = [], _likedPlaylists = []

  if (code) {
    _accessToken = UseAuth(code);
    localStorage.setItem('search-term', '');
  }

  // get user playlists

  _likedSongs = useGetAllData(spotify, spotify.getMySavedTracks); 
  _likedPlaylists = useGetAllData(spotify, spotify.getMySavedAlbums);
  _playlists = useGetAllData(spotify, spotify.getUserPlaylists);

  // save playlists to DataLayer
  useEffect(() => {
    if (!_accessToken) return;
    dispatch({
        type: 'SET_PLAYLISTS',
        playlists: _playlists
      });
  }, [_playlists]);

  useEffect(() => {
    if (!_accessToken) return;
    dispatch({
        type: 'SET_LIKED_SONGS',
        likedSongs: _likedSongs
      });
  }, [_likedSongs]);

  useEffect(() => {
    if (!_accessToken) return;
    dispatch({
        type: 'SET_LIKED_PLAYLISTS',
        likedPlaylists: _likedPlaylists
      });
  }, [_likedPlaylists]);


  useEffect(() => {
      if (!_accessToken) return;

      // Save accessToken to DataLayer
      dispatch({
        type: 'SET_ACCESS_TOKEN',
        accessToken: _accessToken
      });

      spotify.setAccessToken(_accessToken);

      // get user-object from spotify
      spotify.getMe()
      .then(user => {
          dispatch({
          type: 'SET_USER',
          user: user
        });

      }).catch(err => console.log(err));
  }, [_accessToken]);

   

  return (
    <div className="App">
      {code? (_accessToken? [<Dashboard/>, <Player />]: <Loading/>) : <Login/>}
    </div>
  );
}

export default App;
