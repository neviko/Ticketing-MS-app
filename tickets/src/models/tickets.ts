import mongoose from "mongoose"
import { updateIfCurrentPlugin } from "mongoose-update-if-current"


interface TicketsAttrs{
    title:string,
    price: number,
    userId:string
}

// A document is a single record in MongoDB
interface TicketsDoc extends mongoose.Document {
    title:string
    price: number
    userId:string
    version:number
    orderId?: string

}

// A model is a JavaScript object that defines the structure of a 
// document and the methods that can be used to interact with it.
interface TicketsModel extends mongoose.Model<TicketsDoc> {
    build(attrs:TicketsAttrs): TicketsDoc
}

// A schema is a blueprint for the structure of a document in 
// Mongoose which is used to define the structure of a model.
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
    orderId:{
        type: String,
    }
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