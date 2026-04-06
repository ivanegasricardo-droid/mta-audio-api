const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/musica', (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) return res.status(400).send("Falta la URL");

    console.log(`Transmitiendo audio para MTA: ${videoURL}`);
    
    // Le decimos a MTA que lo que va a recibir es un flujo de audio puro (como una radio web)
    res.header('Content-Type', 'audio/mpeg');

    try {
        // ytdl descarga el audio de YouTube y '.pipe(res)' lo bombea directamente a tu servidor de MTA en tiempo real
        ytdl(videoURL, {
            filter: 'audioonly',
            quality: 'highestaudio'
        }).on('error', (err) => {
            console.error("Error de YouTube:", err.message);
            if (!res.headersSent) res.status(500).send("Error de stream");
        }).pipe(res);
        
    } catch (err) {
        if (!res.headersSent) res.status(500).send("Error general");
    }
});

app.listen(PORT, () => console.log(`Radio API encendida en puerto ${PORT}`));
