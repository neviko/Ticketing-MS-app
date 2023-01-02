import express, {Request, Response} from 'express'
import {NotFoundError, RequireAuth} from '@nevo-tickets/common'
import { body } from 'express-validator'
import { Ticket } from '../../models/tickets'

const router = express.Router()

router.get('/api/tickets/' ,
async (req: Request, res:Response)  =>{
    const ticket = await Ticket.find({})
    res.send(ticket)
})


export {router as indexTicketRouter}