'use strict';
const path = require('path');
const Generator = require('yeoman-generator');
const packageJson = require('package-json');
const camelcase = require('camelcase');
const utils = require('./utils');

module.exports = class extends Generator {

	init() {
		return this.prompt([
			{
				name: 'moduleName',
				message: 'What\'s the name of the package you want to generate typings for?',
				validate: pkgName => packageJson(pkgName, 'latest')
					.then(result => {
						this.package = result;

						return true;
					}).catch(() => `Package ${pkgName} does not exist`)
			},
			{
				name: 'githubUsername',
				message: 'What is your GitHub username?',
				store: true,
				validate: x => x.length > 0 ? true : 'You have to provide a username'
			}
		]).then(props => {
			const moduleName = props.moduleName;
			const pkg = this.package;

			const tpl = {
				moduleName,
				moduleIdentifier: camelcase(moduleName),
				moduleVersion: pkg.version.split('.').slice(0, 2).join('.'),
				repositoryUrl: utils.extractUrl(pkg),
				githubUsername: props.githubUsername,
				name: this.user.git.name()
			};

			const mv = (from, to) => {
				this.fs.move(this.destinationPath(from), this.destinationPath(to));
			};

			this.fs.copyTpl([
				`${this.templatePath()}/**`
			], path.join(this.destinationPath(), moduleName), tpl);

			mv(path.join(moduleName, 'dt-tests.ts'), path.join(moduleName, `${moduleName}-tests.ts`));
		});
	}
};
