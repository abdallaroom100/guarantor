
  import mongoose, { Schema } from "mongoose";


  const workerSchema = new Schema({
    fullName :{
        type:String,
        required:true
    },
    phone  :{
        type:Number,
        required:true
    },
    residenceNumber:{
        type:Number,
        required:true,
   
    },
    notice :{
        type:String,
        default:""
    },
    residenceEndDate:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        default:0
       
    },
    paysHistory:{}
  })

 
  const guarantorSchema = new Schema({
   
      fullName :{
          type:String,
          required:true
      },
       phone  :{
          type:Number,
          required:true
      },
       cardNumber  :{
          type:Number,
          required:true,
          unique:true
      },
      workers:{
        type:[workerSchema],
        required:true,

      }
      
  },{
    timestamps:true

  })



  const User = mongoose.model("bagUser",guarantorSchema)

  export default User