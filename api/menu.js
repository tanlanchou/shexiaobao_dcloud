import request from "@/common/request.js";

export const getMenuApi = function() {
	return request({
		url: `/menu/find/all`,
		method: `get`,
		isValid: true
	})
}