import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import '../styles/Resume.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CursorFollower from '../components/CursorFollower/CursorFollower';

const Resume = () => {
  const iframeRef = useRef(null);
  const [resumeCode, setResumeCode] = useState(null);
  const [codeStatus, setCodeStatus] = useState('pending');

  const download = async (e) => {
  e.preventDefault();

  const iframe = document.querySelector('iframe');
  if (!iframe) {
    alert('Iframe not found');
    return;
  }

  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  if (!iframeDoc || !iframeDoc.body) {
    alert('Iframe content not accessible yet');
    return;
  }

  const resumeElement = iframeDoc.body;

  // Wait a moment to ensure styles render
  await new Promise(resolve => setTimeout(resolve, 500));

  html2canvas(resumeElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY,
    windowWidth: resumeElement.scrollWidth,
    windowHeight: resumeElement.scrollHeight,
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('resume.pdf');
  }).catch(err => {
    console.error("Error generating PDF:", err);
  });
};


  useEffect(() => {
    setCodeStatus('pending');
    axios
      .get('http://127.0.0.1:5000/api/create-resume',{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then((res) => {
        setResumeCode(res.data);
        setCodeStatus('done');
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Unknown Error Please Login Again";
        alert(msg);
        window.location.href = '/login';
      });
  }, []);

  useEffect(() => {
    if (resumeCode && iframeRef.current) {
      const doc = iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(resumeCode); // Ensure your resumeCode contains full HTML structure
      doc.close();
    }
  }, [resumeCode]);

  return (
    <>
      <CursorFollower />
      <div id={codeStatus === 'pending' ? 'pending' : 'done'}>
        {codeStatus === 'pending' ? (
          <>
            <h1>Loading your resume</h1>
            <h3>Please Wait<span className="dotAnim"></span></h3>
          </>
        ) : (
          <>
            <h2>Review the resume</h2>
            <iframe ref={iframeRef} title="resume-preview" />
            <div id="resume-buttons">
              <button id="recreate-btn">Recreate</button>
              <button id="download-btn" onClick={download}>Download</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Resume;
