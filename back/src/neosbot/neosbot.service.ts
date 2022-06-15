import { Injectable, Logger } from '@nestjs/common';
import Neos from '@bombitmanbomb/neosjs';

@Injectable()
export class NeosbotService {
  private readonly logger = new Logger(NeosbotService.name);
  neos: Neos;

  constructor() {
    if (process.env.NEOS_BOT_ID) this.initBot();
  }

  async initBot() {
    this.neos = new Neos();
    this.neos.Logout();
    this.neos.Login(process.env.NEOS_BOT_ID, process.env.NEOS_BOT_PASS);
    this.neos.on('messageReceived', (msg: any) => this.messageReceived(msg));
    this.neos.on('friendAdded', (friend: any) => this.addFriend(friend));
    this.neos.on('login', () => this.logger.log('NeosBot login success'));
  }

  addFriend(friend: any) {
    if (friend.FriendStatus === 'Requested') {
      this.logger.log(`FriendRequest Received from ${JSON.stringify(friend)}`);
      this.neos.AddFriend(friend);
    }
  }

  async messageReceived(m: any) {}

  async sendObjectMessage(neos, userId, assetUri, thumbnailUri) {
    const userMessages = await neos.GetUserMessages(userId);
    const message = new neos.CloudX.Shared.Message({
      messageType: 'Object',
    });
    message.SetContent({
      assetUri,
      thumbnailUri,
    });
    const result = await userMessages.SendMessage(message);
    return result;
  }

  async sendMessage(userId, text) {
    this.neos.SendTextMessage(userId, text);
  }
}
