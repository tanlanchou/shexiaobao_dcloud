
export const phoneValid = function(phone) {
	const phoneReg = /^1[3456789]\d{9}$/;
	return phoneReg.test(phone);
}