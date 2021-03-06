module.exports = {
	apps: [{
		name: "Astrologer Backend Service",
		script: "./app.js",
		exec_mode: "fork",
		log_date_format: "YYYY-MM-DD HH:mm Z",
		env: {
			NODE_ENV: "development"
		},
		env_production: {
			NODE_ENV: "production"
		},
		env_staging: {
			NODE_ENV: "staging"
		}
	}]
};