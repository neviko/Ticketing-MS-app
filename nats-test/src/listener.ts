import nats from 'node-nats-streaming'
import { randomBytes } from 'crypto'
import TicketCreatedListener from './events/ticket-created-listener'
console.clear()
/**
 * we need a unique id for each instance registered into nats,
 * in the k8s world we have the pod ID, but here we will generate a 
 * unique ID
 */

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url: 'http://localhost:4222'
})


stan.on('connect', ()=>{
    console.log('Listener connected to NATS')

    stan.on('close',()=>{
        console.log('NATS connection closed')
        process.exit()
    })

    new TicketCreatedListener(stan).listen()
})

process.on('SIGINT', ()=>{stan.close()})
process.on('SIGTERM', ()=>{stan.close()})





