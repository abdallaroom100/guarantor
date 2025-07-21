import mongoose from "mongoose";
import User from "../models/guarantor.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import addMonths from "../helper/addMonth.js";

export const getCurrentUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req?.userId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ error: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(`error in get current user function`);
    console.log(error.message);
  }
};

export const createGuarantor = async (req, res) => {
  const { fullName, phone, cardNumber, price, workers, birthDate } = req.body;
  console.log(req.body)
  try {
    if (!fullName || !phone || !cardNumber || !workers?.length || !birthDate) {
      return res.status(400).json({ error: "برجاء ملئ جميع الحقول المطلوبة بما فيها تاريخ الميلاد للكفيل" });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return res.status(400).json({ error: "صيغة تاريخ الميلاد للكفيل غير صحيحة. يجب أن تكون yyyy-mm-dd" });
    }
    if (fullName.length < 2) {
      return res.status(400).json({ error: "برجاء ادخال بيانات الاسم صحيحة" });
    }
    if (String(phone).length != 10) {
      return res
        .status(400)
        .json({ error: "رقم الهاتف يجب ان يحتوي علي 10 ارقام" });
    }
    if (String(cardNumber).length != 10) {
      return res  
        .status(400)
        .json({ error: "رقم البطاقة يجب ان يحتوي علي 10 ارقام" });
    }
    if (!Array.isArray(workers)) {
      return res.status(400).json({ error: "حقل العمال يجب ان يكون جدول" });
    }
    if(Number(price) && price <=0){
      return res.status(400).json({error:"السعر يجب ان يكون رقم صحيح"})
    }

    for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
    
      // التحقق من الحقول الأساسية
      if (
        !worker?.fullName ||
        !worker?.phone ||
        !worker?.residenceNumber ||
        !worker?.residenceEndDate || 
        !worker?.price ||
        !worker?.birthDate
      ) {
        return res
          .status(400)
          .json({ error: `برجاء ملئ جميع الحقول للعامل رقم ${i + 1} بما فيها تاريخ الميلاد` });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(worker.birthDate)) {
        return res.status(400).json({ error: `صيغة تاريخ الميلاد للعامل رقم ${i + 1} غير صحيحة. يجب أن تكون yyyy-mm-dd` });
      }
      if (worker.fullName.length < 2) {
        return res
          .status(400)
          .json({ error: `برجاء ادخال بيانات الاسم صحيحة للعامل رقم ${i + 1}` });
      }
      if (String(worker.phone).length != 10) {
        return res
          .status(400)
          .json({ error: `برجاء ادخال رقم هاتف مكون من 10 ارقام للعامل رقم ${i + 1}` });
      }
      if (String(worker.residenceNumber)?.length != 10) {
        return res 
          .status(400)
          .json({ error: `برجاء ادخال رقم إقامة مكون من 10 أرقام للعامل رقم ${i + 1}` });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(worker?.residenceEndDate)) {
        return res
          .status(400)
          .json({ error: `برجاء ادخال تاريخ انتهاء صالح للعامل رقم ${i + 1}` });
      }
      // ✅ التحقق من عدم تكرار رقم الإقامة في قاعدة البيانات
      const existingWorker = await User.findOne({
        "workers.residenceNumber": worker.residenceNumber,
      });
      if (existingWorker) {
        return res.status(400).json({
          error: `رقم الإقامة للعامل رقم ${i + 1} مسجل بالفعل`,
        });
      }
    }
    const user = await User.findOne({ cardNumber });
    if (user)
      return res.status(400).json({ error: "بيانات الكفيل هذه مسجله بالفعل" });
   console.log("done")
    const newUser = await User.create({
      fullName,
      phone,
      workers,
      cardNumber,
      price,
      birthDate
    });
    // generateToken(newUser._id, res,req);
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message)
    console.log(`error in signup user function`);
    return res.status(500).json({ error: "حدث خطأ داخلي أثناء تنفيذ الطلب" });
  }
};


export const updateGuarantor = async (req, res) => {
  const { cardNumber: cardId } = req.params;
  const { fullName, phone, workers,cardNumber, birthDate } = req.body;

  try {
    if (!fullName || !phone || !cardNumber || !workers?.length || !birthDate) {
      return res.status(400).json({ error: "برجاء ملئ جميع الحقول المطلوبة بما فيها تاريخ الميلاد للكفيل" });
    }
    const guarantor = await User.findOne({ cardNumber: cardId });

    if (!guarantor) {
      return res.status(404).json({ error: "لم يتم العثور على الكفيل" });
    }


    if (fullName) {
      if (fullName.length < 2) {
        return res.status(400).json({ error: "برجاء إدخال اسم صحيح للكفيل" });
      }
      guarantor.fullName = fullName;
    }

    if (birthDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        return res.status(400).json({ error: "صيغة تاريخ الميلاد للكفيل غير صحيحة. يجب أن تكون yyyy-mm-dd" });
      }
      guarantor.birthDate = birthDate;
    }

    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: "رقم الهاتف يجب أن يحتوي على 10 أرقام" });
      }
      guarantor.phone = phone;
    }


    if (workers) {
      if (!Array.isArray(workers)) {
        return res.status(400).json({ error: "العمال يجب أن يكونوا في جدول (Array)" });
      }

      for (let i = 0; i < workers.length; i++) {
        const worker = workers[i];

        // التحقق من الحقول الأساسية
        if (
          !worker.fullName ||
          !worker.phone ||
          !worker.residenceNumber ||
          !worker.residenceEndDate ||
          !worker.birthDate
        ) {
          return res.status(400).json({
            error: `برجاء ملئ جميع الحقول الأساسية للعامل رقم ${i + 1} بما فيها تاريخ الميلاد`
          });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(worker.birthDate)) {
          return res.status(400).json({ error: `صيغة تاريخ الميلاد للعامل رقم ${i + 1} غير صحيحة. يجب أن تكون yyyy-mm-dd` });
        }

        if (worker.fullName.length < 2) {
          return res.status(400).json({ error: `اسم العامل رقم ${i + 1} غير صالح` });
        }

        if (!/^\d{10}$/.test(worker.phone)) {
          return res.status(400).json({ error: `رقم هاتف العامل رقم ${i + 1} يجب أن يكون 10 أرقام` });
        }

        if (!/^\d{10}$/.test(worker.residenceNumber)) {
          return res.status(400).json({ error: `رقم إقامة العامل رقم ${i + 1} غير صالح` });
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(worker.residenceEndDate)) {
          return res.status(400).json({ error: `تاريخ انتهاء الإقامة غير صالح للعامل رقم ${i + 1}` });
        }

   
        if (worker.price !== undefined && typeof Number(worker.price) !== "number") {
          return res.status(400).json({ error: `السعر يجب أن يكون رقمًا للعامل رقم ${i + 1}` });
        }


        if (worker.notice !== undefined && typeof worker.notice !== "string") {
          return res.status(400).json({ error: `الملاحظة يجب أن تكون نصًا للعامل رقم ${i + 1}` });
        }

  
        if (worker.paysHistory !== undefined) {
          if (
            typeof worker.paysHistory !== "object" ||
            Array.isArray(worker.paysHistory)
          ) {
            return res.status(400).json({
              error: `سجل الدفعات للعامل رقم ${i + 1} يجب أن يكون كائن وليس مصفوفة`,
            });
          }

          for (const year in worker.paysHistory) {
            if (!/^\d{4}$/.test(year)) {
              return res.status(400).json({
                error: `السنة "${year}" في سجل الدفعات للعامل رقم ${i + 1} غير صالحة`,
              });
            }

            const months = worker.paysHistory[year];
            if (!Array.isArray(months)) {
              return res.status(400).json({
                error: `القيمة الخاصة بسنة ${year} يجب أن تكون مصفوفة شهور للعامل رقم ${i + 1}`,
              });
            }

            const isValidMonths = months.every(
              (month) => typeof month === "number" && month >= 1 && month <= 12
            );

            if (!isValidMonths) {
              return res.status(400).json({
                error: `بعض الشهور غير صالحة في سنة ${year} للعامل رقم ${i + 1}. يجب أن تكون أرقام من 1 إلى 12.`,
              });
            }
          }
        }
      }

      // استبدال العمال بالكامل
      guarantor.workers = workers;
    }
  await guarantor.save()
   
    return res.status(200).json(guarantor);

  } catch (error) {
    console.error("Error in updateGuarantor:", error.message);
    return res.status(500).json({ error: "حدث خطأ أثناء تحديث البيانات" });
  }
};

export const deleteGuarantorTemporary = async (req,res) =>{
  try {
    const {cardId} = req.params
     const guarantor = await User.findOne({cardNumber:cardId})
     if(!guarantor){
      return res.status(400).json({error:"بيانات الكفيل هذه غير موجوده"})
     }
      guarantor.isDeleted = true
      await guarantor.save()
      return res.status(200).json({message:"تم حذف الكفيل بنجاح"})
  } catch (error) {
    console.log(`error in get current user function`);
    console.log(error.message);
    return res.status(500).json({error:error.message})
  }
}
export const getWorkerWithGuarantor = async (req,res) =>{
 
   const {residenceNumber} = req.params
  try {
    const guarantor = await User.find({"workers.residenceNumber":residenceNumber})

     if(!guarantor?.length){
      return res.status(400).json({error:"بيانات العامل غير موجوده"})
     }
     
     const worker = guarantor[0]?.workers.find((w)=>String(w.residenceNumber) == residenceNumber)
    console.log(worker)
     return res.status(200).json({guarantor:guarantor[0],worker})
  } catch (error) {
    console.log(error.message)
    console.log("the error in get worker with guarantor ")
    return res.status(500).json({error:error.message})
  }
}


 export const getAllGuarantors = async (req,res) =>{

  try {
      const guarnators = await User.find({}).sort({createdAt:-1})
      return res.status(200).json(guarnators)
  } catch (error) {
    console.log(error.message)
    console.log("the error in get all guarantors ")
    return res.status(500).json({error:error.message})
  }
 }
 export const getGuarantor = async (req,res) =>{
   try { 
    const {cardId} = req.params
      const guarantor = await User.findOne({cardNumber:cardId})
      if(!guarantor){
        return res.status(401).json({error:"بيانات الكفيل غير موجوده"})
      }
      return res.status(200).json(guarantor)
  } catch (error) {
    console.log(error.message)
    console.log("the error in get guarantor ")
    return res.status(500).json({error:error.message})
  }
 }
 
export const getAllWorkers = async  (req,res) =>{
  try {
     const workers = (await User.find({})).map(guarantor=>{
     let editedGuarantor =  guarantor.workers.map(worker=>{
        return {...worker._doc,guarantorName:guarantor.fullName}
      })
      return editedGuarantor
     }).flat()
   
     return res.status(200).json(workers)
  } catch (error) {
    console.log(error.message)
    console.log("the error in get worker with guarantor ")
    return res.status(500).json({error:error.message})
  }
}



export const getAllEndDateWorkers = async (req, res) => {
  try {
    const allUsers = await User.find();

    const today = new Date();

    const filteredWorkers = [];

    for (const guarantor of allUsers) {
      for (const worker of guarantor.workers) {
        const [year, month, day] = worker.residenceEndDate.split("-").map(Number);
        const endDate = new Date(year, month - 1, day); // تحويل تاريخ انتهاء الإقامة إلى كائن تاريخ
        const threeMonthsBeforeEnd = new Date(endDate);
        threeMonthsBeforeEnd.setMonth(threeMonthsBeforeEnd.getMonth() - 3);

        if (
          today >= threeMonthsBeforeEnd && // داخل الثلاث شهور
          today <= endDate // ولسه منتهتش
        ) {
          filteredWorkers.push(
            worker,
          );
        }
      }
    }

    return res.status(200).json(filteredWorkers);
  } catch (error) {
    console.log(error.message);
    console.log("Error in getAllEndDateWorkers");
    return res.status(500).json({ error: "حدث خطأ أثناء معالجة الطلب" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ error: "plase fill all fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 chars" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "username must be atleast 3 chars" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    const Vpassword = bcrypt.compareSync(password, user.password);
    if (!Vpassword) {
      return res.status(401).json({ error: "password is incorrect" });
    }
    generateToken(user._id, res, req);
    console.log(req.token);
    res.status(200).json({ ...user._doc, token: req.token });
  } catch (error) {
    console.log(`error in login user function`);
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const user = await User.findByIdAndDelete(userId, {
      new: true,
    });
    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    return res.status(200).json("user has deleted successfully");
  } catch (error) {
    console.log(`error in delete user function`);
    console.log(error.message);
  }
};
export const updateUser = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "invalid id" });
    }
    const { username, password } = req.body;
    if (!username && !password) {
      return res.status(400).json({ error: "plase fill at least one field" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 chars" });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ error: "username must be atleast 3 chars" });
    }
    const existUser = await User.findOne({ username });
    if (existUser)
      if (username) {
        return res
          .status(400)
          .json({ error: "this username is already exist" });
      }
    const hash = bcrypt.hashSync(password, 10);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        username,
        password: hash,
      },
      { new: true }
    );

    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log(`error in delete user function`);
    console.log(error.message);
  }
};

export const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(`error in logout user function`);
    console.log(error.message);
  }
};
