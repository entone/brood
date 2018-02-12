import * as types from './types'

export function login(email, password){
	return {
		type: types.LOGIN,
		email: email,
		password: password
	};
}

export function authenticated(token){
	return {
		type: types.AUTHENTICATED,
		token: token
	};
}

export function auth_error(error){
	return {
		type: types.AUTH_ERROR,
		error: error
	};
}

export function updateData() {
	return {
		type: types.UPDATE_DATA
	};
}

export function sendMessage(type, id, payload, send_backend = true) {
	return {
		type: types.SEND_MESSAGE,
		id: id,
		message: type,
		payload: payload,
		send_backend: send_backend
	};
}

export function receiveImage(payload) {
	return {
		type: types.RECEIVE_IMAGE,
		payload: payload
	};
}

export function receiveAction(action, payload) {
	return {
		type: types.RECEIVE_ACTION,
		action: action,
		payload: payload
	};
}

export function receiveChannelSettings(payload) {
	return {
		type: types.RECEIVE_CHANNEL_SETTINGS,
		payload: payload
	};
}

export function receiveDataPoint(data_point) {
	return {
		type: types.RECEIVE_DATA_POINT,
		data_point: data_point
	};
}

export function receiveData(measurement, data) {
	return {
		type: types.RECEIVE_DATA,
		data: data,
		measurement: measurement
	};
}
