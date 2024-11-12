// Importar las librerías necesarias
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

// Crear una instancia de express para el servidor HTTP
const app = express();
const port = process.env.PORT || 3000;

// Crear un cliente de Discord
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const CHANNEL_ID = '1305730042353025107'; // Reemplaza con el ID del canal al que deseas enviar los mensajes


// Middleware para poder leer datos JSON en las peticiones POST
app.use(express.json());

// Configuración del evento 'ready' de Discord (cuando el bot está online)
client.once('ready', () => {
    console.log('¡El bot está listo!');
});

// Configuración del endpoint POST que el API externa usará
app.post('/trigger', (req, res) => {
    // Obtener los datos del cuerpo de la solicitud POST (JSON)
    const { binaryImage } = req.body;

    // Asegurarse de que se ha proporcionado un mensaje y un canal
    if (!binaryImage) {
        return res.status(400).send('Faltan datos en la petición.');
    }

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) {
        return res.status(404).send('Canal no encontrado.');
    }

    // Enviar el mensaje al canal de Discord
    channel.send(binaryImage)
        .then(() => {
            res.status(200).send('Mensaje enviado correctamente.');
        })
        .catch(error => {
            console.error('Error enviando mensaje:', error);
            res.status(500).send('Error enviando el mensaje.');
        });
});

// Iniciar el servidor HTTP
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

// Iniciar el bot de Discord
client.login(process.env.token);
