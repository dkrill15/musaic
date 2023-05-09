import SpotifyWebApi from 'spotify-web-api-js';
import { clientId, redirectUri, scopes } from './config';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    redirectUri: redirectUri,
});

export const login = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes.join(' '))}`;
};

export const getTokenFromUrl = () => {
    const hash = window.location.hash.substr(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
};

export const setAccessToken = (accessToken) => {
    spotifyApi.setAccessToken(accessToken);
};

export const getMe = async () => {
    const response = await spotifyApi.getMe();
    return response;
};
