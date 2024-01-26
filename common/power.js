import {
	getMenuStorage,
	getPowerStorage
} from "./login";


let powers, menus;
export const getCommonMenus = function() {
	if (!menus) menus = getMenuStorage();
	const commonMenus = menus.filter(item => item.common == 1 && checkPower(item.power));
	return commonMenus;
}

export const getMenusGroupByType = function() {
	if (!menus) menus = getMenuStorage();
	const m = menus.filter(item => checkPower(item.power));
	let result = m.reduce((acc, cur) => {
		if (!acc[cur.type]) {
			acc[cur.type] = [];
		}
		acc[cur.type].push(cur);
		return acc;
	}, {});

	return result;
}

export const checkPower = function(key) {
	if (!powers) powers = getPowerStorage();
	if (key == 'RoleController_create') {
		console.log(`--------------------`)
		console.log(powers);
		const result = powers.find(item => item.powerName == key)
		console.log(result);
		console.log(!!result);
		console.log(`--------------------`)
	}
	const result = powers.find(item => item.powerName == key)
	return !!result;
}

export const checkPowerCommon = function(key) {
	const powerBase = key;
	const findAllPowerName = `${powerBase}_findAll`;
	const createPowerName = `${powerBase}_create`;
	const findOnePowerName = `${powerBase}_findOne`;
	const updatePowerName = `${powerBase}_update`;
	const deletePowerName = `${powerBase}_delete`;
	console.log("createPowerName", createPowerName);
	console.log("checkPower(createPowerName)", checkPower(createPowerName))
	return {
		findAllPowerEnable: checkPower(findAllPowerName),
		createPowerEnable: checkPower(createPowerName),
		findOnePowerEnable: checkPower(findOnePowerName),
		updatePowerEnable: checkPower(updatePowerName),
		deletePowerEnable: checkPower(deletePowerName)
	}
}