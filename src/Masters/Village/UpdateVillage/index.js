import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getVillageDetails } from '../duck/network';
import { CircularProgress } from '@mui/material';
import CreateVillage from '../CreateVillage';


export default function UpdateVillage() {
    const [loader, setLoader] = useState(true)
    const villageDetails = useSelector((state) => state.village.villageDetails);
    const params = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getVillageDetails({ id: params.id })).then((resp) => {
            setLoader(false)
        })
    }, [params.id]);

    return (
        <>
            {loader ? (
                <div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
                    <CircularProgress />
                </div>
            ) : <CreateVillage formType="edit" villageDetails={villageDetails} />}
        </>
    );
}
