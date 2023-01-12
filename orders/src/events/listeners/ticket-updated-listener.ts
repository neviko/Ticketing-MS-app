import {Message} from 'node-nats-streaming'
import { Subjects, Listener, TicketUpdatedEvent } from '@nevo-tickets/common'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/tickets'


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent['data'],msg:Message){
        const {title, price, id,version} = data
        const ticket = await Ticket.findByEvent(data)
        if(!ticket){
            throw new Error('Ticket not found')
        }
        ticket.set({title,price})
        await ticket.save()

        msg.ack()
    }
}