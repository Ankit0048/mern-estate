import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import React, { useState, useEffect } from 'react'
import { app } from '../firebase';
import {useSelector} from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateListing() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const params = useParams();
  const [imageUploadError, setImageUploadError] =  useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorSubmit, setErrorSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const {currentUser} = useSelector(state => state.user)
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    address: "",
    description: "",
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  })

  useEffect (() => {
    const fetchListing = async() => {
        setErrorSubmit(false);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`)
        const data = await res.json();
        if (data.success == false) {
            setErrorSubmit(data.message);
            return;
        }
        setFormData(data);
        console.log(data);
    }

    fetchListing();
  }, []);

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
        setFormData({
            ...formData,
            type: e.target.id,
        })
    }
    else if(e.target.id ==='parking' || e.target.id ==='furnished' || e.target.id ==='offer') {
        setFormData({
            ...formData,
            [e.target.id]: e.target.checked,

        })
    }
    else if(e.target.type === 'number'){
        setFormData({
            ...formData,
            [e.target.id]: parseInt(e.target.value),
        })
    }
    else {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }
  }

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length < 7) {
        const promises = [];
        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            promises.push(storeImage(files[i]));
        }

        Promise.all(promises).then((urls) => {
            setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
            setImageUploadError(false);
            setUploading(false);
        }).catch((err)=>{
            setUploading(false);
            setImageUploadError("Image upload failed 2MB max per image");
        });
    }
    else {
        setUploading(false);
        setImageUploadError("Number of files must be less than 7")
    }
  }

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on("state_changed",
            (snapshot)=> {
                const progress = (snapshot.bytesTransferred/ snapshot.totalBytes)*100;
            },
            (error) => {
                reject(error);
            },
            ()=> {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
  }

  const handleRemoveImage = (index) => {
    setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (formData.imageUrls.length < 1) return setErrorSubmit('You must Upload at least 1 image');
        if (formData.regularPrice < formData.discountPrice) return setErrorSubmit('Discount price must be lower than regular Price')
        setLoading(true);
        setErrorSubmit(false);
        const bodyString = JSON.stringify({
            ...formData, 
            userRef: currentUser._id,
        });

        const res = await fetch(`/api/listing/update/${formData._id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyString
        });
        const data = await res.json();
        setLoading(false);
        if (data.success === false) {
            setErrorSubmit(data.message);
        }
        navigate(`/listing/${data._id}`)
    }
    catch(err) {
        setLoading(false);
        setErrorSubmit(err.message);
    }
  }

  console.log(formData.offer);
  return (
    <main className='p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Update Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col justify-evenly sm:flex-row gap-4'> 
            <div className='flex flex-col gap-4 flex-1'>
                <input id='name' onChange={handleChange} value={formData.name} maxLength='62' required minLength='10' type='text' placeholder='Name' className='border p-3 rounded-lg'/>
                <textarea onChange={handleChange} value={formData.description} id='description' type='text' placeholder='description' className='border p-3 rounded-lg' required/>
                <input id='address' onChange={handleChange} value={formData.address} maxLength='62' required minLength='10' type='text' placeholder='Address' className='border p-3 rounded-lg'/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'}/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={formData.type==='rent'} id='rent' className='w-5 rounded' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking}/>
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={formData.furnished} id='furnished' className='w-5' />
                        <span>Furnished</span>
                        
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' onChange={handleChange} checked={formData.offer} id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-5'>
                    <div className='flex items-center gap-2'>
                        <input type='number' value={formData.bedrooms} onChange={handleChange} id='bedrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input onChange={handleChange} value={formData.bathrooms} type='number' id='bathrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input min={0} max={1000000000}type='number' onChange={handleChange} value={formData.regularPrice} id='regularPrice' required className='p-3 border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                    {formData.offer && 
                        (<div className='flex items-center gap-2'>
                        <input type='number' min={0} onChange={handleChange} value={formData.discountPrice} id='discountPrice'required className='p-3 border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                        </div>)
                    }
                </div>
            </div>
            <div className='flex flex-col flex-1'>
                <p className='font-semibold'>Images: 
                <span className='font-Normal text-gray-600 ml-2'>
                    The first image will be the cover (max 6)
                </span>
                </p>
                <div className='flex gap-4 justify-between'>
                    <input onChange={(e)=>setFiles(e.target.files)} type='file' id='images' className='p-3 border border-gray-300 rounded w-full' accept='image/*' multiple/>
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-greeen-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading?"Uploading...":"Upload"}</button>
                </div>
            <p className='text-red-600'>{(imageUploadError && imageUploadError)}</p>
            {
                formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) => (
                    <div key={url} className='flex justify-between p-3 border items-center border-slate-300 gap-3'>
                        <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg'/>
                        <button type='button' onClick={() => handleRemoveImage(index)} className='bg-red-700 rounded uppercase p-2 text-white'>Delete</button>
                    </div>
                ))
            }
            <p className='text-red-600'>{(errorSubmit && errorSubmit)}</p>
            <button disabled={uploading || loading} className='my-6 p-3 bg-slate-700 text-white rounded-lg uppercase hover:placeholder-opacity-95 disabled:opacity-95'>{loading?"Updating..": "Update Listing"}</button>
            </div>
        </form>
    </main>
  )
}
