import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';

import { getUnitContentSurveyDetail } from '../../duck/network';
import { setSurveyForm, setSelectedQuestionnaire } from '../../duck/unitContentSlice';
import SurveysCreate from '../SurveysCreate';

export default function SurveysUpdate() {
	const params = useParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	const unitContentSurveyDetail = useSelector((state)=>state.unitContent.unitContentSurveyDetails)
	const loading = useSelector((state) => state.unitContent.unitContentDetailsLoading);
  const surveyForm = useSelector((state) => state.unitContent.surveyForm);

	useEffect(() => {
		dispatch(getUnitContentSurveyDetail(params.id || unitContent.id)).then((res)=>{
			res?.data?.sections.forEach((section,index)=>{
				if(surveyForm?.hiddenProperty == false) dispatch(setSelectedQuestionnaire({finalData:section?.questionnaire, sectionIndex:index}));
			})
      
      if(Object.keys(surveyForm).length > 0 && surveyForm?.hiddenProperty == false) dispatch(setSurveyForm({title:res.data.title, sections:res.data.sections,  contentFor:res.data.contentFor}))
    })
	}, []);

	return <>{!loading ? <SurveysCreate type="update" defaultValues={unitContentSurveyDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}</>;
}
