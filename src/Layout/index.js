import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { utils } from '../../utils';
import Sidebar from '../Sidebar';
import { useLocation } from 'react-router-dom';
import { verifyUser } from '../../Auth/Login/duck/network';
import { useDispatch } from 'react-redux';
import { fillProgramApplyFilter, fillProgramFilterBlock, fillProgramFilterDistrict, fillProgramFilterPanchayat, fillProgramFilterStatus, fillProgramFilterVillage, setPaginationPage, setSelectedProgramStatus } from '../../Programs/duck/programSlice';
import { fillFilterDistrict, fillFilterRole, fillFilterVillage, fillPageNum as fillUserPageNum, fillPerPageNum as fillUserPerPageNum, fillApplyFilter as TeamFilter } from '../../Users/duck/userSlice';
import {
	fillApplyFilter,
	fillMaxBlockZonesCount,
	fillMaxCEWCount,
	fillMaxPanchayatWardsCount,
	fillMaxParentCount,
	fillMaxProgramCount,
	fillMaxSupervisorCount,
	fillMaxVillageAreasCount,
	fillMinBlockZonesCount,
	fillMinCEWCount,
	fillMinPanchayatWardsCount,
	fillMinParentCount,
	fillMinProgramCount,
	fillMinSupervisorCount,
	fillMinVillageAreasCount,
	fillPerPageNum as fillDistrictPerPageNum,
	fillPageNum as fillDistrictPageNum
} from '../../Masters/Districts/duck/DistrictsSlice';
import {
	fillAssignedSupervisorId, fillApplyFilter as fillApplyFilterPanchayat, fillMinCEWCount as fillPanchayatMinCEWCount, fillMaxCEWCount as fillPanchayatMaxCEWCount, fillMinVillageAreasCount as fillPanchayatMinVillageAreasCount, fillMaxVillageAreasCount as fillPanchayatMaxVillageAreasCount, fillMinParentCount as fillPanchayatMinParentCount, fillMaxParentCount as fillPanchayatMaxParentCount, fillPerPageNum as fillPanchayatPerPageNum,
	fillPageNum as fillPanchayatPageNum
} from '../../Masters/Panchayat/duck/panchayatSlice';
import {
	fillAssignedDistrict, fillApplyFilter as BlockFilter, fillPerPageNum as fillBlockPerPageNum,
	fillPageNum as fillBlockPageNum
} from '../../Masters/Block/duck/blockSlice';
import { fillAnswerFormatValue, fillAnswerTypeValue, fillCreatedByValue, fillFromValue, fillPageNumContentLibrary, fillPerPageNumContent, fillStoreTabs, fillTabSucess, fillTagsValue, fillToValue } from '../../contentlibrary/duck/contentlibrarySlice';
import { fillBlockZoneIds, fillProgressCewValue, fillDistrictIds, fillEndDateValue, fillPageNumParents, fillPanchayatWardIds, fillPerPageNumParents, fillStartDateValue, fillSupervisorValue, fillVillageAreaIds, fillVillageValue, setSelectedQuestion, fillCewValue, setSelectedSharedQuizQuestion, fillPageNumSharedQuizParents, fillPerPageNumSharedQuizParents, fillPageNumSharedWorkshopParents, fillPerPageNumSharedWorkshopParents, setSelectedSharedWorkshopQuestion } from '../../parents/duck/parentsSlice';
import { getCEWNameList } from '../../Masters/Districts/duck/network';

import {
	fillApplyFilter as fillVillageApplyFilter, fillPerPageNum as fillVillagePerPageNum,
	fillPageNum as fillVillagePageNum
} from '../../Masters/Village/duck/VillageSlice';
import { fillAttendanceValue, fillConductedByValue, fillStatusValue } from '../../Progress/Village/visits/duck/visitsSlice';
import { fillQuizProgresStatusValue, fillQuizStartDateValue, fillQuizEndDateValue, fillQuizStatusValue } from '../../Progress/Village/quiz/duck/quizSlice';
import { fillLearningContentEndDateValue, fillLearningContentParentsPlatformValue, fillLearningContentParentsStatusValue, fillLearningContentStartDateValue, fillLearningContentTypeValue, fillLearningStatusValue } from '../../Progress/Village/learningContent/duck/learningSlice';
import { fillSessionValue, fillWorkshopSessionFilter, fillWorkshopStatusValue } from '../../Progress/Village/workshop/duck/workshopSlice';
import { fillApplySurveyFilter, fillSurveyProgressStatusValue, fillSurveyStatusValue } from '../../Progress/Village/survey/duck/surveySlice';
import { fillProgressBlockZoneIds, fillProgressDistrictIds, fillProgressPanchayatWardIds, fillProgressVillageAreaIds, fillStoreTabValue } from '../../Progress/duck/progressSlice';
import { fillFilterData, fillFormDataCampaign, fillTagsFilter, fillWhatsappEndDateValue, fillWhatsappStartDateValue } from '../../ManualWhatsApp/duck/manualWhatsAppSlice';
import { fillFormDataOutboundCampaign, fillIVRIDValue, fillOutboundFromValue, fillOutboundToValue, fillProgramNameValue, fillSTatusValue, fillTagsOutboundValue, fillUnitNumberValue } from '../../OutBoundCampaign/duck/OutboundCampaignSlice';
import { fillTainingApplyFilter, fillTainingDetailsApplyFilter, fillTainingDetailsStatusFilter, filltrainingAttendanceByVal, filltrainingCreatedByVal, fillTrainingProgramFilterStatus, filltrainingProgramUnitVal, filltrainingProgramVal, filltrainingStatusVal } from '../../Training/duck/trainingSlice';
import { fillNotificationCampaignAddedUsers, fillNotificationFromValue, fillNotificationToValue, fillTagsNotificationValue, setSelectedMember } from '../../InAppNotifications/duck/notificationSlice';
import { fillEngagementScoreData } from '../../EngagementScoreRule/duck/scoreSlice';
// import { fillAssignedSupervisorId } from '../../Masters/Village/duck/VillageSlice';

export default function Layout(props) {
	const auth = useSelector((state) => state?.auth?.user);
	const selectedProgramStatus = useSelector((state) => state.program.selectedProgramStatus)
	const [token, setToken] = useState(utils.getLocalStorageValue('token'));
	const location = useLocation();
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);

	let publicUrl = false;
	if ((location.pathname.includes('unit-content/questionnaire-attempt') || location.pathname === '/terms-and-conditions' || location.pathname === '/privacy-policy')) publicUrl = true;

	useEffect(() => {
		if (token) dispatch(verifyUser());
	}, [token]);

	useEffect(() => {
		let path = location.pathname;

		if (!(path.includes('program') || path.includes('progress') || path.includes('unit-content') || path.includes('workshop-content'))) {
			if (selectedProgramStatus !== 'all') dispatch(setSelectedProgramStatus('all'));
			dispatch(setPaginationPage(1))
			dispatch(fillWorkshopSessionFilter(false))
			dispatch(fillSessionValue(null));
			dispatch(fillSurveyProgressStatusValue(null));
			dispatch(fillApplySurveyFilter(false))

		}

		if (!(path.includes('team-members') || path.includes('team-member-details'))) {
			dispatch(fillFilterDistrict(''));
			dispatch(fillFilterVillage(''));
			dispatch(fillFilterRole(''));
			dispatch(TeamFilter(""))
			dispatch(fillUserPageNum(1));
			dispatch(fillUserPerPageNum(10))
		}

		if (!(path.includes('districts') || path.includes('district-details'))) {
			dispatch(fillMinBlockZonesCount(null));
			dispatch(fillMaxBlockZonesCount(null));
			dispatch(fillMinPanchayatWardsCount(null));
			dispatch(fillMaxPanchayatWardsCount(null));
			dispatch(fillMinVillageAreasCount(null));
			dispatch(fillMaxVillageAreasCount(null));
			dispatch(fillMinSupervisorCount(null));
			dispatch(fillMaxSupervisorCount(null));
			dispatch(fillMinCEWCount(null));
			dispatch(fillMaxCEWCount(null));
			dispatch(fillMinParentCount(null));
			dispatch(fillMaxParentCount(null));
			dispatch(fillMinProgramCount(null));
			dispatch(fillMaxProgramCount(null));
			dispatch(fillMinBlockZonesCount(null));
			dispatch(fillApplyFilter(false));
			dispatch(fillDistrictPageNum(1));
			dispatch(fillDistrictPerPageNum(10))
		}

		if (!(path.includes('block_zone') || path.includes('block-zone-details'))) {
			dispatch(fillMinPanchayatWardsCount(null));
			dispatch(fillMaxPanchayatWardsCount(null));
			dispatch(fillMinVillageAreasCount(null));
			dispatch(fillMaxVillageAreasCount(null));
			dispatch(fillMinParentCount(null));
			dispatch(fillMaxParentCount(null));
			// dispatch(fillApplyFilter(false));
			dispatch(BlockFilter(false))
			dispatch(fillAssignedDistrict(null));
			dispatch(fillBlockPageNum(1));
			dispatch(fillBlockPerPageNum(10))
		}
		if (!(path.includes('panchayat_ward') || path.includes('panchayat-ward-details'))) {
			dispatch(fillPanchayatMinCEWCount(null));
			dispatch(fillPanchayatMaxCEWCount(null));
			dispatch(fillPanchayatMinVillageAreasCount(null));
			dispatch(fillPanchayatMaxVillageAreasCount(null));
			dispatch(fillPanchayatMinParentCount(null));
			dispatch(fillPanchayatMaxParentCount(null));
			dispatch(fillAssignedSupervisorId(null));
			dispatch(fillApplyFilterPanchayat(false))
			dispatch(fillPanchayatPageNum(1));
			dispatch(fillPanchayatPerPageNum(10))
		}
		if (!(path.includes('village_area') || path.includes('village-area-details'))) {
			dispatch(fillVillageApplyFilter(false))
			dispatch(fillVillagePageNum(1));
			dispatch(fillVillagePerPageNum(10))
		}
		if (!(path.includes('content-library'))) {
			dispatch(fillTagsValue([]))
			dispatch(fillCreatedByValue(""))
			dispatch(fillFromValue(null))
			dispatch(fillToValue(null))
			dispatch(fillAnswerFormatValue(""))
			dispatch(fillAnswerTypeValue(""))
			dispatch(fillPageNumContentLibrary(1));
			dispatch(fillPerPageNumContent(10))
			dispatch(fillTabSucess(""))
			dispatch(fillStoreTabs(0))

		}
		if (!(path.includes('parents'))) {
			dispatch(fillDistrictIds([]))
			dispatch(fillBlockZoneIds([]))
			dispatch(fillPanchayatWardIds([]))
			dispatch(fillVillageAreaIds([]))
			dispatch(fillSupervisorValue(""))
			dispatch(fillCewValue(""))
			dispatch(fillStartDateValue(null))
			dispatch(fillEndDateValue(null))
			dispatch(fillPageNumParents(1));
			dispatch(fillPerPageNumParents(10))
			dispatch(fillPageNumSharedQuizParents(1));
			dispatch(fillPerPageNumSharedQuizParents(10))
		}

		if (!path.includes('visits')) {
			dispatch(fillAttendanceValue(""))
		}
		if (!path.includes('/village/quiz')) {
			dispatch(fillQuizProgresStatusValue(""))
			dispatch(fillQuizStartDateValue(null))
			dispatch(fillQuizEndDateValue(null))
		}
		if (!path.includes('/village/learning')) {
			dispatch(fillLearningContentTypeValue(""))
			dispatch(fillLearningContentParentsStatusValue(""))
			dispatch(fillLearningContentParentsPlatformValue(""))
			dispatch(fillLearningContentStartDateValue(null))
			dispatch(fillLearningContentEndDateValue(null))
		}

		if (!path.includes('/progress/village')) {
			dispatch(fillConductedByValue(''));
			dispatch(fillStatusValue(''));
			dispatch(fillStartDateValue(null));
			dispatch(fillEndDateValue(null));
			dispatch(fillQuizStatusValue(''));
			dispatch(fillWorkshopStatusValue(''));
			dispatch(fillSurveyStatusValue(''));
			dispatch(fillLearningStatusValue(''));
			dispatch(fillStoreTabValue(0))
		}


		if (!(path.includes('programs') || path.includes('progress') || path.includes('program-details'))) {
			dispatch(fillProgramFilterDistrict(''));
			dispatch(fillProgramFilterVillage(''));
			dispatch(fillProgramFilterStatus(""));
			dispatch(fillProgramFilterBlock(""))
			dispatch(fillProgramFilterPanchayat(""))
			dispatch(fillProgramApplyFilter(false))

		}

		if(!(path.includes('progress/'))){
			dispatch(fillProgressDistrictIds([]))
			dispatch(fillProgressBlockZoneIds([]))
			dispatch(fillProgressPanchayatWardIds([]))
			dispatch(fillProgressVillageAreaIds([]))
		}


		if (!(path.includes('manual-whatsapp/add') || path.includes('parents'))) {
			dispatch(fillFormDataCampaign({}))
			dispatch(setSelectedQuestion([]))
			dispatch(setSelectedSharedQuizQuestion([]))
			dispatch(setSelectedSharedWorkshopQuestion([]))
			dispatch(fillTagsFilter([]));
			dispatch(fillFilterData({}))
			dispatch(fillWhatsappEndDateValue(null))
			dispatch(fillWhatsappStartDateValue(null))

		}

		if (!(path.includes('outbound'))) {
			dispatch(fillOutboundFromValue(null))
			dispatch(fillOutboundToValue(null))
			dispatch(fillIVRIDValue(""))
		}

		dispatch(fillProgramNameValue(""))
		dispatch(fillUnitNumberValue(""))
		dispatch(fillSTatusValue(""))


		if (!(path.includes('outbound') || path.includes('parents'))) {
			dispatch(fillFormDataOutboundCampaign({}))
			dispatch(fillTagsOutboundValue(""))
		}
		if (!(path.includes('cew-training') || path.includes('cew-training-details'))) {
			dispatch(filltrainingStatusVal(''));
			dispatch(fillStartDateValue(null));
			dispatch(fillEndDateValue(null));
			dispatch(filltrainingProgramVal(null));
			dispatch(filltrainingProgramUnitVal(null))
			dispatch(fillTainingApplyFilter(false));
			dispatch(filltrainingCreatedByVal(null));
			dispatch(fillTainingDetailsStatusFilter(null));

		}

		if (!(path.includes('cew-training-details'))) {
			dispatch(fillTainingDetailsApplyFilter(false))

		}

		if (!(path.includes('manual-in-app-notification') || path.includes('team-members'))) {
			dispatch(fillNotificationCampaignAddedUsers({}))
			dispatch(setSelectedMember([]))
		}

		if (!(path.includes('manual-in-app-notification'))) {
			dispatch(fillTagsNotificationValue([]))
			dispatch(fillNotificationFromValue(null))
			dispatch(fillNotificationToValue(null))
		}

		if (!path.includes("programs-unit/engagement-rule/create")) {
			dispatch(fillEngagementScoreData([]))
		}



		// if (!(path.includes('village_area') || path.includes('panchayat-ward-details'))) {

		// 	dispatch(fillApplyFilter(false))
		// dispatch(fillassignedCEWId(null))
		// dispatch(fillAssignedSeniorSupervisorId(null))
		// dispatch(fillMinParentCount(null))
		// dispatch(fillMaxParentCount(null))
		// dispatch(fillAssignedSupervisorId(null))
		// }







	}, [location]);

	useEffect(() => {
		setToken(utils.getLocalStorageValue('token'));
	}, [auth]);

	return (
		<>
			{!publicUrl ? (
				<div className={token ? 'tw-flex tw-gap-1 tw-min-h-[100vh] tw-bg-backgroundGrey ' : 'tw-block'}>
					{token ? <Sidebar setIsOpen={setIsOpen} isOpen={isOpen} token={token} /> : null}

					<div className={token ? `${isOpen ? "tw-w-[calc(100vw-67px)] tw-ml-11" : "tw-w-[calc(100vw-280px)]"} tw-delay-150 tw-p-8` : 'tw-block'}>{props.children}</div>
				</div>
			) : (
				<div className="tw-bg-backgroundGrey">{props.children}</div>
			)}
		</>
	);
}
