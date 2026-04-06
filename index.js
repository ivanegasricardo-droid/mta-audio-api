const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

// Le decimos al servidor dónde está el conversor MP3
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/musica', (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) return res.status(400).send("Falta la URL");

    console.log(`Convirtiendo a MP3 y transmitiendo: ${videoURL}`);
    
    // Le aseguramos a MTA que está recibiendo un MP3 real
    res.header('Content-Type', 'audio/mpeg');

    try {
        // Descargamos el audio de YouTube
        const stream = ytdl(videoURL, { quality: 'highestaudio' });
        
        // Lo convertimos a MP3 al instante y lo enviamos a MTA
        ffmpeg(stream)
            .audioBitrate(128)
            .format('mp3')
            .on('error', (err) => {
                console.error('Error en la conversión:', err.message);
            })
            .pipe(res);

    } catch (err) {
        if (!res.headersSent) res.status(500).send("Error de servidor");
    }
});

app.listen(PORT, () => console.log(`API con conversor MP3 encendida en puerto ${PORT}`));
