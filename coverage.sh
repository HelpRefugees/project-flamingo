#! /usr/bin/env bash
set -e -x

for DIR in client scripts
do
    pushd $DIR
        ../cc-test-reporter format-coverage -o "../coverage/cc.$DIR.json" --add-prefix $DIR
    popd
done

PATTERN=coverage/cc.*.json
FILES=($PATTERN)

./cc-test-reporter sum-coverage $PATTERN -p ${#FILES[@]}
