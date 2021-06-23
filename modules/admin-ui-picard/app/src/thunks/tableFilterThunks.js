import {loadFiltersSuccess, loadFiltersFailure, loadFiltersInProgress, loadStats} from '../actions/tableFilterActions';
import axios from "axios";
import {relativeDateSpanToFilterValue} from "../utils/dateUtils";
/**
* This file contains methods/thunks used to query the REST-API of Opencast to get the filters of a certain resource type.
* This information is used to filter the entries of the table in the main view.
*
* */
// Fetch table filters from opencast instance and transform them for further use
export const fetchFilters = resource => async dispatch => {
    try {
        dispatch(loadFiltersInProgress());

        let response;

        switch (resource) {
            case 'events': {
                const data = await axios.get('admin-ng/resources/events/filters.json');
                const eventsData =  await data.data;

                response = transformResponse(eventsData);
                break;
            }
            case 'series': {
                const data = await axios.get('admin-ng/resources/series/filters.json');
                const seriesData =  await data.data;

                response = transformResponse(seriesData);
                break;
            }
            case 'recordings': {
                const data = await axios.get('admin-ng/resources/recordings/filters.json');
                const recordingsData = await data.data;

                response = transformResponse(recordingsData);
                break;
            }
            case 'jobs': {
                const data = await axios.get('admin-ng/resources/jobs/filters.json');
                const jobsData = await data.data;

                response = transformResponse(jobsData);
                break;
            }
            case 'servers': {
                const data = await axios.get('admin-ng/resources/servers/filters.json');
                const serversData = await data.data;

                response = transformResponse(serversData);
                break;
            }
            case 'services': {
                const data = await axios.get('admin-ng/resources/services/filters.json');
                const servicesData = await data.data;

                response = transformResponse(servicesData);
                break;
            }
            case 'users': {
                const data = await axios.get('admin-ng/resources/users/filters.json');
                const usersData = await data.data;

                response = transformResponse(usersData);
                break;
            }
            case 'groups': {
                const data = await axios.get('admin-ng/resources/groups/filters.json');
                const groupsData = await data.data;

                response = transformResponse(groupsData);
                break;
            }
            case 'acls': {
                const data = await axios.get('admin-ng/resources/acls/filters.json');
                const aclsData = await data.data;

                response = transformResponse(aclsData);
                break;
            }
            case 'themes': {
                const data = await axios.get('admin-ng/resources/themes/filters.json');
                const themesData = await data.data;

                response = transformResponse(themesData);
                break;
            }
        }

        const filters = response
        const filtersList = Object.keys(filters.filters).map(key => {
            let filter = filters.filters[key];
            filter.name = key;
            return filter;
        });
        dispatch(loadFiltersSuccess(filtersList));
    } catch (e) {
        dispatch(loadFiltersFailure());
        console.log(e);
    }
}

export const fetchStats = () => async dispatch => {
    try {
        // fetch information about possible status an event can have
        let data =  await axios.get('admin-ng/resources/STATS.json');
        let response = await data.data;

        // transform response
        const statsResponse = Object.keys(response).map(key => {
            let stat = JSON.parse(response[key]);
            stat.name = key;
            return stat;
        });

        let stats = [];

        // fetch for each status the corresponding count of events having this status
        for (let i in statsResponse) {
            let filter = [];
            for (let j in statsResponse[i].filters) {
                let value = statsResponse[i].filters[j].value;
                let name = statsResponse[i].filters[j].name;

                if (Object.prototype.hasOwnProperty.call(value, 'relativeDateSpan')) {
                    value = relativeDateSpanToFilterValue(value.relativeDateSpan.from, value.relativeDateSpan.to, value.relativeDateSpan.unit);
                }
                filter.push(name + ':' + value);
            }
            let data = await axios.get('admin-ng/event/events.json', {
                params: {
                    filter: filter.join(','),
                    limit: 1
                }
            });

            let response = await data.data;

            // add count to status information fetched before
            statsResponse[i] = {
                ...statsResponse[i],
                count: response.total
            };

            // fill stats array for redux state
            stats.push(statsResponse[i]);
        }

        stats.sort(compareOrder);

        dispatch(loadStats(stats));

    } catch (e) {
        console.log(e);
    }
}

// Transform received filter.json to a structure that can be used for filtering
function transformResponse(data) {
    let filters = {};
    try {
        filters = data;

        for (let key in filters) {
            filters[key].value = "";
            if (!filters[key].options) {
                continue;
            }
            let filterArr = [];
            let options = filters[key].options;
            for (let subKey in options) {
                filterArr.push({value: subKey, label: options[subKey]});
            }
            filterArr = filterArr.sort(function(a,b) {
                if (a.label.toLowerCase() < b.label.toLowerCase()) {
                    return -1;
                }
                if (a.label.toLowerCase() > b.label.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            filters[key].options = filterArr;
        }
    } catch (e) {  console.log(e.message);}

    return {filters: filters};
}

// compare function for sort stats array by order property
const compareOrder = (a, b) => {
    if (a.order < b.order) {
        return -1;
    }
    if (a.order > b.order) {
        return 1;
    }
    return 0;
}

