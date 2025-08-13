import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getParentsDetails } from './duck/network';
import CreateParent from './createparent';

const UpdateParent = () => {
  const [loader, setLoader] = useState(true)
  const parentDetails = useSelector((state) => state.parents.parentdetails);
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getParentsDetails(params)).then((resp) => {
      setLoader(false)
  })
  }, [params]);

  return (
    <>
      {loader ? (
        <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
          <CircularProgress />
        </div>
      ) : <CreateParent formType="edit" defaultValues={parentDetails} />}
    </>
  );
};

export default UpdateParent;
