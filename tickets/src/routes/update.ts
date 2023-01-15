import express, {Request, Response} from 'express'
import {BadRequestError, NotAuthorizedError, NotFoundError, RequireAuth, ValidateRequest} from '@nevo-tickets/common'
import { body } from 'express-validator'
import { Ticket } from '../models/tickets'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { natsWrapper } from '../nats-wrapper'
import mongoose from 'mongoose'

const router = express.Router()

router.put('/api/tickets/:id' ,
RequireAuth,
[
    body('title')
    .not()
    .isEmpty()
    .withMessage('Title is required'),

    body('price')
    .isFloat({gt:0})
    .withMessage('Price must be grater than zero'),
],
ValidateRequest,
async (req: Request, res:Response)  =>{

    console.log('NEVO - currentUser is: ',req.currentUser)

    const {title, price} = req.body

    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        throw new NotFoundError()
    }
    if(ticket.userId !== req.currentUser?.id){
        throw new NotAuthorizedError()
    }

    if(ticket.orderId){
        throw new BadRequestError('ticket is reserved and cannot be edited')
    }


    ticket.set({
        title,
        price
    })
    await ticket.save()

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:ticket.id,
        title:ticket.title,
        price: ticket.price,
        userId:ticket.userId,
        version:ticket.version
    })

    res.send(ticket).status(200)
})


export {router as updateTicketRouter}