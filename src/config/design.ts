export const designPresets = {
  personalEngineeringNotebook: {
    id: 'personal-engineering-notebook',
    label: 'Personal Engineering Notebook',
    status: 'ready',
    description: 'Warm paper, expressive editorial type, handwritten details, and evidence-led work.',
    themeColor: '#fbfaf7',
  },
  editorialPortrait: {
    id: 'editorial-portrait',
    label: 'Editorial Portrait',
    status: 'planned',
    description: 'The quieter Sara-led composition from the first concept.',
    themeColor: '#ffffff',
  },
  quietKinetic: {
    id: 'quiet-kinetic',
    label: 'Quiet Kinetic Portfolio',
    status: 'planned',
    description: 'The more interactive Josh-influenced composition from the third concept.',
    themeColor: '#ffffff',
  },
} as const;

/** The single site-wide design selection. */
export const activeDesign = designPresets.personalEngineeringNotebook;

export type DesignPresetId = (typeof designPresets)[keyof typeof designPresets]['id'];
