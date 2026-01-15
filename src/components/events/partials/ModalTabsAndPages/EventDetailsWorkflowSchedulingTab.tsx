import React, { useEffect } from "react";
import { Formik, FormikProps } from "formik";
import {
	getBaseWorkflow,
	getWorkflow,
	getWorkflowConfiguration,
	getWorkflowDefinitions,
	isFetchingWorkflows,
} from "../../../../selectors/eventDetailsSelectors";
import Notifications from "../../../shared/Notifications";
import RenderWorkflowConfig from "../wizards/RenderWorkflowConfig";
import { getUserInformation } from "../../../../selectors/userInfoSelectors";
import { hasAccess, parseBooleanInObject } from "../../../../utils/utils";
import DropDown from "../../../shared/DropDown";
import { useAppDispatch, useAppSelector } from "../../../../store";
import {
	fetchWorkflows,
	saveWorkflowConfig,
} from "../../../../slices/eventDetailsSlice";
import { removeNotificationWizardForm } from "../../../../slices/notificationSlice";
import { useTranslation } from "react-i18next";
import { formatWorkflowsForDropdown } from "../../../../utils/dropDownUtils";
import ModalContent from "../../../shared/modals/ModalContent";

type InitialValues = {
    workflowDefinition: string;
    configuration: { [key: string]: any } | undefined;
}

/**
 * This component manages the workflows tab of the event details modal
 */
const EventDetailsWorkflowSchedulingTab = ({
	eventId,
	formikRef,
}: {
	eventId: string,
	formikRef?: React.RefObject<FormikProps<InitialValues> | null>
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

	const user = useAppSelector(state => getUserInformation(state));
	const baseWorkflow = useAppSelector(state => getBaseWorkflow(state));
	const workflow = useAppSelector(state => getWorkflow(state));
	const workflowConfiguration = useAppSelector(state => getWorkflowConfiguration(state));
	const workflowDefinitions = useAppSelector(state => getWorkflowDefinitions(state));
	const isLoading = useAppSelector(state => isFetchingWorkflows(state));

	const isRoleWorkflowEdit = hasAccess(
		"ROLE_UI_EVENTS_DETAILS_WORKFLOWS_EDIT",
		user,
	);

    useEffect(() => {
        dispatch(removeNotificationWizardForm());
        dispatch(fetchWorkflows(eventId));
    }, [dispatch, eventId]);

    const hasCurrentAgentAccess = () => true;

    const extractDefaultValues = (workflowId: string) => {
        const defaultValues: Record<string, any> = {};
        const definition = workflowDefinitions.find(def => def.id === workflowId);
        definition?.configurationPanelJson?.forEach(panel => {
            panel.fieldset?.forEach(field => {
                if (field?.name) defaultValues[field.name] = field.value;
            });
        });
        return defaultValues;
    };

    /**
     * Helper to get the configuration for a specific ID.
     * Merges XML defaults with DB values ONLY if the ID matches what is saved in the DB.
     */
    const getConfigurationForWorkflow = (targetWorkflowId: string) => {
        const xmlDefaults = extractDefaultValues(targetWorkflowId);
        let mergedConfig = xmlDefaults;
        if (baseWorkflow.workflowId === targetWorkflowId && baseWorkflow.configuration) {
            const dbValues = parseBooleanInObject(baseWorkflow.configuration);
            mergedConfig = { ...xmlDefaults, ...dbValues };
        }

        return mergedConfig;
    };

    const handleWorkflowChange = (newWorkflowId: string, formik: FormikProps<InitialValues>) => {
        const newConfigs = getConfigurationForWorkflow(newWorkflowId);
        formik.setValues({
            workflowDefinition: newWorkflowId,
            configuration: newConfigs
        });
    };

    const getInitialValues = (): InitialValues => {
        const initialId = baseWorkflow.workflowId || "";
        return {
            workflowDefinition: initialId,
            configuration: getConfigurationForWorkflow(initialId),
        };
    };

    const handleSubmit = (values: InitialValues) => {
        dispatch(saveWorkflowConfig({ values, eventId }));
    };

    return (
        <ModalContent>
            <Notifications context="not_corner" />

            {isLoading ? (
                <div>{t("LOADING")}</div>
            ) : (
                <Formik<InitialValues>
                    initialValues={getInitialValues()}
                    enableReinitialize={true}
                    onSubmit={handleSubmit}
                    innerRef={formikRef}
                >
                    {formik => {
                        const selectedDef = workflowDefinitions.find(d => d.id === formik.values.workflowDefinition);
                        const hasConfig = selectedDef?.configurationPanelJson && selectedDef.configurationPanelJson.length > 0;

                        return (
                            <div className="obj list-obj">
                                <header>{t("EVENTS.EVENTS.DETAILS.WORKFLOW_DETAILS.CONFIGURATION")}</header>
                                <div className="obj-container">
                                    {/* Workflow Selection Section */}
                                    <div className="obj list-obj quick-actions">
                                        <table className="main-tbl">
                                            <thead><tr><th>{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.WORKFLOW")}</th></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="obj-container padded">
                                                            <div className="editable">
                                                                <DropDown
                                                                    value={formik.values.workflowDefinition}
                                                                    text={selectedDef?.title ?? ""}
                                                                    options={workflowDefinitions.length > 0 ? formatWorkflowsForDropdown(workflowDefinitions) : []}
                                                                    required={true}
                                                                    handleChange={el => el && handleWorkflowChange(el.value, formik)}
                                                                    disabled={!isRoleWorkflowEdit}
                                                                    customCSS={{ width: "100%" }}
                                                                />
                                                            </div>
                                                            <div className="obj-container padded">{workflow.description}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Configuration / Checkboxes Section */}
                                    <div className="obj list-obj quick-actions">
                                        <table className="main-tbl">
                                            <thead><tr><th>{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.CONFIGURATION")}</th></tr></thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="obj-container padded">
                                                            {isRoleWorkflowEdit && formik.values.workflowDefinition && hasConfig ? (
                                                                <div id="event-workflow-configuration" className="checkbox-container obj-container">
                                                                    <RenderWorkflowConfig
                                                                        workflowId={formik.values.workflowDefinition}
                                                                        formik={formik}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div>{t("EVENTS.EVENTS.DETAILS.WORKFLOWS.NO_CONFIGURATION")}</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Footer */}
                                {isRoleWorkflowEdit && formik.values.workflowDefinition && formik.dirty && (
                                    <footer style={{ padding: "0 15px" }}>
                                        <div className="pull-left">
                                            <button type="button" onClick={() => formik.resetForm()} className="cancel">
                                                {t("CANCEL")}
                                            </button>
                                        </div>
                                        <div className="pull-right">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    console.log("Submitting Values:", formik.values);
                                                    formik.handleSubmit();
                                                }}
                                                disabled={!formik.isValid}
                                                className={`save green ${!formik.isValid ? "disabled" : ""}`}
                                            >
                                                {t("SAVE")}
                                            </button>
                                        </div>
                                    </footer>
                                )}
                            </div>
                        );
                    }}
                </Formik>
            )}
        </ModalContent>
    );
};

export default EventDetailsWorkflowSchedulingTab;