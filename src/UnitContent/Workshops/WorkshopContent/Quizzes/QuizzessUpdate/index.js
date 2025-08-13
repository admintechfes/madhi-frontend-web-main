import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import QuizzesCreate from '../QuizzesCreate';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkshopContentQuizDetail } from '../../../duck/network';
import { CircularProgress } from '@mui/material';
import { setQuizForm, setSelectedQuestionnaire } from '../../../duck/workshopContentSlice';

export default function QuizzesUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const workshopContent = location?.state?.workshopContent;

	const workshopContentQuizDetail = useSelector((state)=>state.workshopContent.workshopContentQuizDetails)
	const loading = useSelector((state) => state.workshopContent.workshopContentDetailsLoading);
	const quizForm = useSelector((state)=>state.workshopContent.quizForm)

	useEffect(() => {
		dispatch(getWorkshopContentQuizDetail(params.id || workshopContent.id)).then((res)=>{
      res?.data?.sections.forEach((section,index)=>{
				if(quizForm?.hiddenProperty == false) dispatch(setSelectedQuestionnaire({finalData:section?.questionnaire, sectionIndex:index}));
			})
			if(Object.keys(quizForm).length > 0 && quizForm?.hiddenProperty == false) dispatch(setQuizForm({title:res.data.title, contentFor: res.data.contentFor, sections:res.data.sections}))
    })
	}, []);

	return <>{!loading ? <QuizzesCreate type="update" defaultValues={workshopContentQuizDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
