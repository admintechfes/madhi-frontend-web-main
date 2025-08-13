import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Auth/Login/duck/authSlice';
import loaderReducer from '../components/Loader/duck/loaderSlice';
import districtsReducer from "../Masters/Districts/duck/DistrictsSlice"
import userReducer from "../Users/duck/userSlice"
import villageReducer from "../Masters/Village/duck/VillageSlice"
import panchayatReducer from "../Masters/Panchayat/duck/panchayatSlice"
import blockReducer from "../Masters/Block/duck/blockSlice"
import programReducer from '../Programs/duck/programSlice';
import unitReducer from '../Units/duck/unitSlice'
import ContentLibraryReducer from '../contentlibrary/duck/contentlibrarySlice';
import unitContentReducer from '../UnitContent/duck/unitContentSlice';
import parentsReducer from '../parents/duck/parentsSlice';
import profileReducer from '../ViewProfile/duck/profileSlice';
import workshopContentReducer from '../UnitContent/Workshops/duck/workshopContentSlice';
import ProgressReducer from '../Progress/duck/progressSlice';
import visitsReducer from '../Progress/Village/visits/duck/visitsSlice';
import quizReducer from '../Progress/Village/quiz/duck/quizSlice';
import surveyReducer from '../Progress/Village/survey/duck/surveySlice';
import WorkshopReducer from '../Progress/Village/workshop/duck/workshopSlice';
import PermissionReducer from '../PermissionManagement/duck/permissionSlice';
import learningReducer from '../Progress/Village/learningContent/duck/learningSlice';
import manualWhatsAppReducer from "../ManualWhatsApp/duck/manualWhatsAppSlice";
import glificFlowManagementReducer from "../GlificFlowManagement/duck/glificFlowManagementSlice";
import OutboundCampaignReducer from '../OutBoundCampaign/duck/OutboundCampaignSlice';
import inboundReducer from '../InboundIVRS/duck/inboundSlice'
import trainingReducer from '../Training/duck/trainingSlice';
import activityReducer from '../Activitylog/duck/activitySlice';
import notificationReducer from '../InAppNotifications/duck/notificationSlice';
import scoreReducer from '../EngagementScoreRule/duck/scoreSlice';
import studentquizruleReducer from '../StudentQuizRule/duck/studentquizruleSlice';
import studentquizreportReducer from '../Progress/StudentQuizReport/duck/studentquizreportSlice';


export const store = configureStore({
	reducer: {
		auth: authReducer,
		user: userReducer,
		loader: loaderReducer,
		district: districtsReducer,
		village: villageReducer,
		panchayat: panchayatReducer,
		block: blockReducer,
		program: programReducer,
		unit: unitReducer,
		contentlibrary: ContentLibraryReducer,
		unitContent: unitContentReducer,
		parents: parentsReducer,
		profile: profileReducer,
		workshopContent: workshopContentReducer,
		progress: ProgressReducer,
		visits: visitsReducer,
		quiz: quizReducer,
		survey: surveyReducer,
		learning: learningReducer,
		permissions: PermissionReducer,
		workshop: WorkshopReducer,
		manualWhatsApp: manualWhatsAppReducer,
		glificFlowManagement: glificFlowManagementReducer,
		outboundCampaign: OutboundCampaignReducer,
		inboundIvrs: inboundReducer,
		training: trainingReducer,
		activity: activityReducer,
		notification: notificationReducer,
		score: scoreReducer,
		studentquizrule: studentquizruleReducer,
		studentquizreport: studentquizreportReducer
	},
});
