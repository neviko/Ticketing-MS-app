import mongoose from "mongoose";
import  Request  from "supertest";
import { app } from "../../app";
import { GetSignupCookie } from "../../test/signup-cookie";


const createTicket = (title:string,price:number)=>{
    return Request(app).post('/api/tickets')
    .set('Cookie', GetSignupCookie())
    .send({
        title,
        price
    })
    .expect(201)
}

it('should fetch all tickets', async ()=>{

    await createTicket('concert',300)
    await createTicket('Nevo',800)

    const {body} = await Request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

    expect(body.length).toEqual(2)
})