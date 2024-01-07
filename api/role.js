import request from "@/common/request.js";

export const getAllRoleApi = function() {
	return request({
		url: `/role`,
		method: `get`,
		isValid: true
	})
}


export const addRoleApi = function(data) {
	return request({
		url: `/role`,
		method: `post`,
		isValid: true,
		data
	})
}

export const editRoleApi = function(id, data) {
	return request({
		url: `/role/${id}`,
		method: `put`,
		isValid: true,
		data
	})
}

export const getRoleByIdApi = function(id) {
	return request({
		url: `/role/${id}`,
		method: `get`,
		isValid: true
	})
}


export const getAllPowerApi = function() {
	return request({
		url: `/power`,
		method: `get`,
		isValid: true
	})
}