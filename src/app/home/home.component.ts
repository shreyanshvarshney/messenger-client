import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { WebSocketService } from './../../services/web-socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  name: string;
  onlineUsers: number;

  getOnlineUsersSub: Subscription;
  onLiveCountUpdateSub: Subscription;

  constructor(private router: Router, private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.connect();

    // this.webSocketService.getOnlineUsers()
    // .subscribe((data) => {
    //   this.onlineUsers = data.count;
    // });

    this.webSocketService.onLiveCountUpdate()
    .subscribe((data) => {
      // console.log(data);
      this.onlineUsers = data.count;
      console.log(data.count);
    });
  }

  joinChat() {
    if (this.name) {
      this.webSocketService.joinChat({name: this.name});
      // this.router.navigate(['/chat']);
    }
  }

  joinChatAnonymously() {
    this.webSocketService.joinChat({name: `user_${Date.now()}`});
    // this.router.navigate(['/chat']);
  }

  ngOnDestroy(): void {
    if (this.getOnlineUsersSub) {
      this.getOnlineUsersSub.unsubscribe();
    }
    if (this.onLiveCountUpdateSub) {
      this.onLiveCountUpdateSub.unsubscribe();
    }
  }

}
