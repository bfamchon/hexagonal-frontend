import { MessageGateway } from '../model/message.gateway';

export class FakeMessageGateway implements MessageGateway {
  willFail = false;
  lastPostedMessage!: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  };
  postMessage(message: {
    id: string;
    author: string;
    text: string;
    publishedAt: string;
    timelineId: string;
  }): Promise<void> {
    this.lastPostedMessage = message;
    if (this.willFail) {
      this.willFail = false;
      return Promise.reject();
    }
    this.willFail = true;
    return Promise.resolve();
  }
}
