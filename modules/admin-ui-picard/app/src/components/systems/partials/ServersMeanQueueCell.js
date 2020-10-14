import React from "react";
import {useTranslation} from "react-i18next";


const ServersMeanQueueCell = ({ row }) => {
    const { t } = useTranslation();

    return (
        <span>
            {t('dateFormats.time.medium', { time: new Date(row.meanQueueTime)})}
        </span>
    );
}

export default ServersMeanQueueCell;