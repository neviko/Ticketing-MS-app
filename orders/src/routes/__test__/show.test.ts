import mongoose from 'mongoose'
import request from 'supertest' 
import {app} from '../../app'
import { Ticket } from '../../models/tickets'
import { GetSignupCookie } from '../../test/signup-cookie'

it('return an error if the order does not exist', async ()=>{

    const orderId = new mongoose.Types.ObjectId()// generates a new mongo valid ID
    await request(app)
        .get(`/api/orders/${orderId}`)
        .set('Cookie', GetSignupCookie())
        .expect(404)
})

it('should return an order', async ()=>{
    const ticket = Ticket.build({
        title:'title',
        price:50
    })
    await ticket.save()
    const user = GetSignupCookie()

    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId:ticket.id
        })
        .expect(200)


    await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)
})
