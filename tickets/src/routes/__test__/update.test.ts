import mongoose from "mongoose";
import  Request  from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";
import { GetSignupCookie } from "../../test/signup-cookie";

it(' returns a 404 if the ticket id is not found', async ()=>{
    const generatedId = new mongoose.Types.ObjectId().toHexString() // generates a valid id
    await Request(app).put(`/api/tickets/${generatedId}`)
    .set('Cookie', GetSignupCookie())
    .send({
        title:'dfkdfg',
        price:55
    })
    .expect(404)
})

it(' returns a 401 if the user is not authenticated', async ()=>{

    const generatedId = new mongoose.Types.ObjectId().toHexString() // generates a valid id
    await Request(app).put(`/api/tickets/${generatedId}`)
    .send({
        title:'dfkdfg',
        price:55
    })
    .expect(401)
})

it(' returns a 401 if the user is not the ticket owner', async ()=>{

    // creates a new ticket
    const response = await Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title:'sdfsdf',
        price:50
    })
    .expect(201)


    await Request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie', GetSignupCookie()) // different user token
    .send({
        title:'dfkdfg',
        price:55
    })
    .expect(401)
})

it(' returns a 400 if the user provides an invalid title or price', async ()=>{

    const cookie = GetSignupCookie()
    // creates a new ticket
    const response = await Request(app).post('/api/tickets')
    .set('Cookie',cookie)
    .send({
        title:'sdfsdf',
        price:50
    })
    .expect(201)


    await Request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) // different user token
    .send({
        title:'',
        price:''
    })
    .expect(400)
})

it(' returns a ticket if the ticket is found', async ()=>{

    const title = 'concert'
    const price = 150

    const response = await Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title,
        price
    })
    .expect(201)

    const ticketResponse = await Request(app).get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

    expect(ticketResponse.body.title).toEqual(title)
    expect(ticketResponse.body.price).toEqual(price)
    expect(ticketResponse.body.id).toEqual(response.body.id)
})


it(' should create and update a ticket', async ()=>{
    const cookie = GetSignupCookie()
    const response = await Request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title:'title',
        price:20
    })
    .expect(201)

    const newTitle = 'newTitle'
    const newPrice = 70

    await Request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200)


    const ticketResponse = await Request(app).get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

    expect(ticketResponse.body.title).toEqual(newTitle)
    expect(ticketResponse.body.price).toEqual(newPrice)
    expect(ticketResponse.body.id).toEqual(response.body.id)
})

it('publishes an event',async ()=>{

    const cookie = GetSignupCookie()
    const response = await Request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title:'title',
        price:20
    })
    .expect(201)

    const newTitle = 'newTitle'
    const newPrice = 70

    await Request(app).put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(200)


    const ticketResponse = await Request(app).get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

    expect(ticketResponse.body.title).toEqual(newTitle)
    expect(ticketResponse.body.price).toEqual(newPrice)
    expect(ticketResponse.body.id).toEqual(response.body.id)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('should reject for reserved ticket',async()=>{

    const cookie = GetSignupCookie()
    const {body} = await Request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({
        title:'title',
        price:20
    })
    .expect(201)

    const ticket = await Ticket.findById(body.id)
    ticket?.set({orderId: new mongoose.Types.ObjectId().toHexString()})
    ticket?.save()


    const newTitle = 'newTitle'
    const newPrice = 70

    await Request(app).put(`/api/tickets/${body.id}`)
    .set('Cookie', cookie)
    .send({
        title:newTitle,
        price:newPrice
    })
    .expect(400)
})