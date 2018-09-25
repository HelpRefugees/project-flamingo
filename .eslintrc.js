module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends":[
        "eslint:recommended",
    ],
    "rules": {
        "no-console": 1,
        "indent": [
            "error",
            2
        ],
        "no-unused-vars": [
            "error",
            {
            "vars": "all",
            "args": "after-used",
            "ignoreRestSiblings": true
            }
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "operator-linebreak": [
            "error",
            "before"
        ],
        "prefer-arrow-callback": [
            "error",
            {
            "allowNamedFunctions": true
            }
        ]
    }
};
