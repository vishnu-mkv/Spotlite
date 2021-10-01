const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config({path : ".env"});

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const getSpotify = () => {
    return new SpotifyWebApi({
        redirectUri : process.env.REDIRECT_URI,
        clientId : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENT_SECRET
    })
}

const getSpotifyAuthenticationObject = (data) => {
    return {
        accessToken : data.body.access_token,
        refreshToken : data.body.refresh_token,
        expiresIn : data.body.expires_in
    }
}

app.post('/login', (req, res) => {
    const code = req.body.code;
    const SpotifyApi = getSpotify();

    SpotifyApi.authorizationCodeGrant(code).then(data => {
        res.json(getSpotifyAuthenticationObject(data));
    }).catch((err) => {
        console.log(err);
        res.sendStatus(400);
    });
});

app.post('/login/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const SpotifyApi = getSpotify();
    SpotifyApi.setRefreshToken(refreshToken);

    SpotifyApi.refreshAccessToken().then((data) => {

        // there will be no refresh token in response from spotify
        // so add it manually here
        let obj = getSpotifyAuthenticationObject(data);
        obj['refreshToken'] = SpotifyApi.getRefreshToken();
        res.json(obj);
    }).catch( err => {
        res.sendStatus(400);
    });
});

app.listen(process.env.PORT);
console.log("listening", process.env.PORT);