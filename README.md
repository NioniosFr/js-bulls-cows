Bulls and cows
==============

An implementation of the **bulls and cows** puzzle game,
it's similar to mastermind.

The project was coded for fun during a weekend, after a friend taught me the game, mainly to practice my JavaScript knowledge.

####Goal of the game
Find all the numbers in their correct position and you win.

You can play the game [**here**](http://nioniosfr.github.io/js-bulls-cows/)

##Contributing

If you want to contribute, you are more than welcome.
Here's how I though of it initially.

###Structure

The project source files are stored under the `src` folder and the libraries and "compiled" files into the `dist` folder.

The project is using the `npm` package manager to keep track of the dependencies and the `grunt` task runner to automate some of the work.

For the page styling the twitter-bootstrap framework is used, and is placed under the dist folder.

Changes to the HTML document should also point to the `gh-pages` branch.

###JavaScript code

Run `grunt jshint` to lint your file, fix any errors and then commit.

###General tasks

By running `grunt` from the root of the repository, the files that exist in the source will be concatenated, minified, and a header will be applied.  
The resulted file is saved under the `dist` folder.

The tasks can be changed and/or reviewed from inside the `Gruntfile.js` file.

##License

The project is licensed under the [MIT License ](http://opensource.org/licenses/MIT)

