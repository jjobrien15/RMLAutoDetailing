import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useGetUserID } from "../hooks/useGetUserID"
import axios from "axios"
import { useCookies } from "react-cookie"
import FormInput from "../components/FormInput"
import "../stylesheets/formPageStyles.scss"


const userProfile = () => {
    const [cookies, setCookie, removeCookie] = useCookies(["access_token"])
    const [userInfo, setUserInfo] = useState({})
    const [formValues, setFormValues] = useState({
        fname: "",
        lname: "",
        email: "",
    })
    
    const userID = useGetUserID();

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

     //Handle request to update user
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_BASE_URI}/auth/register`, { ...formValues });
            alert("Registration successful! Please login.");
        } catch (err){
            console.log(err);ß
        }

    }

    useEffect(() => {
        const fetchUser = async () => {
            if (userID) {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URI}/auth/profile/${userID}`,
                    {
                        method: "GET",
                        headers: {
                            auth: cookies.access_token
                        }
                    });
                const data = await response.json();
                setUserInfo(data);
            } else {
                return useNavigate("/login");
            }
        }
        fetchUser();
    }, [userID])

    const inputs = [
        {
            name: "fname",
            type: "text",
            placeholder: userInfo.fname,
            label: "First Name:",
            required: true,
            errormessage: "Please enter your first name..."
        },
        {
            name: "lname",
            type: "text",
            placeholder: userInfo.lname,
            label: "Last Name:",
            required: true,
            errormessage: "Please enter your last name..."
        },
        {
            name: "email",
            type: "email",
            placeholder: userInfo.email,
            label: "Email:",
            pattern: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
            required: true,
            errormessage: "Please enter valid email address...",
        },
    ]
    
    

    return (
        <div className="edit-profile formPageContent">
            <h1>Edit Profile</h1>
            <form onSubmit={onSubmit}>
                {inputs.map((input, key) => (
                    <FormInput {...input} key={key} value={formValues[input.name]} onChange={handleChange}/>
                ))}
                    <div className='formGroup'>
                    <button type="submit" className='submitBtn'>Save Changes</button>
            </div>
            </form>
        </div>
    )
}

export default userProfile