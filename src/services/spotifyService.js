require('dotenv').config();
const axios = require('axios');

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getAccessToken() {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
        }
    });
    return response.data.access_token;
}

async function searchSpotify(query) {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: {
            'Authorization': 'Bearer ' + token
        },
        params: {
            q: query,
            type: 'track,artist,album',
            limit: 10
        }
    });
    return response.data;
}

module.exports = { searchSpotify };
