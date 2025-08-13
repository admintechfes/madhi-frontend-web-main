import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import moment from 'moment';

import { Button, CircularProgress, Container, IconButton, Paper, TextField, Tooltip } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { ErrorBox } from '../../components/Errorbox';
import { BasicDatePicker } from '../../components/DatePicker';
import DropdownWithSearch from '../../components/Programs/DropdownWithSearch';
import { getBlockNameList, getDistrictNameList, getPanchayatNameList, getVillageNameList } from '../../Masters/Districts/duck/network';
import MultipleSelectDropdownWithSearch from '../../components/Programs/MultiSelectDropdownWithSearch';
import { createProgram, getProgramDetails, updateProgram } from '../duck/network';
import { LoadingButton } from '@mui/lab';
import { hideLoader, showLoader } from '../../components/Loader/duck/loaderSlice';
import { utils } from '../../utils';
import { setProgramUpdateDetailLoading } from '../duck/programSlice';

export default function ProgramCreateUpdate(props) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const qParams = useParams();

	const laoding = useSelector((state) => state.program.programCreateLoading);
	const loader = useSelector((state) => state.loader.openLoader);

	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [districtList, setDistrictList] = useState([]);
	const [regionDistrict, setRegionDistrict] = useState([]);
	const [blockZoneList, setBlockZoneList] = useState([]);
	const [regionBlockZone, setRegionBlockZone] = useState([]);
	const [ogDistrictList, setOgDistrictList] = useState([]);
	const [ogRegionBlockZoneList, setOgRegionBlockZoneList] = useState([]);
	const [panchayatWardList, setPanchayatWardList] = useState([]);
	const [ogPanchayatWardList, setOgPanchayatWardList] = useState([]);
	const [regionPanchayatWard, setRegionPanchayatWard] = useState([]);
	const [villageAreaList, setVillageAreaList] = useState([]);
	const [regionvillageArea, setRegionVillageArea] = useState([]);
	const [ogVillageAreaList, setOgVillageAreaList] = useState([]);
	const [programDetails, setProgramDetails] = useState(JSON.parse(window.localStorage.getItem('currentProgram')));

	useEffect(()=>{
		if(location.pathname?.includes('add')) {
			utils.removeLocalStorageValue('currentProgram')
			setProgramDetails(null)}
	},[])

	useEffect(() => {
		const runEffect = async () => {
			if (props?.defaultValues) {
				setStartDate(props.defaultValues.startedAt);
				setEndDate(props.defaultValues.endedAt);
				setValue('startDate', props.defaultValues.startedAt, { shouldValidate: true });
				setValue('endDate', props.defaultValues.endedAt, { shouldValidate: true });
				dispatch(showLoader());
				let distRes = await dispatch(getDistrictNameList());

				setOgDistrictList(distRes);

				let selectedRegionDistrict = props.defaultValues.regions?.map((region, index) => {
					return region.districtId;
				});

				setRegionDistrict(selectedRegionDistrict);

				let filteredDistrictList = props.defaultValues.regions?.map((region, index) => {
					let slicedDistrict = [...selectedRegionDistrict];

					slicedDistrict.splice(index, 1);
					let filterArr = distRes.filter((option) => !slicedDistrict.includes(option['district_id']));

					return filterArr;
				});

				setDistrictList(filteredDistrictList);
				let blockZoneListRes = [];
				for await (const [index, region] of props.defaultValues.regions?.entries() ?? [].entries()) {
					let blockRes = await dispatch(getBlockNameList({ district_id: region.districtId }));
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
					if (blockRes.length == region.blockZoneIds?.length) {
						setProgramDetails((prev) => {
							let newState = { ...prev };
							newState.regions[index].blockZoneIds.unshift('all');
							return newState;
						});
					}
				}

				let selectedRegionBlockZone = props.defaultValues.regions?.map((region) => {
					return region.blockZoneIds;
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
				for await (const [index, region] of props.defaultValues.regions?.entries() ?? [].entries()) {
					let panchayatRes = await dispatch(getPanchayatNameList({ block_zone_id: region.blockZoneIds, source: 'programs' }));
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
					if (panchayatRes.length == region.panchayatWardIds?.length) {
						setProgramDetails((prev) => {
							let newState = { ...prev };
							newState.regions[index].panchayatWardIds.unshift('all');
							return newState;
						});
					}
				}

				let selectedRegionPanchayatWard = props.defaultValues.regions?.map((region) => {
					return region.panchayatWardIds;
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
				for await (const [index, region] of props.defaultValues.regions?.entries() ?? [].entries()) {
					let villageRes = await dispatch(getVillageNameList({ panchayat_ward_id: region.panchayatWardIds, source: 'programs', programId: qParams?.id ?? null }));
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
					if (villageRes.length == region.villageAreaIds?.length) {
						setProgramDetails((prev) => {
							let newState = { ...prev };
							newState.regions[index].villageAreaIds.unshift('all');
							return newState;
						});
					}
				}

				let selectedRegionVillageArea = props.defaultValues.regions?.map((region) => {
					return region.villageAreaIds;
				});

				setRegionVillageArea(() => {
					let newState = [];
					panchayatListRes.forEach((item, index) => {
						if (selectedRegionVillageArea[index]?.length == item?.length) {
							newState[index] = ['all', ...selectedRegionVillageArea[index]];
						} else {
							newState[index] = selectedRegionVillageArea[index];
						}
					});
					return newState;
				});
				dispatch(hideLoader());
			} else {
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
		};
		runEffect();
	}, [props?.defaultValues]);

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: props?.defaultValues
			? { ...props.defaultValues }
			: {
					regions: [{ districtId: null, blockZoneIds: [], panchayatWardIds: [], villageAreaIds: [] }],
			  },
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'regions',
	});

	const onChangeRegionDistrict = (e, index, text = '') => {
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
		//if (programDetails?.status !== 'active') {
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
			setValue(`regions.${index}.blockZoneIds`, []);
			setValue(`regions.${index}.panchayatWardIds`, []);
			setValue(`regions.${index}.villageAreaIds`, []);
		//}
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
		// if(event[0] !== 'all' && event?.filter(el=>el !== 'all') !== regionBlockZone[index]?.filter(el=>el !== 'all')) {
		// 	event = event?.filter(el=>el !== 'all')
		// }
		if (regionBlockZone?.[index]?.includes('all')) {
			if (!event.includes('all')) {
				if (text) {
					setRegionBlockZone((prevstate) => {
						let newState = [...prevstate];
						newState[index] = newState[index].filter((item) => !blockZoneList[index]?.map((el) => el.block_zone_id)?.includes(item));
						if (programDetails?.status == 'active') {
							programDetails?.regions[index]?.blockZoneIds.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`regions.${index}.blockZoneIds`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionBlockZone((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.regions[index]?.blockZoneIds.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`regions.${index}.blockZoneIds`, newState[index]?.filter((id)=>id !== 'all'));
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
				newState[index] = newState.length > 0 && newState[index] ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])];
			} else {
				if (ogRegionBlockZoneList?.[index]?.length >=2 && ogRegionBlockZoneList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`regions.${index}.blockZoneIds`, e);
			return newState;
		});
		dispatch(getPanchayatNameList({ block_zone_id: e, source: 'programs' })).then((res) => {
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
			setValue(`regions.${index}.panchayatWardIds`, []);
			setValue(`regions.${index}.villageAreaIds`, []);
		}
	};

	const onChangeRegionPanchyatWard = (event, index, text = '') => {
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
							programDetails?.regions[index]?.panchayatWardIds.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`regions.${index}.panchayatWardIds`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionPanchayatWard((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.regions[index]?.panchayatWardIds.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`regions.${index}.panchayatWardIds`, newState[index]?.filter((id)=>id !== 'all'));
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
				newState[index] = newState.length > 0 && newState[index] ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])] 
			} else {
				if (ogPanchayatWardList?.[index]?.length >=2 && ogPanchayatWardList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`regions.${index}.panchayatWardIds`, e);
			return newState;
		});
		dispatch(getVillageNameList({ panchayat_ward_id: e, source: 'programs', programId: qParams?.id ?? null })).then((res) => {
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
			setValue(`regions.${index}.villageAreaIds`, []);
		}
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
							programDetails?.regions[index]?.villageAreaIds.forEach((id) => {
								if (!newState[index]?.includes(id)) {
									newState[index].push(id);
								}
							});
						}
						setValue(`regions.${index}.villageAreaIds`, newState[index]?.filter((id)=>id !== 'all'));
						return newState;
					});
				} else {
					setRegionVillageArea((prevstate) => {
						let newState = [...prevstate];
						newState[index] = [];
						if (programDetails?.status == 'active') {
							programDetails?.regions[index]?.villageAreaIds.forEach((id) => {
								newState[index].push(id);
							});
						}
						setValue(`regions.${index}.villageAreaIds`, newState[index]?.filter((id)=>id !== 'all'));
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
				newState[index] = newState.length > 0 && newState[index] ? [...new Set(['all', ...newState[index], ...e])] : [...new Set(['all', ...e])]
			} else {
				if (ogVillageAreaList?.[index]?.length >=2 && ogVillageAreaList?.[index]?.length == event?.filter((el) => el !== 'all')?.length) {
					newState[index] = ['all', ...e];
				} else {
					newState[index] = e;
				}
			}
			setValue(`regions.${index}.villageAreaIds`, e);
			return newState;
		});
	};

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

	const handleDropdownSearchBackSpacEvent = (text, index, dropdownName) => {
		if (dropdownName?.includes('village_area')) {
			//dispatch(getVillageNameList({ panchayat_ward_id: regionBlockZone[index], search: text, source: 'programs' })).then((res) => {
			let res = ogVillageAreaList[index].filter((item) => item.village_area_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
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
			let res = ogPanchayatWardList[index].filter((item) => item.panchayat_ward_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
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
			let res = ogRegionBlockZoneList[index].filter((item) => item.block_zone_id !== 'all').filter((item) => item.name.toLowerCase().includes(text.toLowerCase()));
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
		let dispatchFormValues = { ...formValues, startDate: moment(formValues.startDate).format('YYYY-MM-DD'), endDate: moment(formValues.endDate).format('YYYY-MM-DD') };
		if (qParams.id) {
			dispatch(updateProgram(qParams.id, dispatchFormValues)).then((res) => {
				if (res?.statusCode == 200) {
					dispatch(setProgramUpdateDetailLoading(true))
					navigate('/programs')
				};
			});
		} else {
			dispatch(createProgram(dispatchFormValues)).then((res) => {
				if (res?.statusCode == 200) navigate('/programs');
			});
		}
	};

	return (
		<>
			{!loader ? (
				<div>
					<form onSubmit={handleSubmit(onFormSubmit)}>
						<div className="tw-flex tw-flex-wrap tw-gap-y-3 tw-justify-between">
							<h1 className="tw-font-bold tw-text-[24px]">
								<Button
									variant="text"
									onClick={() => {
										dispatch(setProgramUpdateDetailLoading(true))
										navigate(qParams.id ? `/program-details/${qParams.id}` : '/programs')
									}}
									className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]"
									disableRipple
									startIcon={<KeyboardBackspaceIcon />}
								>
									{`${qParams.id ? 'Program Details' : 'Programs'}`}
								</Button>
								<h1 className="tw-px-2 tw-mt-[-4px]">{qParams.id ? 'Edit Program Details' : 'Create New Program'}</h1>
							</h1>
							<div className="tw-flex tw-gap-x-5">
								<div className="tw-flex tw-gap-x-5">
									<Button onClick={() => {
										dispatch(setProgramUpdateDetailLoading(true))
										navigate(qParams.id ? `/program-details/${qParams.id}` : '/programs')
									}}
									type="button" variant="contained" size="small" className="tw-h-[35px] !tw-bg-white !tw-text-primary">
										Cancel
									</Button>
									<LoadingButton loading={laoding} type="submit" variant="contained" size="small" className="tw-h-[35px]">
										Save
									</LoadingButton>
								</div>
							</div>
						</div>
						<div className="tw-pt-6">
							<Paper>
								<Container maxWidth={false}>
									<div className="tw-py-6">
										<div className="tw-flex tw-justify-between tw-items-center">
											<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Program Details</h1>
											<p className="tw-text-sm">
												<sup className="tw-text-error tw-text-[12px]">*</sup>All fields are mandatory
											</p>
										</div>

										<div className="tw-flex tw-gap-x-12 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
											<Controller
												name="name"
												control={control}
												rules={{ required: 'This field is mandatory', pattern: { value: /.{2,}/, message: 'Minimum 2 character are required' } }}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<TextField variant="outlined" fullWidth size="small" label="Program Name" {...field} />
														{errors.name && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.name.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
											<Controller
												name="startDate"
												control={control}
												rules={{ required: 'This field is mandatory' }}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<BasicDatePicker
															{...field}
															inputFormat="DD-MM-YYYY"
															value={startDate}
															maxDate={endDate}
															onChange={(newValue) => {
																setStartDate(moment(newValue).format('YYYY-MM-DD'));
																setValue('startDate', newValue, { shouldValidate: true });
															}}
															label="Select Start Date of the Program"
														/>
														{errors.startDate && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.startDate.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
											<Controller
												name="endDate"
												control={control}
												rules={{ required: 'This field is mandatory' }}
												render={({ field }) => (
													<div className="tw-w-[300px]">
														<BasicDatePicker
															{...field}
															inputFormat="DD-MM-YYYY"
															value={endDate}
															minDate={startDate}
															onChange={(newValue) => {
																setEndDate(moment(newValue).format('YYYY-MM-DD'));
																setValue('endDate', newValue, { shouldValidate: true });
															}}
															label="Select End Date of the Program"
														/>
														{errors.endDate && (
															<ErrorBox>
																<ErrorOutlineIcon fontSize="small" />
																<span>{errors.endDate.message}</span>
															</ErrorBox>
														)}
													</div>
												)}
											/>
										</div>
									</div>
								</Container>
							</Paper>
						</div>
						<div className="tw-pt-6">
							<Paper>
								<Container maxWidth={false}>
									<div className="tw-py-6">
										<h1 className="tw-text-secondaryText tw-font-semibold tw-text-[20px]">Select Villages where you want to start this program</h1>
										<div>
											<div>
												{fields.map((item, index) => (
													<div className="tw-flex tw-gap-x-6 tw-gap-y-6 tw-flex-wrap tw-pt-6 tw-items-start">
														<Controller
															name={`regions.${index}.districtId`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[250px]">
																	<DropdownWithSearch
																		listSearch={getDistrictNameList}
																		{...field}
																		disabled={qParams.id && programDetails?.status == 'active' && props?.defaultValues?.regions?.length - 1 >= index ? true : false}
																		value={regionDistrict[index]}
																		handleSearch={(text) => handleDropdownSearch(text, index, 'district')}
																		onChange={(e) => {
																			onChangeRegionDistrict(e, index);
																			setValue(`regions.${index}.districtId`, e, { shouldValidate: true });
																		}}
																		options={districtList.length > index && districtList[index] ? districtList[index] : []}
																		valuekey="district_id"
																		labelkey="name"
																		label="Select District"
																	/>
																	{Object.keys(errors).length > 0 && errors?.regions?.[index]?.districtId && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.regions?.[index]?.districtId.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`regions.${index}.blockZoneIds`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[250px]">
																	<Tooltip arrow placement="top-start" title={!regionDistrict[index] ? 'Please select District first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getBlockNameList}
																				{...field}
																				value={regionBlockZone[index]}
																				onChange={(e, text) => {
																					setValue(`regions.${index}.blockZoneIds`, e);
																					onChangeRegionBlockZone(e, index, text);
																				}}
																				handleSearch={(text) => handleDropdownSearch(text, index, 'block_zone')}
																				disabled={!regionDistrict[index] ? true : false}
																				options={blockZoneList.length > index && blockZoneList[index] ? blockZoneList[index] : []}
																				ogOptions={ogRegionBlockZoneList.length > index && ogRegionBlockZoneList[index] ? ogRegionBlockZoneList[index] : []}
																				valuekey="block_zone_id"
																				labelkey="name"
																				label="Select Block/Zone"
																				parentId={regionDistrict[index]}
																				parentName={'district_id'}
																				loadingName={'blockNameLoading'}
																				status={programDetails?.status}
																				preSelected={programDetails?.regions[index]?.blockZoneIds ?? []}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'block_zone')}
																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.regions?.[index]?.blockZoneIds && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.regions?.[index]?.blockZoneIds.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`regions.${index}.panchayatWardIds`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[250px]">
																	<Tooltip arrow placement="top-start" title={!regionBlockZone[index]?.length > 0 ? 'Please select Block/Zone first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getPanchayatNameList}
																				{...field}
																				value={regionPanchayatWard[index]}
																				onChange={(e, text) => {
																					setValue(`regions.${index}.panchayatWardIds`, e);
																					onChangeRegionPanchyatWard(e, index, text);
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
																				loadingName={'panchayatNameLoading'}
																				status={programDetails?.status}
																				preSelected={programDetails?.regions[index]?.panchayatWardIds ?? []}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'panchayat_ward')}
																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.regions?.[index]?.panchayatWardIds && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.regions?.[index]?.panchayatWardIds.message}</span>
																		</ErrorBox>
																	)}
																</div>
															)}
														/>
														<Controller
															name={`regions.${index}.villageAreaIds`}
															control={control}
															rules={{ required: 'This field is mandatory' }}
															render={({ field }) => (
																<div className="tw-w-[250px]">
																	<Tooltip arrow placement="top-start" title={!regionPanchayatWard[index]?.length > 0 ? 'Please select Panchayat/Ward first' : ''}>
																		<span>
																			<MultipleSelectDropdownWithSearch
																				listSearch={getVillageNameList}
																				{...field}
																				value={regionvillageArea[index]}
																				onChange={(e, text) => {
																					setValue(`regions.${index}.villageAreaIds`, e);
																					onChangeRegionVillageArea(e, index, text);
																				}}
																				handleSearch={(text) => handleDropdownSearch(text, index, 'village_area')}
																				disabled={!regionPanchayatWard[index]?.length > 0 ? true : false}
																				options={villageAreaList.length > index && villageAreaList[index] ? villageAreaList[index] : []}
																				ogOptions={ogVillageAreaList.length > index && ogVillageAreaList[index] ? ogVillageAreaList[index] : []}
																				valuekey="village_area_id"
																				labelkey="name"
																				label="Select Village/Area"
																				parentId={regionPanchayatWard[index]}
																				parentName={'panchayat_ward_id'}
																				loadingName={'villageNameLoading'}
																				status={programDetails?.status}
																				preSelected={programDetails?.regions[index]?.villageAreaIds ?? []}
																				handleBackspace={(text) => handleDropdownSearchBackSpacEvent(text, index, 'village_area')}
																			/>
																		</span>
																	</Tooltip>
																	{Object.keys(errors).length > 0 && errors?.regions?.[index]?.villageAreaIds && (
																		<ErrorBox>
																			<ErrorOutlineIcon fontSize="small" />
																			<span>{errors?.regions?.[index]?.villageAreaIds.message}</span>
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
																	disabled={qParams.id && programDetails?.status != 'yet to start' && props?.defaultValues?.regions.length - 1 >= index ? true : false}
																	className=""
																	onClick={() => {
																		remove(index);

																		let tempRegionDistrict = regionDistrict;
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
											<div className="tw-pt-3 tw-flex tw-justify-end">
												<Tooltip arrow placement="top-start" title={fields?.length + 1 > 5 ? 'Max Limit Reached' : ''}>
													<span>
														<Button
															type="button"
															disabled={fields?.length + 1 > 5 ? true : false}
															onClick={() => {
																append({ districtId: null, blockZoneIds: [], panchayatWardIds: [], villageAreaIds: [] });
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
												</Tooltip>
											</div>
										</div>
									</div>
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
