import request from "@/common/request.js";

export const addProductInfoApi = function(data) {
	return request({
		url: `/product/info`,
		method: `post`,
		isValid: true,
		data,
	})
}

export const updateProductInfoApi = function(id, data) {
	return request({
		url: `/product/info/${id}`,
		method: `put`,
		isValid: true,
		data,
	})
}

export const getProductAllInfoApi = function(page, data) {
	return request({
		url: `/product/info/search/all/${page}`,
		method: `post`,
		isValid: true,
		data
	})
}

export const getProductInfoOneApi = function(id) {
	return request({
		url: `/product/info/${id}`,
		method: `get`,
		isValid: true,
	})
}

export const getProductTypeAllApi = function() {
	return request({
		url: `/product/type`,
		method: `get`,
		isValid: true,
	})
}

export const getProductCategoryAllApi = function() {
	return request({
		url: `/product/category`,
		method: `get`,
		isValid: true,
	})
}

export const getProductQualityAllApi = function() {
	return request({
		url: `/product/quality`,
		method: `get`,
		isValid: true,
	})
}

export const getProductOriginAllApi = function() {
	return request({
		url: `/product/origin`,
		method: `get`,
		isValid: true,
	})
}

export const getProductStorehouseAllApi = function() {
	return request({
		url: `/product/storehouse`,
		method: `get`,
		isValid: true,
	})
}

export const getProductMaterialAllApi = function() {
	return request({
		url: `/product/material`,
		method: `get`,
		isValid: true,
	})
}




export const getProductTagAllApi = function() {
	return request({
		url: `/product/tag`,
		method: `get`,
		isValid: true,
	})
}

export const getProductAttachAllApi = function() {
	return request({
		url: `/product/attachment`,
		method: `get`,
		isValid: true,
	})
}


