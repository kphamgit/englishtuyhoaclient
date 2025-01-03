import React, { useState } from 'react';
import { uploadFile } from '../services/list';

interface FormDataProps {
  file: File | null;
  s3_file_path: string;
}

const FileUpload: React.FC = () => {
  const [formData, setFormData] = useState<FormDataProps>({
    file: null,
    s3_file_path: '',
  });

  const [s3FilePath, setS3FilePath] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.file) {
        //console.log("XMMMMMMM formData file", formData.file)
      const newFormData = new FormData();
      // s3_file_path has to be appended BEFORE 'file', or else it won't work. kpham Jan, 3, 2025
      newFormData.append('s3_file_path', s3FilePath);
      newFormData.append('file', formData.file);
    
    uploadFile(newFormData)
    .then(response => {
        console.log(" response....")
    })
    
    
    }
  };

  return (
    <div className='mx-3 mt-3 grid grid-rows-3 bg-bgColor1 text-textColor1'>
    <div className='mx-3 mt-3 grid grid-rows-3 bg-bgColor1 text-textColor1'>
    <span className='m-1 p-1 bg-bgColor1 text-textColor1'>Path should not contain final slash "/"</span>
    <span className='m-1 p-1 bg-bgColor1 text-textColor1'>Don't specify file name. Will use name of file uploaded</span>
    <span className='m-1 p-1 bg-bgColor1 text-textColor1'>Example:  audios/reading/razkids,  images/reading/razkids</span>
   
    </div>
    <form onSubmit={handleSubmit}>
      <div className='m-3 p-2 bg-bgColor1 text-textColor2 '>Enter s3 file path:
        <input className='bg-bgColor1 text-textColor1 px-2 text-sm rounded-md w-4/12' type="text" value={s3FilePath}
        onChange={e => setS3FilePath(e.target.value)}
        />
      </div>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
   
    </div>
  );
};

export default FileUpload;

/*
 return (
    <form onSubmit={handleSubmit}>
        <div className='m-3 p-2 bg-bgColor3 text-textColor2 '>Enter s3 file path:<input className='bg-bgColor1 text-textColor1 px-2 text-sm rounded-md w-4/12' type="text" value={s3FilePath}
        onChange={e => setS3FilePath(e.target.value)}
                            /></div>
      <input type="file" onChange={handleFileChange} />
      <input type="text" value={formData.otherData} onChange={handleInputChange} />
      <button type="submit">Upload</button>
    </form>
  );
*/