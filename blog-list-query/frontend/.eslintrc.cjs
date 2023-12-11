module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"jest/globals": true,
		"cypress/globals": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
	"ignorePatterns": ['dist', '.eslintrc.cjs'],
	"overrides": [
		{
			"env": {
				"node": true,
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react", "jest", "cypress"
	],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		],
		"react/prop-types": 0,
		"react/react-in-jsx-scope": "off",
		"no-unused-vars": 0,
	}
}
