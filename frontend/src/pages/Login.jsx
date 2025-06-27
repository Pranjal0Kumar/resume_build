import React from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CursorFollower from '../components/CursorFollower/CursorFollower.jsx'
import '../styles/Login.css'

const Login = () => {
    const navigate = useNavigate();

        const handleSubmit = (e) => {
            e.preventDefault();
            axios.post('https://resume-build-1.onrender.com/auth/login',{
                username: e.target.username.value,
                password: e.target.password.value,
            })
            .then(res => {
                localStorage.setItem('token', res.data.token);
                navigate('/home')
            })
        }   
    
  return (
    
    <>
    <CursorFollower/>
    <div className="login-page">
        <div className="form-container">

            <h1>Login</h1>

            <div className="form">
                <form action="" onSubmit={handleSubmit} method='POST'>

                    <div className='username-container'>
                        <input type="text" id='username' name='username' placeholder='Enter username' />
                        <i class="fa-solid fa-user" icon></i>
                    </div>

                    <div className='password-container'>
                        <input type="password" id='password' name='password' placeholder='Enter password' />
                        <i class="fa-solid fa-unlock" icon></i>
                    </div>

                    <button>Submit</button>
                    
                </form>
            </div>
        </div>
        <div className="image-container">
            <h1>
            Crafting effortless connections, inspired by <br/> <span className='highlight'> trust and ease.</span>
            </h1>
        </div>
    </div>
    </>
  )
}

export default Login