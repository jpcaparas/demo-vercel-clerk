import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CVData } from '@/types/cv';

const initialState: CVData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    updatePersonalInfo: (state, action: PayloadAction<Partial<CVData['personalInfo']>>) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    addEducation: (state, action: PayloadAction<CVData['education'][0]>) => {
      state.education.push(action.payload);
    },
    updateEducation: (state, action: PayloadAction<{ index: number; data: Partial<CVData['education'][0]> }>) => {
      const { index, data } = action.payload;
      state.education[index] = { ...state.education[index], ...data };
    },
    removeEducation: (state, action: PayloadAction<number>) => {
      state.education.splice(action.payload, 1);
    },
    reorderEducation: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const education = state.education[oldIndex];
      state.education.splice(oldIndex, 1);
      state.education.splice(newIndex, 0, education);
    },
    addExperience: (state, action: PayloadAction<CVData['experience'][0]>) => {
      state.experience.push(action.payload);
    },
    updateExperience: (state, action: PayloadAction<{ index: number; data: Partial<CVData['experience'][0]> }>) => {
      const { index, data } = action.payload;
      state.experience[index] = { ...state.experience[index], ...data };
    },
    removeExperience: (state, action: PayloadAction<number>) => {
      state.experience.splice(action.payload, 1);
    },
    addSkill: (state, action: PayloadAction<CVData['skills'][0]>) => {
      state.skills.push(action.payload);
    },
    updateSkill: (state, action: PayloadAction<{ index: number; data: Partial<CVData['skills'][0]> }>) => {
      const { index, data } = action.payload;
      state.skills[index] = { ...state.skills[index], ...data };
    },
    removeSkill: (state, action: PayloadAction<number>) => {
      state.skills.splice(action.payload, 1);
    },
    addLanguage: (state, action: PayloadAction<CVData['languages'][0]>) => {
      state.languages.push(action.payload);
    },
    updateLanguage: (state, action: PayloadAction<{ index: number; data: Partial<CVData['languages'][0]> }>) => {
      const { index, data } = action.payload;
      state.languages[index] = { ...state.languages[index], ...data };
    },
    removeLanguage: (state, action: PayloadAction<number>) => {
      state.languages.splice(action.payload, 1);
    },
    setCVData: (state, action: PayloadAction<CVData>) => {
      return action.payload;
    },
    reorderSkills: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const skill = state.skills[oldIndex];
      state.skills.splice(oldIndex, 1);
      state.skills.splice(newIndex, 0, skill);
    },
    reorderLanguages: (state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) => {
      const { oldIndex, newIndex } = action.payload;
      const language = state.languages[oldIndex];
      state.languages.splice(oldIndex, 1);
      state.languages.splice(newIndex, 0, language);
    },
    reorderList: (state, action: PayloadAction<{ type: 'certifications' | 'interests'; oldIndex: number; newIndex: number }>) => {
      const { type, oldIndex, newIndex } = action.payload;
      // Handle case where list might be undefined
      const list = state[type] || [];
      if (list.length > 0) {
        const item = list[oldIndex];
        list.splice(oldIndex, 1);
        list.splice(newIndex, 0, item);
      }
    },
  },
});

export const {
  updatePersonalInfo,
  addEducation,
  updateEducation,
  removeEducation,
  reorderEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  updateSkill,
  removeSkill,
  addLanguage,
  updateLanguage,
  removeLanguage,
  setCVData,
  reorderSkills,
  reorderLanguages,
  reorderList,
} = cvSlice.actions;

export default cvSlice.reducer;