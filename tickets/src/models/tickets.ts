import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"


interface TicketsAttrs{
    title:string,
    price: number,
    userId:string
}

interface TicketsDoc extends mongoose.Document {
    title:string
    price: number
    userId:string
    version:number
}

interface TicketsModel extends mongoose.Model<TicketsDoc> {
    build(attrs:TicketsAttrs): TicketsDoc
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        required:true,
    },
    userId:{
        type:String,
        required:true
    },
},
{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id
            delete ret._id
        }
    }
})

ticketSchema.set('versionKey','version') // instead of __v
ticketSchema.plugin(updateIfCurrentPlugin) // fix concurrency issues library

ticketSchema.statics.build = (attrs:TicketsAttrs) =>{
    return new Ticket(attrs)
}

const Ticket = mongoose.model<TicketsDoc,TicketsModel>('Ticket',ticketSchema)

export {Ticket}