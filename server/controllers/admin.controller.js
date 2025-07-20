import validator from "validator"
import bcryptjs from "bcryptjs"
import Admin from "../models/admin.model.js"
import generateToken from "../utils/generateToken.js"

export const signUpAdmin = async ( req,res) =>{

    try {
        const {name,email,password} = req.body
         if(!name || !email || !password){
            return res.status(400).json({error:"برجاء ملئ جميع الحقول المطلوبه"})
         }

         if(String(name).length < 2){
            return res.status(400).json({error:"برجاء ادخال بيانات الاسم صحيحه"})
         }
         if(String(password).length <= 6){
            return res.status(400).json({error:"الرقم السري يجب ان يحتوي علي الاقل علي 6 احرف"})
         }
         if(!validator.isEmail(email)){
            return res.status(400).json({error:"برجاء ادخال بيانات  بريد الكتروني صالح"})
         }
        const checkAdminExists = await Admin.findOne({email})
        if(checkAdminExists){
            return res.status(400).json({error:"البريد الاكتروني هذا موجود بالفعل"})
        }

         const hashedPassword = await bcryptjs.hash(password, 10)
         const newAdmin = await Admin.create({
            name,email,password:hashedPassword
         })

         // TODO: Save admin to database here
         return res.status(201).json({...newAdmin._doc,password:undefined})

    } catch (error) {
        console.log(error.message)
        console.log("error in signup admin ")
        return res.status(500).json({error:"خطا غير متوقع في انشاء الحساب"})
    }
}
export const loginAdmin = async ( req,res) =>{

    try {
        const {email,password} = req.body
         if( !email || !password){
            return res.status(400).json({error:"برجاء ملئ جميع الحقول المطلوبه"})
         }

         const admin = await Admin.findOne({email})
         if(!admin){
            return res.status(401).json({error:"بيانات الادمن غير موجوده"})
         }
         
          const vPassword = bcryptjs.compareSync(password,admin.password)
          if(!vPassword){
            return res.status(400).json({error:"الرقم السري غير صحيح "})
          }
         
           generateToken(admin._id, res,req)
           return res.status(201).json({...admin._doc,token:req.token,password:undefined})
      

    } catch (error) {
        console.log(error.message)
        console.log("error in login admin ")
        return res.status(500).json({error:"خطا غير متوقع في التسجيل للحساب"})
    }
}

 export const getCurrentAdmin = async  (req,res) =>{
 

  
     try {
           const currentAdmin = await Admin.findById(req.adminId)
   if(!currentAdmin) {
    return res.status(401).json({error:"بيانات الادمن هذه غير موجوده"})
   }
   return res.status(201).json({...currentAdmin._doc , password:undefined})
    } catch (error) {
         console.log(error.message)
        console.log("error in get current admin ")
        return res.status(500).json({error:"خطا غير متوقع   "})
    }
 }