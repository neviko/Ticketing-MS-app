import { TicketCreatedEvent } from "@nevo-tickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../ticket-created-listener"

const setup = async () =>{
    // creates an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client)
    //create a fake data event
    const data: TicketCreatedEvent['data']={
        id:new mongoose.Types.ObjectId().toHexString(),
        version:0,
        price:50,
        title:'title',
        userId:new mongoose.Types.ObjectId().toHexString()
    }
    // create a fake message object

    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    } 

    return {listener, data, msg}
}


it('creates and saves a ticket',async ()=>{
    const {listener, data, msg} = await setup()
    await listener.onMessage(data,msg)

    const ticket = await Ticket.findById(data.id)
    expect(ticket).toBeDefined()
    expect(ticket?.title).toEqual(data.title)
})

it('acks the message',async ()=>{
    const {listener, data, msg} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toBeCalled()
})