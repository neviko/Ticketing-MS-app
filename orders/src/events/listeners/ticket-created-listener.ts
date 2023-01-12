import {Message} from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@nevo-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'


export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated
    queueGroupName = queueGroupName

    async onMessage(data: TicketCreatedEvent['data'],msg:Message){
        // when receiving a new ticket:created event we want to 
        // duplicate the data to the orders ticket table so we won't need 
        // to pull the ticket info once we want to make an order
        const {title, price, id} = data
        const ticket = Ticket.build({
            id,
            title,
            price
        })
        await ticket.save()

        msg.ack()
    }
}