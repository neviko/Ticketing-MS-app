import express, {Request, Response} from 'express'
import {RequireAuth} from '@nevo-tickets/common'
import { Order } from '../models/orders'
import { ticketSchema } from '../models/tickets'
import mongoose from 'mongoose'

const router = express.Router()

/**
 * return all the orders related to the currentUser
 */
router.get('/api/orders/' ,
RequireAuth,
async (req: Request, res:Response) =>{
    const userId = req.currentUser!.id
    try{
        mongoose.model('ticket', ticketSchema);
        const orders = await Order.find({userId}).populate('ticket')
        res.send(orders)
    }
    catch(err){
        console.log(err)
    }
})


export {router as indexOrderRouter}