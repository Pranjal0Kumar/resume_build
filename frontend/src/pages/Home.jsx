import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';
import CursorFollower from '../components/CursorFollower/CursorFollower.jsx';
import Dropzone from '../components/Dropzone/Dropzone.jsx';
import axios from 'axios';
import Home_resume from './Home_resume.jsx';

const Home = () => {
    const navigate = useNavigate();

    const [resumeFile, setResumeFile] = useState(null);
    const [jdFile, setJdFile] = useState(null);

    const handleFileSelect = (type, file) =>{
        if(type === "resume"){
            setResumeFile(file);
        }
        else if(type === "jd"){
            setJdFile(file);
        }
    }

    const handleUpload = () => {

        if (!resumeFile || !jdFile) {
            alert("Upload both files first.");
            return;
        }


        const formData = new FormData();
        formData.append("resume", resumeFile); // resumeFile = selected resume
        formData.append("jd", jdFile);         // jdFile = selected job description

        const res = axios.post('http://127.0.0.1:5000/api/score', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
        })
        .then(res => console.log(res.data))
        .catch(err => console.error(err));

        navigate("/score");
};



    return(
        <>
        <CursorFollower />
            <nav>
                <div id="nav-div">
                    <a href="">Home</a>
                    <a href="">ATS Score</a>
                    <a href="">Resume</a>
                    <a href="">About</a>
                </div>
            </nav>

           <div id="hero-section">
                <div id="hero-text">
                    <h1>Land More Interviews with <br/>a Winning Resume</h1>
                    <h3>Upload your resume and get instant feedback with our AI-powered ATS analyzer.</h3>
                    <button id="get-started-btn">Get Started</button>
                </div>
                <div id="dragDropMenu">
                    <Dropzone label={'Upload Resume'} name={'resume'} onFileSelect={handleFileSelect} />
                    <Dropzone label={'Upload Job-Description'} name={'jd'} onFileSelect={handleFileSelect}/>
                    <button id="submit-btn" onClick={handleUpload}>Submit</button>
                </div>
           </div>
            <Home_resume/>
        </>
    )
}

export default Home