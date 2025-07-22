
import Agent from "../models/agent.model.js";

export const createAgent = async (req, res) => {
  const { fullName, phone, cardNumber, managerName, managerPhone, birthDate, passportNumber, visaType } =
    req.body;
  console.log(req.body);
  try {
    if (
      !fullName ||
      !phone ||
      !cardNumber ||
      !birthDate ||
      !managerName ||
      !managerPhone ||
      !visaType
    ) {
      return res
        .status(400)
        .json({
          error: "برجاء ملئ جميع الحقول المطلوبة ",
        });
    }
    if (!['زيارة', 'عمرة', 'عمل'].includes(visaType)) {
      return res.status(400).json({ error: 'نوع التأشيرة غير صحيح يجب أن يكون زيارة أو عمرة أو عمل' });
    }
    if (!/^[\d]{4}-[\d]{2}-[\d]{2}$/.test(birthDate)) {
      return res
        .status(400)
        .json({
          error: "صيغة تاريخ الميلاد للكفيل غير صحيحة. يجب أن تكون yyyy-mm-dd",
        }); 
    }
    if (fullName.length < 2) {
      return res.status(400).json({ error: "برجاء ادخال بيانات الاسم صحيحة" });
    }
    // تم إزالة شرط الطول لرقم الجوال ورقم الهوية
    // if (String(phone).length != 10) {
    //   return res
    //     .status(400)
    //     .json({ error: "رقم الهاتف يجب ان يحتوي علي 10 ارقام" });
    // }
    // if (String(cardNumber).length != 10) {
    //   return res
    //     .status(400)
    //     .json({ error: "رقم الهوية يجب ان يحتوي علي 10 ارقام" });
    // }

    const agent = await Agent.findOne({ cardNumber });
    if (agent)
      return res.status(400).json({ error: "بيانات الكفيل هذه مسجله بالفعل" });

    const newUser = await Agent.create({
      fullName,
      phone,
      managerName,
      cardNumber, 
      managerPhone,
      birthDate,
      passportNumber,
      visaType
    });
    // generateToken(newUser._id, res,req);
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error.message);
    console.log(`error in create agent function`);
    return res.status(500).json({ error: "حدث خطأ داخلي أثناء تنفيذ الطلب" });
  }
};


 export const getAgents = async (req,res) =>{
    try {
        const agents  = await Agent.find({isDeleted:false}).sort({createdAt:-1})
        return res.status(200).json(agents)
    } catch (error) {
        
    }
 }
 export const getAgent = async (req,res) =>{
    try {
        const {id}  = req.params
        const agent  = await Agent.findById(id)
        if(!agent){
            return res.status(400).json({error:"بيانات الوكيل غير موجوده"})
        }
        return res.status(200).json(agent) 
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
 }
 
export const updateAgent = async (req, res) => {
  const { id } = req.params;
  const {
    fullName,
    phone,
    cardNumber, 
    managerPhone,
    managerName,
    birthDate,
    status,
    passportNumber,
    visaType
  } = req.body;

  try {
    if (
      !fullName ||
      !phone ||
      !cardNumber ||
      !managerPhone ||
      !managerName ||
      !birthDate ||
      !visaType
    ) {
      return res
        .status(400)
        .json({
          error: "برجاء ملئ جميع الحقول المطلوبة بما فيها تاريخ الميلاد ونوع التأشيرة",
        });
    }
    if (!['زيارة', 'عمرة', 'عمل'].includes(visaType)) {
      return res.status(400).json({ error: 'نوع التأشيرة غير صحيح يجب أن يكون زيارة أو عمرة أو عمل' });
    }
    const agent = await Agent.findById(id);

    if (!agent) {
      return res.status(404).json({ error: "لم يتم العثور على الكفيل" });
    }

    if (fullName) {
      if (fullName.length < 2) {
        return res.status(400).json({ error: "برجاء إدخال اسم صحيح للكفيل" });
      }
      agent.fullName = fullName;
    }
    if (managerName) {
      if (managerName.length < 2) {
        return res.status(400).json({ error: "برجاء إدخال اسم صحيح الوكيل" });
      }
      agent.managerName = managerName;
    }

    if (birthDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
        return res
          .status(400)
          .json({
            error:
              "صيغة تاريخ الميلاد للكفيل غير صحيحة. يجب أن تكون yyyy-mm-dd",
          });
      }
      agent.birthDate = birthDate;
    }

    agent.phone = phone;
    agent.managerPhone = managerPhone;
    agent.cardNumber = cardNumber;
    agent.passportNumber = passportNumber;
    agent.visaType = visaType;

    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ error: "برجاء ادخال حالة التاشيره بشكل صحيح" });
    } else {
      agent.status = status;
    }

    await agent.save();

    return res.status(200).json(agent);
  } catch (error) {
    console.error("Error in update agent:", error.message);
    return res.status(500).json({ error: "حدث خطأ أثناء تحديث البيانات" });
  }
};

export const deleteAgentTemporary = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(400).json({ error: "بيانات الكفيل هذه غير موجوده" });
    }
    agent.isDeleted = true;
    await agent.save();
    return res.status(200).json({ message: "تم حذف الكفيل بنجاح" });
  } catch (error) {
    console.log(`error in get delete agent temporary function`);
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const returnAgentfromTemp = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await Agent.findById(id);
    if (!agent) {
      return res.status(400).json({ error: "بيانات الكفيل هذه غير موجوده" });
    }
    agent.isDeleted = false;
    await agent.save();
    return res.status(200).json({ message: "تم حذف الكفيل بنجاح" });
  } catch (error) {
    console.log(`error in get delete agent temporary function`);
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};



export const getTempAgents = async (req,res) =>{
  try {
      const agents  = await Agent.find({isDeleted:true}).sort({createdAt:-1})
      return res.status(200).json(agents)
  } catch (error) {
      
  }
}