import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getContentLibraryDetails } from './duck/network';
import CreateQuestion from './createquestion';


const UpdateQuestion = () => {
  const [loader, setLoader] = useState(true)
  const contentDetails = useSelector((state) => state.contentlibrary.contentdetails);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getContentLibraryDetails(params)).then((resp) => {
      setLoader(false)
  })
  }, [params]);


  return (
    <>
      {loader ? (
        <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
          <CircularProgress />
        </div>
      ) : <CreateQuestion formType="edit" defaultValues={contentDetails} />}
    </>
  );
};

export default UpdateQuestion;
