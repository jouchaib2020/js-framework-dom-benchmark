# Current benchmark being implemented 
## Starting point react <--> solid 
## Creation of a shallow and a deep tree
- 1. Create a tree with 1000 nodes and 2 children each.
- 2. Create a tree with 5000 nodes and 2 children.
- 3. Create a tree with 10000 nodes and 2 children.
- 4. Create a tree with 100000 nodes and 2 children. 

## TODO: add bechmark for upding a subtree

# Common Operations in Tree-Like Front-End Structures

## Add New Children to Existing Nodes
- **Example:** When a user creates a nested comment or a new sub-item.

## Remove Children from Nodes
- **Example:** Deleting a comment chain.

## Insert New Subtrees in the Middle
- **Example:** Loading data on demand and inserting it into the existing tree structure.

## Reorder Sibling Nodes
- **Example:** Dragging and dropping items into a new position within the same parent.

## Toggle Visibility of Entire Branches
- **Example:** Allowing users to expand or collapse sections of the tree.

## Update Node Data Without Affecting Siblings
- **Example:** Frequently updating the data of a specific node while keeping its siblings unchanged.

## Move Subtrees Between Different Parents
- **Example:** Reorganizing a menu hierarchy by moving subtrees to different parent nodes.

## Replace Entire Branches
- **Example:** Swapping out a collapsed section for a different view or component.

## Handle Partial Updates to Leaves
- **Example:** Updating only a few leaf nodes without reprocessing the entire tree.

## Attach Event Listeners to Modified Subtrees
- **Example:** Rebinding event listeners only within the subtree that has been modified.

## Manage Dynamic Conditions for Showing/Hiding Children
- **Example:** Hiding or showing children based on some state of the parent node.

## Refresh Part of the Tree in Response to External Actions
- **Example:** Updating a portion of the tree when receiving a server push or external event.

## Perform Incremental Loads
- **Example:** Loading new layers of the tree only when a user expands a node.

## Execute Large-Scale Changes
- **Example:** Removing a subtree and adding a different one as part of a significant update.

## Track Interdependencies Between Sibling Nodes
- **Example:** Toggling one node’s property affects how another sibling is rendered.

## Handle Concurrent Updates
- **Example:** Allowing the user to edit one branch while automated updates occur in another branch.

## Perform Partial Re-renders
- **Example:** Changing a single subtree while keeping the rest of the tree unchanged.

## Measure Time to Fully Unmount Subtrees
- **Example:** Assessing how long it takes to completely remove a subtree when the user navigates away.

# 2 Building the frameworks and running the benchmark 

## 2.1 Prerequisites

Have _node.js (>=v16.14.2)_ installed. If you want to do yourself a favour use nvm for that and install yarn. The benchmark has been tested with node vv16.14.2.
For some frameworks you'll also need _java_ (>=8, e.g. openjdk-8-jre on ubuntu).
Please make sure that the following command work before trying to build:

```
> npm
npm -version
8.5.0
> node --version
v16.14.2
> echo %JAVA_HOME% / echo $JAVA_HOME
> java -version
java version "1.8.0_131" ...
> javac -version
javac 1.8.0_131
```

## 2.2 Start installing

As stated above building and running the benchmarks for all frameworks can be challenging, thus we start step by step...

Install global dependencies
This installs just a few top level dependencies for the building the frameworks and a local web server.

```
npm ci
```
Then install the server:
```
npm run install-server
```

We start the local web server in the root directory

```
npm start
```

Verify that the local web server works:
Try to open [http://localhost:8080/index.html](http://localhost:8080/index.html). If you see something like that you're on the right track:
![Index.html](images/index.png?raw=true "Index.html")

Now open a new terminal window and keep the web server running in background.

## 2.3 Building and viewing a single framework

We now try to build the first framework. Go to the vanillajs reference implementation

```
cd frameworks/keyed/vanillajs
```

and install the dependencies

```
npm ci
```

and build the framework

```
npm run build-prod
```

There should be no build errors and we can open the framework in the browser:
[http://localhost:8080/frameworks/keyed/vanillajs/](http://localhost:8080/frameworks/keyed/vanillajs/)

Some frameworks like binding.scala or ember can't be opened that way, because they need a 'dist' or 'target/web/stage' or something in the URL. You can find out the correct URL in the [index.html](http://localhost:8080/index.html) you've opened before or take a look whether there's a customURL property under js-framework-benchmark in the [package.json](https://github.com/krausest/js-framework-benchmark/blob/master/frameworks/keyed/ember/package.json#L10) that represents the url.

## 2.4 Running benchmarks for a single framework

The benchmark uses an automated benchmark driver using chromedriver to measure the duration for each operation using chrome's timeline. Here are the steps to run is for a single framework:

```
cd ../../..
cd webdriver-ts
```

and install the dependencies

```
npm ci
```

and build the benchmark driver

```
npm run compile
```

now run the benchmark driver for the vanillajs-keyed framework:

```
npm run bench keyed/vanillajs
```

Just lean back and watch chrome run the benchmarks.
If it doesn't complain then the html for the table should be fine and your categorization as keyed or non-keyed should also be correct.

You should keep the chrome window visible since otherwise it seems like paint events can be skipped leading to wrong results. On the terminal will appear various log statements.

The results for that run will be saved in the `webdriver-ts/results` directory. We can take a look at the results of a single result:

```
cat results/vanillajs-keyed_01_run1k.json
{"framework":"vanillajs-keyed","benchmark":"01_run1k","type":"cpu","min":135.532,"max":154.821,"mean":143.79166666666666,"median":141.022,"geometricMean":143.56641695989177,"standardDeviation":8.114582360718808,"values":[154.821,135.532,141.022]}
```

As you can see the mean duration for create 1000 rows was 144 msecs.

You can also check whether the implementation appears to be compliant to the rules:

```
npm run isKeyed keyed/vanillajs
```

If it finds anything it'll report an ERROR.

## 2.5 Building the result table

Install libraries:

```
cd ..
cd webdriver-ts-results
npm ci
cd ..
cd webdriver-ts
```

In the webdriver-ts directory issue the following command:

```
npm run results
```

Now a result table should have been created which can be opened on [http://localhost:8080/webdriver-ts-results/dist/index.html](http://localhost:8080/webdriver-ts-results/dist/index.html).
There's nothing in table except for the column vanillajs-keyed at the right end of the first table.
![First Run Results](images/staticResults.png?raw=true "First Run Results")

## 2.6 [Optional] Updating the index.html file

This simply rebuilds the file used to display the table, not the results.

```
npm run index
```

## 2.7 [Optional] Building and running the benchmarks for all frameworks

This is not for the faint at heart. **Please read the security advice before running this command.**
You can build all frameworks by issuing:

```
cd ..
npm run rebuild-all
```

After downloading the whole internet it starts building it. Basically there should be no errors during the build, but I can't guarantee that the dependencies won't break. 

You can now run the benchmark for all frameworks by invoking:

```
npm run bench-all
```

in the root directory.

After that you can check all results in [http://localhost:8080/webdriver-ts/table.html](http://localhost:8080/webdriver-ts/table.html).

# 3 Tips and tricks

- You can run multiple implementations by passing their directory names (cd to webdriver-ts):
  `npm run bench keyed/angular keyed/react`.
- You can select multiple frameworks and benchmarks for running with prefixes like in the following example in the webdriver-ts directory:
  `npm run bench -- --benchmark 01_ 02_ --framework keyed/vanillajs keyed/react-hooks`
  runs the test for all frameworks that contain either angular or bob, which means all angular versions and bobril and all benchmarks whose id contain 01* or 02*
- The memory benchmarks assume certain paths for the chrome installation. If it doesn't fit use
  `npm run bench -- --chromeBinary /usr/bin/google-chrome`
- If you can't get one framework to compile or run, just move it out of the frameworks directory and re-run
- One can check whether an implementation is keyed or non-keyed via `npm run isKeyed` in the webdriver-ts directory. You can limit which frameworks to check in the same way as the webdriver test runner like e.g. `npm run isKeyed keyed/svelte`. The program will report an error if a benchmark implementation is incorrectly classified.

## 4. Contributing a new implementation

## 4.1 Example instructions for a real implementation
Thanks @dsvorc41 for providing the following description:
TL;DR:
![demo](https://github.com/dsvorc41/js-framework-benchmark/assets/20287188/91ae2d64-7362-4be8-b88f-e52637b33fa5)

1. Install all of the root-level dependencies
    1. `cd js-framework-benchmark/`
    1. `npm ci` or `npm i`
    1. `npm run install-local`
2. Make a new directory for your desired framework, for example Fast framework: `mkdir /frameworks/keyed/fast`
3. Set up your new directory in whatever way is appropriate for that framework, for example:
    1. Set up prettier, eslint, dependencies (i.e. `@microsoft/fast-element`) etc
    2. Create `index.html` in the root of your folder where your app will be served `touch /frameworks/keyed/fast/index.html`
    3. Note: your html file must use the global CSS styles `<link href="/css/currentStyle.css" rel="stylesheet" />`
4.  Serve the page - Test that your html page is loaded properly in the browser
    1. For example put `<h1>Hello World - Fast Framework</h1>` somewhere
    2. Run the server from the root directory: `npm start`
    3. Visit your page in the browser (URL follows the folder structure): `http://localhost:8080/frameworks/keyed/fast/index.html`
    4. Note: Its important to always start the server from the root, because that way you'll get access to global CSS that all apps must share
    5. Note 2: **AVOID SHADOW DOM** - if your framework relies on Shadow Dom (like Fast framework does), you should turn it off. Otherwise you won't get access to global CSS.
5. Add the "action triggers" - buttons that all apps must have (see `frameworks/keyed/vanillajs/index.html`)
   1. Note: Action triggers are simply buttons that are used to run the benchmarks (adding rows, deleting rows, swapping them, etc). Those buttons can be static HTML, or you can render them dynamically (with JS) with your framework of choice 
   2. Make sure your HTML elements have the same classes and structure as VanillaJS, otherwise benchmarks won't be able to find your elements on the page, and you will not get the global CSS (Bootstrap)
   3. Add the html example below and open the page. You should see nicely formatted elements on the page, like in the GIF image above.
   4. Example for action triggers
      ```html
          <body>
            <div id="main">
              <div class="container">
                <div class="jumbotron">
                  <div class="row">
                    <div class="col-md-6">
                      <h1>VanillaJS-"keyed"</h1>
                    </div>
                    <div class="col-md-6">
                      <div class="row">
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="run"
                          >
                            Create 1,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="runlots"
                          >
                            Create 10,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="add"
                          >
                            Append 1,000 rows
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="update"
                          >
                            Update every 10th row
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="clear"
                          >
                            Clear
                          </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                          <button
                            type="button"
                            class="btn btn-primary btn-block"
                            id="swaprows"
                          >
                            Swap Rows
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <table class="table table-hover table-striped test-data"> 
                  <!-- your dynamic content should render here --> 
                </table>
              </div>
            </div>
          </body>
      ```
6. Generate dummy data for rendering
   1. See `frameworks/keyed/fast/src/utils/build-dummy-data.ts` as an example
   2. Note: `id` is an important attribute and it must be initialized as `1`, and continuously incremented. The only time `id` resets back to `1` is when the page reloads - otherwise it should just keep incrementing each time a new row is created. Doing anything else will cause errors when benchmarks try to find elements with specific IDs. Trust me, I learned the hard way.
7. . Your app needs to support several actions that correspond to "Action triggers" listed above. Here's an example from Fast framework `frameworks\keyed\fast\src\App.ts` and `frameworks\keyed\fast\src\components\Table.ts`:
   1. Code example:
      ```typescript
        export class BenchmarkApp extends FASTElement {
          createOneThousandRows() {}
          createTenThousandRows() {}
          appendOneThousandRows() {}
          updateEveryTenthRowLabel() {}
          deleteAllRows() {}
          swapTwoRows() {}
          deleteSingleRow(rowId: number) {}
        }

        export class Table extends FASTElement {
          selectRow(rowId: number) {}
        }
      ```
    2. Note: your app doesn't need methods with the same name - you should write idiomatic code and follow the best practices of your framework of choice. The example above is just to give you an idea of which operations must be supported, but how you choose to implement those methods can be very different from one framework to the next. 
8. Manually testing your app - do this before you run the benchmarks
   1. Open your page and click on the buttons, make sure your app adds 1000 rows, then removes them, or swaps them, or adds/removes 10,000 rows. 
   2. To do this, you'll probably need to watch your local files and compile them into some sort of a bundle, like `frameworks\keyed\fast\dist\bundle.js` which will be loaded through a script tag in your HTML file
   3. For example, in Fast folder we have webpack watching our files: ` "dev": "rimraf dist && webpack --config webpack.config.js --watch --mode=development",` 
   4. That means we have two terminal tabs running
      1. One for the server from the root folder `npm start`
      2. And another in our local folder where webpack is watching the files
9. Run the single benchmark for your framework
   1.  Once you manually verified that everything works as expected, run a single benchmark and make sure all of the tests are running
   2.  If you forgot something, one of the benchmarks will probably fail - for example it won't be able to find an element on the page or similar
   3.  Keep the server in the root folder running `npm start`, and in another terminal tab, also from the root folder run `npm run bench -- --framework keyed/fast` (or whatever is your framework `keyed/react`, `keyed/angular`, etc.).
   4.  The benchmark runner will open and close Chrome multiple times. The whole thing will take a couple of minutes.
10. Optional: run the benchmark for VanillaJS as comparison
    1.  ` npm run bench -- --framework keyed/vanillajs`
11. Build the report
    1. `npm run results`
12. Open the report in your browser (NOTE: the server must still be running if you want to see this page)
    1. `http://localhost:8080/webdriver-ts-results/table.html`

## 4.2 Building the app

For contributions it is basically sufficient to create a new directory for your framework that supports `npm install` and `npm run build-prod` and can be then opened in the browser. All other steps are optional. Let's simulate that by copying vanillajs.

```
cd ../frameworks/keyed
cp -r vanillajs super-vanillajs
cd super-vanillajs
```

Then we edit super-vanillajs/index.html to have a correct index.html:

```
<title>Super-VanillaJS-"keyed"</title>
...
                    <h1>Super-VanillaJS-"keyed"</h1>
```

In most cases you'll need `npm install` and `npm run build-prod` and then check whether it works in the browser on [http://localhost:8080/frameworks/keyed/super-vanillajs/](http://localhost:8080/frameworks/keyed/super-vanillajs/).

(Of course in reality you'd rather throw out the javascript source files and use your framework there instead of only changing the html file.)

## 4.3 Adding your new implementation to the results table.

(Notice: Updating common.ts is no longer necessary, super-vanillajs is visible in the result table)

Your package.json must include some information for the benchmark. Since you copied it, the important section is already there:

```
  ...
  "js-framework-benchmark": {
    "frameworkVersion": "",
    "frameworkHomeURL": ""
  },
  ...
```

This one is a bit exceptional since vanillajs has no version and there no framework involved. If you use a normal framework like react it carries a version information and the framework should have an URL. For most frameworks you'll add a
dependency to your framework in package.json. The benchmark can automatically determine the correct version information from package.json and package-lock.json if you specify the
package name like that:

```
  "js-framework-benchmark": {
    "frameworkVersionFromPackage": "react"
    "frameworkHomeURL": "https://www.reactjs.org"
  },
```

Now the benchmark will fetch the installed react version from package-lock.json in the react directory and use that version number to compute the correct version string.
If your library has multiple important packages like react + redux you can put them separated with a colon there like "react:redux".
If you don't pull your framework from npm you can hardcode a version like `"frameworkVersion": "0.0.1"`.
The other important, but optional properties for js-framework-benchmark are shown in the following example:

```
"customURL": "/target/web/stage",
"useShadowRoot": true
```

You can set an optional different URL if needed or specify that your DOM uses a shadow root.

## 4.4 Submitting your implementation

Please take a look at https://github.com/krausest/js-framework-benchmark/wiki/Process-for-merging-a-pull-request for informations how pull requests are merged.



Contributions are very welcome. Please use the following rules:

- Name your directory frameworks/[keyed|non-keyed]/[FrameworkName]
- The package.json in your directory must contain some important information see section 4.2 above.
- Each contribution must be buildable by `npm install` and `npm run build-prod` command in the directory. What build-prod does is up to you. Often there's an `npm run dev` that creates a development build
- Every implementation must use bootstrap provided in the root css directory.
- All npm dependencies should be installed locally (i.e. listed in your package.json). Http-server or other local web servers should not be local dependencies. It is installed from the root directory to allow access to bootstrap.
- Please use _fixed version_ numbers, no ranges, in package.json. Otherwise the build will break sooner or later - believe me. Updating works IMO best with npm-check-updates, which keeps the version format.
- Webdriver-ts must be able to run the perf tests for the contribution. This means that all buttons (like "Create 1,000 rows") must have the correct id e.g. like in vanillajs. Using shadow DOM is a real pain for webdriver. The closer you can get to polymer the higher the chances I can make that contribution work.
- Don't change the ids in the index.html, since the automated benchmarking relies on those ids.
- Please push only files in your framework folder (not index.html or results.json)
- **Please make sure your implementation is validated by the test tool.** cd to the root directory and perform a check  `npm run rebuild-ci [keyed|non-keyed]/[FrameworkName]`. It'll print an error if your framework doesn't build, the benchmark can't be run or behaves other as specified. It'll print a big ERROR explaining if it isn't happy with the implementation. Some common errors include:
  - Your package.json is missing some required fields
  - Incorrect classification (Keyed/NonKeyed)
  - You have gzipped files in /dist (unfortunately the web server prefers these when they exist)
- Please don't commit any of the result file webdriver-ts/table.html, webdriver-ts-results/src/results.ts or webdriver-ts-results/table.html. I use to run the benchmarks after merging and publish updated (temporary) results.
- The latest stable chrome can be used regarding web features and language level (babel-preset-env "last 1 chrome versions")
- The vanillajs implementations and some others include code that try to approximate the repaint duration through javascript code. Implementations are not required to include that measurement. Remember: The real measurements are taken by the automated test driver by examining chrome timeline entries.
- **Please don't over-optimize.** This benchmark is most useful if you apply an idiomatic style for the framework you're using. We've sharpened the rules what kind of implementation is considered correct and will add errors or notes when an implementations handles things wrongly (errors) or in a way that looks like a shortcut (notes).
  - The html must be identical with the one created by the reference implementation vanillajs. It also must include all the aria-hidden attributes. Otherwise the implementation is considered erroneous and will be marked with issue [#634](https://github.com/krausest/js-framework-benchmark/issues/634).
  - Keyed implementations must pass the `npm run isKeyed` test in the test driver otherwise they are erroneous. Not that this test might not be sufficient, but just necessary to be keyed (from time to time we find new loop holes). There's error [#694](https://github.com/krausest/js-framework-benchmark/issues/694) for such cases.
  - Using request animation frame calls in client code, especially when applied only for some benchmark operations, is considered bad style and gets note [#796](https://github.com/krausest/js-framework-benchmark/issues/796) applied. Note that frameworks are free to choose whether they use RAF of not.
  - Manual DOM manipulation (like setting the danger class directly on the selected row) lead to some controversial debates. Depending on the framework you're using it might be idiomatic style or not. In any case it gets note [#772](https://github.com/krausest/js-framework-benchmark/issues/772) applied.
  - Implementations should keep the selected rows in the state (i.e. not a flag for each row, but one reference, id or index for the table) and use that information for rendering. Keeping a selection flag for each row might be faster, but it's considered bad style. Thus those implementations get note [#800](https://github.com/krausest/js-framework-benchmark/issues/800).
  - Explicit event delegation is another area where many discussions came up. Implementations that use explicit event delegation in client code get note [#801](https://github.com/krausest/js-framework-benchmark/issues/801). Frameworks themselves are free to use event delegation.

Helpful tips:

- Do not start your implementation using vanillajs as the reference. It uses direct DOM manipulation (and thus has note [#772](https://github.com/krausest/js-framework-benchmark/issues/772)) and serves only as a performance baseline but not as a best practice implementation. Instead pick a framework which is similar to yours.
- Do not forget to preload the glyphicon by adding this somewhere in your HTML: `<span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>` or you will get terrible performance.
- Be careful not to leave gzipped files in your /dist directory. Unfortunately the web server prefers these when they exist and we cannot change that (meaning you could be observing an outdated build).

This work is derived from a benchmark that Richard Ayotte published on https://gist.github.com/RichAyotte/a7b8780341d5e75beca7 and adds more framework and more operations. Thanks for the great work.

Thanks to Baptiste Augrain for making the benchmarks more sophisticated and adding frameworks.