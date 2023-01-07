module.exports = {
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
        // "react"
    ],
    "rules": {
        'semi': 0,
        'import/export': 0,
        'react/prop-types' : 0,
        'no-new': 0,
    }
}
