import React from 'react'
import Skeleton from '@mui/material/Skeleton';

export default function highlightsSkeleton() {
  return (
    <div className="overflow-x-auto whitespace-no-wrap">
    <div className='flex mt-2 mb-2'> 
      <div className='flex-col ml-2 mr-2 items-center justify-center'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
      <div className='flex-col ml-2 mr-2'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
      <div className='flex-col ml-2 mr-2'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
      <div className='flex-col ml-2 mr-2'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
      <div className='flex-col ml-2 mr-2'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
      <div className='flex-col ml-2 mr-2'>
        <Skeleton variant='circular' width={70} height={70} />
        <Skeleton variant='text' width={70} sx={{fontSize:14}} />
      </div>
    </div>
    </div>
  )
}
