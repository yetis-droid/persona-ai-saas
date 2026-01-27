import { create } from 'zustand';
import { PersonaFormData } from '../types';

interface PersonaFormState {
  currentStep: number;
  formData: Partial<PersonaFormData>;
  setStep: (step: number) => void;
  setFormData: (data: Partial<PersonaFormData>) => void;
  resetForm: () => void;
}

const initialFormData: Partial<PersonaFormData> = {
  genre: '',
  oneLiner: '',
  creatorCallname: '',
  fanCallname: '',
  tone: '',
  politenessLevel: 3,
  emojiUsage: '',
  replyLength: '',
  phrasingExamples: '',
  bannedPhrases: '',
  relationshipStyle: '',
  smalltalkLevel: '',
  supportScope: '',
  refusalStyle: '',
  boundaries: '',
  worldKeywords: '',
  coreValues: '',
  consistencyRule: '',
  faqPairs: '',
  ngTopicsExtra: '',
  shareLinks: '',
  shareInfo: ''
};

export const usePersonaFormStore = create<PersonaFormState>((set) => ({
  currentStep: 1,
  formData: initialFormData,
  
  setStep: (step) => set({ currentStep: step }),
  
  setFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  
  resetForm: () => set({
    currentStep: 1,
    formData: initialFormData
  })
}));
