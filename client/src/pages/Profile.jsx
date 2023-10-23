import React, {useRef, useState, useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase';
import {updateUserStart, updateUserSuccess, updateUserFailure} from '../redux/user/userSlice.js';
import {deleteUserStart, deleteUserSuccess, deleteUserFailure} from '../redux/user/userSlice.js'
import {signOutUserStart, signOutUserSuccess, signOutUserFailure} from '../redux/user/userSlice.js'
import { Link } from 'react-router-dom';


export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser, loading, error} = useSelector(state=> state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setSuccess] = useState(false);
  const dispatch= useDispatch();
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
          getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
              setFormData({...formData, avatar: downloadURL});
            }
          )
      }
    )
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, 
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      }
      );
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      else {
        dispatch(deleteUserSuccess(data));

      }

    }
    catch(err) {
        dispatch(deleteUserFailure(err.message))
    }
  }

  const onformChange = (e) => {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      })
  }

  const handleSignOut =async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return ;
      }
      dispatch(signOutUserSuccess());
    }
    catch(err) {
      dispatch(signOutUserFailure(err.message));
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setSuccess(false);
        dispatch(updateUserFailure(data.message));
        return;
      }
      else {
        setSuccess(true);
        dispatch(updateUserSuccess(data));
      }

    }
    catch(err) {
      console.log(err);
      setSuccess(false);
      dispatch(updateUserFailure(err.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Profile
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type='file' ref={fileRef} onChange={(e)=>setFile(e.target.files[0])} hidden/>
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt ="profile" className='rounded-full h-24 w-24 object-cover self-center mt-2'/>
        <p>
          {fileUploadError?
           <span className='text-red-700'>Error Upload Image must be less than 2MB</span> :
           filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
           )
           :
           filePerc == 100 ? (
            <span className='text-green-700'> Image Successfully uploaded</span>
           ): ""
          }
        </p>
        <input onChange={onformChange} type='text' defaultValue={currentUser.username} placeholder='username' id='username' className='border p-3 rounded-lg'/>
        <input onChange={onformChange} type='text' defaultValue={currentUser.email} placeholder='email' id='email' className='border p-3 rounded-lg'/>
        <input onChange={onformChange} type='password' placeholder='password' id='password' className='border p-3 rounded-lg'/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Update'}</button>
        <Link to={'/create-listing'} className='bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-600 cursor-pointer font-semibold'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 cursor-pointer font-semibold'>Sign Out</span>
      </div>
      <p className='text-green-700 font-bold my-3'>{updateSuccess?"Updated Successfully!!":''}</p>
      <p className='text-red-800'>{error?error:''}</p>
    </div>
  )
}
