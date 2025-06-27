import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ScoreGauge from '../components/Scoreguage/Scoreguage';
import axios from 'axios';
import CursorFollower from '../components/CursorFollower/CursorFollower';
import '../styles/Score.css';


const Score = () => {
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const navigate = useNavigate();

  const handleAnalysis = async (e) => {
    e.preventDefault();
    setStatus("Analyzing");
    try{
       const response = await axios.get('https://resume-build-1.onrender.com/api/analyse')
       setAnalysis(response.data);
       setStatus("Analyzed");
    }catch(err){
      console.error(err);
      setStatus("Error in analysis");
    }
    
  }

  const create_resume = (e) =>{

    e.preventDefault();
    //axios.get('https://resume-build-1.onrender.com0/api/create-resume')
    navigate('/create-resume')
  }

  useEffect(() => {
    axios.get('https://resume-build-1.onrender.com/api/score')
    .then(res => {setScore(res.data)})
    .catch(err => console.error(err));
  },[])
  return (
    <>
      <CursorFollower />

      <div id="score-page">
        <div id="score-section">

        <h1>Your ATS Score</h1>
        <p>Your ATS score is a measure of how well your resume matches the job description.</p>
        <ScoreGauge score={score} />
        <h2>{score ? score : "Loading..."}</h2>

      </div>
      <div id={status === null ? 'analyse-section' : 'analyse-section-non_center'}>

        {status === null && (
          <>
            <h1>Want a deep analysis of your resume ?</h1>
            <p>This helps increase the selection probability of your resume</p>
            <button id='analyse-btn' onClick={handleAnalysis}>Analyse</button>
          </>
        )}

         {status === "Analyzing" && (
          <div className="analysing-text">
            <h2>Analyzing<span className="dotAnim"></span></h2>
          </div>
        )}

        {status === "Analyzed" && (
          <div className="analysis-result">
            <h2>Strengths: </h2>
            <ul>
              {analysis.strengths.map((point, i)=>(
                <li key={i}>✅ {point}</li>
              ))}
            </ul>

            <h2>Weaknesses: </h2>
            <ul>
              {analysis.weaknesses.map((point, i)=>(
                <li key={i}>❌ {point}</li>
              ))}
            </ul>

            <h2>Missing Sections: </h2>
            <ul>
              {analysis.missing_sections.map((point,i)=>(
                <li key={i}>🚧 {point}</li>
              ))}
            </ul>

            <h2>Wording Suggestions: </h2>
            <ul>
              {analysis.wording_suggestions.map((point, i)=>(
                <li key={i}>🧠 {point}</li>
              ))}
            </ul>
            <div id="optional-btn">
              <button id='create' onClick={create_resume}>Create resume</button>
              <button id='reanalyse' onClick={handleAnalysis}>Re-Analyse</button>
            </div>
            
            
          </div>
        )}

        {status === "Error in analysis" && (
          <div className="error-text">
            <p>Something went wrong during analysis.</p>
          </div>
        )}


      </div>
      </div>
      
    </>
  )
}

export default Score
