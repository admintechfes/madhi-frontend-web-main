import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {  getPanchayatDetails } from '../duck/network';
import { CircularProgress } from '@mui/material';
import CreatePanchayat from '../CreatePanchayat';


export default function UpdatePanchayat() {
    const [loader,setLoader]=useState(true)
//   const loader = useSelector((state) => state.district.loading);
  const panchayatDetails = useSelector((state) => state.panchayat.panchayatDetails);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(getPanchayatDetails({id:params.id})).then((resp)=>{

setLoader(false)
      })
  }, [params.id]);

  return (
      <>
          {loader ? (
              <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
                  <CircularProgress />
              </div>
          ) : <CreatePanchayat formType="edit" panchayatDetails={panchayatDetails} />}
      </>
  );
}
