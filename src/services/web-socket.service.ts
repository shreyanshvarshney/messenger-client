import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: Socket;
  private name: string;

  constructor(private router: Router, private http: HttpClient) { }

  getUserName(): string {
    return this.name;
  }

  getOnlineUsers() {
    return this.http.get<{count: number}>(environment.baseServiceUrl + 'onlineusers');
  }

  connect() {
    // this.name = data.name;
    this.socket = io(environment.baseServiceUrl, {
      reconnectionDelayMax: 10000
    });

    this.socket.on('connect', () => {
      this.socket.connected ? console.log('Connected with server!') : console.log('Connection with server FAILED!');
    });

    this.socket.on("connect_error", (error) => {
      console.log('Error in connecting with server');
      console.log(error.message);
      this.router.navigateByUrl('/');
    });
  }

  joinChat(data) {
    this.name = data.name;
    this.socket.emit('joined', data);
    this.router.navigate(['/chat']);
  }

  send(data) {
    this.socket.emit('send', data);
  }

  recieve() {
    return new Observable<{message: string, name: string, time: Date}>((subscriber) => {
      this.socket.on('recieve', (data) => {
        subscriber.next(data);
      });
    });
  }

  onJoined() {
    return new Observable<{message: string, name: string}>((subscriber) => {
      console.log(this.socket);
      this.socket.on('on-joined', (data) => {
        subscriber.next(data);
      });
    });
  }

  onLeave() {
    return new Observable<{message: string, name: string}>((subscriber) => {
      this.socket.on('leave', (data) => {
        subscriber.next(data);
      });
    });
  }

  onLiveCountUpdate() {
    return new Observable<{count: number}>((subscriber) => {
      console.log(this.socket);
      this.socket.on('live-users-count-update', (data) => {
        console.log(data);
        subscriber.next(data);
      });
    });
  }

}
