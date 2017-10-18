## Linting
It uses the [Google javascript style guide](https://google.github.io/styleguide/jsguide.html).

To run eslint on index.js lib/ config/ examples/
 * install dev dependencies
```
yarn install --dev
yarn lint
```

 * lint with --fix
```
yarn run lint -- --fix
```

 * lint a specific file
```
./node_modules/.bin/eslint <file.js>
```

#### Always lint before pushing
```
cp .dev-tools/git-hooks/pre-push .git/hooks/pre-push
export DO_STYLE_CHECKS=true
```


## Tests
Using mocha with BDD style testing and chai-as-promised for promises
Mocha looks for a `test/` dir in the root of the project and then runs the
`tests.js` file in it.

### Adding a new test file
Add a `.js` file with tests in it and put it in the `test/` dir in a way that
mirrors the location of the file it's testing.

### Adding a new test file to the general test suite
Add your test module and make it runnable from `test/tests.js`

### Running all the tests in the test suite
```
$ yarn test
```

Running the tests and watching for changes
```
$ yarn test --watch
```

### Running tests a single module
Not yet implemented


References:
- [NodeJS assert](https://nodejs.org/api/assert.html#assert_assert)
- [Mocha JS](https://mochajs.org/)
