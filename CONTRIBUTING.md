# Contributing to Sailor

<3

 * [Code of conduct](#code-of-conduct)
 * [Questions](#questions)
 * [Issue found](#issue-found)
 * [Verifying issues](#verifying-issues)
 * [New feature](#new-feature)
 * [Setup developer environment](#setup-developer-environment)
 * [Code and naming conventions](#code-and-naming-conventions)
 * [Tests](#tests)
 * [Documentation](#documentation)
 * [Commit message](#commit-message)
 * [Making a pull request](#making-a-pull-request)
 * [Get even more involved](#get-even-more-involved)


## Code of conduct
We are committed to making participation in this project a harassment-free
experience for everyone. Please read and follow our [Code of conduct](https://github.com/Etiene/sailor/blob/master/CODE_OF_CONDUCT.md).

## Questions
If you have questions about how to use Sailor, please direct them to our [Google group](https://groups.google.com/forum/#!forum/sailor-l).

## Issue found
If you found a problem or a bug at Sailor that does not pose a security risk, please report on the [Github issue tracker of Sailor's repository](https://github.com/Etiene/sailor/issues). Before creating a new issue, search if someone hasn't reported it already. If it's not listed, then you can create a new issue. Please be very descriptive and offer means for us to reproduce the error. If the problem you found can cause a security risk to current users of Sailor, please email it to dalcol@etiene.net

## Verifying issues
One important way you can help is by verifying and confirming bug reports. You can make comments to make the description more extensive, clearer or more reproducible and add test cases that are failing. 

## New feature
If you want to request a new feature on Sailor or develop a new feature yourself, post about it on the issue tracker of the Github repository as well. Also remember to see if nobody has posted it yet.   

## Setup developer environment

Example code given for Ubuntu users, if you are not under Ubuntu, follow these steps adapting to your current operational system.

 * Install Lua, LuaRocks and a database of choice. E.g. sqlite3
```
sudo apt-get install lua5.1 luarocks sqlite3
```
 * Fork [Sailor's repository](http://github.com/Etiene/sailor) by clicking on Fork then clone it:
```
git clone http://github.com/your_username/sailor
```
 * Setup the current rockspec, it will install almost all the necessary dependancies
```
luarocks install rockspecs/sailor-current-1.rockspec
```
 * Install the Lua module for the database of choice,. E.g. sqlite3
```
luarocks install luasql-sqlite3
```
 * Create a database and import the corresponding sql found on `test/dev-app/sql`
```
mkdir test/db
sqlite3 test/db/sailor_test < test/dev-app/sql/sqlite3.sql
```
 * Go to the directory test/dev-app, open index.lua and add this on the beginning so it reads from the Sailor dir you are currently working on. This line of code will add Sailor's src to the Lua package path, so when using require Lua will also look on this dir. Don't forget to replace /path/to/your/sailor/repo to the path where you've cloned your fork of Sailor's git repository.
```
 package.path =  '/path/to/your/sailor/repo/src/?.lua;'..package.path
```
 * Configure the dev-app to use your sql information by editing the file `test/dev-app/conf/conf.lua`
```lua
db = {
	test = {
		driver = sqlite3',
		host = 'localhost',
		user = nil,
		pass = nil,
		dbname = '/path/to/your/sailor/repo/test/db/sailor_test'
	}
}
```
 * To start the app using the Xavante webserver, run this command from the `test/dev-app` dir:
```
lua start-server.lua
```
 * This dev-app contains example codes and some unit & functional tests. You can add things to it.
 * If you decide to create a new app using `sailor create <app name>` while making your developments, don't forget to add the package.path modification to it as well.
 * If you wish to develop on Sailor while using a different web server or a different database, please refer to [installation tutorials](http://sailorproject.org/?r=docs/install).

## Code and naming conventions

These are general conventions to try to follow for consistency and not strict rules that will make your pull request be rejected or shamed. Code not following some of these conventions might be asked to be revised.

  * Do not create global variables for anything ever
  * It's okay to cache global standard functions into local functions for performance but pay attention to naming
  * File names and variable names, including functions, use snake_case
  * A variable for a model class can use PascalCase
  * Avoid 1 letter variable names when deemed apropriate
  * Add spaces between operators, after commands and inside curly braces
  * Identation normally uses 4 spaces
  * Use the constructor syntax for tables when possible. 
  * When tables have functions use `self` to refer to itself 
  * Use the dot operator to access known fields of tables when possible
  * Assign variables on the top of the scope whenever possible
  * Return from functions as early as possible
  * Try to take advantage of tail calls when deemed apropriate
  * Do not use semicolons
  * Remember Lua table index starts at 1 and do not use the table length operator (#) if your table has 'holes' in it

## Tests

Sailor is integrated with [Busted](olivinelabs.com/busted/) for unit and functional testing. If you want to run the current tests the dev-app, go to the app directory and run the tests using `sailor test` You can use normal Busted flags such as `--verbose` on regular mode. There is a special mode for simulating an OpenResty environment. To run this special resty mode run `sailor test --resty` from the app directory.

If you made any modifications to Sailor, it is ideal that you add a test a case for your modifications. 

Even if you did not make a new modification you can also contribute with additional test cases for parts of Sailor that you feel could be better tested. 

Please read the [testing tutorial](https://github.com/Etiene/sailor/blob/master/docs/tutorial_testing.md) for designing new tests. Ideally each Sailor module should have its own file inside `test/dev-app/tests/unit`, named in the same way as the module being tested. If your test case tests a combination of uses of modules please refer to `test/dev-app/tests/functional`. You might have to create a new file or add test cases to current files. 

## Documentation
Don't forget to document your code and to update the [CHANGELOG](https://github.com/Etiene/sailor/blob/master/CODE_OF_CONDUCT.md) adding a new entry on the top if applicable. Modifications that require updating the changelog:
 * Bug fix
 * Adding or removing feature
 * Deprecating a feature

Modifications that do not require updating the changelog:
 * Refactors
 * Docs modification

Do not forget to highlight anything that is a breaking change to apps developed on previous versions of Sailor.

If you added any new features or modified something that changes how to use Sailor, update the Reference manual and corresponding tutorials found on [docs](https://github.com/Etiene/sailor/tree/master/docs). 

You may also contribute with additional documentation or modifying the current docs to be easier to understand, correcting errors, typos, or updating them in case they are out of sync with the current Sailor. 

### Translating
Offers to translate the guides to your language are also welcome. In this case, add a new folder for it inside `docs`, for example, `docs/pt_br`. 

## Commit message

Some of these [conventions](http://blog.thoughtram.io/announcements/tools/2014/09/18/announcing-clog-a-conventional-changelog-generator-for-the-rest-of-us.html) were invented by Google folks for Angular JS and using clog. We are not using clog yet but we might.

 * The first line should ideally have less than 50 character 
 * It must indicate at the beginning what type of modification your commit poses and the scope 
 * Then write a short summary beginning with a verb usually on imperative or 3rd person present e.g. Update or Updates file X
 * A dot is not necessary at the end
 * Skip a line
 * Write a more detailed description and a motivation for this change if applicable
 * The description can have more than one paragraph
 * If you are making a breaking change skip another line and add BREAKING CHANGE

### Types: 
* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation changes
* **style**: Changes that do not affect the meaning of the code e.g. whitespace
* **refactor**: A code change that is not a new feature or bug fix
* **perf**: A code change that improves performance
* **test**: Adds missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries 

Example of a commit message:

```
docs(guide): Add tutorial for lua at client
<OBLIGATORY BLANK LINE>
A more detailed description goes here if necessary. Try to 
explain the problem that was fixed or the motivation for the change.
It is interesting to explain why this commmit is being done, not how.
<optional blank lines between paragraphs are ok>
You can add code examples indented with 4 spaces or bullet points 
using hyphens or asterisks.
```

## Making a pull request

After pushing your commits, open the page of your fork of Sailor and click on New pull request. That's it! :D
It might happen that you are asked to revise something before we merge it :)

## Get even more involved

If you want to be more participative on the future of Sailor, it is very recommended that you join the [Google group](https://groups.google.com/forum/#!forum/sailor-l) and start a discussion. Other options are to join our [Gitter chat](https://gitter.im/Etiene/sailor). Sometimes we also make physical meetings. When a maintainer goes to a conference it is often announced on the [website's News](sailorproject.org/?r=main/news). Whenever there are Lua reunions it is also possible to take a moment to talk about Sailor.

If you want to help spreading the word, get more developers using Sailor or contributing, there's also plenty of things you can do. You can tweet about it, you can print some stickers with Sailor logo and give to developer friends or distribute in conferences or hackathons. If you are an active contributor who understands details of Sailor, you are also encouraged to submit talks or give workshops about it on your country. You can ask on the [Google group](https://groups.google.com/forum/#!forum/sailor-l) for resources about that.

If you are a company or a person who wishes to support Sailor financially, there are also plenty of options. Donations get more time invested into Sailor for coding, documenting or spreading the word. You can also pay to have specific issues or new features coded using Bounty Source. You can find more information about this on the [Donation page](http://sailorproject.org/?r=main/donate).


### Thank you for contributing to Sailor!
### You are awesome <3
