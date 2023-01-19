import { ExpirationCompleteEvent } from "@nevo-tickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Order, OrderStatus } from "../../../models/orders"
import { Ticket, ticketSchema } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"

const setup = async () =>{
    // creates an instance of the listener
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    //create a fake data event
    mongoose.model("ticket", ticketSchema);
    const ticket = Ticket.build({
        id:new mongoose.Types.ObjectId().toHexString(),
        price:50,
        title:'title',
    })
    await ticket.save()

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'dfsdf',
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    const data: ExpirationCompleteEvent['data'] = {
        orderId:order.id
    }

    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    } 

    return {listener, data, msg,order,ticket}
}
it('updates the order status to cancelled',async ()=>{
    const {listener, data, msg,order,ticket} = await setup()
    await listener.onMessage(data, msg) // sho
    const updatedOrder = await Order.findById(order.id)
    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
})

it('emit an OrderCancelled event',async ()=>{
    const {listener, data, msg,order,ticket} = await setup()
    await listener.onMessage(data, msg)

    expect(natsWrapper.client.publish).toHaveBeenCalled()

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(eventData.id).toEqual(order.id)
})

it('ack the message',async ()=>{
    const {listener, data, msg,order,ticket} = await setup()
    await listener.onMessage(data, msg)

    expect(msg.ack).toHaveBeenCalled()
})