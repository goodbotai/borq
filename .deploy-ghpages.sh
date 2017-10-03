#!/bin/sh

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo "Generating and pushing docs to github pages"
    cd docs/html/ || exit
    git init
    git config user.name "Travis CI"
    git add .
    git commit -m "API docs."
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
fi
