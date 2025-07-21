
import Agent from "../models/agent.model.js";

export const createAgent = async (req, res) => {
  const { fullName, phone, cardNumber, managerName, managerPhone, birthDate } =
    req.body;
  console.log(req.body);
  try {
    if (
      !fullName ||
      !phone ||
      !cardNumber ||
      !birthDate ||
      !managerName ||
      !managerPhone
    ) {
      return res
        .status(400)
        .json({
          error: "برجاء ملئ جميع الحقول المطلوبة بما فيها تاريخ الميلاد للكفيل",
        });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return res
        .status(400)
        .json({
          error: "صيغة تاريخ الميلاد للكفيل غير صحيحة. يجب أن تكون yyyy-mm-dd",
        });
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
        const agents  = await Agent.find({}).sort({createdAt:-1})
        return res.status(200).json(agents)
    } catch (error) {
        
    }
 }
 export const getAgent = async (req,res) =>{
    try {
        const {cardId}  = req.params
        const agent  = await Agent.findOne({cardNumber:cardId})
        if(!agent){
            return res.status(400).json({error:"بيانات الوكيل غير موجوده"})
        }
        return res.status(200).json(agent)
    } catch (error) {
        
    }
 }
 
export const updateAgent = async (req, res) => {
  const { cardNumber: cardId } = req.params;
  const {
    fullName,
    phone,
    cardNumber,
    managerPhone,
    managerName,
    birthDate,
    status,
  } = req.body;

  try {
    if (
      !fullName ||
      !phone ||
      !cardNumber ||
      !managerPhone ||
      !managerName ||
      !birthDate
    ) {
      return res
        .status(400)
        .json({
          error: "برجاء ملئ جميع الحقول المطلوبة بما فيها تاريخ الميلاد للكفيل",
        });
    }
    const agent = await Agent.findOne({ cardNumber: cardId });

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

    if (phone) {
      if (!/^\d{10}$/.test(phone)) {
        return res
          .status(400)
          .json({ error: "رقم الهاتف يجب أن يحتوي على 10 أرقام" });
      }
    }
    if (managerPhone) {
      if (!/^\d{10}$/.test(phone)) {
        return res
          .status(400)
          .json({ error: "رقم هاتف الوكيل يجب أن يحتوي على 10 أرقام" });
      }
      agent.managerPhone = phone;
    }
  
    if (!["accepted", "rejected", "pending"].includes(status)) {
      return res
        .status(400)
        .json({ error: "برجاء ادخال حالة التاشيره بشكل صحيح" });
    }else {
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
    const { cardId } = req.params;
    const agent = await Agent.findOne({ cardNumber: cardId });
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
