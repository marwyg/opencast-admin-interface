/**
 * This file contains selectors regarding users
 */
import {createSelector} from "reselect";

export const getUsers = state => state.users.results;

export const getUsernames = createSelector(
    getUsers,
    (users) => {
        return users.map(user => user.username)
    }
);
