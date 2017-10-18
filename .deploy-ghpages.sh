#! /bin/sh

echo "Generating and pushing docs to github pages"
cat docs/_css/custom.css >> out/styles/jsdoc-default.css || exit
cd out/ || exit
git init
git config user.email "travis@travis-ci.org"
git config user.name "Travis CI"
git add .
git commit -m "API docs."
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
