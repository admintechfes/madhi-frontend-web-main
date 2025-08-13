import React, { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WorkshopCreate from '../WorkshopCreate';

export default function WorkshopUpdate() {
	const params = useParams();
	const location = useLocation();

	const unit = location?.state?.unit;
	const unitContent = location?.state?.unitContent;

	return (
		<>
			<WorkshopCreate type="update" defaultValues={unitContent} />
		</>
	);
}
