import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chat } from './models/chat.mdoel';
import { ChatAppService } from './services/chat-app.service';
import * as signalR from '@microsoft/signalr';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewChecked {
  title = 'SignalRChatAppDemo.Angular';

  chatForm: FormGroup;
  @ViewChild('scrollToBottom')
  private myScrollContainer!: ElementRef<HTMLFormElement>;
  connection!: signalR.HubConnection;
  chat: Chat = new Chat();
  chatInboxArray: Chat[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private chatAppSvc: ChatAppService
  ) {
    this.chatForm = this.formBuilder.group({
      user: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnInit(): void {
    this.chatAppSvc.retrieveChatMessage().subscribe((receivedObj: Chat) => {
      this.addToInbox(receivedObj);
    });
  }

  addToInbox(chat: Chat) {
    let newChat = new Chat();
    newChat.user = chat.user;
    newChat.message = chat.message;
    this.chatInboxArray.push(newChat);
  }

  sendMessage(): void {
    var user = this.chatForm.get('user')?.value;
    if (this.chat) {
      if (user == 0) {
        window.alert('User Form Is Required.');
      } else {
        this.chatAppSvc.broadcastMessage(this.chatForm.value);
        this.chatForm.get('message')?.reset();
      }
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }
}
