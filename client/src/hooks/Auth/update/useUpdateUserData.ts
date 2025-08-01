import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UpdateUserDataResponse {
  success: boolean;
  message?: string;
  error?: string;
}

const useUpdateUserData = () => {
  const navigate  = useNavigate()
  const updateUserData = async (formData: FormData): Promise<UpdateUserDataResponse> => {
    let currentUserToken = "";
    const data = localStorage.getItem("user") || "";
    
    if (JSON.parse(data)?.token) {
      currentUserToken = JSON.parse(data)?.token;
    }

    try {
      // await axios.patch("https://children-khaki.vercel.app/user/update", formData, {
      console.log(formData)
      await axios.patch("/user/testupdate", formData, {
        headers: {
          "Authorization": `Bearer ${currentUserToken}`,
          "Content-Type": "multipart/form-data"
        }
      }).then((res) => {
        // Parse the current user data from localStorage
        let userObj;
        try {
          userObj = data ? JSON.parse(data) : {};
        } catch {
          userObj = {};
        }
        // Update incomeSources with the new value from the response
        
        userObj.incomeSources = res.data.data.incomeSources;
        userObj.hasAFamily = true
        localStorage.setItem("user", JSON.stringify(userObj));
        setTimeout(() => {
          navigate("/")
        }, 300);
      });

      return { success: true, message: "تم تسجيل  البيانات بنجاح" };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "حدث خطأ ما";
      return { error: errorMessage, success: false };
    }
  };

  return { updateUserData };
};

export default useUpdateUserData;