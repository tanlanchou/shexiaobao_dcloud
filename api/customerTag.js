import request from "@/common/request.js";

export const getCustomerTagOneApi = function(id) {
	return request({
		url: `/customer/tag/tag/${id}`,
		method: `get`,
		isValid: true
	})
}

export const getCustomerTagAllApi = function(id) {
	return request({
		url: `/customer/tag/tag`,
		method: `get`,
		isValid: true
	})
}

export const addCustomerTagApi = function(data) {
	return request({
		url: `/customer/tag/tag`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const updateCustomerTagApi = function(id, data) {
	return request({
		url: `/customer/tag/tag/${id}`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const deleteCustomerTagOneApi = function(id) {
	return request({
		url: `/customer/tag/tag/${id}`,
		method: `delete`,
		isValid: true
	})
}