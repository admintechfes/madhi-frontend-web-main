import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { ErrorBox } from '../../components/Errorbox';
import { BasicDatePicker } from '../../components/DatePicker';

import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getSrSupervisorNameList, getSupervisorNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import MultipleSelectDropdownWithSearch from '../../components/Programs/MultiSelectDropdownWithSearch';
import { createUser, getUserRoleNameList, partialUpdateUser, updateUser } from '../duck/network';
import { LoadingButton } from '@mui/lab';
import { hideLoader, showLoader } from '../../components/Loader/duck/loaderSlice';
import { Dropdown } from '../../components/Select';
import DropDownWithSearch from '../../components/Masters/DropDownWithSearch';
import DropdownWithSearch from '../../components/Programs/DropdownWithSearch';
import { utils } from '../../utils';

export default function UserCreateUpdate({ defaultValues, formtype }) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const qParams = useParams();

	const laoding = useSelector((state) => state.user.loading);
	const loader = useSelector((state) => state.loader.openLoader);
	const roleName = useSelector((state) => state.user.userRoleNameList)
	const supervisorName = useSelector((state) => state.district.supervisorNameList);
	// const srSupervisorNameList = useSelector((state) => state.district.srSupervisorNameList);

	
	const [roleShow, setRoleShow] = useState("")
	const [selectRole, setSelectRole] = useState("");
	const [districtList, setDistrictList] = useState([]);
	const [regionDistrict, setRegionDistrict] = useState([]);
	const [ogDistrictList, setOgDistrictList] = useState([]);
	const [srSupervisorList, setSrSupervisorList] = useState([]);
	const [regionSrSupervisor, setRegionSrSupervisor] = useState([]);
	const [ogSrSupervisorList, setOgSrSupervisorList] = useState([]);
	const [blockZoneList, setBlockZoneList] = useState([]);
	const [regionBlockZone, setRegionBlockZone] = useState([]);
	const [ogRegionBlockZoneList, setOgRegionBlockZoneList] = useState([]);
	const [panchayatWardList, setPanchayatWardList] = useState([]);
	const [ogPanchayatWardList, setOgPanchayatWardList] = useState([]);
	const [regionPanchayatWard, setRegionPanchayatWard] = useState([]);
	const [villageAreaList, setVillageAreaList] = useState([]);
	const [regionvillageArea, setRegionVillageArea] = useState([]);
	const [ogVillageAreaList, setOgVillageAreaList] = useState([]);
	const [programDetails, setProgramDetails] = useState(JSON.parse(window.localStorage.getItem('currentTeam')));
	const [permissions, setPermissions] = useState({});
	const [user, setUser] = useState(null);

	
	const [filterData, setFilterData] = useState({
		district_id: "",
	});
	const [supervisorList, setSupervisorList] = useState([])
	const [regionSupervisor, setRegionSupervisor] = useState([]);
	const [ogSupervisorList, setOgSupervisorList] = useState([]);
	const userData = localStorage.getItem('user');

	const srRoleName=user?.role_type.toString()=="admin"?roleName:roleName.filter((data)=>data.name!=="Senior Supervisor")
	useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const profileDetails = JSON.parse(userData);
      setUser(profileDetails)
      // dispatch(getUserDetails({ id: idProfile.id })).then(resp => setUser(resp))
    }
  }, []);


	useEffect(()=>{
		if(location.pathname?.includes('add')) {
			utils.removeLocalStorageValue('currentTeam')
			setProgramDetails(null)}
	},[])


	useEffect(() => {
		const runEffect = async () => {
			if (defaultValues) {
				setRoleShow(defaultValues?.role_name)

				if (defaultValues?.role_name !== "CEW"){
					dispatch(getSupervisorNameList())
				
	
					let distRes = await dispatch(getDistrictNameList());
	
	
					setOgDistrictList(distRes);
	
					let selectedRegionDistrict = defaultValues.assigned_details?.map((region, index) => {
						return region?.district_id;
					});
	
					setRegionDistrict(selectedRegionDistrict);
	
					let filteredDistrictList = defaultValues.assigned_details?.map((region, index) => {
						let slicedDistrict = [...selectedRegionDistrict];
	
						slicedDistrict.splice(index, 1);
						let filterArr = distRes?.filter((option) => !slicedDistrict.includes(option['district_id']));
	
						return filterArr;
					});
	
					setDistrictList(filteredDistrictList);
				}
			



				if (defaultValues?.role_name === "Supervisor") {
					let SrSupRes = await dispatch(getSrSupervisorNameList());


					setOgSrSupervisorList(SrSupRes);

					let selectedRegionSrSup = defaultValues.assigned_details?.map((region, index) => {
						return region?.senior_supervisor_id;
					});

					setRegionSrSupervisor(selectedRegionSrSup);

					let filteredSrSupList = defaultValues.assigned_details?.map((region, index) => {
						let slicedSrSup = [...selectedRegionSrSup];

						slicedSrSup.splice(index, 1);
						let filterArr = SrSupRes?.filter((option) => !slicedSrSup.includes(option['senior_supervisor_id']));

						return filterArr;
					});

					setSrSupervisorList(filteredSrSupList);
				}




				if (defaultValues?.role_name === "CEW") {
					// let srSupRes = await dispatch(getSrSupervisorNameList());
					// setOgSrSupervisorList(srSupRes)

					// let selectedRegionSrSupervisor = defaultValues.assigned_details?.map((region, index) => {
					// 	return region?.senior_supervisor_id;
					// });
					// setRegionSrSupervisor(selectedRegionSrSupervisor)


					// let filteredSrSupervisorList = defaultValues.assigned_details?.map((region, index) => {
					// 	let slicedSrSup = [...selectedRegionSrSupervisor];

					// 	slicedSrSup.splice(index, 1);
					// 	let filterArr = srSupRes?.filter((option) => !slicedSrSup.includes(option['senior_supervisor_id']));

					// 	return filterArr;
					// });
					// setSrSupervisorList(filteredSrSupervisorList);




					let distRes = await dispatch(getDistrictNameList());


					setOgDistrictList(distRes);

					let selectedRegionDistrict = defaultValues.assigned_details?.map((region, index) => {
						return region?.district_id;
					});

					setRegionDistrict(selectedRegionDistrict);

					let filteredDistrictList = defaultValues.assigned_details?.map((region, index) => {
						let slicedDistrict = [...selectedRegionDistrict];

						slicedDistrict.splice(index, 1);
						let filterArr = distRes?.filter((option) => !slicedDistrict.includes(option['district_id']));

						return filterArr;
					});

					setDistrictList(filteredDistrictList);
					let blockZoneListRes = [];

					for await (const [index, region] of defaultValues.assigned_details?.entries() ?? [].entries()) {
						let blockRes = await dispatch(getBlockNameList({ district_id: region?.district_id }));
						blockZoneListRes[index] = blockRes;
						setOgRegionBlockZoneList((prevstate) => {
							let newState = [];
							newState = [...prevstate];
							newState[index] = blockRes;
							return newState;
						});

						setBlockZoneList((prevstate) => {
							let newState = [];
							newState = [...prevstate];
							if (blockRes.length) {
								newState[index] = [{ block_zone_id: 'all', name: 'Select All' }, ...blockRes];
							} else {
								newState[index] = [];
							}
							return newState;
						});
						if (blockRes.length == region?.block_zone_id?.length) {
							setProgramDetails((prev) => {
								let newState = { ...prev };
								newState?.assigned_details[index]?.block_zone_id?.unshift('all');
								return newState;
							});
						}

					}

					let selectedRegionBlockZone = defaultValues?.assigned_details?.map((region) => {
						return region?.block_zone_id;
					});
					setRegionBlockZone(() => {
						let newState = [];
						blockZoneListRes.forEach((item, index) => {
							if (selectedRegionBlockZone[index]?.length == item?.length) {
								newState[index] = ['all', ...selectedRegionBlockZone[index]];
							} else {
								newState[index] = selectedRegionBlockZone[index];
							}
						});
						return newState;
					});

					let panchayatListRes = [];
					for await (const [index, region] of defaultValues.assigned_details?.entries() ?? [].entries()) {
						let panchayatRes = await dispatch(getPanchayatNameList({ block_zone_id: region?.block_zone_id, source: 'users' }));
							panchayatListRes[index] = panchayatRes;

						setOgPanchayatWardList((prevstate) => {
							let newState = [];
							newState = [...prevstate];
							newState[index] = panchayatRes;
							return newState;
						});
						setPanchayatWardList((prevstate) => {
							let newState = [];
							newState = [...prevstate];
							if (panchayatRes.length) {
								newState[index] = [{ panchayat_ward_id: 'all', name: 'Select All' }, ...panchayatRes];
							} else {
								newState[index] = [];
							}
							return newState;
						});
						if (panchayatRes.length == region?.panchayat_ward_id?.length) {
							setProgramDetails((prev) => {
								let newState = { ...prev };
								newState?.assigned_details?.panchayat_ward_id?.unshift('all');
								return newState;
							});
						}
					}


					let selectedRegionPanchayatWard = defaultValues?.assigned_details?.map((region) => {
						return region?.panchayat_ward_id;
					});
					setRegionPanchayatWard(() => {
						let newState = [];
						panchayatListRes.forEach((item, index) => {
							if (selectedRegionPanchayatWard[index]?.length == item?.length) {
								newState[index] = ['all', ...selectedRegionPanchayatWard[index]];
							} else {
								newState[index] = selectedRegionPanchayatWard[index];
							}
						});
						return newState;
					});

					let villageListRes = [];
					for await (const [index, region] of defaultValues?.assigned_details?.entries() ?? [].entries()) {
						let villageRes = await dispatch(getVillageNameList({ panchayat_ward_id: region?.panchayat_ward_id, source: 'users' }));
						villageListRes[index] = villageRes;

						setOgVillageAreaList((prevstate) => {
							let newState = [];
							newState = [...prevstate];
							newState[index] = villageRes;
							return newState;
						});
						setVillageAreaList((prevstate) => {
							let newState = [];
						newState = [...prevstate];
						if (villageRes.length) {
							newState[index] = [{ village_area_id: 'all', name: 'Select All' }, ...villageRes];
						} else {
							newState[index] = [];
						}
						return newState;
						});
						if (villageRes.length == region?.village_area_id?.length) {
							setProgramDetails((prev) => {
								let newState = { ...prev };
								newState?.assigned_details?.village_area_id?.unshift('all');
								return newState;
							});
						}


					}


					let selectedRegionVillageArea = defaultValues?.assigned_details?.map((region) => {
						return region?.village_area_id;
					});

					setRegionVillageArea(selectedRegionVillageArea);
					// dispatch(hideLoader())










					let SupRes = await dispatch(getSupervisorNameList());

					setOgSupervisorList(SupRes);

					let selectedRegionSup = defaultValues.assigned_details?.map((region, index) => {
						return region?.supervisor_id;
					});
					setRegionSupervisor(selectedRegionSup);

					let filteredSupList = defaultValues.assigned_details?.map((region, index) => {
						let slicedSup = [...selectedRegionSup];

						slicedSup.splice(index, 1);
						let filterArr = SupRes?.filter((option) => !slicedSup.includes(option['id']));

						return filterArr;
					});

					setSupervisorList(filteredSupList);

				}

			} else {
				dispatch(getUserRoleNameList())

				dispatch(getDistrictNameList()).then((res) => {
					setOgDistrictList(res);
					setDistrictList((prevstate) => {
						let newState = [];
						newState = [...prevstate];
						newState.push(res);
						return newState;
					});
				});
			}

		}

		runEffect();
	}, [defaultValues, setRoleShow]);


	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: defaultValues
			? { ...defaultValues, assigned_details: [...defaultValues.assigned_details] }
			: {
				assigned_details: [{ district_id: null, block_zone_id: [], panchayat_ward_id: [], village_area_id: [] }],
			},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'assigned_details',
	});


	const handleDropdownChange = (selectedOption) => {
		setSelectRole(selectedOption)
		const roleObject = roleName.find((item) => item.id === selectedOption)
		 district_id: "",
		 setFilterData((resp) => ({ ...resp, district_id: null}))

		setRoleShow(roleObject?.name)
		delete errors.role_id

		setValue('assigned_details', [{
			district_id: [],
			block_zone_id: [],
			panchayat_ward_id: [],
			village_area_id: []
	}]);
		// setValue(`assigned_details.0.district_id`,"")
		setRegionDistrict("")
	};

	const onChangeRegionDistrict = (e, index) => {

		setFilterData((resp) => ({ ...resp, district_id: e }))


		setRegionDistrict((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			newState[index] = e;
			return newState;
		});






		for (let i = 0; i < fields.length; i++) {
			let slicedDistrict = [...regionDistrict];
			if (slicedDistrict[index]) {
				slicedDistrict[index] = e;
			} else {
				slicedDistrict.push(e);
			}
			slicedDistrict.splice(i, 1);
			let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));
			setDistrictList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[i] = filterArr;
				return newState;
			});
		}

		// dispatch(getSrSupervisorNameList({ district_id: e })).then((resp) => setSrSupervisorList(resp))


		dispatch(getSrSupervisorNameList({ district_id: e })).then((res) => {
			setOgSrSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
			setSrSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
		});
		dispatch(getSupervisorNameList({ district_id: e })).then((res) => {

			setOgSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
			setSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
		});

		dispatch(getBlockNameList({ district_id: e })).then((res) => {
			setOgRegionBlockZoneList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
			setBlockZoneList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length) {
					if(res.length >=2) {
						newState[index] = [{ block_zone_id: 'all', name: 'Select All' }, ...res];
					} else {
						newState[index] = [...res];
					}	
				} else {
					newState[index] = [];
				}
				return newState;
			});
		});

		setRegionBlockZone((prevState) => {
			let newState = [...prevState];
			newState.splice(index, 1);
			return newState;
		});
		setRegionPanchayatWard((prevState) => {
			let newState = [...prevState];
			newState.splice(index, 1);
			return newState;
		});
		setRegionVillageArea((prevState) => {
			let newState = [...prevState];
			newState.splice(index, 1);
			return newState;
		});

		setValue(`assigned_details.${index}.block_zone_id`, []);
		setValue(`assigned_details.${index}.panchayat_ward_id`, []);
		setValue(`assigned_details.${index}.village_area_id`, []);
	};




	const onChangeRegionBlockZone = (event, index, text = '') => {
		if(event?.length == 0) {
			setRegionBlockZone((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState.splice(index, 1);
				return newState
			})
			return
		}
		
		if (regionBlockZone?.[index]?.includes('all')) {

			if (!event.includes('all')) {
				if (text) {
					setRegionBlockZone((prevstate) => {
						let newState = [...prevstate];
						newState[index] = newState[index].filter((item) => !blockZoneList[index]?.map((el) => el.block_zone_id)?.includes(item));
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.block_zone_id.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`assigned_details.${index}.block_zone_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionBlockZone((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.block_zone_id.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`assigned_details.${index}.block_zone_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				}
				return;
			}
		}
		let e = event;
		if (e?.includes('all') && event[event.length - 1] == 'all') {
		
			e = blockZoneList[index].filter((item) => item.block_zone_id !== 'all').map((el) => el.block_zone_id);
		} else {
			e = event?.filter((el) => el !== 'all');
		}
		setRegionBlockZone((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			if (event?.includes('all') && event[event.length - 1] == 'all') {
				newState[index] = newState.length > 0 ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])];
			} else {
				if (ogRegionBlockZoneList?.[index]?.length >=2 && ogRegionBlockZoneList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`assigned_details.${index}.block_zone_id`, e);
			return newState;
		});
		dispatch(getPanchayatNameList({ block_zone_id: e, source: 'users' })).then((res) => {
			setOgPanchayatWardList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
			setPanchayatWardList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length) {
					if(res.length >=2) {
					newState[index] = [{ panchayat_ward_id: 'all', name: 'Select All' }, ...res];
					} else {
						newState[index] = [...res];
					}
				} else {
					newState[index] = [];
				}
				return newState;
				
			});
		});
		if (programDetails?.status !== 'active') {
			setRegionPanchayatWard((prevState) => {
				let newState = [...prevState];
				newState.splice(index, 1);
				return newState;
			});
			setRegionVillageArea((prevState) => {
				let newState = [...prevState];
				newState.splice(index, 1);
				return newState;
			});
			setValue(`assigned_details.${index}.panchayat_ward_id`, []);
			setValue(`assigned_details.${index}.village_area_id`, []);
		}
	};

	const onChangeRegionPanchyatWard = (event, index,text="") => {
		if(event?.length == 0) {
			setRegionPanchayatWard((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState.splice(index, 1);
				return newState
			})
			return
		}
		if (regionPanchayatWard?.[index]?.includes('all')) {
			if (!event?.includes('all')) {
				if (text) {
					setRegionPanchayatWard((prevstate) => {
						let newState = [...prevstate];
						newState[index] = newState[index]?.filter((item) => !panchayatWardList[index]?.map((el) => el.panchayat_ward_id)?.includes(item));
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.panchayat_ward_id.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`assigned_details.${index}.panchayat_ward_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionPanchayatWard((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.panchayat_ward_id.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`assigned_details.${index}.panchayat_ward_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				}

				return;
			}
		}
		let e = event;
		if (e?.includes('all') && event[event.length - 1] == 'all') {
			e = panchayatWardList[index]?.filter((item) => item.panchayat_ward_id !== 'all').map((el) => el.panchayat_ward_id);
		} else {
			e = event?.filter((el) => el !== 'all');
		}
		setRegionPanchayatWard((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			if (event?.includes('all') && event[event.length - 1] == 'all') {
				newState[index] = newState.length > 0 ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])] 
			} else {
				if (ogPanchayatWardList?.[index]?.length >=2 && ogPanchayatWardList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`assigned_details.${index}.panchayat_ward_id`, e);
			return newState;
		});
		dispatch(getVillageNameList({ panchayat_ward_id: e, source: 'users' })).then((res) => {
			setOgVillageAreaList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = res;
				return newState;
			});
			setVillageAreaList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length) {
					if(res.length >=2) {
					newState[index] = [{ village_area_id: 'all', name: 'Select All' }, ...res];
					} else {
						newState[index] = [...res];
					}
				} else {
					newState[index] = [];
				}
				return newState;
			});
		});

		if (programDetails?.status !== 'active') {
			setRegionVillageArea((prevState) => {
				let newState = [...prevState];
				newState.splice(index, 1);
				return newState;
			});
			setValue(`regions.${index}.village_area_id`, []);
		}

		// setRegionVillageArea((prevState) => {
		// 	let newState = [...prevState];
		// 	newState.splice(index, 1);
		// 	return newState;
		// });
	};

	const onChangeRegionVillageArea = (event, index, text = '') => {
		if(event?.length == 0) {
			setRegionVillageArea((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState.splice(index, 1);
				return newState
			})
			return
		}
		if (regionvillageArea?.[index]?.includes('all')) {
			if (!event?.includes('all')) {
				if (text) {
					setRegionVillageArea((prevstate) => {
						let newState = [...prevstate];
						newState[index] = newState[index].filter((item) => !villageAreaList[index]?.map((el) => el.village_area_id)?.includes(item));
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.village_area_id.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`assigned_details.${index}.village_area_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionVillageArea((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.assigned_details?.village_area_id.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`assigned_details.${index}.village_area_id`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				}

				return;
			}
		}
		let e = event;
		if (e?.includes('all') && event[event.length - 1] == 'all') {
			e = villageAreaList[index]?.filter((item) => item.village_area_id !== 'all').map((el) => el.village_area_id);
		} else {
			e = event?.filter((el) => el !== 'all');
		}
		setRegionVillageArea((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			if (event?.includes('all') && event[event.length - 1] == 'all') {
				newState[index] = newState.length > 0 ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])] 
			} else {
				if (ogVillageAreaList?.[index]?.length >=2 && ogVillageAreaList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`assigned_details.${index}.village_area_id`, e);
			return newState;
		});
	};
	const onChangeRegionSrSupervisorArea = (e, index) => {
		setRegionSrSupervisor((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			newState[index] = e;
			return newState;
		});
	};

	const onChangeRegionSupervisorArea = (e, index) => {
		setRegionSupervisor((prevstate) => {
			let newState = [];
			newState = [...prevstate];
			newState[index] = e;
			return newState;
		});
	};


	// const onChangeDropDownFilter = (e, type) => {
	// 	if (type === "district_id") {

	// 		setFilterData({ ...filterData, district_id: e });

	// 		dispatch(getBlockNameList({ district_id: e, source: "users" })).then((resp) => setBlockList(resp))
	// 		setDisableDropDown((res) => ({ ...res, blockZoneDisable: false }))
	// 	}
	// }


	const handleDropdownSearch = (text, index, dropdownName) => {
		if (dropdownName?.includes('village_area')) {
			//dispatch(getVillageNameList({ panchayat_ward_id: regionBlockZone[index], search: text, source: 'programs' })).then((res) => {
			let res = ogVillageAreaList[index].filter((item) => item.village_area_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			setVillageAreaList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length > 1) {
					newState[index] = [{ village_area_id: 'all', name: 'Select All' }, ...res];
				} else {
					newState[index] = res;
				}
				return newState;
			});
			//});
		}

		if (dropdownName?.includes('panchayat_ward')) {
			// dispatch(getPanchayatNameList({ block_zone_id: regionBlockZone[index], search: text, source: 'programs' })).then((res) => {
			let res = ogPanchayatWardList[index].filter((item) => item.panchayat_ward_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			setPanchayatWardList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length > 1) {
					newState[index] = [{ panchayat_ward_id: 'all', name: 'Select All' }, ...res];
				} else {
					newState[index] = res;
				}
				return newState;
			});
			// });
		}
		if (dropdownName?.includes('block_zone')) {
			// dispatch(getBlockNameList({ district_id: regionDistrict[index], search: text })).then((res) => {
				let res = ogRegionBlockZoneList[index].filter((item) => item.block_zone_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
				setBlockZoneList((prevstate) => {
					let newState = [];
					newState = [...prevstate];
					if (res.length > 1) {
						newState[index] = [{ block_zone_id: 'all', name: 'Select All' }, ...res];
					} else {
						newState[index] = res;
					}
	
					return newState;
				});
			// });
		}
		if (dropdownName?.includes('district')) {
			let res = ogDistrictList?.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			let slicedDistrict = [...regionDistrict];
			slicedDistrict.splice(index, 1);
			let filterArr = res.filter((option) => !slicedDistrict.includes(option['district_id']));
			setDistrictList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = filterArr;
				return newState;
			});
		}
		if (dropdownName?.includes('srSupervisor')) {
			let res = ogSrSupervisorList[index]?.filter((item) => item?.full_name?.toLowerCase().includes(text.toLowerCase()));
			let slicedSrSup = [...regionSrSupervisor];
			slicedSrSup.splice(index, 1);

			let filterArr = res?.filter((option) => !slicedSrSup?.includes(option['senior_supervisor_id']));
			setSrSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = filterArr;
				return newState;
			});
		}


		if (dropdownName?.includes('supervisor')) {
			let res = ogSupervisorList[index]?.filter((item) => item?.full_name?.toLowerCase().includes(text.toLowerCase()));
			let slicedSup = [...regionSupervisor];
			slicedSup.splice(index, 1);

			let filterArr = res?.filter((option) => !slicedSup?.includes(option['supervisor_id']));
			setSupervisorList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = filterArr;
				return newState;
			});
		}


	};



	const handleDropdownSearchBackSpacEvent = (text, index, dropdownName) => {
		if (dropdownName?.includes('village_area')) {
			//dispatch(getVillageNameList({ panchayat_ward_id: regionBlockZone[index], search: text, source: 'programs' })).then((res) => {
			let res = ogVillageAreaList[index]?.filter((item) => item.village_area_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			setVillageAreaList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length > 1 && regionvillageArea?.[index]?.length == res.length) {
					newState[index] = [{ village_area_id: 'all', name: 'Select All' }, ...res];
				} else {
					newState[index] = res;
				}
				return newState;
			});
			onChangeRegionVillageArea(regionvillageArea[index], index, '');
			//});
		}
		if (dropdownName?.includes('panchayat_ward')) {
			// dispatch(getPanchayatNameList({ block_zone_id: regionBlockZone[index], search: text, source: 'programs' })).then((res) => {
			let res = ogPanchayatWardList[index]?.filter((item) => item.panchayat_ward_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			setPanchayatWardList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length > 1 && regionPanchayatWard?.[index]?.length == res.length) {
					newState[index] = [{ panchayat_ward_id: 'all', name: 'Select All' }, ...res];
				} else {
					newState[index] = res;
				}
				return newState;
			});
			onChangeRegionPanchyatWard(regionPanchayatWard[index], index, '');
			// });
		}
		if (dropdownName?.includes('block_zone')) {
			// dispatch(getBlockNameList({ district_id: regionDistrict[index], search: text })).then((res) => {
			let res = ogRegionBlockZoneList[index]?.filter((item) => item.block_zone_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			setBlockZoneList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				if (res.length > 1 && regionBlockZone?.[index]?.length == res.length) {
					newState[index] = [{ block_zone_id: 'all', name: 'Select All' }, ...res];
				} else {
					newState[index] = res;
				}

				return newState;
			});
			onChangeRegionBlockZone(regionBlockZone[index], index, '');
			// });
		}
		if (dropdownName?.includes('district')) {
			let res = ogDistrictList.filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
			let slicedDistrict = [...regionDistrict];
			slicedDistrict.splice(index, 1);
			let filterArr = res.filter((option) => !slicedDistrict.includes(option['district_id']));
			setDistrictList((prevstate) => {
				let newState = [];
				newState = [...prevstate];
				newState[index] = filterArr;
				return newState;
			});
		}
	};


	const onFormSubmit = (formValues) => {
		let a = {}
		let b=formValues
		if (roleShow === "CEW") {
			a = { "assigned_details": formValues["assigned_details"][0] }
			delete formValues["assigned_details"]
		} else if (roleShow === "Senior Supervisor") {
			 b = formValues["assigned_details"]?.map((a) => ({ "district_id": a.district_id }))
			a = { "assigned_details": b }
		} else if (roleShow === "Supervisor") {
			let b = formValues["assigned_details"]?.map((a) => ({ "district_id": a.district_id, "senior_supervisor_id": a.senior_supervisor_id }))
			a = { "assigned_details": b }
		}
		if (qParams.id) {

				delete formValues["role_type"]
				delete formValues["role_name"]
				delete formValues["role_id"]
				delete formValues["assigned_districts"]
				delete formValues["assigned_village_area"]
			dispatch(partialUpdateUser({ id: qParams.id,...formValues,...a})).then((res) => {
				if (res?.status == 200) {
					
					navigate(`/team-member-details/${qParams.id}`);
				}
			});
		} else {
			dispatch(createUser({ ...formValues, ...a })).then((res) => {
				if (res?.status == 200){
					
					navigate('/team-members');
				}
			});
		}
	};



	const handleSearch = (txt, type) => {
		if (type == "senior_supervisor") {

			dispatch(getSrSupervisorNameList({ ...filterData, search: txt }))
		}
	}




	const renderTextFieldWithError = (field, label, error, onKeyPress, type, params) => (
		<div className="!tw-w-[300px]">
			<TextField variant="outlined" size="small" label={label} type={type ? type : "text"} onKeyPress={onKeyPress} value={field.value || ''} {...field} className='!tw-w-[300px]' />
			{error && (
				<ErrorBox>
					<ErrorOutlineIcon fontSize="small" />
					<span>{error.message}</span>
				</ErrorBox>
			)}
		</div>
	);


	return (
		<>
			{!loader ? (
				<div>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
							<h1 className="tw-font-bold tw-text-[24px]">
								<Button variant="text" onClick={() => navigate(-1)} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
									Team Member
								</Button>
								<h1 className="tw-px-2 tw-mt-[-4px]">{qParams.id ? 'Edit Member Details' : 'Create New Member'}</h1>
							</h1>
							<div className="tw-flex tw-gap-x-5">
								<div className="tw-flex tw-gap-x-5">
									<Button onClick={() =>formtype!=="edit"? navigate('/team-members'):navigate(`/team-member-details/${qParams.id}`)} type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
										Cancel
									</Button>
									<LoadingButton loading={laoding} type="submit" variant="contained" size="small" className="tw-h-[35px]">
										{formtype==="edit"?"Save":"Create"}
									</LoadingButton>
								</div>
							</div>
						</div>
						<div className="tw-pt-6">
							<Paper>
								<Container maxWidth={false}>
									<div className="tw-py-6">
										<div className="tw-flex tw-justify-between tw-items-center">
											<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Basic Info</h1>
											<p className="tw-text-sm">
												<sup className="tw-text-error tw-text-[12px]">*</sup>All fields are mandatory
											</p>
										</div>

										<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
											<Controller
												name="first_name"
												control={control}
												rules={{
													required: 'This field is mandatory.',
													validate: value => value.length > 1 || 'Please enter valid first name.',
												}}
												render={({ field }) => renderTextFieldWithError(field, 'First Name', errors.first_name, (e) => {
													if (!/^[a-zA-Z\s]*$/.test(e.key)) {
														e.preventDefault();
													}
												})}
											/>
											<Controller
												name="last_name"
												control={control}
												rules={{
													required: 'This field is mandatory.',
													validate: value => value.length > 0 || 'Please enter a valid last name.',
												}}
												render={({ field }) => renderTextFieldWithError(field, 'Last Name', errors.last_name, (e) => {
													if (!/^[a-zA-Z\s]*$/.test(e.key)) {
														e.preventDefault();
													}
												})}
											/>
											<Controller
												name="email"
												control={control}
												rules={{
													required: 'This field is mandatory.',
													pattern: {
														value: /^\S+@\S+\.\S+$/,
														message: 'Please enter a valid email address.'
													}
												}}
												render={({ field }) => renderTextFieldWithError(field, 'Email', errors.email)}
											/>
											<Controller
												name="mobile"
												control={control}
												rules={{
													required: 'This field is mandatory.',
													pattern: {
														value: /^[0-9]{10}$/,
														message: 'Please enter a valid number',
													},
												}}
												render={({ field }) => renderTextFieldWithError(field, 'Mobile No', errors.mobile, (e) => {
													if (!/^\d*$/.test(e.target.value)) {
														e.preventDefault();
													}
													if (['+', '-'].includes(event.key)) {
														e.preventDefault();
													}
													if (e.target.value.length === 10) {
														e.preventDefault();
													}
												}, "number")}
											/>



											<Controller
												name="role_id"
												control={control}
												rules={{
													required: "This field is mandatory."
												}}
												render={({ field }) => (
													<div className="!tw-w-[300px]">
														<Dropdown {...field}
															options={srRoleName}
															valuekey="role_id"
															labelkey="name"
															onChange={(e) => {

																handleDropdownChange(e),
																	setValue(`role_id`, e)
															}
															}
															label="Select Role"
															placeholder="Select"
															// value={selectRole}
															disabled={formtype === "edit"}
														/>

														{errors.role_id && (
															<ErrorBox >
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.role_id.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>

											{roleShow === "Senior Supervisor" && formtype !== "edit" && <Controller
												name="password"
												control={control}
												rules={{ required: 'This field is mandatory', pattern: { value: /.{5,}/, message: 'Minimum 5 character are required' } }}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<TextField variant="outlined" fullWidth size="small" label="Set Password" {...field} />
														{errors.password && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.password.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>}
										</div>
									</div>
								</Container>
							</Paper>
						</div>
						<div className="tw-pt-6">
							<Paper>
								<Container maxWidth={false}>
									{roleShow === "CEW" && <div className="tw-py-6">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Location Details</h1>
										<div>
											<div>
												{fields.map((item, index) => (
													<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
														<Controller
															name={`assigned_details.${index}.district_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<DropdownWithSearch
																		listSearch={getDistrictNameList}
																		{...field}
																		disabled={qParams.id ? true : false}
																		value={regionDistrict[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'district')}
																		onChange={(e) => {
																			onChangeRegionDistrict(e, index);
																			setValue(`assigned_details.${index}.district_id`, e, { shouldValidate: true });
																		}}
																		options={districtList.length > index && districtList[index] ? districtList[index] : []}
																		valuekey="district_id"
																		labelkey="name"
																		label="District"
																	/>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.district_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.district_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`assigned_details.${index}.block_zone_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<Tooltip arrow placement="top-start" title={!regionDistrict[index] ? 'Please select District first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getBlockNameList}
																				{...field}
																				value={regionBlockZone[index]}
																				onChange={(e,text) => {
																					setValue(`assigned_details.${index}.block_zone_id`, e);
																					onChangeRegionBlockZone(e, index,text);
																				}}
																				handleSearch={(text) => handleDropdownSearch(text, index, 'block_zone')}
																				disabled={ !regionDistrict[index] ? true : false}
																				options={blockZoneList.length > index && blockZoneList[index] ? blockZoneList[index] : []}
																				ogOptions={ogRegionBlockZoneList.length > index && ogRegionBlockZoneList[index] ? ogRegionBlockZoneList[index] : []}
																				valuekey="block_zone_id"
																				labelkey="name"
																				label="Select Block/Zone"
																				parentId={regionDistrict[index]}
																				parentName={'district_id'}
																				// loadingName={'blockNameLoading'}
																				preSelected={programDetails?.assigned_details?.block_zone_id ?? []}
																				status={programDetails?.status}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'block_zone')}
																				// status={programDetails?.status}
																				// preSelected={programDetails?.assigned_details[index]?.block_zone_id ?? []}
																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.block_zone_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.block_zone_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`assigned_details.${index}.panchayat_ward_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<Tooltip arrow placement="top-start" title={!regionBlockZone[index] ? 'Please select Block/Zone first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getPanchayatNameList}
																				{...field}
																				value={regionPanchayatWard[index]}
																				onChange={(e) => {
																					setValue(`assigned_details.${index}.panchayat_ward_id`, e);
																					onChangeRegionPanchyatWard(e, index);
																				}}
																				handleSearch={(text) => handleDropdownSearch(text, index, 'panchayat_ward')}
																				disabled={!regionBlockZone[index]?.length > 0 ? true : false}
																				options={panchayatWardList.length > index && panchayatWardList[index] ? panchayatWardList[index] : []}
																				ogOptions={ogPanchayatWardList.length > index && ogPanchayatWardList[index] ? ogPanchayatWardList[index] : []}
																				valuekey="panchayat_ward_id"
																				labelkey="name"
																				label="Select Panchayat/Ward"
																				parentId={regionBlockZone[index]}
																				parentName={'block_zone_id'}
																				// loadingName={'panchayatNameLoading'}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'panchayat_ward')}
																				status={programDetails?.status}
																				preSelected={programDetails?.assigned_details?.panchayat_ward_id ?? []}
																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.panchayat_ward_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.panchayat_ward_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`assigned_details.${index}.village_area_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<Tooltip arrow placement="top-start" title={!regionPanchayatWard[index] ? 'Please select Panchayat/Ward first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getVillageNameList}
																				{...field}
																				value={regionvillageArea[index]}
																				onChange={(e) => {
																					setValue(`assigned_details.${index}.village_area_id`, e);
																					onChangeRegionVillageArea(e, index);
																				}}
																				handleSearch={(text) => handleDropdownSearch(text, index, 'village_area')}
																				// disabled={qParams.id ? true : !regionPanchayatWard[index] ? true : false}
																				disabled={!regionPanchayatWard[index]?.length > 0 ? true : false}
																				options={villageAreaList.length > index && villageAreaList[index] ? villageAreaList[index] : []}
																				ogOptions={ogVillageAreaList.length > index && ogVillageAreaList[index] ? ogVillageAreaList[index] : []}
																				valuekey="village_area_id"
																				labelkey="name"
																				label="Select Village/Area"
																				parentId={regionPanchayatWard[index]}
																				parentName={'panchayat_ward_id'}
																				// loadingName={'villageNameLoading'}
																				status={programDetails?.status}
																				preSelected={programDetails?.assigned_details?.village_area_id ?? []}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'village_area')}

																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.village_area_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.village_area_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>

													 <Controller
															name={`assigned_details.${index}.supervisor_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<DropdownWithSearch
																		listSearch={getSupervisorNameList}
																		{...field}
																		disabled={qParams.id ? true : !regionDistrict[index] ? true : false}
																		value={regionSupervisor[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'supervisor')}
																		onChange={(e) => {
																			setValue(`assigned_details.${index}.supervisor_id`, e);
																			onChangeRegionSupervisorArea(e, index);
																		}}
																		options={supervisorList.length > index && supervisorList[index] ? supervisorList[index] : []}
																		valuekey="id"
																		labelkey="full_name"
																		label="Assign Supervisor"
																	/>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.supervisor_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.supervisor_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														{/* {formtype == "edit" && <Controller
															name={`assigned_details.${index}.supervisor_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]" 	{...field}>
																	<FormControl className="tw-min-w-[120px] tw-w-full" size="small" fullWidth disabled={true}>
																		<InputLabel id="demo-simple-select-label">Assign Supervisor</InputLabel>
																		<Select
																			labelId="demo-simple-select-label"
																			id="demo-simple-select"
																			value={defaultValues?.assigned_details[0]?.assigned_supervisor}
																			label="Assign Supervisor"

																		>
																			<MenuItem value={defaultValues?.assigned_details[0]?.assigned_supervisor}>{defaultValues?.assigned_details[0]?.assigned_supervisor}</MenuItem>
																		</Select>
																	</FormControl>

																</div>
															)}
														/>} */}
														<div>
															{index > 0 ? (
																<IconButton
																	color="error"
																	disableRipple
																	disabled={qParams.id ? true : false}
																	className=""
																	onClick={() => {
																		remove(index);

																		let tempRegionDistrict = regionDistrict;
																		tempRegionDistrict?.splice(index, 1);

																		let tempDistrictList = districtList;
																		tempDistrictList?.splice(index, 1);

																		let newState = [];

																		for (let i = 0; i < fields.length - 1; i++) {
																			let slicedDistrict = [...tempRegionDistrict];
																			slicedDistrict.splice(i, 1);
																			let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));

																			newState.push(filterArr);
																		}

																		setDistrictList(newState);
																		setRegionDistrict(tempRegionDistrict);



																		//----

																		setRegionBlockZone((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setBlockZoneList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgRegionBlockZoneList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionPanchayatWard((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setPanchayatWardList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgPanchayatWardList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionVillageArea((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setVillageAreaList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgVillageAreaList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgSrSupervisorList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});
																	}}
																	aria-label="delete"
																>
																	<DeleteIcon />
																</IconButton>
															) : (
																<div className="tw-w-[38px]"></div>
															)}
														</div>
													</div>
												))}
											</div>
											{roleShow !== "CEW" && <div className="tw-pt-3 tw-flex tw-justify-end">
												{/* <Tooltip arrow placement="top-start" title={fields?.length + 1 > 5 ? 'Max Limit Reached' : ''}> */}
													<span>
														<Button
															type="button"
															// disabled={fields?.length + 1 > 5 ? true : false}
															onClick={() => {
																append({ district_id: null, block_zone_id: [], panchayat_ward_id: [], village_area_id: [] });
																for (let i = 0; i < fields.length + 1; i++) {
																	let slicedDistrict = [...regionDistrict];

																	slicedDistrict.splice(i, 1);
																	let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));
																	setDistrictList((prevstate) => {
																		let newState = [];
																		newState = [...prevstate];
																		newState[i] = filterArr;
																		return newState;
																	});
																}
															}}
															size="small"
															variant="outlined"
														>
															Add Another
														</Button>
													</span>
												{/* </Tooltip> */}
											</div>}
										</div>
									</div>}

									{roleShow === "Senior Supervisor" && <div className="tw-py-6">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Location Details</h1>
										<div>
											<div>

												{fields.map((item, index) => (
													<div className="tw-flex tw-gap-x-6 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
														<Controller
															name={`assigned_details.${index}.district_id`}
															control={control}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<DropdownWithSearch
																		listSearch={getDistrictNameList}
																		{...field}
																		disabled={qParams.id && defaultValues?.assigned_details.length - 1 >= index ? true : false} 
																		value={regionDistrict[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'district')}
																		onChange={(e) => {
																			onChangeRegionDistrict(e, index);

																			setValue(`assigned_details.${index}.district_id`, e);
																		}}
																		options={districtList.length > index && districtList[index] ? districtList[index] : []}
																		valuekey="district_id"
																		labelkey="name"
																		label="District"
																	/>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.district_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.district_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<div>
															{index > 0 ? (
																<IconButton
																	color="error"
																	disableRipple
																	disabled={qParams.id  &&defaultValues?.assigned_details.length - 1 >= index ? true : false }
																	className=""
																	onClick={() => {
																		remove(index);

																		let tempRegionDistrict = [...regionDistrict];
																		
																		tempRegionDistrict?.splice(index, 1);

																		let tempDistrictList = districtList;
																		tempDistrictList?.splice(index, 1);

																		let newState = [];

																		for (let i = 0; i < fields.length - 1; i++) {
																			let slicedDistrict = [...tempRegionDistrict];
																			slicedDistrict.splice(i, 1);
																			let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));

																			newState.push(filterArr);
																		}

																		setDistrictList(newState);
																		setRegionDistrict(tempRegionDistrict);

																		setRegionBlockZone((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setBlockZoneList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgRegionBlockZoneList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionPanchayatWard((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setPanchayatWardList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgPanchayatWardList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionVillageArea((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setVillageAreaList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgVillageAreaList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});
																	}}
																	aria-label="delete"
																>
																	<DeleteIcon />
																</IconButton>
															) : (
																<div className="tw-w-[38px]"></div>
															)}
														</div>
													</div>
												))}
											</div>
											{roleShow !== "CEW"  && <div className="tw-pt-3 tw-flex tw-justify-end">
												{/* <Tooltip arrow placement="top-start" title={fields?.length + 1 > 5 ? 'Max Limit Reached' : ''}> */}
													<span>
														<Button
															type="button"
															// disabled={fields?.length + 1 > 5 ? true : false}
															onClick={() => {
																append({ district_id: null, block_zone_id: [], panchayat_ward_id: [], village_area_id: [] });
																for (let i = 0; i < fields.length + 1; i++) {
																	let slicedDistrict = [...regionDistrict];

																	slicedDistrict.splice(i, 1);
																	let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));
																	setDistrictList((prevstate) => {
																		let newState = [];
																		newState = [...prevstate];
																		newState[i] = filterArr;
																		return newState;
																	});
																}
															}}
															size="small"
															variant="outlined"
														>
															Add Another
														</Button>
													</span>
												{/* </Tooltip> */}
											</div>}
										</div>
									</div>}

									{roleShow === "Supervisor" && <div className="tw-py-6">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Location Details</h1>
										<div>
											<div>

												{fields.map((item, index) => (
													<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
														<Controller
															name={`assigned_details.${index}.district_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<DropdownWithSearch
																		listSearch={getDistrictNameList}
																		{...field}
																		disabled={qParams.id  &&defaultValues?.assigned_details.length - 1 >= index ? true : false }
																		value={regionDistrict[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'district')}
																		onChange={(e) => {
																			onChangeRegionDistrict(e, index);
																			setValue(`assigned_details.${index}.district_id`, e, { shouldValidate: true });
																		}}
																		options={districtList.length > index && districtList[index] ? districtList[index] : []}
																		valuekey="district_id"
																		labelkey="name"
																		label="District"
																	/>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.district_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.district_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`assigned_details.${index}.senior_supervisor_id`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[300px]">
																	<DropdownWithSearch
																		listSearch={getSrSupervisorNameList}
																		{...field}
																		disabled={qParams.id ? (regionDistrict[index] === defaultValues?.assigned_details[index]?.district_id) : !regionDistrict[index] ? true : false }
																		value={regionSrSupervisor[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'srSupervisor')}
																		onChange={(e) => {
																			onChangeRegionSrSupervisorArea(e, index);
																			setValue(`assigned_details.${index}.senior_supervisor_id`, e, { shouldValidate: true });
																		}}
																		options={srSupervisorList.length > index && srSupervisorList[index] ? srSupervisorList[index] : []}
																		valuekey="id"
																		labelkey="full_name"
																		label="Assign Senior Supervisor"
																	/>
																	{Object.keys(errors).length > 0 && errors?.assigned_details?.[index]?.senior_supervisor_id && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.assigned_details?.[index]?.senior_supervisor_id.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>

														<div>
															{index > 0 ? (
																<IconButton
																	color="error"
																	disableRipple
																	disabled={qParams.id  &&defaultValues?.assigned_details.length - 1 >= index ? true : false }
																	className=""
																	onClick={() => {
																		remove(index);

																		let tempRegionDistrict = [...regionDistrict];
																		tempRegionDistrict.splice(index, 1);

																		let tempDistrictList = districtList;
																		tempDistrictList.splice(index, 1);

																		let newState = [];

																		for (let i = 0; i < fields.length - 1; i++) {
																			let slicedDistrict = [...tempRegionDistrict];
																			slicedDistrict.splice(i, 1);
																			let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));

																			newState.push(filterArr);
																		}

																		setDistrictList(newState);
																		setRegionDistrict(tempRegionDistrict);

																		
																		setRegionSrSupervisor((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setSrSupervisorList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgSrSupervisorList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionBlockZone((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setBlockZoneList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgRegionBlockZoneList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionPanchayatWard((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setPanchayatWardList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgPanchayatWardList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});

																		setRegionVillageArea((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setVillageAreaList((prevState) => {
																			let newState = [...prevState];
																			newState.splice(index, 1);
																			return newState;
																		});
																		setOgVillageAreaList((prevstate) => {
																			let newState = [...prevstate];
																			newState.splice(index, 1);
																			return newState;
																		});
																	}}
																	aria-label="delete"
																>
																	<DeleteIcon />
																</IconButton>
															) : (
																<div className="tw-w-[38px]"></div>
															)}
														</div>
													</div>
												))}
											</div>
											{roleShow !== "CEW"  && <div className="tw-pt-3 tw-flex tw-justify-end">
												{/* <Tooltip arrow placement="top-start" title={fields?.length + 1 > 5 ? 'Max Limit Reached' : ''}> */}
													<span>
														<Button
															type="button"
															// disabled={fields?.length + 1 > 5 ? true : false}
															onClick={() => {
																append({ district_id: null, block_zone_id: [], panchayat_ward_id: [], village_area_id: [] });
																for (let i = 0; i < fields.length + 1; i++) {
																	let slicedDistrict = [...regionDistrict];

																	slicedDistrict.splice(i, 1);
																	let filterArr = ogDistrictList.filter((option) => !slicedDistrict.includes(option['district_id']));
																	setDistrictList((prevstate) => {
																		let newState = [];
																		newState = [...prevstate];
																		newState[i] = filterArr;
																		return newState;
																	});
																}
															}}
															size="small"
															variant="outlined"
														>
															Add Another
														</Button>
													</span>
												{/* </Tooltip> */}
											</div>}
										</div>
									</div>}
								</Container>
							</Paper>
						</div>
					</form>
				</div>
			) : (
				<div className="tw-flex tw-h-[100vh] tw-items-center tw-justify-center">
					<CircularProgress />
				</div>
			)}
		</>
	);
}
