import request from "@/common/request.js";

export const getCustomerOneApi = function(id) {
	return request({
		url: `/customer/${id}`,
		method: `get`,
		isValid: true
	})
}

export const getCustomerAllApi = function(id) {
	return request({
		url: `/customer`,
		method: `get`,
		isValid: true
	})
}

export const getCustomerAllByPageApi = function(id, data) {
	return request({
		url: `/customer/find/all/${id}`,
		method: `post`,
		isValid: true,
		data
	})
}



export const addCustomerApi = function(data) {
	return request({
		url: `/customer`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const updateCustomerApi = function(id, data) {
	return request({
		url: `/customer/${id}`,
		method: `put`,
		isValid: true,
		data,
	})
}

export const deleteCustomerOneApi = function(id) {
	return request({
		url: `/customer/${id}`,
		method: `delete`,
		isValid: true
	})
}