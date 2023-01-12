import express, {Request, Response} from 'express'
import {NotFoundError, RequireAuth, ValidateRequest, OrderStatus, BadRequestError} from '@nevo-tickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/tickets'
import { Order } from '../models/orders'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders/' ,
RequireAuth,
[
    body('ticketId')
    .notEmpty()
    .custom( (input: string) =>mongoose.Types.ObjectId.isValid(input) )
    .withMessage('ticket id must be valid')
],
ValidateRequest,
async (req: Request, res:Response) =>{

    const { ticketId } = req.body
    // find the ticket
    const ticket = await Ticket.findById(ticketId)
    if(!ticket){
        throw new NotFoundError()
    }

 
    const isReserved = await ticket.isReserved()

    if(isReserved){
        throw new BadRequestError('Ticket is already reserved')
    }

    // calculate an expiration date for the ticket
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // build the order and save it to the DB
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    })
    await order.save()

    // send an event order:created
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id:order.id,
        status:OrderStatus.Created,
        userId: req.currentUser!.id,
        expiredAt:order.expiresAt.toISOString(),
        ticket:{
            id: ticket.id,
            price: ticket.price
        }

    })
    res.send(order).status(200)
})


export {router as newOrderRouter}