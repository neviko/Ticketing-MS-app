import nats, {Message} from 'node-nats-streaming'
import Listener from './base-listeners';

export default class TicketCreatedListener extends Listener {

    subject = 'ticket:created'
    queueGroupName = 'payments-service'
    onMessage(data:any, msg:Message){
        console.log('Event data :', data);
        msg.ack()
    }

}
