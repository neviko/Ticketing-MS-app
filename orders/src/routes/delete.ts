import express, {Request, Response} from 'express'
import {NotFoundError, RequireAuth} from '@nevo-tickets/common'
import { body } from 'express-validator'

const router = express.Router()

router.delete('/api/orders/:orderId' ,
async (req: Request, res:Response) =>{
    // const ticket = await Ticket.find({})
    res.send({})
})


export {router as deleteOrderRouter}