const express = require('express');
const ytdl = require('@distube/ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/musica', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) return res.status(400).json({ error: "Falta la URL" });

    try {
        const info = await ytdl.getInfo(videoURL);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
        if (format && format.url) {
            res.json({ url: format.url });
        } else {
            res.status(500).json({ error: "No se encontró formato de audio." });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al procesar el video." });
    }
});

app.listen(PORT, () => console.log(`API encendida en puerto ${PORT}`));