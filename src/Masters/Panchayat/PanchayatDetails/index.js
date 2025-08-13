import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { checkDependancePanchayat, deletePanchayat, getPanchayatDetails } from '../duck/network';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '../../../components/Loader/style';
import { CircularProgress } from '@mui/material';
import { setLoading } from '../duck/panchayatSlice';
import DeleteAlert from '../../../components/Masters/DeleteAlert';
import DropDownWithSearch from '../../../components/Masters/DropDownWithSearch';
import { getPanchayatNameList } from '../../Districts/duck/network';
import access from '../../../../public/assets/icons/access_denied.svg';
import  { InfoDialog } from '../../../components/Dialog';
import ViewMore from '../../../components/ViewMore';


export default function PanchayatDetails() {
  const pathname = useParams();
  const dispatch = useDispatch();
  const details = useSelector((state) => state.panchayat.panchayatDetails);
  const loader=useSelector((state)=>state.panchayat.loading)
  const navigate = useNavigate();
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [trasferDialog, setTrasferDialog] = useState(false)
  const [transferName, setTransferName] = useState()
  const [roleName, setRoleName] = useState([])
  const [permissions, setPermissions] = useState({})
  const [isDeleteInfoDialogOpen, setIsDeleteInfoDialogOpen] = useState(false);


  const handleEdit = () => {
  }

  useEffect(() => {
    dispatch(setLoading(true))
    dispatch(getPanchayatDetails({ id: pathname.id }))
  }, [pathname.id]);

	useEffect(() => {
		const userPermissions = JSON.parse(localStorage.getItem('permissions'))
		setPermissions(userPermissions["Masters"]["Panchayat/Ward"])
	}, [])


  
  const openDeleteMember = () => {
    setIsInfoDialogOpen(true);
    setTransferName("")
    dispatch(getPanchayatNameList({block_zone_id:details?.block_zone_id})).then((resp) => {
      const updateRoleName = resp.filter((data) => data.panchayat_ward_id !== pathname.id)
      setRoleName(updateRoleName)
    })
  }

  

  const handleTransfer = () => {
   
    setIsInfoDialogOpen(false)
    setTrasferDialog(true)
  }



  const closeTrasferDelete = () => {
    setTrasferDialog(false)
  }



	const closeDelete = () => setIsDeleteInfoDialogOpen(false);
  const closeDeleteInfo=()=>setIsInfoDialogOpen(false)

  const onChangeDropDownFilter = (e, type) => {

    setTransferName(e)


      dispatch(getPanchayatNameList({block_zone_id:details?.block_zone_id})).then((resp) => {
        const updateRoleName = resp.filter((data) => data.panchayat_ward_id !== pathname.id)
        setRoleName(updateRoleName)
      })
    

  }



  const handleSearchDrop = (txt, type) => {
    // dispatch(getDistrictNameList())

      dispatch(getPanchayatNameList({block_zone_id:details?.block_zone_id,search:txt})).then((resp) => {
        const updateRoleName = resp?.filter((data) => data.panchayat_ward_id !== pathname.id);
        setRoleName(updateRoleName);
      });

    
  };


  const handleTransferRecords=()=>{
    dispatch(deletePanchayat({id:pathname?.id}))
    navigate("/masters/panchayat_ward")
  }


  const handleDeleteDependance = () => {
		dispatch(checkDependancePanchayat({ id: details.id, isSuccess: true })).then((resp) => {

			if (resp?.statusCode == 200) {
				dispatch(deletePanchayat({ id: details.id })).then((resp) => {

					navigate('/masters/panchayat_ward');
					setIsInfoDialogOpen(false);
				});
			} else if (resp?.data?.statusCode == 422) {
				setIsInfoDialogOpen(false);
				setIsDeleteInfoDialogOpen(true);
			}
		});
	};



  

  return (
    <>{
      !loader ?
        <div>
          <div className="tw-flex tw-items-center tw-w-full tw-justify-between">
            <div className='tw-flex tw-justify-center '>
              <Link to="/masters/panchayat_ward"  >
                <ArrowBackIcon className="tw-text-grey" />
                <span className="tw-text-grey tw-ml-2 tw-mt-2 tw-text-sm tw-leading-normal"> Panchayat/Ward</span>
              </Link>
            </div>
            <div className='tw-flex tw-gap-5'>
            {permissions?.delete && <Button onClick={openDeleteMember} variant="outlined" className='!tw-bg-none !tw-text-error !tw-border-error !tw-text-base'>
            Delete
          </Button>}
            {permissions?.update && <Button onClick={() => navigate(`/panchayat-ward/update/${pathname.id}`)} className='!tw-bg-primary !tw-text-white'>
              Edit Info
            </Button>}
            </div>
          </div>

          {isInfoDialogOpen ? (
						<div>
							<DeleteAlert open={isInfoDialogOpen} close={closeDeleteInfo} title={`Delete account?`}>
								<p className="tw-w-[95%]">Are you sure you want to delete {details?.full_name} account.</p>
								<div className="tw-pt-8 tw-flex tw-gap-10  ">
									<Button variant="outlined" className="!tw-text-secondary tw-flex-grow" onClick={()=>setIsInfoDialogOpen(false)}>
										Cancel
									</Button>
									<Button variant="contained" className="!tw-text-white tw-flex-grow" color="error" onClick={handleDeleteDependance}>
										Delete
									</Button>
								</div>
							</DeleteAlert>
						</div>
					) : null}

          {isDeleteInfoDialogOpen ? (
						<InfoDialog open={isDeleteInfoDialogOpen} close={closeDelete}>
							<div className="tw-text-center">
								<img className="tw-mx-auto" src={access} />
								<h3 className="tw-font-bold tw-text-inter tw-pt-5 tw-text-[20px] tw-text-secondaryText">Unable to delete</h3>
								<p className="tw-pt-5">Already linked to an active program.</p>

								<div className="tw-pt-5">
									<Button
										onClick={() => {
											setIsDeleteInfoDialogOpen(false);
										}}
										variant="contained"
										fullWidth
										disableElevation
										className="tw-px-[105px] !tw-text-white "
									>
										Okay
									</Button>
								</div>
							</div>
						</InfoDialog>
					) : null}
        {trasferDialog ? (
          <div>
            <DeleteAlert open={trasferDialog} close={closeTrasferDelete} title={`Select Block/Zone to transfer ${details?.name} parents record`}>

              <DropDownWithSearch
                options={roleName}
                valuekey="panchayat_ward_id"
                labelkey="name"
                label={`Select Panchayat/Ward account`}
                listSearch={getPanchayatNameList}
                searchText={(txt) => handleSearchDrop(txt, "panchayat_ward_id")}
                onChange={(e) => {
                  onChangeDropDownFilter(e, 'panchayat_ward_id')
                }}
                value={transferName}
              />
              <div className='tw-pt-8'>
                <Button variant="contained" className='!tw-text-white !tw-w-[100%] ' onClick={handleTransferRecords}  disabled={transferName === ""}>Transfer Records and Delete Account</Button>
              </div>
            </DeleteAlert>
          </div>
        ) : null}
          <div className='tw-pt-2'>
            <h2 className='tw-text-secondaryText tw-font-bold tw-text-2xl '>{details?.name || "-"}</h2>
          </div>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Panchayat/Ward Info
            </Typography>
            <div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">Panchayat/Ward Info</span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.name || "-"}</span>
                </div>

              </div>
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">Assigned District Name</span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_district || "-"}</span>
                </div>

              </div>


              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">Assigned Block/Zone Name </span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_block_zone || "-"}</span>
                </div>
              </div>


            </div>

          </div>
          <div className="tw-flex tw-p-6 tw-flex-col tw-items-start tw-gap-5 tw-mb-5 tw-rounded-xl tw-my-8 tw-shadow-md tw-bg-white">
            <Typography variant="h4" className="!tw-font-semibold tw-mb-1 !tw-text-secondaryText">Other Details
            </Typography>
            <div className="tw-flex  tw-gap-x-10 tw-gap-y-6 tw-flex-wrap tw-pt-6">
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">No.of CEWs</span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_cews || "0"}</span>
                </div>

              </div>
              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">No.of Village/Area</span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_village_areas || "0"}</span>
                </div>

              </div>


              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">No.of Total Parents</span>
                  <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.no_of_parents || "0"}</span>
                </div>
              </div>

              <div className="tw-flex tw-items-start tw-gap-x-2  tw-self-stretch tw-w-[250px] ">
                <div className="tw-flex tw-flex-col tw-items-start tw-gap-1 tw-flex-1">
                  <span className="tw-text-xs  tw-text-grey">Assigned Supervisor</span>
                  {/* <span className="tw-text-sm tw-text-primaryText tw-font-normal">{details?.assigned_supervisors || "-"}</span> */}
                  <ViewMore data={details?.assigned_supervisors || '-'} className="tw-text-sm tw-text-primaryText tw-font-normal" />

                </div>
              </div>
            </div>

          </div>
        </div> : (<Box className="tw-text-center tw-py-5">{<CircularProgress />}</Box>
        )
    }</>
  )
}
