import { Listener, NotFoundError, OrderCancelledEvent, Subjects } from "@nevo-tickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { queueGroupName } from "./queue-group-name";


export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = queueGroupName

    async onMessage(data:OrderCancelledEvent['data'],msg:Message){
        const ticket = await Ticket.findById(data.ticket.id)
        if(!ticket){
            throw new Error('ticket not found')
        }
        ticket.set({orderId: undefined})
        await ticket.save()


        await new TicketUpdatedPublisher(this.client).publish({
            id:ticket.id,
            version: ticket.version,
            price: ticket.price,
            title:ticket.title,
            userId: ticket.userId,
            orderId: undefined
        })

        msg.ack()
    }
}