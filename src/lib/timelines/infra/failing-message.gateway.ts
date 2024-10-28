import { MessageGateway } from '@/lib/timelines/model/message.gateway';

export class FailingMessageGateway implements MessageGateway {
  constructor(private readonly willFailWithErrorMessage: string) {}
  async postMessage(): Promise<void> {
    return Promise.reject(this.willFailWithErrorMessage);
  }
}
