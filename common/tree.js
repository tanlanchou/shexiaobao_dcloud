export const parseAndSort = function(arr, parentId = 0) {
	const result = [];

	// 过滤出具有当前parentId的项
	const children = arr.filter(item => item.parentId === parentId);

	// 将子项按照id的顺序添加到结果数组中，并递归处理子项的子项
	children.forEach(child => {
		result.push(child);
		const grandchildren = parseAndSort(arr, child.id);
		result.push(...grandchildren);
	});

	return result;
}