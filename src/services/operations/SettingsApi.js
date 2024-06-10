import toast from "react-hot-toast";
import { settingsEndpoints } from "../apis";
import { apiConnector } from "../apiConnnector";
import { setUser } from "../../slices/profileSlice";
import { logout } from "./authApi";


const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API,
  } =settingsEndpoints

  export  function updateDisplayPicture(token,formData){
    
    return async(dispatch)=>{
        const toastId =toast.loading("Loading...")
        try{
            const response = await apiConnector("PUT",UPDATE_DISPLAY_PICTURE_API,formData,
        {
            
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              
        })
        console.log("Update display Picture api response",response)
        
        if(!response.data.success){
            throw new Error(response.data.message)
        }
            toast.success("profile picture updated successfully")
            dispatch(setUser(response.data.data))
        }
        catch(err){
            console.error("error in update picture api",err)
            toast.error("Cannot update profile picture")
        }
        toast.dismiss(toastId)
    }
  }
  export  function deleteProfile(token,navigate){
    return async(dispatch)=>{
        const toastId=toast.loading("Loading...")
        try{
            const response =await apiConnector("DELETE",DELETE_PROFILE_API,null,{
                Authorization:`Bearer ${token}`,
            })
            console.log("delete account api response",response)
            if(!response.data.success){
                throw new Error(response.data.message);

            }
            toast.success("Account deleted successfully")
            dispatch(logout(navigate))
        }
        catch(err){
            console.error("error in delete profile api",err)
            toast.error("Cannot delete profile")
        }
        toast.dismiss(toastId)
    }
  }
  export  function updateProfile(token,formData){
    return async(dispatch)=>{
       const toastId= toast.loading("Loading...")
        try{
            const response =await apiConnector("PUT",UPDATE_PROFILE_API,formData,{
                Authorization:`Bearer ${token}`
            })
            console.log("response of the update Profile",response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            
            const userImage =response.data.updatedUserDetails.image ?response.data.updatedUserDetails.image
            :`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
            dispatch(setUser({...response.data.updatedUserDetails,image:userImage}))
            toast.success("Profile Updated Successfully")
        }catch(err){
            console.error("error in update profile api",err)
            toast.error("Cannot Update Profile")
        }
        toast.dismiss(toastId)
    }
  }
  export  async function changePassword (token,formData){
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("PUT",CHANGE_PASSWORD_API,formData,{
            Authorization:`Bearer ${token}`
        })
        console.log("change password api response",response);
    
        if(!response.data.success){
          throw new Error(response.data.message)
        }
        toast.success("password changed succcessfully")
        

    }
    catch(err){
        console.error("error in change password api",err)
        toast.error("Cannot change password")
    }
    toast.dismiss(toastId)
  }