#!/bin/bash
rm -rf docs/html/ || exit 0;
jsdoc -c js-doc.json
( cd docs/html/
 git init
 git config user.name "Njagi Mwaniki"
 git config user.email "njagi@urbanslug.com"
 git add .
 git commit -m "Deployed to Github Pages"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
)
