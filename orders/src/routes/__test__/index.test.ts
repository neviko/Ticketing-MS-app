import request from 'supertest' 
import {app} from '../../app'
import { Ticket } from '../../models/tickets'
import { GetSignupCookie } from '../../test/signup-cookie'

const buildTicket = async ()=>{
    const ticket = Ticket.build({
        title:'concert',
        price: 50
    })

    await ticket.save()
    return ticket 
}

it('should fetch orders for a particular user', async ()=>{
    // create three tickets
    const ticketOne = await buildTicket()
    const ticketTwo = await buildTicket()
    const ticketThree = await buildTicket()

    const userA = GetSignupCookie()
    const userB = GetSignupCookie()

    // create one order as User #1
       await request(app)
       .post('/api/orders')
       .set('Cookie',userA)
       .send({
        ticketId:ticketOne.id
       })
       .expect(200)
    // create two order as User #2

    await request(app)
       .post('/api/orders')
       .set('Cookie',userB)
       .send({
        ticketId:ticketTwo.id
       })
       .expect(200)

    await request(app)
        .post('/api/orders')
        .set('Cookie',userB)
        .send({
            ticketId:ticketThree.id
        })
        .expect(200)
    // fetch orders for user #2

    const userOrders = await request(app)
        .get(`/api/orders`)
        .set('Cookie',userB)
        .expect(200)
    // make sure we got the orders for user #2
    expect(userOrders.body.length).toEqual(2)
})