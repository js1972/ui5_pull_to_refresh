# ui5\_pull\_to\_refresh

> Test the pull-to-refresh and scrolling capabilities of sap.m.Page and sap.m.List controls.

![ui5-pull-to-refresh](https://f.cloud.github.com/assets/1317161/2489828/6e180ff4-b17a-11e3-9558-a82996e4328f.gif)

## About ##
This application is a simple OpenUI5 sap.m.SplitApp (master/detail) which has been generated by the OpenUI5 Yeoman generator (https://github.com/saschakiefer/generator-openui5).

I wanted to test the pull-to-refresh capability when the app is run on a mobile device. Pull to refresh is added very simply with the following in the Master xml view: ```<PullToRefresh refresh="refreshData"	/>``` (see file Master.view.xml).

One event handler is required in the controller for pull-to-refresh to work. See ```refreshData()``` in Master.controller.js. Here we just request some more data (I'm using a dummy json source and a pretend latency delay) and update our model. Note that I Pre-pend the new data instead of appending it to get the Twitter-like experience where new items scroll in from the top.

Now, after seeing a StackOverlow.com question (http://stackoverflow.com/questions/22451180/positioning-a-sap-m-list) requesting how to do this and scroll back to the list item you were looking at I decided to add the functionality here as well.

See the ```handleUpdateFinished``` event handler in Master.controller.js. Here we handle the UpdateFinished event on the sap.m.List and calculate how many new items are being added (from our previous model update). We then force a scroll back that many items so the user is back where they started and can freely scroll up to see the new items at will - just like the Twitter mobile app as well as the GMail mobile app.

## How to use ##
1. Clone this repo
2. Change into the cloned directory and run ```npm install``` to download all the Grunt dependencies
3. Run ```grunt serve``` which will start a web server and launch the app in your default browser
4. Alternatively just navigate to ```http://js1972.github.io/ui5_pull_to_refresh/``` on you desktop browser or phone to see a GitHub hosted version.

Check Gruntfile.js for the connect web server settings. By default it sets up a server on localhost:8080 and serves files from the current diretory and the ../sapui5/latest directories. Change this latter directory to be the location of your UI5 library or alternatively use ```https://openui5.netweaver.ondemand.com/resources/sap-ui-core.js``` as the src attribute in the bootstrap script (although, this is damn slow).

##Notes ##
In OpenUI5 / SAPUI5, scrolling is handled by the awesome iScroll library. It currently uses version 4 although version 5 is available, which is a shame as there are some very handy features in 5. UI5 uses a delegate class to wrap iScroll. I've used this encapsulated class to make use of the handy ```scrollToElement()``` function so that I can build up an element id of the list I want to scroll to and then use this function to scroll away...

Scrolling is a tricky job. The browser must be able to complete painting before it can determine the dimensions of elements properly and therefore scroll. If you run into issues just try giving some time back to the browser before your scroll commands, like such: ```setTimeout(function() { scroller.scrollToElement(el, 200); }, 200);```.

Careful when using phone emulators... I've noticed that the scrolling is not quite right. For example the current code provided here works great on a real iPhone. However, if I run it on chrome using the iphone emulator the auto-sroll down after a pull-to-refresh event goes two far. It as if its measure the top as the top of the screen instead of the top of the the List. Maybe its fixed in iScroll 5; maybe its just UI5 that is buggy!
