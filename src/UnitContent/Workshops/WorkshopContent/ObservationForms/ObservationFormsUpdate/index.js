import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getWorkshopContentObservationFormsDetail } from '../../../duck/network';
import { CircularProgress } from '@mui/material';
import { setQuizForm, setSelectedQuestionnaire } from '../../../duck/workshopContentSlice';
import ObservationFormsCreate from '../ObservationFormsCreate';

export default function ObservationFormsUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const workshopContent = location?.state?.workshopContent;

	const workshopContentQuizDetail = useSelector((state)=>state.workshopContent.workshopContentQuizDetails)
	const loading = useSelector((state) => state.workshopContent.workshopContentDetailsLoading);
	const quizForm = useSelector((state)=>state.workshopContent.quizForm)

	useEffect(() => {
		dispatch(getWorkshopContentObservationFormsDetail(params.id || workshopContent.id)).then((res)=>{
      res?.data?.sections.forEach((section,index)=>{
				if(quizForm?.hiddenProperty == false) dispatch(setSelectedQuestionnaire({finalData:section?.questionnaire, sectionIndex:index}));
			})
			if(Object.keys(quizForm).length > 0 && quizForm?.hiddenProperty == false) dispatch(setQuizForm({title:res.data.title, contentFor: res.data.contentFor, sections:res.data.sections}))
    })
	}, []);

	return <>{!loading ? <ObservationFormsCreate type="update" defaultValues={workshopContentQuizDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
