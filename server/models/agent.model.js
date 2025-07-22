
import mongoose, { Schema } from "mongoose";


const agentSchema = new Schema({

    fullName :{
        type:String,
        required:true
    },
    birthDate: {
        type: String,
        required: true 
    },
     phone :{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    },
     cardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    managerName:{
        type:String,
        required:true
    },
    managerPhone:{
        type:String,
        required:true
    },
    passportNumber: {
        type: String,
        required: false
    },
    visaType: {
        type: String,
        enum: ['زيارة', 'عمرة', 'عمل'],
        required: true
    }
  
},{
    timestamps:true
})


const Agent =  mongoose.model("bagAgent",agentSchema)

export default Agent