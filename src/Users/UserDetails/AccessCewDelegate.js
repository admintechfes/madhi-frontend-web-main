import { Button, Popover, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ErrorBox } from '../../components/Errorbox';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import moment from 'moment';
import { getCEWDelegateNameList } from '../../Masters/Districts/duck/network';
import DeleteAlert from '../../components/Masters/DeleteAlert';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import { BasicDatePicker } from '../../components/DatePicker';
import { useParams } from 'react-router-dom';
import { addDelegateAcces, getAccessDelegateList } from '../duck/network';
import { useDispatch } from 'react-redux';

export default function AccessCewDelegate({ isCEWDelegateModalOpen,id,setCheckCEW, closeIsCEWDelegateModalOpen, handleDelegateCancel, CEWData }) {
  const [cewDelegateName, setCEWDelegatename] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();


const params=useParams();

  const onChangeDropDownFilterCEWDelegate = (e, type) => {
    setCEWDelegatename(e);
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!startDate) {
      errors.startDate = "Please select start date";
      isValid = false;
    }

    if (!endDate) {
      errors.endDate = "Please select end date";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(addDelegateAcces({ startedAt:startDate, endedAt:endDate, delegatedFromId:cewDelegateName,delegatedToId:id}))
      closeIsCEWDelegateModalOpen();
      dispatch(getAccessDelegateList({delegatedToId:id}))
      setCheckCEW(false)
    } else {
      console.log("Form has errors, please correct them.");
    }
  };

  const clearErrorsStart = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      startDate:""
    }))
  }

  const clearErrorsEnd=()=>{
    setErrors((prevErrors) => ({
      ...prevErrors,
      endDate:""
    }))
  }


	const handleSearchDrop = (txt, type) => {
	

		if (type === 'CEW') {
			dispatch(getCEWDelegateNameList({ search: txt, supervisor_id:id}));
		}


	};

  return (
    <div>
      <form >
        <DeleteAlert
          open={isCEWDelegateModalOpen}
          close={closeIsCEWDelegateModalOpen}
          title={`Select time period and CEWs account to share delegate access`}
        >
          <DropDownWithSearch
            options={CEWData}
            valuekey="id"
            labelkey="full_name"
            label={`Select reporting CEW account`}
            listSearch={getCEWDelegateNameList}
            searchText={(txt) => handleSearchDrop(txt,"CEW")}
            onChange={(e) => {
              onChangeDropDownFilterCEWDelegate(e);
            }}
            value={cewDelegateName}
          />

          {/* <parentSele */}

          <p className="tw-py-4">Select Start and End date of the access</p>

          <div className="tw-flex tw-flex-col">
            <span className="tw-text-lg  tw-text-secondaryText tw-block tw-mb-5 tw-font-semibold">
              Date range
            </span>
            <div className="tw-flex tw-justify-between tw-items-start tw-gap-6 tw-mb-5 tw-flex-col">
              <div className="tw-flex tw-justify-between tw-items-center tw-gap-4">
                <span className="tw-text-grey tw-text-xs">Start Date:</span>

                <div className="tw-w-[300px]">
                  <BasicDatePicker
                    inputFormat="DD/MM/YYYY"
                    value={startDate}
                    disablePast
                    maxDate={endDate}
                    onChange={(newValue) => {
                      setStartDate(moment(newValue).format("YYYY-MM-DD"));
                      if (errors.startDate) {
                        clearErrorsStart();
                      }
                    }}
                    label="Select start date of the access"
                  />
                  {errors.startDate && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.startDate}</span>
                    </ErrorBox>
                  )}
                </div>
              </div>
              <div className="tw-flex tw-justify-between tw-items-center tw-gap-6">
                <span className="tw-text-grey tw-text-xs">End Date:</span>

                <div className="tw-w-[300px]">
                  <BasicDatePicker
                   inputFormat="DD/MM/YYYY"
                    value={endDate}
                    minDate={startDate}
                    onChange={(newValue) => {
                      setEndDate(moment(newValue).format("YYYY-MM-DD"));
                      if (errors.endDate) {
                        clearErrorsEnd();
                      }
                    }}
                    label="Select end date of the access"
                  />
                  {errors.endDate && (
                    <ErrorBox>
                      <ErrorOutlineIcon fontSize="small" />
                      <span>{errors.endDate}</span>
                    </ErrorBox>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="tw-pt-8 tw-flex tw-gap-8">
            <Button
              variant="outlined"
              className="!tw-text-primary !tw-w-[100%] "
              onClick={handleDelegateCancel}
            >
              cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="!tw-text-white !tw-w-[100%]"
              onClick={onFormSubmit}
              disabled={cewDelegateName === undefined}
            >
              Add Delegate Access
            </Button>
          </div>
        </DeleteAlert>
      </form>
    </div>
  );
}
