import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuizzesCreate from '../QuizzesCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitContentQuizDetail } from '../../duck/network';
import { CircularProgress } from '@mui/material';
import { setQuizForm, setSelectedQuestionnaire } from '../../duck/unitContentSlice';

export default function QuizzesUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	const unitContentQuizDetail = useSelector((state)=>state.unitContent.unitContentQuizDetails)
	const loading = useSelector((state) => state.unitContent.unitContentDetailsLoading);
  const quizForm = useSelector((state) => state.unitContent.quizForm);

	useEffect(() => {
		dispatch(getUnitContentQuizDetail(params.id || unitContent.id)).then((res)=>{
      res?.data?.sections.forEach((section,index)=>{
				if(quizForm?.hiddenProperty == false) dispatch(setSelectedQuestionnaire({finalData:section?.questionnaire, sectionIndex:index}));
			})
      if(Object.keys(quizForm).length > 0 && quizForm?.hiddenProperty == false) dispatch(setQuizForm({title:res.data.title, sections:res.data.sections, contentFor:res.data.contentFor}))
    })
	}, []);

	return <>{!loading ? <QuizzesCreate type="update" defaultValues={unitContentQuizDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
