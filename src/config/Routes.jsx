import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import { utils } from '../utils';
import App from '../App';
import Login from '../Auth/Login';
import Users from '../Users';
import ContentLibrary from '../contentlibrary';
import QuestionDetail from '../contentlibrary/questiondetail';
import Districts from '../Masters/Districts';
import Block from '../Masters/Block';
import Panchayat from '../Masters/Panchayat';
import Village from '../Masters/Village';
import DistrictsDetails from '../Masters/Districts/DistrictsDetails';
import CreateQuestion from '../contentlibrary/createquestion';
import PanchayatDetails from '../Masters/Panchayat/PanchayatDetails';
import BlockDetails from '../Masters/Block/BlockDetails';
import VillageDetails from '../Masters/Village/VillageDetails';
import CreateDistrict from '../Masters/Districts/CreateDistrict';
import Programs from '../Programs';
import ProgramDetails from '../Programs/ProgramDetails';
import ProgramCreateUpdate from '../Programs/ProgramCreate';
import UpdateDistrict from '../Masters/Districts/UpdateDistrict';
import CreateBlock from '../Masters/Block/CreateBlock';
import CreatePanchayat from '../Masters/Panchayat/CreatePanchayat';
import CreateVillage from '../Masters/Village/CreateVillage';
import UpdateBlock from '../Masters/Block/UpdateBlock';
import UpdatePanchayat from '../Masters/Panchayat/UpdatePanchayat';
import UpdateVillage from '../Masters/Village/UpdateVillage';
import ProgramUpdate from '../Programs/ProgramUpdate';
import UpdateQuestion from '../contentlibrary/update-question';
import UserDetails from '../Users/UserDetails';
import UnitCreate from '../Units/UnitCreate';
import UnitUpdate from '../Units/UnitUpdate';
import UnitContent from '../UnitContent';
import WorkshopCreate from '../UnitContent/Workshops/WorkshopCreate';
import WorkshopDetail from '../UnitContent/Workshops/WorkshopDetail';
import WorkshopUpdate from '../UnitContent/Workshops/WorkshopUpdate';
import UserCreateUpdate from '../Users/UserCreate';
import UserUpdate from '../Users/UserUpdate';
import ViewProfile from '../ViewProfile';
import UpdateProfileDetails from '../ViewProfile/UpdateProfileDetails';
import Parents from '../parents';
import ParentsDetail from '../parents/parentsdetail';
import CreateParent from '../parents/createparent';
import UpdateParent from '../parents/update-parent';
import QuizzesCreate from '../UnitContent/Quizzes/QuizzesCreate';
import QuizzesUpdate from '../UnitContent/Quizzes/QuizzessUpdate';
import WorkshopContent from '../UnitContent/Workshops/WorkshopContent';
import WorkshopQuizzesCreate from '../UnitContent/Workshops/WorkshopContent/Quizzes/QuizzesCreate';
import WorkshopQuizzesUpdate from '../UnitContent/Workshops/WorkshopContent/Quizzes/QuizzessUpdate';
import WorkshopObservationFormCreate from '../UnitContent/Workshops/WorkshopContent/ObservationForms/ObservationFormsCreate';
import WorkshopObservationFormUpdate from '../UnitContent/Workshops/WorkshopContent/ObservationForms/ObservationFormsUpdate';
import Preview from '../Programs/Quiz/Preview';
import BulkUpload from '../parents/bulk-upload';
import PermissionManagement from '../PermissionManagement';
import SurveysCreate from '../UnitContent/Surveys/SurveysCreate';
import SurveysUpdate from '../UnitContent/Surveys/SurveysUpdate';
import LearningActivityCreate from '../UnitContent/LearningActivity/LearningActivityCreate';
import LearningActivityUpdate from '../UnitContent/LearningActivity/LearningActivityUpdate';
import ProgressDetails from '../Progress';
import VillageArea from '../Progress/Village';
import Workshop from '../Progress/Village/workshop';
import Quiz from '../Progress/Village/quiz';
import Survey from '../Progress/Village/survey';
import Visits from '../Progress/Village/visits';
import Session from '../Progress/Village/workshop/session';
import LearningContent from '../Progress/Village/learningContent';
import ContentList from '../Progress/Village/learningContent/contentList';
import QuizzesPreview from '../UnitContent/Quizzes/QuizzesPreview';
import QuizzesAttempt from '../UnitContent/Quizzes/QuizzessAttempt';
import WorkshopQuizzesPreview from '../UnitContent/Workshops/WorkshopContent/Quizzes/QuizzesPreview';
import SurveysPreview from '../UnitContent/Surveys/SurevysPreview';
import WorkshopObservationFormPreview from '../UnitContent/Workshops/WorkshopContent/ObservationForms/ObservationFormPreview';
import QuizPreview from '../Progress/Village/quiz/quizpreview';
import VillageUsers from '../Progress/VillageUsers';
import SurveyPreview from '../Progress/Village/survey/surveyPreview';
import SurveyUpdate from '../Progress/Village/survey/surveyUpdate';
import WorkshopPreview from '../Progress/Village/workshop/workshopPreview';
import WorkshopQuizPreview from '../Progress/Village/workshop/workshopQuizPreview';
import TermsConditions from '../Terms&Conditions';
import PrivacyPolicy from '../PrivacyPolicy';
import ActivityLog from '../Activitylog';
import QuizChildren from '../Programs/Quiz/Children';
import SurveyChildren from '../Progress/Village/survey/surveyChildren';
import ManualWhatsApp from '../ManualWhatsApp';
import { CampaignCreate } from '../ManualWhatsApp/CampaignCreate';
import ManualWhatsAppDetails from '../ManualWhatsApp/ManualWhatsAppDetails';
import VisitsPreview from '../components/Progress/visits/visitspreview';
import Template from '../OutBoundTemplate';
import TemplateDetail from '../OutBoundTemplate/TemplaDetail';
import Campaign from '../OutBoundCampaign';
import CampaignDetail from '../OutBoundCampaign/CampaignDetails';
import { CreateIVRSCampaign } from '../OutBoundCampaign/CreateIVRSCampaign';
import SessionChildren from '../Progress/Village/workshop/sessionChildren';
import WorkshopQuizChildPreview from '../Progress/Village/workshop/workshopQuizChildPreview';
import GlificFlowManagement from '../GlificFlowManagement';
import GlificFlowManagementDetails from '../GlificFlowManagement/GlificFlowManagementDetails';
import { CreateIVRSTemplate } from '../OutBoundTemplate/CreateIVRSTemplate';
import VisitsCreate from '../UnitContent/Visits/VisitsCreate';
import VisitsUpdate from '../UnitContent/Visits/VisitsUpdate';
import VisitsPrev from '../UnitContent/Visits/VisitsPreview';
import { GlificFlowCreate } from '../GlificFlowManagement/CampaignCreate';
import InAppNotifications from '../InAppNotifications';
import InboundIVRS from '../InboundIVRS';
import Training from '../Training';
import TrainingDetails from '../Training/TrainingDetails';
import ManageGlificFlow from '../GlificFlowManagement/ManageGlificFlow';
import CreateNotification from '../InAppNotifications/createnotification';
import InAppCampaignDetail from '../InAppNotifications/InAppCampaignDetails';
import EngagementScoreRule from '../EngagementScoreRule';
import StudentQuizRule from '../StudentQuizRule';
import CreateStudentQuizRule from '../StudentQuizRule/createquizrule';
import UpdateStudentQuizRule from '../StudentQuizRule/updatequizrule';
import StudentQuizReport from '../Progress/StudentQuizReport';
import ManageBulkUploadParent from '../parents/manage-bulk-upload';
import ParentsAdded from '../parents/manage-bulk-upload/parents-added';
import ManageBulkUploadVillageArea from '../Masters/Village/manage-bulk-upload';
import LocationAdded from '../Masters/Village/manage-bulk-upload/LocationAdded';
import EngagementScoreRuleCreate from '../EngagementScoreRule/CreateEngagement';
import ChangeLog from '../EngagementScoreRule/ChangeLog';
import VillageProgress from '../Progress/VillageProgress';
import PastEngagementScoreRule from '../EngagementScoreRule/ChangeLog/PastEngagementScoreRule';
import ParentProgress from '../Progress/ParentProgress';
import ErrorsAdded from '../Masters/Village/manage-bulk-upload/errorAdded';
import SharedParents from '../sharedQuizParents';
import SharedWorkshopParents from '../sharedWorkshopParents';

function Navigation() {
	const [navigate, setNavigate] = useState('')

	const location = useLocation();
	let token = utils.getLocalStorageValue('token');
	let navPermission = JSON.parse(window.localStorage.getItem('permissions'));

	useEffect(() => {
		token = utils.getLocalStorageValue('token');
		if (navPermission) {
			let navs = Object.keys(navPermission);
			if (navs[0].toLowerCase() == 'masters') {
				let innerNavs = Object.keys(navPermission?.Masters);
				setNavigate(`masters/${innerNavs[0].toLowerCase().replace('/', '_')}`)
			} else {
				setNavigate(`${navs[0].toLowerCase().replace(' ', '-')}`)
			}
		}
	}, [location]);


	return (
		<div>
			<Routes>
				<Route exact path="/" element={token ? <Navigate replace to={`/${navigate}`} /> : <Navigate replace to="/login" />}></Route>
				<Route exact path="/login" element={<Login />}></Route>
				<Route path="/profile" element={token ? <ViewProfile /> : <Navigate replace to="/login" />}></Route>
				<Route path="/profile/update" element={token ? <UpdateProfileDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/permission-management" element={token ? <PermissionManagement /> : <Navigate replace to="/login" />}></Route>
				<Route path="/team-members" element={token ? <Users /> : <Navigate replace to="/login" />}></Route>
				<Route path="/team-member-details/:id" element={token ? <UserDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/team-member/add" element={token ? <UserCreateUpdate /> : <Navigate replace to="/login" />}></Route>
				<Route path="/team-member/update/:id" element={token ? <UserUpdate /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents" element={token ? <Parents /> : <Navigate replace to="/login" />}></Route>
				<Route path="/shared-parents" element={token ? <SharedParents  /> : <Navigate replace to="/login" />}></Route>
				<Route path="/workshop-shared-parents" element={token ? <SharedWorkshopParents  /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents-detail/:id" element={token ? <ParentsDetail /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents/create-parent" element={token ? <CreateParent /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents/update-parent/:id/" element={token ? <UpdateParent /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents/manage-bulk-upload" element={token ? <ManageBulkUploadParent /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents/manage-bulk/view-errors" element={token ? <BulkUpload /> : <Navigate replace to="/login" />}></Route>
				<Route path="/parents/manage-bulk/parents-added" element={token ? <ParentsAdded /> : <Navigate replace to="/login" />}></Route>
				<Route path="/content-library" element={token ? <ContentLibrary /> : <Navigate replace to="/login" />}></Route>
				<Route path="/content-library/:id/:index" element={token ? <QuestionDetail /> : <Navigate replace to="/login" />}></Route>
				<Route path="/content-library/create-question" element={token ? <CreateQuestion /> : <Navigate replace to="/login" />}></Route>
				<Route path="/content-library/update-question/:id/" element={token ? <UpdateQuestion /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/districts" element={token ? <Districts /> : <Navigate replace to="/login" />}></Route>
				<Route path="/district/add" element={token ? <CreateDistrict /> : <Navigate replace to="/login" />}></Route>
				<Route path="/district/update/:id" element={token ? <UpdateDistrict /> : <Navigate replace to="/login" />}></Route>
				<Route path="/district-details/:id" element={token ? <DistrictsDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/block_zone" element={token ? <Block /> : <Navigate replace to="/login" />}></Route>
				<Route path="/block-zone-details/:id" element={token ? <BlockDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/block-zone/add" element={token ? <CreateBlock /> : <Navigate replace to="/login" />}></Route>
				<Route path="/block-zone/update/:id" element={token ? <UpdateBlock /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/panchayat_ward" element={token ? <Panchayat /> : <Navigate replace to="/login" />}></Route>
				<Route path="/panchayat-ward-details/:id" element={token ? <PanchayatDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/panchayat-ward/add" element={token ? <CreatePanchayat /> : <Navigate replace to="/login" />}></Route>
				<Route path="/panchayat-ward/update/:id" element={token ? <UpdatePanchayat /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/village_area" element={token ? <Village /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/village_area/manage-bulk-upload" element={token ? <ManageBulkUploadVillageArea /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/village_area/manage-bulk-upload/location-added" element={token ? <LocationAdded /> : <Navigate replace to="/login" />}></Route>
				<Route path="/masters/village_area/manage-bulk-upload/error-added" element={token ? <ErrorsAdded /> : <Navigate replace to="/login" />}></Route>
				<Route path="/village-area-details/:id" element={token ? <VillageDetails /> : <Navigate replace to="/login" />}></Route>
				<Route path="/village-area/add" element={token ? <CreateVillage /> : <Navigate replace to="/login" />}></Route>
				<Route path="/village-area/update/:id" element={token ? <UpdateVillage /> : <Navigate replace to="/login" />}></Route>
				<Route path="/programs" element={token ? <Programs /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/program-details/:id" element={token ? <ProgramDetails /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs/add" element={token ? <ProgramCreateUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs/update/:id" element={token ? <ProgramUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs/quiz/preview" element={token ? <Preview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/create/:programId" element={token ? <UnitCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/update/:programId/:unitId" element={token ? <UnitUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/unit-content/:id" element={token ? <UnitContent /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/engagement-rule" element={token ? <EngagementScoreRule /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/engagement-rule/create" element={token ? <EngagementScoreRuleCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/engagement-rule/change-log" element={token ? <ChangeLog /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/past-engagement-rule" element={token ? <PastEngagementScoreRule /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/student-quiz-rule" element={token ? <StudentQuizRule /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/student-quiz-rule/create" element={token ? <CreateStudentQuizRule /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/programs-unit/student-quiz-rule/update" element={token ? <UpdateStudentQuizRule /> : <Navigate replace to="/login" />}></Route>
				<Route path="/unit-content/workshops/create" element={token ? <WorkshopCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/workshops/:id" element={token ? <WorkshopDetail /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/workshops/update/:id" element={token ? <WorkshopUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/quizzes/create" element={token ? <QuizzesCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/quizzes/update/:id" element={token ? <QuizzesUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/quizzes/preview/:id" element={token ? <QuizzesPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/surveys/create" element={token ? <SurveysCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/surveys/update/:id" element={token ? <SurveysUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/surveys/preview/:id" element={token ? <SurveysPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/learning-activity/create" element={token ? <LearningActivityCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/learning-activity/update/:id" element={token ? <LearningActivityUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/visits/create" element={token ? <VisitsCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/visits/update/:id" element={token ? <VisitsUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/visits/preview/:id" element={token ? <VisitsPrev /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/workshop-content/:id" element={token ? <WorkshopContent /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/quizzes/create" element={token ? <WorkshopQuizzesCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/quizzes/update/:id" element={token ? <WorkshopQuizzesUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/quizzes/preview/:id" element={token ? <WorkshopQuizzesPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/observationForms/create" element={token ? <WorkshopObservationFormCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/observationForms/update/:id" element={token ? <WorkshopObservationFormUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/workshop-content/observationForms/preview/:id" element={token ? <WorkshopObservationFormPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/:id" element={token ? <ProgressDetails /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/student-quiz-report" element={token ? <StudentQuizReport /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/:id/village-progress" element={token ? <VillageProgress /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/parent-progress" element={token ? <ParentProgress /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/:id/unitId/:unitId/programId/:programId" element={token ? <VillageArea /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/visits/:id" element={token ? <Visits /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/visits/visits-preview" element={token ? <VisitsPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop" element={token ? <Workshop /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/quiz-details" element={token ? <Quiz /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/quiz-preview/parentId/:id" element={token ? <QuizPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/quiz-children/parentId/:id" element={token ? <QuizChildren /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/1/survey" element={token ? <Survey /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/survey-details" element={token ? <Survey /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/survey-details/children" element={token ? <SurveyChildren /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/survey-details/preview" element={token ? <SurveyPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/survey-details/survey-questionnaire/update" element={token ? <SurveyUpdate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village-users/:id" element={token ? <VillageUsers /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/learning-details" element={token ? <LearningContent /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop/session/:id" element={token ? <Session /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop/session/children" element={token ? <SessionChildren /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop/session/previewForm/:id" element={token ? <WorkshopPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop/session/previewQuiz/:id" element={token ? <WorkshopQuizPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/workshop/session/previewQuiz/children/:id" element={token ? <WorkshopQuizChildPreview /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/progress/village/learning-content-details" element={token ? <ContentList /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/unit-content/questionnaire-attempt" element={<QuizzesAttempt />}></Route>
				<Route path="/manual-whatsapp" element={token && navPermission["Manual Whatsapp"] ? <ManualWhatsApp /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/manual-whatsapp-details/:id" element={token && navPermission["Manual Whatsapp"] ? <ManualWhatsAppDetails /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/manual-whatsapp/add" element={token && navPermission["Manual Whatsapp"] ? <CampaignCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/manual-in-app-notification" element={token ? <InAppNotifications /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/manual-in-app-notification/create-notification" element={token ? <CreateNotification /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/manual-in-app-notification/campaign-detail/:id" element={token ? <InAppCampaignDetail /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/glific-flow-management" element={token ? <GlificFlowManagement /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/glific-flow-management/single-frequency/:id" element={token ? <GlificFlowManagementDetails /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/glific-flow-management/add" element={token ? <GlificFlowCreate /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/glific-flow-management/manage-flow" element={token ? <ManageGlificFlow /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/terms-and-conditions" element={<TermsConditions />}></Route>
				<Route path="/privacy-policy" element={<PrivacyPolicy />}></Route>
				<Route path="/view-activity-log" element={<ActivityLog />}></Route>
				{/* <Route path="/outbound/template" element={token ? <Template /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/outbound/template-detail" element={token ? <TemplateDetail /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/outbound/create-template" element={token ? <CreateIVRSTemplate /> : <Navigate replace to={`/login`} />}></Route> */}
				<Route path="/outbound-ivrs" element={token && navPermission["Outbound IVRS"] ? <Campaign /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/outbound-ivrs/campaign-detail/:id" element={token && navPermission["Outbound IVRS"] ? <CampaignDetail /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/outbound-ivrs/create-campaign" element={token && navPermission["Outbound IVRS"] ? <CreateIVRSCampaign /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/inbound-ivrs" element={token && navPermission["Inbound IVRS"] ? <InboundIVRS /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/cew-training" element={token && navPermission["CEW Training"] ? <Training /> : <Navigate replace to={`/login`} />}></Route>
				<Route path="/cew-training-details/:id" element={token && navPermission["CEW Training"] ? <TrainingDetails /> : <Navigate replace to={`/login`} />}></Route>
			</Routes>
			<ToastContainer autoClose={3000} />
		</div>
	);
}

export default Navigation;
