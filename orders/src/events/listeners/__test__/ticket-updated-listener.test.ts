import { TicketCreatedEvent, TicketUpdatedEvent } from "@nevo-tickets/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/tickets"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () =>{
    // creates an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //creates a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price:70,
        title:'title',
    })
    await ticket.save()

    //create a fake data event
    const data: TicketUpdatedEvent['data']={
        id:ticket.id,
        version:ticket.version +1,
        price:999,
        title:'new_title',
        userId:new mongoose.Types.ObjectId().toHexString()
    }
    // create a fake message object
    //@ts-ignore
    const msg:Message = {
        ack:jest.fn()
    } 

    return {listener, data, msg, ticket}
}


it('finds, updates and saves a ticket',async ()=>{
    const {listener, data, msg, ticket} = await setup()
    await listener.onMessage(data,msg)

    const updatedTIcket = await Ticket.findById(ticket.id)
    expect(updatedTIcket).toBeDefined()
    expect(updatedTIcket?.title).toEqual(data!.title)
    expect(updatedTIcket?.version).toEqual(data!.version)
})

it('acks the message',async ()=>{
    const {listener, data, msg} = await setup()
    await listener.onMessage(data,msg)

    expect(msg.ack).toBeCalled()
})

it('should not call ack if version is not synced',async ()=>{
    const {listener, data, msg} = await setup()
    data.version ++
    try{
        await listener.onMessage(data,msg)
    }
    catch(err){}

    expect(msg.ack).not.toBeCalled()
})