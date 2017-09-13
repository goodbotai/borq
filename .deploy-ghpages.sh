#!/bin/bash

echo "Generating an pushing docs to github pages"
cd docs/html/
git init
git config user.name "Travis CI"
git add .
git commit -m "API docs."
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
