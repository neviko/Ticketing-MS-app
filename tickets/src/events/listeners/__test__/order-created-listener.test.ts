import { OrderCreatedEvent, OrderStatus } from "@nevo-tickets/common"
import mongoose, { version } from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedPublisher } from "../../publishers/ticket-updated-publisher"
import { OrderCreatedListener } from "../order-created-listener"

const setup = async ()=>{

    const listener = new OrderCreatedListener(natsWrapper.client)

    const ticket = Ticket.build({
        userId: new mongoose.Types.ObjectId().toHexString(),
        title:'dfd',
        price:50
    })
    await ticket.save()

    const data :OrderCreatedEvent['data'] = {
        id:new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        expiredAt: 'temp_value',
        version: 0,
        userId:new mongoose.Types.ObjectId().toHexString(),
        ticket:{
            id: ticket.id,
            price:80
        }
    }

    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    return {listener, ticket, data, msg}
}


it('sets the userId of the ticket', async ()=>{
    const {listener, ticket, data, msg} = await setup()

    await listener.onMessage(data,msg)
    const updatedTicket = await Ticket.findById(ticket.id)

    // the order id in tickets schema is equal to the order created id
    expect(updatedTicket!.orderId).toEqual(data.id)
})

it('calls the ack message', async ()=>{
    const {listener, data, msg} = await setup()
    await listener.onMessage(data,msg)
    
    expect(msg.ack).toBeCalled()
})

it('should publish a ticker updated event after receiving ticket:created event', async ()=>{
    const {listener, data, msg} = await setup()
    await listener.onMessage(data,msg)
    
    expect(natsWrapper.client.publish).toBeCalled()

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1] )
    expect(ticketUpdatedData.orderId).toEqual(data.id)
})