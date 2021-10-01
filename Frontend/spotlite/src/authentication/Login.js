import React from 'react'
import './Login.css'

const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-recently-played"
];
const client_id = 'de0de556859645f9a8a25f460c0a73c5';
const redirect_uri = 'https://spotlite.netlify.app/';
const endpoint = 'https://accounts.spotify.com/authorize';
export const AUTH_URL = `${endpoint}?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes.join("%20")}`

function Login() {

    return (
        <div className="Login">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="Spotify Logo" />
            <a href={AUTH_URL}>Login with Spotify</a>
        </div>
    )
}



export default Login;
