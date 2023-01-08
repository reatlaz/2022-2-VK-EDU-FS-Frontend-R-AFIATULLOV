module.exports = {
    "settings": {
        "react": {
        "version": "detect"
        }
    },
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "standard"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "ignorePatterns": ["temp.js", "/src/App.test.js"],
    "rules": {
        'semi': 0,
        'import/export': 0,
        'react/prop-types' : 0,
        'no-new': 0,
    }
}
