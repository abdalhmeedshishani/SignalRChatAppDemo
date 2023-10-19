import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chat } from '../models/chat.mdoel';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatAppService {
  private connection: any = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:44379/chatHub')
    .configureLogging(signalR.LogLevel.Information)
    .build();
  private receivedChatObject: Chat = new Chat();
  private sharedChat = new BehaviorSubject<Chat>(this.receivedChatObject);
  apiUrl = `https://localhost:44379/api/Chats`;

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
    this.connection.on('ReceiveMessage', (user: string, message: string) => {
      this.mapReceivedMessage(user, message);
    });
    this.start();
  }

  public broadcastMessage(message: string) {
    this.http
      .post(`${this.apiUrl}/SendMessage/`, message)
      .subscribe((data) => data);
  }

  public retrieveChatMessage(): Observable<Chat> {
    return this.sharedChat.asObservable();
  }

  private async start() {
    try {
      await this.connection.start();
      console.log('connected');
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(user: string, message: string): void {
    this.receivedChatObject.user = user;
    this.receivedChatObject.message = message;
    this.sharedChat.next(this.receivedChatObject);
  }
}
