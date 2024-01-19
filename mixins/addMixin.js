export default {
	data() {
		return {
			title: null,
			id: null
		}
	},
	onLoad(options) {
		this.title = options.title;
		this.id = options.id;
	}
}