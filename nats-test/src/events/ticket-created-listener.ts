import nats, {Message} from 'node-nats-streaming'
import Listener from './base-listeners';
import { Subjects } from './subjects';
import { TicketCreatedEvent } from './ticket-created-event';

export default class TicketCreatedListener extends Listener<TicketCreatedEvent> {

    readonly subject = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data:TicketCreatedEvent['data'], msg:Message){
        console.log('Event data :', data);
        msg.ack()
    }

}
