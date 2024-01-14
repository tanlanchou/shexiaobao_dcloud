export default {
	data() {
		return {
			title: null,
			id: null
		}
	},
	onLoad(options) {
		console.log("options", options);
		this.title = options.title;
		this.id = options.id;
	}
}