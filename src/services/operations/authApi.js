import toast from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { endpoints } from "../apis"
import { apiConnector } from "../apiConnnector"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
  } = endpoints

export function logout(navigate){
    return (dispatch)=>{
        dispatch(setToken(null))
        dispatch(setUser(null))
        dispatch(resetCart())
        localStorage.removeItem("token");
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}
export function sendOtp(email,navigate){
    return async(dispatch)=>{
        const toastId =toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            const response =await apiConnector("POST",SENDOTP_API,{email})
            console.log("send otp response",response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Otp send successfully")
            navigate("/verify-email")
        }
        catch(err){
            console.log("send otp api error",err)
            toast.error("Could Not send Otp")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
export function login(email,password,navigate){
   return async(dispatch)=>{
    const toastId =toast.loading("Loading...")
        dispatch(setLoading(true))
        try{
            
            const response = await apiConnector("POST",LOGIN_API,{email,password})
            console.log("Login api response",response)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Login successfull")
            dispatch(setToken(response.data.token))
            localStorage.setItem("token",JSON.stringify(response.data.token))
            const userImage = response?.data?.user?.image ? response.data.user.image:
            `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
            dispatch(setUser({...response.data.user,image:userImage}))
            navigate("/dashboard/my-profile")

        }
        catch(err){
            toast.error("Login failed")
            console.log("login api error",err)
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
   }
}
export function getResetPasswordToken(email,setEmailSent){
   return async (dispatch)=>{
    const toastId= toast.loading("Loading....")
    dispatch(setLoading(true))
    try{
        const response = await  apiConnector("POST",RESETPASSTOKEN_API,{email})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Reset mail send")
        setEmailSent(true)
    }
    catch(err){
        console.error("Error in Reset password token api",err);
        toast.error("failed to send reset mail")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
   }
}
export function resetPassword(password,confirmPassword,token,navigate){
    return async(dispatch)=>{
        const toastId =toast.loading("Loading")
        dispatch(setLoading(true))
    try{
        const response =await apiConnector("POST",RESETPASSWORD_API,{password,confirmPassword,token})
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Password Changed Successfully")
        navigate("/login")
    }
    catch(err){
        toast.error("failed to reset password")
        console.log("reset password api error",err)
        
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
    }
}
export function signup(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
    return async(dispatch)=>{
        const toastId =toast.loading("Loading")
        dispatch(setLoading(true))
        try{
            const response =await apiConnector("POST",SIGNUP_API,{
                accountType,firstName,lastName,email,password,confirmPassword,otp
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("SignUp successfull ")
            navigate("/login")
        }
        catch(err){
            console.log("error in signUp API....",err)
            toast.error("Signup failed")
            navigate("/signup")

        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}