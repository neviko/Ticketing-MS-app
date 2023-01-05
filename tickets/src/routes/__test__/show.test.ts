import mongoose from "mongoose";
import  Request  from "supertest";
import { app } from "../../app";
import { GetSignupCookie } from "../../test/signup-cookie";


it(' returns a 404 if the ticket is not found', async ()=>{

    const generatedId = new mongoose.Types.ObjectId().toHexString() // generates a valid id

    await Request(app).get(`api/tickets/${generatedId}`)
    .send()
    .expect(404)
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