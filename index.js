const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const app = express();
const PORT = process.env.PORT || 3000;

// CREAMOS UNA RUTA LIMPIA QUE TERMINE EN .MP3 PARA ENGAÑAR A MTA
app.get('/musica/:id.mp3', (req, res) => {
    const videoId = req.params.id;
    const videoURL = `https://www.youtube.com/watch?v=${videoId}`;

    console.log(`🎵 MTA BASS Conectando a: ${videoURL}`);
    
    // Forzamos las cabeceras para que BASS crea que es un archivo normal
    res.header('Content-Type', 'audio/mpeg');

    try {
        const stream = ytdl(videoURL, { quality: 'highestaudio' });
        
        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                console.error('Error FFmpeg:', err.message);
            })
            .pipe(res);

    } catch (err) {
        console.error(err);
        if (!res.headersSent) res.status(500).send("Error");
    }
});

app.listen(PORT, () => console.log(`API modo Radio BASS lista en puerto ${PORT}`));
