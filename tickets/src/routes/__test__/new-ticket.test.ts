import  Request  from "supertest";
import { Ticket } from "../../../models/tickets";
import { app } from "../../app";
import { GetSignupCookie } from "../../test/signup-cookie";
import { natsWrapper } from "../../nats-wrapper";

it('has a route handler to POST /api/tickets', async ()=>{
    const response = await Request(app).post('/api/tickets')
    .send({})
    expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async ()=>{
    await Request(app).post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns a status other than 401 if a user is signed in', async ()=>{
    const cookie = GetSignupCookie()
    const response = await Request(app).post('/api/tickets')
    .set('Cookie', cookie)
    .send({})
    expect(response.status).not.toEqual(401)
})

it('returns an error if invalid title is provided', async ()=>{
    await Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        price:10
    })
    .expect(400)
})

it('returns an error if invalid price is provided', async ()=>{
    await Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title:'sdfsdf',
        price:-10
    })
    .expect(400)
})

it('create a ticket with a valid info', async ()=>{

    let tickets = await Ticket.find({}) // should be zero because the before each clean up
    expect(tickets.length).toEqual(0)


    await Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title:'sdfsdf',
        price:50
    })
    .expect(201)

    tickets = await Ticket.find({}) 
    expect(tickets.length).toEqual(1)
})

it('publishes an event',async ()=>{

    await Request(app)
    .post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title:'sdfasdf',
        price:40
    })
    .expect(201)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})