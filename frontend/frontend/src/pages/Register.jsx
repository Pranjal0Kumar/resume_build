import React , {useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import CursorFollower from '../components/CursorFollower/CursorFollower.jsx'
import '../styles/Register.css'
import axios from 'axios'

const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://resume-build-1.onrender.com/auth/register',{
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        })
        .then(res => {
            console.log("Pranjal Kumar is the best!!")
            console.log(res.data)
            alert("Verify Your mail by  clicking verification link sent to your email")
            navigate('/login')
        })
    }   
    

  return (
    
    <>
    <CursorFollower/>
    <div className="login-page">
        <div className="form-container">

            <h1>Register</h1>

            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className='email-container'>
                        <input type="email" id='email' name='email' placeholder='Enter Email' />
                        <i className="fa-solid fa-envelope icon fa-lg"></i>
                    </div>

                    <div className='username-container'>
                        <input type="text" id='username' name='username' placeholder='Enter username' />
                        <i class="fa-solid fa-user" icon></i>
                    </div>

                    <div className='password-container'>
                        <input type="password" id='pass' name='password' placeholder='Enter password' />
                        <i class="fa-solid fa-unlock" icon></i>
                    </div>

                    <button type='submit'>Submit</button>
                    
                </form>
            </div>
        </div>
        <div className="image-container">
            <h1>
                Bridging connections and simplifying living with<br/> <span className='highlight'>Trust, Ease, and Innovation</span>
            </h1>
        </div>
    </div>
    </>
  )
}

export default Register