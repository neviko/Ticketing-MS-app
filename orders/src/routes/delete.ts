import express, {Request, Response} from 'express'
import {NotFoundError, RequireAuth ,NotAuthorizedError} from '@nevo-tickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { ticketSchema } from '../models/tickets'
import { Order, OrderStatus } from '../models/orders'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete('/api/orders/:orderId' ,
RequireAuth,
async (req: Request, res:Response) =>{
    // const ticket = await Ticket.find({})
    try{
        mongoose.model('ticket', ticketSchema);
        const order = await Order.findById(req.params.orderId).populate('ticket')
        if(!order){
            throw new NotFoundError()
        }
    
        if(order.userId !== req.currentUser?.id){
            throw new NotAuthorizedError()
        }
        order.status = OrderStatus.Cancelled
        await order.save()

        // publish an event
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id:order.id,
            version : order.version,
            ticket:{
                id:order.ticket.id
            }
        })
        res.status(200).send(order)
    }
    catch(err){
        console.log(err)
    }
})


export {router as deleteOrderRouter}