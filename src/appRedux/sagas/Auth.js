import {all, call, fork, put, takeEvery} from "redux-saga/effects";
import {
    SIGNIN_USER,
    SIGNOUT_USER,
} from "../../constants/ActionTypes";
import {showAuthMessage, userSignInSuccess, userSignOutSuccess} from "../actions";
import * as AdminService from "../../services/Admin";
import {TOKEN_KEY} from "../../modules/Configs";
import {setCookie, removeCookie} from "../../modules/Utils";
import {cookieOptions} from "../../modules/Configs";

function* signInUserWithEmailPassword({payload}) {
    const {email, password} = payload;
    try {
        const adminLoginResponse = yield call(AdminService.login, email, password);
        const accessToken = adminLoginResponse.data.token;

        setCookie(TOKEN_KEY, accessToken, cookieOptions);
        yield put(userSignInSuccess(accessToken));
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

function* signOut() {
    try {
        removeCookie(TOKEN_KEY, cookieOptions);
        yield put(userSignOutSuccess());
    } catch (error) {
        yield put(showAuthMessage(error));
    }
}

export function* signInUser() {
    yield takeEvery(SIGNIN_USER, signInUserWithEmailPassword);
}

export function* signOutUser() {
    yield takeEvery(SIGNOUT_USER, signOut);
}

export default function* rootSaga() {
    yield all([
        fork(signInUser),
        fork(signOutUser)
    ]);
}
