import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import axios from "axios"
import '../styles/login.css'

export default function Signin() {
    const history = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    async function submit(e) {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.backend}/signin`,
                { email, password },
                // { withCredentials: true }
            );
            if(res.data.status === true){
                if(res.data.role === "admin"){
                    history("/admin", { state: { signedUser: email } })
                }
                else{
                    history("/employee", { state: { signedUser: email } })
                }
            }             
            else {
                alert("No such user Exist")
            }

        }
        catch (e) {
            console.log(e);
        }
    }
    
    return (
        <>
            <div className="card">
                <div className="brand">
                    <div className="brand-mark"><span>A</span></div>
                    <span className="brand-name">Aaditya's Corp</span>
                </div>

                <h1 className="form-title">Sign in</h1>
                <p className="form-sub">Enter your credentials to continue</p>

                <div className="field">
                    <label>Email address</label>
                    <input type="email" id="email" placeholder="you@company.com"  onChange={(e) => {setEmail(e.target.value)}} />
                </div>

                <div className="field">
                    <label >Password</label>
                    <input type="password" id="pass"   onChange={(e) => {setPassword(e.target.value)}} />
                </div>

                <button className="submit-btn" onClick={submit}>Sign in</button>

                
            </div>

        </>
    )
}
