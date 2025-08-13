import { Button, InputAdornment, TextField } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import SearchBox from '../SearchBox';


export default function MasterHeader({title,handleSearch,navigateValue,addBtnName,placeHolderName,permissions}) {



	const navigate = useNavigate();

 
  const AddNewDistrict=()=>{

    navigate({ pathname: navigateValue });
  }
  return (
    <div>
      <div className="tw-flex tw-justify-between">
        <div>
          <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>{title}</h2>
        </div>
        <div className='tw-flex tw-gap-4'>
        <SearchBox placeholder={placeHolderName} handleSearch={handleSearch} />

          {permissions?.create && <Button className='!tw-text-white !tw-bg-primary' onClick={AddNewDistrict}>{addBtnName}</Button>}
          {title === "Village" && <Button variant='outlined' onClick={() => navigate('/masters/village_area/manage-bulk-upload')}>
						Manage Bulk  Upload
					</Button>}
        </div>
      </div>
    </div>
  )
}
