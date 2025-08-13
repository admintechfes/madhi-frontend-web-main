import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	unitContentListLoading: false,
	workhopCreateLoading: false,
	unitContentList: [],
	unitContentQuizDetails: {},
	unitContentDetailsLoading: true,
	selectedQuestionnaire: [],
	quizForm: { title: '', sections: [{ title: '', description: '' }], hiddenProperty: false },
	quizCreateLoading: false,
	unitContentSurveyDetails: {},
	surveyForm: { title: '', sections: [{ title: '', description: '' }], hiddenProperty: false },
	surveyCreateLoading: false,
	unitContentLearningActivityDetails: {},
	unitContentFormData: [],
	unitContentFormDataLoading: true,
	visitInviteType:[]
};

export const unitContentSlice = createSlice({
	name: 'unitContent',
	initialState,
	reducers: {
		fillUnitContentList: (state, action) => {
			state.unitContentList = action.payload;
		},
		setunitContentListLoading: (state, action) => {
			state.unitContentListLoading = action.payload;
		},
		setWorkshopCreateLoading: (state, action) => {
			state.workhopCreateLoading = action.payload;
		},
		setSelectedQuestionnaire: (state, action) => {
			const sectionIndex = action.payload?.sectionIndex;
			const finalData = action.payload?.finalData;
			const deleteSection = action.payload?.deleteSection;
			let newData = [];
			let existingSection = [];


			if (deleteSection) {
				newData = finalData;
				state.selectedQuestionnaire = newData;
				return;
			}

			if (typeof sectionIndex === 'undefined' || !Array.isArray(finalData)) {
				console.error('Invalid payload:', action.payload);
				return;
			}

			// Ensure selectedQuestionnaire is initialized as an array
			if (!Array.isArray(state.selectedQuestionnaire)) {
				state.selectedQuestionnaire = [];
			}

			// Clone the existing selectedQuestionnaire
			const selectedQuestionnaire = state.selectedQuestionnaire.map((section, idx) => {
				return Array.isArray(section) ? [...section] : [];
			});

			if (!action.payload?.orderUpdate) {
				// Clone the existing section or initialize it if undefined
				existingSection = selectedQuestionnaire[sectionIndex] || [];


				// Filter new questions that do not already exist in the section
				newData = finalData.filter((question) => existingSection.findIndex((item) => item.id === question.id) === -1);
			} else {
				newData = finalData;
			}


			// Update the section immutably
			const updatedSection = [...existingSection, ...newData];

			// Ensure the array has enough slots
			while (selectedQuestionnaire.length <= sectionIndex) {
				selectedQuestionnaire.push([]);
			}

			// Set the updated section
			selectedQuestionnaire[sectionIndex] = updatedSection;


			// Update the state immutably
			state.selectedQuestionnaire = selectedQuestionnaire;
		},
		deleteSelectedQuestionnnaire: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					let index = null;
					selectedSection.forEach((question, idx) => {
						if (question.id == selectedId) {
							index = idx;
						}
					});
					if (index == 0) {
						selectedSection.forEach((question, index) => {
							if (index == 1) {
								if ('conditionalLogic' in question) {
									delete question.conditionalLogic;
								}
							}
						});
					}
					state.selectedQuestionnaire[sectionIndex] = selectedSection.filter((question) => question.id !== selectedId);
				}
			}
		},
		skipSelectedQuestion: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedId) question.canSkip = !question.canSkip;
						return question;
					});
				}
			}
		},
		displaySelectedQuestion: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedId = action.payload?.selectedId;
			const isDelete = action.payload?.isDelete;

			if (sectionIndex !== undefined && selectedId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedId) {
							if (!isDelete) {
								if (!('conditionalLogic' in question)) question.conditionalLogic = {};
							} else {
								if ('conditionalLogic' in question) delete question.conditionalLogic;
							}
						}
						return question;
					});
				}
			}
		},
		handleConditonOneContentId: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedQuestionId = action?.payload?.selectedQuestionId;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined && selectedQuestionId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedQuestionId) {
							question.conditionalLogic = {
								...question.conditionalLogic,
								conditionOne: { contentId: selectedId },
							};
						}
						return question;
					});
				}
			}
		},
		handleConditonOneOptionIndexes: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedQuestionId = action?.payload?.selectedQuestionId;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined && selectedQuestionId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedQuestionId) {
							question.conditionalLogic = {
								...question.conditionalLogic,
								conditionOne: { ...question.conditionalLogic?.conditionOne, optionIndexes: Array.isArray(selectedId) ? selectedId : [selectedId] },
							};
						}
						return question;
					});
				}
			}
		},
		handleRelation: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedQuestionId = action?.payload?.selectedQuestionId;
			const relation = action?.payload?.relation;
			const isDelete = action?.payload?.delete;

			if (sectionIndex !== undefined && selectedQuestionId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedQuestionId) {
							question.conditionalLogic = {
								...question.conditionalLogic,
								relation: relation,
							};
							if (isDelete) {
								if ('relation' in question?.conditionalLogic) delete question.conditionalLogic.relation;
								if ('conditionTwo' in question?.conditionalLogic) delete question.conditionalLogic.conditionTwo;
							}
						}
						return question;
					});
				}
			}
		},
		handleConditonTwoContentId: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedQuestionId = action?.payload?.selectedQuestionId;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined && selectedQuestionId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedQuestionId) {
							question.conditionalLogic = {
								...question.conditionalLogic,
								conditionTwo: { contentId: selectedId },
							};
						}
						return question;
					});
				}
			}
		},
		handleConditonTwoOptionIndexes: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedQuestionId = action?.payload?.selectedQuestionId;
			const selectedId = action.payload?.selectedId;

			if (sectionIndex !== undefined && selectedId !== undefined && selectedQuestionId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id == selectedQuestionId) {
							question.conditionalLogic = {
								...question.conditionalLogic,
								conditionTwo: { ...question.conditionalLogic?.conditionTwo, optionIndexes: Array.isArray(selectedId) ? selectedId : [selectedId] },
							};
						}
						return question;
					});
				}
			}
		},
		handleWeightage: (state, action) => {
			const sectionIndex = action.payload?.selectedSectionIndex;
			const selectedId = action.payload?.selectedId;
			const selectedValue = action.payload?.selectedValue;

			if (sectionIndex !== undefined && selectedId !== undefined) {
				const selectedSection = state.selectedQuestionnaire[sectionIndex];

				if (selectedSection) {
					state.selectedQuestionnaire[sectionIndex] = selectedSection.map((question) => {
						if (question.id === selectedId) {
              // Return a new object with the updated weightage
              return { ...question, weightage: selectedValue };
            }
            return question;
					});
				}
			}
		},
		resetSelectedQuestionnaire: (state, action) => {
			state.selectedQuestionnaire = [];
		},
		setQuizForm: (state, action) => {
			state.quizForm = { ...state.quizForm, ...action.payload };
		},
		resetQuizForm: (state, action) => {
			state.quizForm = { title: '', sections: [{ title: '', description: '' }], hiddenProperty: false };
		},
		setQuizCreateLoading: (state, action) => {
			state.quizCreateLoading = action.payload;
		},
		setQuizDetails: (state, action) => {
			state.unitContentQuizDetails = action.payload;
		},
		setUnitContentDetailsLoading: (state, action) => {
			state.unitContentDetailsLoading = action.payload;
		},
		setSurveyForm: (state, action) => {
			state.surveyForm = { ...state.surveyForm, ...action.payload };
		},
		resetSurveyForm: (state, action) => {
			state.surveyForm = { title: '', sections: [{ title: '', description: '' }], hiddenProperty: false };
		},
		setSurveyCreateLoading: (state, action) => {
			state.surveyCreateLoading = action.payload;
		},
		setSurveyDetails: (state, action) => {
			state.unitContentSurveyDetails = action.payload;
		},
		setLearningActivityDetails: (state, action) => {
			state.unitContentLearningActivityDetails = action.payload;
		},
		setUnitContentFormData: (state, action) => {
			state.unitContentFormData = action.payload;
		},
		setUnitContentFormDataLoading: (state, action) => {
			state.unitContentFormDataLoading = action.payload;
		},
		setVisitInviteType:(state, action) => {
			state.visitInviteType = action.payload;
		},
	},
});

export const {
	fillUnitContentList,
	setunitContentListLoading,
	setWorkshopCreateLoading,
	setSelectedQuestionnaire,
	resetSelectedQuestionnaire,
	deleteSelectedQuestionnnaire,
	setQuizForm,
	resetQuizForm,
	setQuizCreateLoading,
	setQuizDetails,
	setUnitContentDetailsLoading,
	setSurveyForm,
	resetSurveyForm,
	setSurveyCreateLoading,
	setSurveyDetails,
	setLearningActivityDetails,
	setUnitContentFormData,
	setUnitContentFormDataLoading,
	skipSelectedQuestion,
	displaySelectedQuestion,
	handleConditonOneContentId,
	handleConditonTwoContentId,
	handleConditonOneOptionIndexes,
	handleConditonTwoOptionIndexes,
	handleRelation,
	handleWeightage,
	setVisitInviteType
} = unitContentSlice.actions;
export default unitContentSlice.reducer;
