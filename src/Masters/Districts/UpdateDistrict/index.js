import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getDistrictDetails } from '../duck/network';
import { CircularProgress } from '@mui/material';
import CreateDistrict from '../CreateDistrict';

export default function UpdateDistrict() {
    const [loader, setLoader] = useState(true)
    //   const loader = useSelector((state) => state.district.loading);
    const districtDetails = useSelector((state) => state.district.districtDetails);
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getDistrictDetails({ id: params.id })).then((resp) => {
            setLoader(false)
        })
    }, [params.id]);

    return (
        <>
            {loader ? (
                <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
                    <CircularProgress />
                </div>
            ) : <CreateDistrict formType="edit" districtDetails={districtDetails} />}
        </>
    );
}
