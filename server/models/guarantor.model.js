
  import mongoose, { Schema } from "mongoose";


  const workerSchema = new Schema({
    fullName :{
        type:String,
        required:true
    },
    phone  :{
        type:String,
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
    birthDate: {
        type: String,
        required: true // yyyy/mm/dd
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
  },{
    timestamps:true
  })

 
  const guarantorSchema = new Schema({
   
      fullName :{
          type:String,
          required:true
      },
      birthDate: {
          type: String,
          required: true // yyyy/mm/dd
      },
       phone  :{
          type:String,
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

      },
      isDeleted:{
        type:Boolean,
        default:false
    },
      
  },{
    timestamps:true

  })



  const User = mongoose.model("bagUser",guarantorSchema)

  export default User