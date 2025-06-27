import React from "react";
import { useCallback } from "react";
import './Dropzone.css';
import {useDropzone} from "react-dropzone";

const Dropzone = ({label, name, onFileSelect}) => {

    const onDrop = useCallback(acceptedFiles => {
        onFileSelect(name ,acceptedFiles[0]);
    },[name, onFileSelect]);

    
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({onDrop})

    return (
        <div className="Dropzone-div" {...getRootProps()}>
            <input {...getInputProps()} name={name} />
            {acceptedFiles.length > 0 ? (
                <p className="file-name">{acceptedFiles[0].name}</p>
                ) : (
                <h2>{label}</h2>
            )}
        </div>
    )
}

export default Dropzone;