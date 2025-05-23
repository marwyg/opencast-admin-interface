import React, { useState } from "react";
import GeneralDetailsTab from "../wizards/GeneralDetailsTab";
import ConfigurationDetailsTab from "../wizards/ConfigurationDetailsTab";
import CapabilitiesDetailsTab from "../wizards/CapabilitiesDetailsTab";
import { getRecordingDetails } from "../../../../selectors/recordingDetailsSelectors";
import ModalNavigation from "../../../shared/modals/ModalNavigation";
import { useAppSelector } from "../../../../store";
import { ParseKeys } from "i18next";

/**
 * This component manages the pages of the recording details
 */
const RecordingsDetails: React.FC = () => {
	const [page, setPage] = useState(0);

	const agent = useAppSelector(state => getRecordingDetails(state));

	// information about tabs
	const tabs: {
		tabTranslation: ParseKeys
		accessRole: string
		name: string
	}[] = [
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.GENERAL",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_GENERAL_VIEW",
			name: "general",
		},
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.CONFIGURATION",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_CONFIGURATION_VIEW",
			name: "configuration",
		},
		{
			tabTranslation: "RECORDINGS.RECORDINGS.DETAILS.TAB.CAPABILITIES",
			accessRole: "ROLE_UI_LOCATIONS_DETAILS_CAPABILITIES_VIEW",
			name: "capabilities",
		},
	];

	const openTab = (tabNr: number) => {
		setPage(tabNr);
	};

	return (
		<>
			{/* navigation */}
			<ModalNavigation tabInformation={tabs} openTab={openTab} page={page} />

			<div>
				{page === 0 && <GeneralDetailsTab agent={agent} />}
				{page === 1 && <ConfigurationDetailsTab agent={agent} />}
				{page === 2 && <CapabilitiesDetailsTab agent={agent} />}
			</div>
		</>
	);
};

export default RecordingsDetails;
