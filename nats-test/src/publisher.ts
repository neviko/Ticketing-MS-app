import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/tickert-created-publisher'

console.clear()


const stan = nats.connect('ticketing','abc',{
    url: 'http://localhost:4222'
})

stan.on('connect', async ()=>{
    console.log('Publisher connected to NATS')


    const publisher = new TicketCreatedPublisher(stan)
    try {
        await publisher.publish({
            id:'333',
            title:'title',
            price:50
        })
    }
    catch(err){
        console.error(err)
    }
   
})

