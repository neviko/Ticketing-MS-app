import { OrderCancelledEvent, OrderStatus } from "@nevo-tickets/common"
import mongoose, { version } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async ()=>{

    const listener = new OrderCancelledListener(natsWrapper.client)

    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title:'dfd',
        price:50,
    })
    ticket.set({orderId: new mongoose.Types.ObjectId().toHexString()})

    await ticket.save()

    const data :OrderCancelledEvent['data'] = {
        id:ticket.orderId as string,
        version: 0,
        ticket:{
            id: ticket.id,
        }
    }

    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    return {listener, ticket, data, msg}
}


it('updates the ticket, publish an event and ack the message', async ()=>{
    const {listener, ticket, data, msg} = await setup()

    await listener.onMessage(data,msg)
    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toBeUndefined()
    expect(msg.ack).toBeCalled()
    expect(natsWrapper.client.publish).toHaveBeenCalled()

})

