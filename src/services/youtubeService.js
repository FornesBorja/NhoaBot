require('dotenv').config();
const axios = require('axios');

const youtubeApiKey = process.env.YOUTUBE_API_KEY;

async function searchYouTube(query) {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
            part: 'snippet',
            q: query,
            type: 'video',
            maxResults: 5,
            key: youtubeApiKey
        }
    });
    return response.data.items;
}

module.exports = { searchYouTube };
