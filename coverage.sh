#! /usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTER="$HERE/cc-test-reporter"

function format_coverage() {
    "$REPORTER" format-coverage \
        "$1/coverage/lcov.info" \
        --input-type lcov \
        --output "$HERE/coverage/cc.${2:-server}.json"
}

if [[ "${TRAVIS_TEST_RESULT:-0}" == 0 ]]; then
    format_coverage "$HERE"
    # client coverage includes C:/Users/Dolan/Documents/docx for some reason...
    # format_coverage "$HERE/client" 'client'
    format_coverage "$HERE/scripts" 'scripts'

    PATTERN=coverage/cc.*.json
    FILES=($PATTERN)

    "$REPORTER" sum-coverage $PATTERN -p ${#FILES[@]}
    "$REPORTER" upload-coverage
fi
