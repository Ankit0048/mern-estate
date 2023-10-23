import React from 'react'

export default function CreateListing() {
  return (
    <main className='p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col justify-evenly sm:flex-row gap-4'> 
            <div className='flex flex-col gap-4 flex-1'>
                <input id='Name' maxLength='62' required minLength='10' type='text' placeholder='Name' className='border p-3 rounded-lg'/>
                <textarea id='description' type='text' placeholder='description' className='border p-3 rounded-lg' required/>
                <input id='Address' maxLength='62' required minLength='10' type='text' placeholder='Address' className='border p-3 rounded-lg'/>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span>
                        
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-5'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border-gray-300 rounded-lg'/>
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' required className='p-3 border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountedPrice'required className='p-3 border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1'>
                <p className='font-semibold'>Images: 
                <span className='font-Normal text-gray-600 ml-2'>
                    The first image will be the cover (max 6)
                </span>
                </p>
                <div className='flex gap-4 justify-between'>
                    <input type='file' id='images' className='p-3 border border-gray-300 rounded w-full' accept='image/*' multiple/>
                    <button className='p-3 text-greeen-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button>
                </div>
            <button className='my-6 p-3 bg-slate-700 text-white rounded-lg uppercase hover:placeholder-opacity-95 disabled:opacity-95'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
