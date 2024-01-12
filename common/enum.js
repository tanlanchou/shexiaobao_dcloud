export const tokenKey = "token";
export const menuKey = "menu";
export const userKey = "user";
export const powerListKey = "power";
export const maxPage = 20;
export const userStatusForIndexSelect = [{
	letter: "J",
	data: ["禁用"]
}, {
	letter: "W",
	data: ["未通过验证"]
}, {
	letter: "Z",
	data: ["正常"]
}];

export const userStatus = {
	normal: 1,
	wxUser: 2,
	disable: 3,
	noVerification: 4
}

export const userStatusToWords = ["正常", "微信用户", "禁用", "未通过验证"];