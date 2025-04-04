
# NhoaBot 🎵🤖

**NhoaBot** is a lightweight, easy-to-use Discord bot built with Node.js. It currently supports:

- ✅ Music playback from **YouTube** (and **Spotify** is in development)via [DisTube](https://distube.js.org/)
- 🔊 Automatic queue handling
- ⏱️ `.ping` command to check the bot's response time
- 🐳 Docker support for easy deployment

## 🐳 Docker Setup

You can run NhoaBot via Docker:

```bash
docker run \
  --env=DISCORD_TOKEN=your-discord-token-here \
  --env=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin \
  --env=NODE_VERSION=18.20.7 \
  --env=YARN_VERSION=1.22.22 \
  --workdir=/app \
  --restart=no \
  --runtime=runc \
  -d fornesb/nhoabot:latest
```

> 🔐 **Important**: You must provide your own Discord bot token in the `DISCORD_TOKEN` environment variable.
