import mongoose from 'mongoose'
import request from 'supertest' 
import {app} from '../../app'
import { OrderStatus } from '../../models/orders'
import { Ticket } from '../../models/tickets'
import { natsWrapper } from '../../nats-wrapper'
import { GetSignupCookie } from '../../test/signup-cookie'

it('return an error if trying to delete non exist order', async ()=>{

    // const orderId = new mongoose.Types.ObjectId()// generates a new mongo valid ID
    // await request(app)
    //     .delete(`/api/orders/${orderId}`)
    //     .set('Cookie', GetSignupCookie())
    //     .expect(404)

})

it('should cancel an order', async ()=>{
    //creates a ticket
    const ticket = Ticket.build({
        title:'title',
        price:50
    })
    await ticket.save()

    //creates a user
    const user = GetSignupCookie()

    // order a ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId:ticket.id
        })
        .expect(200)

    // cancel order
    const {body:newOrder} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(order.id).toEqual(newOrder.id)
    expect(newOrder.status).toEqual(OrderStatus.Cancelled)
})


it('emit a order cancelled event ',async ()=>{

    const ticket = Ticket.build({
        title:'title',
        price:50
    })
    await ticket.save()

    //creates a user
    const user = GetSignupCookie()

    // order a ticket
    const {body:order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId:ticket.id
        })
        .expect(200)

    // cancel order
    const {body:newOrder} = await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200)

    expect(order.id).toEqual(newOrder.id)
    expect(newOrder.status).toEqual(OrderStatus.Cancelled)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})