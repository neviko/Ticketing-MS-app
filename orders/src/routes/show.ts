import express, {Request, Response} from 'express'
import {RequireAuth,  NotFoundError, NotAuthorizedError} from '@nevo-tickets/common'
import { Order } from '../models/orders'
import mongoose from 'mongoose'
import { ticketSchema } from '../models/tickets'

const router = express.Router()

router.get('/api/orders/:orderId' ,
RequireAuth,
async (req: Request, res:Response) =>{
    console.log('req.params.orderId',req.params);
    
    try{
        mongoose.model('ticket', ticketSchema);
        const order = await Order.findById(req.params.orderId).populate('ticket')
        if(!order){
            throw new NotFoundError()
        }
    
        if(order.userId !== req.currentUser?.id){
            throw new NotAuthorizedError()
        }
    
        res.send(order)
    }
    catch(err){
        console.log(err)
    }
    
})


export {router as showOrderRouter}