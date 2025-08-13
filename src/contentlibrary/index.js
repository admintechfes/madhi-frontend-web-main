import { Box, Button, CircularProgress, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EnhancedTable from '../components/contentlibrary/Table';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '../components/Tabs/Tabs';
import FilterListIcon from '@mui/icons-material/FilterList';
import ContentFilter from '../components/contentlibrary/contentfilter';
import SearchBox from '../components/SearchBox';
import { deleteQuestion, getContentLibraryList } from './duck/network';
import { resetSelectedQuestionnaire, setSelectedQuestionnaire } from '../UnitContent/duck/unitContentSlice';
import { resetSelectedQuestionnaire as resetSelectedWorkshopQuestionnaire, setSelectedQuestionnaire as setSelectedWorkshopQuestionnaire } from '../UnitContent/Workshops/duck/workshopContentSlice';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import filter_on from '../../public/assets/icons/filter_on.svg';
import { clearSelectedQuestion, fillAnswerFormatValue, fillAnswerTypeValue, fillCreatedByValue, fillFromValue, fillPageNumContentLibrary, fillPerPageNumContent, fillStoreTabs, fillTabSucess, fillTagsValue, fillToValue, setSelectedQuestion } from './duck/contentlibrarySlice';
import { DeleteDialog } from '../components/Dialog';


const header = [
	{
		id: 'question',
		numeric: false,
		disablePadding: true,
		label: 'Question',
		sort: true,
		width: 500,
	},
	{
		id: 'answerFormat',
		numeric: false,
		disablePadding: true,
		label: 'Answer Format',
		sort: true,
		width: 300,
	},
	{
		id: 'answerType',
		numeric: false,
		disablePadding: true,
		label: 'Answer Type',
		sort: true,
		width: 300,
	},
	{
		id: 'tags',
		numeric: false,
		disablePadding: true,
		label: 'Tags',
		sort: true,
		width: 300,
	},
	{
		id: 'createdBy',
		numeric: false,
		disablePadding: true,
		label: 'Created By',
		sort: true,
		width: 250,
	},
	{
		id: 'createdOn',
		numeric: false,
		disablePadding: true,
		label: 'Created On',
		sort: true,
		width: 220,
	},
];

export default function ContentLibrary() {
	const navigate = useNavigate();
	const loader = useSelector((state) => state.contentlibrary.contentListLoading);
	const [list, setList] = useState([]);
	const perPageNum = useSelector((state) => state.contentlibrary.perPageNum)
	const pageNum = useSelector((state) => state.contentlibrary.pageNum)
	const [page, setPage] = useState(pageNum);
	const [anchorEl, setAnchorEl] = useState(null);
	const [searchText, setSearchText] = useState('');
	const dispatch = useDispatch();
	const paginateInfo = useSelector((state) => state.contentlibrary.paginateInfo);
	const [limitPerPage, setLimitPerPage] = useState(perPageNum);
	const contentLibraryList = useSelector((state) => state.contentlibrary.contentList);
	const tagsValue = useSelector((state) => state.contentlibrary.tagsValue);
	const createdbyValue = useSelector((state) => state.contentlibrary.createdbyValue);
	const fromValue = useSelector((state) => state.contentlibrary.fromValue);
	const toValue = useSelector((state) => state.contentlibrary.toValue);
	const answerFormatValue = useSelector((state) => state.contentlibrary.answerFormatValue)
	const answerTypeValue = useSelector((state) => state.contentlibrary.answerTypeValue)
	const Permissions = JSON.parse(localStorage.getItem('permissions'))
	const [applyfilter, setApplyFilter] = useState(false);
	const [storeTagValue, setStoreTagValue] = useState([])
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
	const tab = useSelector((state) => state.contentlibrary.storeTabs);

	/* Modified by nayan for accomplishing unit content feature */
	// const [selected, setSelected] = useState([]);
	const selected = useSelector((state) => state.contentlibrary.selectedQuestion)

	/* Modified by nayan for accomplishing unit content feature */
	const location = useLocation();
	const type = location?.state?.type;
	const redirectFrom = location?.state?.redirectFrom;
	const preAddedIds = location?.state?.preAddedIds;
	const sectionIndex = location?.state?.sectionIndex
	const tabData = useSelector((state) => state.contentlibrary.tabData);


	useEffect(() => {
		let contentType;
		if (tabData) {
			setPage(1)
			if (tabData === "2") {
				contentType = 2
				dispatch(fillStoreTabs(1))
			}
			else {
				contentType = 1
				dispatch(fillStoreTabs(0))
			}
		}
		else {
			contentType = tab == 0 ? 1 : 2
		}

		if (type && (type == 'w_survey' || type == 'survey')) {
			contentType = 2;
		}
		if (!searchText) {
			dispatch(
				getContentLibraryList({
					page: tabData ? 1 : page,
					type: contentType,
					per_page: limitPerPage,
					tagIds: tagsValue.map(item => item.id),
					createdBy: createdbyValue,
					minCreatedOn: fromValue,
					maxCreatedOn: toValue,
					...(tab == 0 && { answerFormat: answerFormatValue }),
					...(tab == 1 && { answerType: answerTypeValue }),
				})
			).then((resp) => {
				/* Modified by nayan for accomplishing unit content feature */
				if (preAddedIds && preAddedIds.length > 0) {
					const filterData = resp?.data.filter((question) => !preAddedIds.includes(question.id));
					formatForDisplay(filterData);
				} else {
					formatForDisplay(resp.data);
				}
			});
		} else {
			/* Modified by nayan for accomplishing unit content feature */
			let contentType = tab == 0 ? 1 : 2;
			if (type && (type == 'w_survey' || type == 'survey')) {
				contentType = 2;
			}
			let timerId = setTimeout(() => {
				dispatch(
					getContentLibraryList({
						page: 1,
						keyword: searchText,
						type: contentType,
						per_page: limitPerPage,
						tagIds: tagsValue.map(item => item.id),
						createdBy: createdbyValue,
						minCreatedOn: fromValue,
						maxCreatedOn: toValue,
						...(tab == 0 && { answerFormat: answerFormatValue }),
						...(tab == 1 && { answerType: answerTypeValue }),
						})
				).then((resp) => {
					/* Modified by nayan for accomplishing unit content feature */
					if (preAddedIds && preAddedIds.length > 0) {
						const filterData = resp?.data.filter((question) => !preAddedIds.includes(question.id));
						formatForDisplay(filterData);
					} else {
						formatForDisplay(resp.data);
					}
				});
			}, 1000);

			return () => clearTimeout(timerId);
		}
	}, [searchText, tab, limitPerPage, type]);

	useEffect(() => {
		return () => dispatch(clearSelectedQuestion())
	}, [])

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};


	const formatForDisplay = (data) => {
		const formatedRows = [];
		data?.forEach((item, index) => {
			formatedRows.push({
				uuid: item.id,
				question: item.title,
				answerFormat: item.answerFormat,
				answerType: item.answerType,
				tags: item.tags,
				createdBy: item.createdBy,
				createdOn: item.createdOn,
				contentType: item.contentType,
				questionnairesJson: item.questionnairesJson,
				tagObject: item.tagObject,
				mediaType: item.mediaType,
				mediaUrl: item.mediaUrl,
				temporaryMediaUrl: item.temporaryMediaUrl,
				description: item.description,
				min:item?.min,
				max:item?.max
			});
		});
		setList(formatedRows);
	};

	const handleSearch = (e) => {
		setSearchText(e.target.value);
	};

	const onPageChange = (page) => {
		let contentType
		if (tabData) {
			if (tabData === "2") {
				contentType = 2
				dispatch(fillStoreTabs(1))
			}
			else {
				contentType = 1
				dispatch(fillStoreTabs(0))
			}
		}
		else {
			contentType = tab == 0 ? 1 : 2
		}

		if (type && (type == 'w_survey' || type == 'survey')) {
			contentType = 2;
		}
		if (type && (type == 'w_quiz' || type == 'quiz')) {
			contentType = 1;
		}
		dispatch(fillTabSucess(""))
		setPage(page);
		dispatch(fillPageNumContentLibrary(page))
		dispatch(
			getContentLibraryList({
				keyword: searchText,
				page: page,
				per_page: limitPerPage,
				type: contentType,
				tagIds: tagsValue.map(item => item.id),
				createdBy: createdbyValue,
				minCreatedOn: fromValue,
				maxCreatedOn: toValue,
				...(tab == 0 && { answerFormat: answerFormatValue }),
				...(tab == 1 && { answerType: answerTypeValue }),
		})
		).then((resp) => {
			/* Modified by nayan for accomplishing unit content feature */
			if (preAddedIds && preAddedIds.length > 0) {
				const filterData = resp?.data.filter((question) => !preAddedIds.includes(question.id));
				formatForDisplay(filterData);
			} else {
				formatForDisplay(resp.data);
			}
		});
	};

	const handleTabChange = (tabValue) => {
		dispatch(fillTabSucess(""))
		if (!redirectFrom) {
			/* Modified by nayan for accomplishing unit content feature */
			dispatch(fillStoreTabs(tabValue));
			setPage(1);
			dispatch(fillTagsValue([]))
			dispatch(fillCreatedByValue(""))
			dispatch(fillFromValue(null))
			dispatch(fillToValue(null))
			dispatch(fillAnswerFormatValue(""))
			dispatch(fillAnswerTypeValue(""))
			setApplyFilter(false)
			setStoreTagValue([])
		}
	};

	const onNavigateDetails = (id, index) => {
		dispatch(fillTabSucess(""))
		navigate({ pathname: `/content-library/${id}/${index}` });
	};

	/* Modified by nayan for accomplishing unit content feature */
	const handleSelected = (selectedData, uuid = '') => {
		dispatch(setSelectedQuestion({ selectedData, uuid }))
		// setSelected(selectedData);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCloseDialog = () => {
		setOpenDeleteDialog(false)
	}

	const DeleteQuestion = () => {
		dispatch(fillTabSucess(""))
		dispatch(deleteQuestion({ ids: [...selected].map(item => item.uuid) })).then((res) => {
			if (res?.data?.statusCode == 200) {
				setOpenDeleteDialog(false)
				dispatch(
					getContentLibraryList({
						page: page,
						keyword: searchText,
						type: tab === 0 ? 1 : 2,
						per_page: limitPerPage,
						tagIds: tagsValue.map(item => item.id),
						createdBy: createdbyValue,
						minCreatedOn: fromValue,
						maxCreatedOn: toValue,
						...(tab == 0 && { answerFormat: answerFormatValue }),
						...(tab == 1 && { answerType: answerFormatValue }),
						})
				).then((resp) => {
					/* Modified by nayan for accomplishing unit content feature */
					if (preAddedIds && preAddedIds.length > 0) {
						const filterData = resp?.data.filter((question) => !preAddedIds.includes(question.id));
						formatForDisplay(filterData);
					} else {
						formatForDisplay(resp.data);
					}
				});
			}
		})
	}



	return (
		<Box>
			{redirectFrom && (
				<Button variant="text" onClick={() => navigate(-1, { state: { ...location.state } })} className="!tw-bg-backgroundColor !tw-text-grey !tw-text-[12px]" disableRipple startIcon={<KeyboardBackspaceIcon />}>
					Back
				</Button>
			)}
			<div className="tw-flex tw-justify-between tw-px-3">
				<Typography variant="h3" className="!tw-font-semibold">
					Content Library
				</Typography>
				<div className="tw-flex tw-gap-6 tw-justify-between">
					<SearchBox placeholder="Search by question" handleSearch={handleSearch} />
					<div className="tw-flex tw-gap-x-5">
						{!redirectFrom && Permissions?.["Content Library"]?.create && ( // Modified by nayan for accomplishing unit content feature
							<Button variant="contained" onClick={() => navigate('/content-library/create-question')} className="uppercase">
								Add new Question
							</Button>
						)}
						{redirectFrom && ( // Modified by nayan for accomplishing unit content feature
							<Button
								disabled={selected.length > 0 ? false : true}
								variant="contained"
								onClick={() => {
									let finalData = selected;
									finalData = finalData.map((obj) => {
										let object = JSON.parse(JSON.stringify(obj))
										// Assign new key
										if (!('id' in object) && !('title' in object)) {
											object['id'] = object['uuid'];
											object['title'] = object['question'];
										}

										// Delete old key
										delete object['uuid'];
										delete object['question'];

										// Add new property
										object.canSkip = false

										if (type == 'quiz' || type == 'w_quiz'){
											object.weightage = '1'
										}

										return object;
									});
									if (type == 'quiz' || type == 'survey') dispatch(setSelectedQuestionnaire({ finalData, sectionIndex }));
									if (type == 'w_quiz') dispatch(setSelectedWorkshopQuestionnaire({ finalData, sectionIndex }));
									if (type == 'w_survey') dispatch(setSelectedWorkshopQuestionnaire({ finalData, sectionIndex }));

									navigate(-1, { state: { ...location.state } });
									dispatch(clearSelectedQuestion())
								}}
								className="uppercase"
							>
								Add Selected Question
							</Button>
						)}
					</div>
				</div>
			</div>
			<Paper className="tw-w-full tw-pt-6 tw-mt-6">
				<div className="tw-flex tw-justify-between tw-items-center tw-pr-4">
					<Grid justifyContent={'space-between'} sx={{ marginLeft: '0px' }}>
						{!redirectFrom && ( // Modified by nayan for accomplishing unit content feature
							<Tabs tabValue={tab} tabs={['Quiz Questions', 'Survey Questions']} tabChange={handleTabChange} />
						)}
					</Grid>
					<div className="tw-relative tw-flex tw-gap-4">
						{!redirectFrom && <Button variant="outlined" className="uppercase" disabled={selected.length > 0 ? false : true} onClick={() => setOpenDeleteDialog(true)}>Delete</Button>}
						<Button variant="outlined" onClick={handleClick} className="uppercase" endIcon={!applyfilter ? <FilterListIcon className="tw-text-primaryColor" /> : <img src={filter_on} />}>
							Filters
						</Button>
						<ContentFilter storeTagValue={storeTagValue} setStoreTagValue={setStoreTagValue} anchorEl={anchorEl} setApplyFilter={setApplyFilter} applyfilter={applyfilter} setAnchorEl={setAnchorEl} handleClose={handleClose} tab={tab} type={type} page={page} formatForDisplay={formatForDisplay} limitPerPage={limitPerPage} preAddedIds={preAddedIds} />
					</div>
				</div>
				<>
					{!loader ? (
						<>
							{list.length ? (
								<EnhancedTable
									paginate={paginateInfo}
									onNavigateDetails={onNavigateDetails}
									scrollable
									actions={{ edit: true, preview: true }}
									columns={header}
									data={list}
									onPageChange={onPageChange}
									page={page}
									details={true}
									keyProp="uuid"
									redirectFrom={redirectFrom || 'contentLibrary'} // Modified by nayan for accomplishing unit content feature
									handleSelected={handleSelected} // Modified by nayan for accomplishing unit content feature
									selectedData={selected} // Modified by nayan for accomplishing unit content feature
									setLimitPerPage={setLimitPerPage}
									limitPerPage={limitPerPage}
									setPage={setPage}
									dispatchperPage={fillPerPageNumContent}
									clearSelected={() => dispatch(clearSelectedQuestion())}
								/>
							) : (
								<div className="tw-p-6 tw-mt-5 tw-bg-[#FAFCFE] tw-text-SecondaryTextColor  tw-font-normal tw-text-sm tw-text-center tw-rounded-lg">
									<span>No Data Found</span>
								</div>
							)}
						</>
					) : (
						<div className="tw-text-center tw-py-5">
							<CircularProgress />
						</div>
					)}
				</>
			</Paper>
			{openDeleteDialog && (
				<DeleteDialog open={openDeleteDialog} loading={false} close={handleCloseDialog} delete={() => DeleteQuestion()} title="Delete Question">
					<p>Are you sure, you want to delete this question? This action is irreversible</p>
				</DeleteDialog>
			)}
		</Box>
	);
}
