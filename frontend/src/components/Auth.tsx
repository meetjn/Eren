import { ChangeEvent, useState } from "react";
import { Link, Navigate, useNavigate }  from "react-router-dom"
import { SignupInput } from "@meetjain/eren-commons";
import { Signin } from "../pages/Signin";
import axios, { Axios } from "axios";
import { BACKEND_URL } from "../config";
export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password: ""
});

    async function sendRequest(){
       try{
        const reponse = await axios.post(`${BACKEND_URL}/api/v1/user/signup`);   // if the request fails, the catch block will be executed
        const jwt = reponse.data;
        localStorage.setItem("token", jwt);
        navigate("/blogs");
       } catch(e) {
            
       }
    }


    return <div className="h-screen flex justify-center flex-col"> 
    <div className="flex justify-center">
        <div>
        <div className="px-10">
            <div className="text-3xl font-extrabold">
                Create an account
            </div>
            <div className="text-slate-500">
               {type === "signin" ? "Don't have an account": "Already have an account?"  }
                <Link className="pl-2 underline" to={type ==="signin" ? "/signup" : "/signin"}> {type === "signin" ? "Signup" : "Sign in"} </Link> 
            </div>
        </div>
        <div className="pt-8">
        {type === "signup" ? <LabelledInput label = "Name" placeholder = "Name" onChange = {(e) => {
            setPostInputs(c => ({
                ...postInputs,  // ... spread operator lets you take the existing object and add new properties in a new object
                name: e.target.value
            }))
        }}/> : null}

        <LabelledInput label = "Username" type= {"Username"} placeholder = "john@gmail.com" onChange = {(e) => {
            setPostInputs(c => ({
                ...postInputs,  // ... spread operator lets you take the existing object and add new properties in a new object
                name: e.target.value
            }))
        }}/>
        <LabelledInput label = "Password" type= {"password"} placeholder = "123456" onChange = {(e) => {
            setPostInputs(c => ({
                ...postInputs,  // ... spread operator lets you take the existing object and add new properties in a new object
                name: e.target.value
            }))
        }}/>
        <button type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"} </button>
        </div>
    </div>
    </div>
    </div>
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}


function LabelledInput({ label, placeholder, onChange, type}: LabelledInputType){
    return  <div>
    <label className="block mb-2 text-sm text-gray-900 dark:text-dark font-semibold pt-4 ">{label}</label>
    <input onChange = {onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder= {placeholder} required />
</div>
}