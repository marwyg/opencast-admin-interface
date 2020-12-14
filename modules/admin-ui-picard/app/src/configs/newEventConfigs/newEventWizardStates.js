export const newEventWizardStates = [
    {
        translation: 'EVENTS.EVENTS.NEW.METADATA.CAPTION',
        name: 'metadata'
    },
    {
        translation: 'EVENTS.EVENTS.DETAILS.TABS.EXTENDED-METADATA',
        name: 'metadata-extended'
    },
    {
        translation: 'EVENTS.EVENTS.NEW.SOURCE.CAPTION',
        name: 'source'
    },
    {
        translation: 'EVENTS.EVENTS.NEW.UPLOAD_ASSET.CAPTION',
        name: 'upload-asset'
    },
    {
        translation: 'EVENTS.EVENTS.NEW.PROCESSING.CAPTION',
        name: 'processing'
    },
    {
        translation: 'EVENTS.EVENTS.NEW.ACCESS.CAPTION',
        name: 'access'
    },
    {
        translation: 'EVENTS.EVENTS.NEW.SUMMARY.CAPTION',
        name: 'summary'
    }
];

// All fields for new event form that are fix and not depending on response of backend
// InitialValues of Formik form (others computed dynamically depending on responses from backend)
export const initialFormValuesNewEvents = {
    sourceMode: '',
    scheduleStartDate: '',
    scheduleEndDate: '',
    scheduleStartTime: '',
    scheduleDuration: '',
    scheduleEndTime: '',
    repeatOn: [],
    location: '',
    deviceInputs: []
};