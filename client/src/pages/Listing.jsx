import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper'
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import { list } from 'firebase/storage';


export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState();
  const [errorListing, setErrorListing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const getListing = async () => {
        setLoading(true);
        try {
            setErrorListing(false);
            const res = await fetch(`/api/listing/get/${params.listingId}`)
            const data = await res.json();
            if (data.success === false) {
                setErrorListing(true);
                setLoading(false);
                return;
            }
            setListing(data);
            setErrorListing(false);
            setLoading(false);
        }
        catch(err) {
            setErrorListing(true);
            setLoading(false);
        }
    }

    getListing();
  }, [params.listingId])
  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {errorListing && <p className='text-red-700 text-center my-12 text-4xl font-semibold'>Something Went Wrong !!</p>}
        {listing && !loading && !errorListing && (
            <div>

            <Swiper navigation>
                {
                    listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div 
                            className='h-[550px]' style={{background: `url(${url}) center no-repeat`,
                            backgroundSize: 'cover'}}> 
                            
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            </div>
        )
        }
    </main>
  )
}
