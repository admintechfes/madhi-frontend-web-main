import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { CircularProgress } from '@mui/material';

import { getUnitContentFormData } from '../../../../UnitContent/duck/network';
import SurveyQuentionnaireForm from '../surveyQuentionnaireForm';
import { getSurveyPreview } from '../duck/network';
import { hideLoader, showLoader } from '../../../../components/Loader/duck/loaderSlice';

// import logo from '../../../../public/assets/images/logo-madhi-2.png'

export default function SurveyUpdate() {
	let [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();

	const dispatch = useDispatch();

	const formData = useSelector((state) => state.survey.surveyPreview);
	const loading = useSelector((state) => state.loader.openLoader);
	let params = { programUnitContentId: searchParams.get('programUnitContentId'), parentId: searchParams.get('parentId'), villageAreaId: searchParams.get('villageAreaId'), cewId: searchParams.get('cewId'),childId:searchParams.get("childId") };

	useEffect(() => {
		dispatch(showLoader());
		dispatch(getSurveyPreview(params)).then(() => dispatch(hideLoader()));
	}, []);

	return (
		<div>
			{!loading ? (
				<SurveyQuentionnaireForm type="attempt" defaultValues={formData?.submittedForm} parentName={formData?.parentName} surveyUnit={formData?.surveyUnit} surveyTitle={formData?.surveyTitle} />
			) : (
				<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>
			)}
		</div>
	);
}
