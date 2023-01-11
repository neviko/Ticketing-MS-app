import mongoose from 'mongoose'
import request from 'supertest' 
import {app} from '../../app'
import { Order, OrderStatus } from '../../models/orders'
import { Ticket } from '../../models/tickets'
import { GetSignupCookie } from '../../test/signup-cookie'

it('return an error if the ticket does not exist', async ()=>{

    const ticketId = new mongoose.Types.ObjectId()// generates a new mongo valid ID
    await request(app)
        .post('/api/orders')
        .set('Cookie', GetSignupCookie())
        .send({
            ticketId
        })
        .expect(404)

})

it('return an error if the ticket is already reserved', async ()=>{
    
    const ticket = Ticket.build({
        title:'title',
        price:50
    })
    await ticket.save()

    const order = Order.build({
        ticket,
        status:OrderStatus.Created,
        userId:'sdskahgakf',
        expiresAt:new Date()
    })

    await order.save()

    await request(app)
    .post('/api/orders')
    .set('Cookie', GetSignupCookie())
    .send({
        ticketId:ticket._id
    })
    .expect(400)
})

it('reserves a ticket', async ()=>{
    const ticket = Ticket.build({
        title:'title',
        price:50
    })
    await ticket.save()

    console.log('ticket',ticket);
    
    await request(app)
    .post('/api/orders')
    .set('Cookie', GetSignupCookie())
    .send({
        ticketId:ticket.id
    })
    .expect(200)
})

it.todo('emit an order created event')