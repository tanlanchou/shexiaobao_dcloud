import request from "@/common/request.js";

export const getOriginOneApi = function(id) {
	return request({
		url: `/origin/${id}`,
		method: `get`,
		isValid: true
	})
}

export const getOriginAllApi = function() {
	return request({
		url: `/origin`,
		method: `get`,
		isValid: true
	})
}

export const addOriginApi = function(data) {
	return request({
		url: `/origin`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const updateOriginApi = function(id, data) {
	return request({
		url: `/origin/${id}`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const deleteOriginOneApi = function(id) {
	return request({
		url: `/origin/${id}`,
		method: `delete`,
		isValid: true
	})
}