import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUnitContentFormData } from '../../duck/network';
import { CircularProgress } from '@mui/material';
import QuizForm from '../../QuizForm';

import logo from '../../../../public/assets/images/logo-madhi-2.png'

export default function QuizzesAttempt() {
	let [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
	const dispatch = useDispatch();

	const quizDetail = useSelector((state) => state.unitContent.unitContentFormData);
	const loading = useSelector((state) => state.unitContent.unitContentFormDataLoading);
	const [statusCode, setStatusCode] = useState(null)

	let params = {programUnitContentId:searchParams.get('programUnitContentId'),parentId:  searchParams.get('parentId')}
	if(searchParams.get('childId')) {
		params.childId = searchParams.get('childId')
	}

	useEffect(() => {
		dispatch(getUnitContentFormData(params)).then((res)=>setStatusCode(res?.statusCode));
	}, []);

	return (
		<div>
			<div className="tw-sticky tw-top-0 tw-left-0 tw-z-10 tw-bg-white tw-w-full tw-shadow-[0px_1.42px_7.11px_0px_#0000001A] tw-py-4 ">
        <div className='tw-max-w-[1200px] tw-mx-auto md:tw-px-10'>
          <img src={logo} />
        </div>
      </div>
			<div className="tw-max-w-[1200px] tw-p-4 tw-mb-[20px] md:tw-my-0 md:tw-p-10 tw-mx-auto tw-min-h-[calc(100vh_-_150px)] md:tw-min-h-[calc(100vh_-_130px)]">
				{!loading ? <QuizForm type="attempt" statusCode={statusCode} defaultValues={quizDetail} /> : <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">{<CircularProgress />}</div>}
			</div>
			<div className="tw-absolute tw-bg-primary tw-w-full tw-shadow-[0px_1.42px_7.11px_0px_#0000001A] tw-py-4 ">
        <div className='tw-max-w-[1200px] tw-mx-auto md:tw-px-10'>
          <p className='tw-text-center tw-text-sm tw-px-2'>Copyright © 2024 Madhi Foundation. All Rights Reserved.</p>
        </div>
      </div>
		</div>
	);
}
