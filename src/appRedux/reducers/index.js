import {combineReducers} from 'redux'
import {connectRouter} from 'connected-react-router'
import Settings from "./Settings";
import Auth from "./Auth";
import Common from "./Common";


const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: Auth,
    common: Common,
});

export default createRootReducer
