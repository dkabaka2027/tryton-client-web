const PROXY_CONFIG = {
	"/tryton": {
		"target": "http://localhost:8000/",
		"secure": false,
		"changeOrigin": false,
		"pathRewrite": {
			"^/tryton": ""
		},
		"bypass": function (req, res, proxyOptions) {
		    req.headers["Host"] = "localhost:8000";
		    req.headers["Origin"] = "http://localhost:8000";
		    req.headers["Referer"] = "http://localhost:8000/index.html";
		},
		"logLevel": "debug"
	}
};

module.exports = PROXY_CONFIG;