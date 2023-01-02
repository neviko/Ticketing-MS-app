import express, {Request, Response} from 'express'
import {NotAuthorizedError, NotFoundError, RequireAuth, ValidateRequest} from '@nevo-tickets/common'
import { body } from 'express-validator'
import { Ticket } from '../../models/tickets'

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

    ticket.set({
        title,
        price
    })
    await ticket.save()
    res.send(ticket).status(200)
})


export {router as updateTicketRouter}