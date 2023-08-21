import { DEFAULT_AUTO_LOCK_TIME, NETWORK_NAME } from '@cd/constants/key';
import { SETTINGS } from '../actionTypes';

export default function userReducer(
	state = {
		theme: '',
		autoLockTime: DEFAULT_AUTO_LOCK_TIME,
		network: NETWORK_NAME,
		isHideBalance: false,
	},
	action,
) {
	switch (action.type) {
		case SETTINGS.SWITCH_THEME:
			return { ...state, theme: action.payload.theme };
		case SETTINGS.SET_AUTO_LOCK_TIME:
			return { ...state, autoLockTime: action.payload.autoLockTime };
		case SETTINGS.SET_NETWORK: {
			return { ...state, network: action.payload.network };
		}
		case SETTINGS.SET_IS_HIDE_BALANCE: {
			return { ...state, isHideBalance: action.payload.isHideBalance };
		}
		default:
			return state;
	}
}
