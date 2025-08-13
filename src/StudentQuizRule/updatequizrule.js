import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { getStudentQuizRuleDetails } from './duck/network';
import CreateStudentQuizRule from './createquizrule'

const UpdateStudentQuizRule = () => {
  const [loader, setLoader] = useState(true)
  const studentquizruleDetails = useSelector((state) => state.studentquizrule.studentquizruleDetails);
  const dispatch = useDispatch();
  const location = useLocation();
  const { id } = location.state || {};

  useEffect(() => {
    dispatch(getStudentQuizRuleDetails(id)).then((resp) => {
      setLoader(false)
    })
  }, [id]);


  return (
    <>
      {loader ? (
        <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
          <CircularProgress />
        </div>
      ) : <CreateStudentQuizRule formType="edit" defaultValues={studentquizruleDetails} />}
    </>
  );
};

export default UpdateStudentQuizRule;
