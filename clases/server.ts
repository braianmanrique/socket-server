import express from 'express';
import { SERVER_PORT } from '../globals/enviroment';
import socketIO from 'socket.io';
import http from 'http';
import * as socket from '../sockets/sockets';

export default class Server {
    private static _instance: Server;
    public app: express.Application;
    public port: number;
    public io : socketIO.Server;
    private httpServer: http.Server;

    private constructor(){
        this.app = express();
        this.port =SERVER_PORT;
        this.httpServer = new http.Server(this.app);
        this.io = new socketIO.Server(this.httpServer , { cors: { origin: true, credentials: true } } );

        this.escucharSockets();
    }
    start(callback: VoidFunction,){
        this.httpServer.listen(this.port, callback);
    }
    private escucharSockets(){
        console.log('Escuchando con - sockets');

            // Aqui se crean los eventos
        this.io.on('connection', cliente => {
            console.log('cliente conectado');
            socket.mensaje(cliente, this.io);
            socket.desconectar(cliente);

           
        })

    
    }
    public static get instance(){
        return this._instance || (this._instance = new this());
    }
}