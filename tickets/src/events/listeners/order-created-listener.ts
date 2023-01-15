import { Listener, NotFoundError, OrderCreatedEvent, Subjects } from "@nevo-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName = queueGroupName

    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new Error('ticket not found')
        }
        ticket.orderId = data.id
        await ticket.save()

        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId
        })

        msg.ack()
    }
}