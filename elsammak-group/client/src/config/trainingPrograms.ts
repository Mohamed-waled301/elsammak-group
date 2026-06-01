/** Training program catalog — shared by listing, booking, and admin views. */

export type AttendanceMode = 'remote' | 'physical';

export type TrainingProgram = {
  id: string;
  titleKey: string;
  allowRemote: boolean;
  allowPhysical: boolean;
};

export const TRAINING_PROGRAMS: TrainingProgram[] = [
  { id: 'digital_accounting', titleKey: 'training.courses.c1_title', allowRemote: true, allowPhysical: true },
  { id: 'corporate_contracts', titleKey: 'training.courses.c2_title', allowRemote: false, allowPhysical: true },
  { id: 'data_analysis', titleKey: 'training.courses.c3_title', allowRemote: true, allowPhysical: false },
  { id: 'digital_compliance', titleKey: 'training.courses.c4_title', allowRemote: true, allowPhysical: true },
  { id: 'human_resources', titleKey: 'training.courses.c5_title', allowRemote: true, allowPhysical: true },
  { id: 'legal_training', titleKey: 'training.courses.c6_title', allowRemote: false, allowPhysical: true },
  { id: 'web_development', titleKey: 'training.courses.c7_title', allowRemote: true, allowPhysical: true },
];

export function getTrainingProgram(id: string): TrainingProgram | undefined {
  return TRAINING_PROGRAMS.find((p) => p.id === id);
}

export const SCHEDULED_WHEN_FULL_KEY = 'training.scheduled_when_full';
