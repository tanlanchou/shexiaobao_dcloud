import request from "@/common/request.js";

export const getRolePowerList = function(id) {
	return request({
		url: `/rolepower/find/all/${id}`,
		method: `get`,
		isValid: true
	})
}
