import React, { useState } from 'react';
import { Button, Popover, TextField } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import  { Dropdown } from '../Select';


export default function FilterExportDistrict() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterDataPopOver, setFilterDataPopOver] = useState({
    minBlockZonesCount: null,
    maxBlockZonesCount: null,
    firstname_uuid: null,
    min_work_experience: null,
    max_work_experience: null,
    state_uuid: null,
    city_uuid: null,
    education_level_uuid: null,
    min_expected_ctc: null,
    max_expected_ctc: null,
    added_by_uuid: null,
    approved_by_uuid: null,
    assign_uuid: null,
    is_relocate: null,
  });


  const open = Boolean(anchorEl);

  const id = open ? 'simple-popover' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  }







  const onChangeFilter = (e, type) => {
    const updateFilterData = (key, value) => {
      setFilterDataPopOver({ ...filterDataPopOver, [key]: value });
    };
    switch (type) {
      case 'minBlockZonesCount':
        updateFilterData('minBlockZonesCount', e);
        dispatch(getGender());
        break;

      case 'maxBlockZonesCount':
        updateFilterData('maxBlockZonesCount', e);
        dispatch(getNoticePeriod());
        break;

      // case 'education_level_uuid':
      //   updateFilterData('education_level_uuid', e);
      //   dispatch(getEducationLevel());
      //   break;

      // case 'min_work_experience':
      //   updateFilterData('min_work_experience', e);
      //   break;
      // case 'max_work_experience':
      //   updateFilterData('max_work_experience', e);
      //   break;
      // case 'state_uuid':
      //   updateFilterData('state_uuid', e);
      //   dispatch(getStates());
      //   dispatch(
      //     getCity({
      //       uuid: e,
      //     })
      //   );
      //   break;
      // case 'city_uuid':
      //   updateFilterData('city_uuid', e);

      //   break;

      // case 'min_expected_ctc':
      //   updateFilterData('min_expected_ctc', e);
      //   break;
      // case 'max_expected_ctc':
      //   updateFilterData('max_expected_ctc', e);
      //   break;
      // case 'added_by_uuid':
      //   updateFilterData('added_by_uuid', e);
      //   break;
      // case 'is_relocate':
      //   updateFilterData('is_relocate', e.target.checked);
      //   break;
      // case 'approved_by_uuid':
      //   updateFilterData('approved_by_uuid', e);
      //   break;
      // case 'assign_uuid':
      //   updateFilterData('assign_uuid', e);
      //   break;

      default:
        break;
    }
  };

const ResetFilter=()=>{

}

const ApplyFilter=()=>{

}
  return (
    <div className='tw-pr-3 tw-pb-3 tw-flex tw-justify-end  tw-gap-4'>
      <Button
      variant="outlined"
        onClick={handleClick}
        endIcon={<FilterListIcon />}
        className={`tw-px-1 tw-h-10 !tw-text-secondary  !tw-text-base   !tw-border-[0.1px]
        !tw-border-[#DDD] tw-rounded-lg tw-transition-all tw-duration-300 tw-w-14 tw-font-medium  tw-border-r-2  md:tw-w-4  lg:tw-w-20  !tw-shadow-sm	 `}
      >
        Filter
      </Button>
      <Button
        variant="outlined"
        onClick={handleClick}
        className={`tw-px-1 tw-h-10 !tw-text-secondary   !tw-text-base
        !tw-border-secondary tw-rounded-md tw-transition-all tw-duration-300 tw-w-14 tw-font-medium    md:tw-w-4  lg:tw-w-32   `}
      >
        Export Data
      </Button>
      <Popover
        sx={{
          '& .MuiPaper-root': {
            padding: '16px',
            overflow: 'visible',
          },
        }}
        id={1}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >

        <div className='tw-flex tw-justify-between tw-w-full tw-pb-5 '>
          <div>
            <h2 className='tw-text-2xl tw-text-secondaryText tw-font-bold'>Districts</h2>
          </div>
          <div onClick={handleClose}>
            <CloseIcon />
          </div>
        </div>
        <div className="tw-flex tw-items-start tw-gap-6 tw-justify-between tw-w-[608px] ">
          <div className="tw-flex tw-w-1/2 tw-flex-col tw-items-start tw-gap-4">
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs  tw-font-normal tw-text-grey block tw-w-1/2">No.of  Block/Zone</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'minBlockZonesCount');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.minBlockZonesCount}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'maxBlockZonesCount');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.maxBlockZonesCount}
                className="tw-w-[33.33%]"
              />
            </div>
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of  Panchayat/Ward</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of  Village/Area</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of  Total Parents</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>
          </div>
          <div className="tw-flex tw-flex-col tw-items-start tw-w-1/2 tw-gap-4">
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of CEWs</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of Supervisor</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>
            <div className="tw-flex tw-items-center tw-self-stretch tw-gap-2 tw-justify-between">
              <span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-1/2">No.of Program Assigned</span>
              <TextField
                size="small"
                type="number"
                placeholder="Min"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'min_work_experience');
                  // handleChangeMinMax();
                }}
                value={filterDataPopOver.min_work_experience}
                className="tw-w-[33.33%]"
              />

              <span className="tw-text-xs tw-font-normal tw-text-grey block">-</span>
              <TextField
                size="small"
                type="number"
                placeholder="Max"
                onChange={(e) => {
                  onChangeFilter(e.target.value, 'max_work_experience');
                  handleChangeMinMaxWE(e);
                }}
                value={filterDataPopOver.max_work_experience}
                className="tw-w-[33.33%]"
              />
            </div>

            <div className="tw-flex tw-items-center tw-justify-between tw-self-stretch tw-gap-3">
										<span className="tw-text-xs tw-font-normal tw-text-grey block tw-w-2/3">Assigned Sr.Supervisor</span>
										<Dropdown
											options={[{"uuid":"a"}]}
											onChange={(e) => onChangeFilter(e, 'assign_uuid')}
											value={filterDataPopOver.assign_uuid}
											valuekey="uuid"
											labelkey="name"
											label="Assigned To"
										/>
									</div>
                  <div className="tw-flex tw-justify-end  tw-self-stretch tw-gap-3">
										<Button variant="contained" onClick={ResetFilter} className="uppercase !tw-bg-backgroundGrey tw-w-[60%] !tw-text-grey">
											Reset Filter
										</Button>
										<Button variant="contained" onClick={ApplyFilter} className="uppercase tw-w-[60%] !tw-text-white">
											Apply
										</Button>
									</div>
        </div>
          </div>
       
      </Popover>
    </div>
  )
}
