import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { WebSocketService } from 'src/services/web-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  roomChats = [];
  name: string;
  chatForm: FormGroup;
  date: Date;

  onJoinedSub: Subscription;
  onMessageRecieveSub: Subscription;
  onLeaveSub: Subscription;

  constructor(private webSocketService: WebSocketService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.name = this.webSocketService.getUserName();
    this.date = new Date();
    this.appendMessage(null, 'right', 'You joined the chat.', null);
    this.initializeForm();

    this.onJoinedSub = this.webSocketService.onJoined()
    .subscribe((data) => {
      // console.log(data);
      this.appendMessage(null, 'left', data.message, null);
    });

    this.onMessageRecieveSub = this.webSocketService.recieve()
    .subscribe((data) => {
      this.notifyIncomingMessage();
      // console.log(data);
      this.appendMessage(data.name, 'left', data.message, data.time);
    });

    this.onLeaveSub = this.webSocketService.onLeave()
    .subscribe((data) => {
      // console.log(`${data.name} has left the chat room.`);
      this.appendMessage(null, 'left',`${data.name} has left the chat.`);
    });
  }

  initializeForm() {
    this.chatForm = this.fb.group({
      message: new FormControl('', Validators.required)
    });
  }

  sendMessage (form: FormGroup) {
    if (form.valid) {
      this.webSocketService.send({name: this.name, message: form.controls.message.value, time: new Date()});
      this.appendMessage('You', 'right', form.controls.message.value, new Date());
      form.reset();
    }
  }

  appendMessage(name: string, side: string, message: string, time: Date = null) {
    const obj = {
      name,
      side,
      message,
      time
    };
    this.roomChats.push(obj);
  }

  notifyIncomingMessage() {
    const audio = new Audio('../assets/audio/Message-Tone.mp3');
    audio.play();
  }

  ngOnDestroy(): void {
    this.onJoinedSub.unsubscribe();
    this.onMessageRecieveSub.unsubscribe();
    this.onLeaveSub.unsubscribe();
  }

}
