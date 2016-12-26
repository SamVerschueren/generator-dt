import path from 'path';
import test from 'ava';
import helpers from 'yeoman-test';
import assert from 'yeoman-assert';
import pify from 'pify';
import tempfile from 'tempfile';

test.beforeEach(async t => {
	await pify(helpers.testDirectory)(tempfile());
	t.context.generator = helpers.createGenerator('dt', [path.join(__dirname, '/app')], null, {skipInstall: true});
});

test.serial('generates expected files', async t => {
	const generator = t.context.generator;

	generator.package = {
		version: '1.2.1',
		repository: {
			url: 'git+https://github.com/foo/foo'
		}
	};

	helpers.mockPrompt(generator, {
		moduleName: 'foo',
		githubUsername: 'SamVerschueren'
	});

	await pify(generator.run.bind(generator))();

	assert.file([
		'foo/index.d.ts',
		'foo/foo-tests.ts',
		'foo/tslint.json',
		'foo/tsconfig.json'
	]);

	assert.fileContent('foo/index.d.ts', /^\/\/ Type definitions for foo 1\.2/);
	assert.fileContent('foo/foo-tests.ts', `import foo = require('foo');`);
	assert.fileContent('foo/tslint.json', '{ "extends": "../tslint.json" }');
});

test.serial('generates expected content for dashed module name', async t => {
	const generator = t.context.generator;

	generator.package = {
		version: '1.2.1',
		repository: {
			url: 'git+https://github.com/foo/foo-bar'
		}
	};

	helpers.mockPrompt(generator, {
		moduleName: 'foo-bar',
		githubUsername: 'SamVerschueren'
	});

	await pify(generator.run.bind(generator))();

	assert.fileContent('foo-bar/index.d.ts', /^\/\/ Type definitions for foo-bar 1\.2/);
	assert.fileContent('foo-bar/foo-bar-tests.ts', `import fooBar = require('foo-bar');`);
	assert.fileContent('foo-bar/tslint.json', '{ "extends": "../tslint.json" }');
});
