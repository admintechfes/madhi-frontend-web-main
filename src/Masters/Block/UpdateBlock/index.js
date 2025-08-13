import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getBlockDetails } from '../duck/network';
import CreateBlock from '../CreateBlock';


export default function UpdateBlock() {
    const [loader,setLoader]=useState(true)
//   const loader = useSelector((state) => state.district.loading);
  const blockDetails = useSelector((state) => state.block.blockDetails);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getBlockDetails({id:params.id})).then((resp)=>{
setLoader(false)
      })
  }, [params.id]);

  return (
      <>
          {loader ? (
              <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
                  <CircularProgress />
              </div>
          ) : <CreateBlock formType="edit" blockDetails={blockDetails} />}
      </>
  );
}
