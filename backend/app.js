const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const sequelize = require('./src/config/db');
const routes = require('./src/routes/index');
require('dotenv').config();


const app = express();
const server = http.createServer(app);


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", routes);


const port = process.env.PORT || 3000;

sequelize.sync() 
    .then(() => {
        console.log('Database tables created successfully.');
        server.listen(port, '0.0.0.0', () => {
            console.log(`Server running on http://47.91.121.123:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error synchronizing database:', error);
    });

process.on('uncaughtException', (err) => {
    console.error('Unhandled exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection:', reason);
});