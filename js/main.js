var currentObject;
var hist = [];
var ind;
var objectlabel = '';
var regex = /arr/;
var boxNumber = -1;
//var boxesInArray = -1;
var currentMessage = -1;

// an object containing 3 arrays representing what variables are inside the array, and which are on either side of it. This is useful for keeping track of where everything is so our visible model acts like a real array
var arrayModel = {
	pre : [],
	in : [],
	post : []
};

var settings = {
	modal : document.getElementById('settings'),
	show : function(content) {
		settings.modal.style.visibility = 'visible';
		guide.modal.style.visibility = 'hidden';
		help.modal.style.visibility = 'hidden';
	},
	hide : function() {
		settings.modal.style.visibility = 'hidden';
	},
	background : function() {
		document.body.style.background = "url('" + document.getElementById('bgImgUrl').value + "')";
		document.body.style.backgroundSize = "cover";
	},
	// used to force levelup and fill guide pages early, for demo purposes to avoid grinding
	debug : function(value) {
		// split the value string into task and level components to avoid long, unreadable code later
		var debugTask = value.split(' ')[0];
		var debugLevel = value.split(' ')[1];
		// if forcing level 3 which only fills right page, force level 2 to fill left page as well
		if (debugLevel == 3) {
			// calls the parent function again with debugLevel 2 specified
			settings.debug(debugTask + ' 2');
		}
		// set the level variable for the selected task
		score.tasks[debugTask].level = debugLevel -1;
		// set the score variable for the selected task to its goal so levelup is triggered when score.update runs
		score.tasks[debugTask].score = score.tasks[debugTask].goal[score.tasks[debugTask].level];
		// increment the score for the current task by 1
		score.update(debugTask, 1);
	},
	variableLimitToggle : function(toggle) {
		if (toggle === 'on') {
			settings.variableLimit = 4;
		} else {
			settings.variableLimit = 10000;
		}
	},
	variableLimit : 4,
};

var help = {
	modal : document.getElementById('help'),
	show : function(content) {
		help.modal.style.visibility = 'visible';
		settings.modal.style.visibility = 'hidden';
		guide.modal.style.visibility = 'hidden';
	},
	hide : function() {
		help.modal.style.visibility = 'hidden';
	}
};

var score = {
	tasks : {
		var : {
			name : ['var definition','var syntax','var compatibility',''],
			score : 0,
			level : 0,
			goal : [10, 10, 10, 1000],
			bar : document.getElementById('skillBar'),
			contentIndex : 0
		},
		push : {
			name : ['push() definition','push() syntax','push() compatibility'],
			score : 0,
			level : 0,
			goal : [10, 10, 10, 1000],
			bar : document.getElementById('taskBar'),
			contentIndex : 2
		},
		pop : {
			name : ['pop() definition','pop() syntax','pop() compatibility'],
			score : 0,
			level : 0,
			goal : [10, 10, 10, 1000],
			bar : document.getElementById('levelBar'),
			contentIndex : 4
		}
	},
	levelledUp : '',
	currTaskLevel : '',
	update : function(selectedScore, newValue) {
		// increment score by the amount to be added
		score.tasks[selectedScore].score += newValue;
		// if the user reaches their goal for the selected score...
		if (score.tasks[selectedScore].score >= score.tasks[selectedScore].goal[score.tasks[selectedScore].level]) {
			// store selectedScore in score.levelledUp so it will be available outside this scope
			score.levelledUp = selectedScore;
			// prevent progress bar from exceeding its container
			score.tasks[selectedScore].score = score.tasks[selectedScore].goal[score.tasks[selectedScore].level];
			// update and animate progress bar to fill its container
			score.progressbarAnimate(selectedScore);
			// display levelup modal and pass in the name of the goal completed
			levelup.show(score.tasks[selectedScore].name[score.tasks[selectedScore].level]);
			// increment the level of the selected score to set a new goal for the user
			score.tasks[selectedScore].level += 1;
			// set the score for the new goal to 0
			score.tasks[selectedScore].score = 0;
			// determine which content needs to be added to Pocket Guide
			var currContentSlot = guide.personalized[score.tasks[selectedScore].contentIndex];
			var currContent;
			var currContentLevel = score.tasks[selectedScore].level -1;
			if (currContentLevel == 0) {
				currContent = guide.content[selectedScore][0];
				// add content to Pocket Guide
				guide.personalized[score.tasks[selectedScore].contentIndex] = currContent;
				// add blank right page
				guide.personalized[score.tasks[selectedScore].contentIndex + 1] = '';
			} else if (currContentLevel == 1) {
				currContent = guide.content[selectedScore][0] + guide.content[selectedScore][1];
				// add content to Pocket Guide
				guide.personalized[score.tasks[selectedScore].contentIndex] = currContent;
				// add blank right page
				guide.personalized[score.tasks[selectedScore].contentIndex + 1] = '';
			} else if (currContentLevel == 2) {
				currContent = guide.content[selectedScore][2];
				// add content to Pocket Guide
				guide.personalized[score.tasks[selectedScore].contentIndex + 1] = currContent;
			}
		} else {
			// update and animate progress bar to its new level
			score.progressbarAnimate(selectedScore);
		}
	},
	progressbarAnimate : function (selectedScore) {
		// set width of progress bar to the percentage of the goal represented by the current score
		score.tasks[selectedScore].bar.style.width = ((score.tasks[selectedScore].score / score.tasks[selectedScore].goal[score.tasks[selectedScore].level]) * 100) + '%';
	}

};

var ios = [];
var iosTable = [];
var boxGeometry = [
	"M20,128 36,138 20,148 4,138z",
	"M4,138 20,128 20,110 4,120z",
	"M36,138 20,128 20,110 36,120z",
	"M4,120 20,130 20,148 4,138z",
	"M36,120 20,130 20,148 36,138z",
	"M20,110 36,120 20,130 4,120z"
];
var boxFills = [
	'#326466',
	'#3e7c7f',
	'#3e7c7f',
	'#60bdcc',
	'#60bdcc',
	'#6cd4e5'
];
var messages = [
	[
		'Creating Variables 1/3',
		'<p>We\'re going to take a visual look at how to work with JavaScript arrays.</p><p>An <em>array</em> is just a container for a collection of things. Before we can work with <em>arr</em> (the name of the empty array here) we need something to put in our container.</p><ol><li>Create a variable named <em>a</em><li>Set its value to <em>apple</em></ol>Type this command in the Console box:</p><p><code>var a = \'apple\'</code></p>'
	],
	[
		'Creating Variables 2/3',
		'<p>Fantastic! Now try this:</p><ol><li>Create another variable named <em>b</em><li>Set its value to some other fruit</ol></p><hr size="1"><p><em>Hint <svg version="1.1" id="upButton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 403 206" enable-background="new 0 0 403 206" xml:space="preserve"><path d="M0,206L0,31.2c0,0-2-31,31-31s341,0,341,0s31-4,31,28s0,177.8,0,177.8H0z"/><rect y="190" fill="#414649" width="403" height="15"/><polygon fill="#FCFFFD" points="201.5,62 221,113 179,113"/></svg><br>When the cursor is in the console, you can press the up arrow on your keyboard to access commands you\'ve entered before.</em></p>'
	],
	[
		'Creating Variables 3/3',
		'<p>One more should do it.<ol><li>Create a variable named <em>c</em><li>Set its value to another fruit</ol></p>'
	],
	[
		'Pushing Data Into An Array 1/3',
		'<p>One of the most common ways to add data to an array is to <em>push()</em> it. Try it!</p><p><ol><li>Push <em>a</em> into the array named <em>arr</em></ol></p><p><code>arr.push(a)</code></p>'
	],
	[
		'Pushing Data Into An Array 2/3',
		'<p>Notice that the variable you pushed into the array is now labelled <em>[0]</em>. That\'s the <em>index</em> of that item in the array.</p><p>It\'s an an automatically-assigned address you can use to find it later, which is pretty cool. I wish my sock drawer did that.</p><p><ol><li>Push another variable into the array</ol></p><p><em>Hint<br>You don\'t have to push b next, you could push c if you want to. Experiment!</em></p>'
	],
	[
		'Pushing Data Into An Array 3/3',
		'<p>One left to go.<ol><li>Push a third variable into the array</ol></p>'
	],
	[
		'Popping Data Out Of An Array 1/3',
		'<p>So you\'ve got all your variables in the array. Great. At some point, you\'re going to want to remove things from the array. You can use <em>pop()</em> to remove the last item in an array.<ol><li>Pop the last item out of the array and store its value in a new variable called <em>x</em></ol></p><p><code>x = arr.pop()</code></p>'
	],
	[
		'End of Line',
		'<p>That\'s all the coding I have time for right now. Stay tuned for future updates which will go over <em>shift()</em>, <em>unshift()</em>, <em>splice()</em>, and other favorite JavaScript array methods.</p><p>Also, to avoid the need to grind in this demo to see what the Pocket Guide could offer, check out the debug section of the settings window.</p>'
	]
];
/* TODO, add entries for:
shift() popping from the bottom of the array
unshift() pushing to the bottom of the array
tostring() converting the array to a string of values separated by commas
join() converting the array to a string of values separated by a specified string [join(' * ')]
accessing by index with brackets fruits[0]= 'kiwi'
deleting by index with brackets delete fruits[0]
splice()


*/



//create a Box class
var Box = function(vLabel,cLabel,boxNumber) {
	// create a group so we can animate this part of the SVG together
	this.group = s.g();

	// create an array to store the six sides of the cube we generate in the for loop,
	// drawing their geometry and fill colors from the boxPaths and boxGeometry arrays
	this.boxPaths = [];
	for (var path=0; path<boxGeometry.length; path++) {
		this.boxPaths[path] = s.path(boxGeometry[path]).attr({
			fill : boxFills[path],
			stroke : '#fff',
			strokeWidth : 0.25,
			strokeMiterlimit : 1,
			opacity : 0.3
		});
		this.group.add(this.boxPaths[path]);
	}
	// add a label for the variable name
	this.vName = s.text(7, 136, vLabel).attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.vName);

	// add a label for the index
	this.iName = s.text(14, 124, '').attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.iName);

	// add a label for the content
	this.cName = s.text(22, 136, cLabel).attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.cName);
	if (boxNumber > 2) {
		this.group.transform('T-50,'+(-40*(boxNumber-3)));
	} else {
		this.group.transform('T0,'+(-40*boxNumber));
	}
	// set opacity to 0 so we can fade in on instantiation
	this.group.attr({
		opacity: 0,
		onmouseover: 'messageConsole.update(\'A variable named <em>' + vLabel + '</em> containing the string <em>' + cLabel + '</em>\', \'#fff\', \'mouseover\')',
		onmouseout: 'messageConsole.clear()'
	});
	// set to fade in over 1s on instantiation
	this.group.animate({
		opacity: 1
    }, (1000), mina.easeinout);
	this.boxNumber = boxNumber;
};

// stores functions and references related to console messages
var messageConsole = {
	// reference to the div where console messages will be displayed
	box : document.getElementById('messageConsole'),
	// replace the contents of the messageConsole box with the passed message
	update: function(message,color,type) {
		var icon = '';
		if (type == 'mouseover') {
			icon = '<svg style="height:12pt;width:12pt;margin:4px 3px -4 0;"><use x="0" y="0" xlink:href="#mouseovericon"/></svg>';
		} else if (type == 'error') {
			icon = '<svg style="height:12pt;width:12pt;margin:4px 3px -4 0;"><use x="0" y="0" xlink:href="#erroricon"/></svg>';
			// no mouseOut event to clear the messageConsole, so clear after 10 seconds
			setTimeout(messageConsole.clear, 10000);
		} else if (type == 'alert') {
			icon = '<svg style="height:12pt;width:12pt;margin:4px 3px -4 0;"><use x="0" y="0" xlink:href="#alerticon"/></svg>';
			// no mouseOut event to clear the messageConsole, so clear after 10 seconds
			setTimeout(messageConsole.clear, 10000);
		}
		messageConsole.box.innerHTML = icon + '<span style="color:' + color + ';">' + message + '</span>';
	},
	// clear the messageConsole when called
	clear : function() {
		messageConsole.box.innerHTML = '';
	}
};

// store data and functions for the console
//   to avoid confusion with the browser's console, and overly-long names for an
//   often-used variable, the name has been shortened to "cnsl".
//     "cnsl.hist.data[cnsl.hist.index]"
//   is FAR more readable than
//     "consoleObject.history.data[consoleObject.history.index]"
var cnsl = {
	in : document.getElementById('console'),
	clear : function() {
		cnsl.in.value = '';
	},
	enteredValue : '',
	hist : {
		data : [],
		index : 0,
		display : function() {
			cnsl.in.labels[0].innerHTML = '(history: ' + (cnsl.hist.index + 1) + '/' + cnsl.hist.data.length + ')';
		},
		update : function() {
			cnsl.in.value = cnsl.hist.data[cnsl.hist.index];
		},
		dec : function() {
			cnsl.hist.index -= 1;
		},
		inc : function() {
			cnsl.hist.index += 1;
		},
		clearLabel : function() {
			cnsl.in.labels[0].innerHTML = '';
		},
	}
};

// stores functions and references related the left message box
// This area is intended to assign tasks for the user to complete
// TODO: implement right message box to display instructor video
var messageBox = {
	// reference to the div where task messages will be displayed
	box : document.getElementById('messageBoxLeft'),
	// state of the div: 1=visible, 0=minimized
	// may be toggled by user clicks on the div
	state : 1,
	// called when a new task is assigned to the user
	update : function() {
		// increments currentMessage so the next task is displayed when messageBox.show is called
		currentMessage += 1;
		// hides the messageBox to make it more visually apparent that its contents have changed
		messageBox.hide();
		// calls messageBox.show after a half-second delay so contents can update offscreen
		setTimeout(messageBox.show, 500);
	},
	// hides the messageBox
	hide : function() {
		messageBox.box.style.left = '-30vw';
	},
	// minimizes the messageBox so it is out of the way, but still displays enough to be restored onclick
	min : function() {
		messageBox.box.style.left = '-26vw';
	},
	// shows the messageBox and replaces its contents
	show : function() {
		// slides the messageBox so its left edge is at the left edge of the screen
		messageBox.box.style.left = '0vw';
		// fills the messageBox with the contents of messages[currentMessage]
		// the first item in that array is the message title, second is the message body
		messageBox.box.innerHTML = '<h3>' + messages[currentMessage][0] + '</h3>' + messages[currentMessage][1];
	},
	// shows or minimizes the messageBox when user clicks it
	click : function() {
		if (messageBox.state == 1) {
			messageBox.min();
			messageBox.state = 0;
		} else {
			messageBox.show();
			messageBox.state = 1;
		}
	},
};




// when the console box has focus and a key is pressed...
function kd(evt) {
	// if the key pressed is the return/enter key...
	if (evt.keyCode == 13) {
		// store the value of the console text in cnsl.enteredValue
		cnsl.enteredValue = cnsl.in.value;
		// push the entered text into the hist array (console history) so we can retrieve it on demand
		cnsl.hist.data.push(cnsl.enteredValue);
		// clear the console and history indicator to get ready for new input
		cnsl.clear();
		cnsl.hist.clearLabel();
		// set the index of the current command to the length of the hist.data array
		cnsl.hist.index = cnsl.hist.data.length;

		// handle arr.push() //pushing a value into the array
		if (/arr\.push\(.*\)/.test(cnsl.enteredValue)) {
			// parse the variable name from the submitted string
			var currVar = cnsl.enteredValue.split(/[()]+/)[1];
			// throw an error message if user tries to push a nonexistent variable
			if (arrayModel.pre.indexOf(currVar) == -1) {
				messageConsole.update('Sorry, I can\'t find a variable named <em>' + currVar + '</em>', 'red', 'error');
			} else {
				// look up the index of the specified variable in iosTable, and use that index to select object in ios as the currentObject
				currentObject = ios[iosTable.indexOf(currVar)];
				arrayModel.pre.splice(arrayModel.pre.indexOf(currVar),1);
				arrayModel.in.push(currVar);
				//boxesInArray += 1;
				pushA();
				messageBox.update();
				score.update('push',3.4);
			}
		// handle _ = arr.pop() //popping a value out of the array and storing in a variable
		} else if (/.* = arr\.pop\(\)/.test(cnsl.enteredValue)) {
			objectlabel = cnsl.enteredValue.split(/[=]+/)[0];
			arrayModel.in.splice(arrayModel.pre.indexOf(objectlabel),1);
			arrayModel.post.push(objectlabel);
			popA();
			messageBox.update();
			score.update('pop',3.4);
		// handle var _ = '_' //creating a variable
		} else if (/var .* = \'.*\'/.test(cnsl.enteredValue)) {
			var thesplit = cnsl.enteredValue.split(/var|[=\']+/);
			var theVariable = cnsl.enteredValue.split(/var|[=\']+/)[1].trim();
			var theContent = cnsl.enteredValue.split(/var|[=\']+/)[3];
			if (boxNumber > settings.variableLimit) {
				messageConsole.update('This demo is limited to 6 variables due to screen space limitations.', 'yellow', 'alert');
			} else {
				boxNumber += 1;
				ios[boxNumber] = new Box(theVariable,theContent,boxNumber,'ios'+boxNumber);
				currentObject = ios[boxNumber];
				arrayModel.pre.push(theVariable);
				iosTable.push(theVariable);
				messageBox.update();
				score.update('var',3.4);
			}
		}
		// Pseudocode: if (currentmessage = x && cnsl.enteredValue.split.test) {missionaccomplished}
	}
	// up arrow scrolls back through history array
	if (evt.keyCode == 38) {
		// if index is a positive number
		if (cnsl.hist.index > 0) {
			// decrement the index
			cnsl.hist.dec();
			// update the input box with the value at the new index
			cnsl.hist.update();
			// update the input box label with the current history index like this (history: 1/4)
			cnsl.hist.display();
			console.log(cnsl.hist.index);
			console.log(cnsl.hist);
		// if the index is 0, there are no older entries, so
		} else if (cnsl.hist.index === 0) {
			// decrement the index to -1, so any further up keypresses are ignored
			cnsl.hist.dec();
			// clear the input box, because there are no older entries
			cnsl.clear();
			// clear the input box label so it's clear we're not looking at data from our history
			cnsl.hist.clearLabel();
			console.log(cnsl.hist.index);
			console.log(cnsl.hist);
		}
	}
	// down arrow scrolls forward through history array
	if (evt.keyCode == 40) {
		// if index is a positive number
		if (cnsl.hist.index < cnsl.hist.data.length -1 ) {
			// increment the index
			cnsl.hist.inc();
			// update the input box with the value at the new index
			cnsl.hist.update();
			// update the input box label with the current history index like this (history: 1/4)
			cnsl.hist.display();
			console.log(cnsl.hist.index);
			console.log(cnsl.hist);
		// if the index equals the length of the history array, there are no newer entries, so
		} else if (cnsl.hist.index === cnsl.hist.data.length -1) {
			// increment the index to data.length+1, so any further down keypresses are ignored
			cnsl.hist.inc();
			// clear the input box, because there are no newer entries
			cnsl.clear();
			// clear the input box label so it's clear we're not looking at data from our history
			cnsl.hist.clearLabel();
			console.log(cnsl.hist.index);
			console.log(cnsl.hist);
		}
	}
}

function pushA() {
	currentObject.group.animate({
		transform: 't60,-108'
        }, (900), mina.easeinout, pushB);
}
function pushB() {
	currentObject.group.animate({
		transform: 't60,'+(-20*(arrayModel.in.length -1))
        }, (900), mina.easeinout);
	// change the array index label of this object
	// note: could also use node.textContent to get to access the text
	// note: possibly also available: .attr({'#text':'new text'})
	// todo: test and compare them to see if one has a performance advantage
	currentObject.iName.node.innerHTML = '[' + (arrayModel.in.length -1) + ']';
}
function popA() {
	currentObject.group.animate({
		transform: 't60,-108'
        }, (200), mina.easeinout, popB);
}
function popB() {
	currentObject.iName.node.innerHTML = '';
	currentObject.group.animate({
		transform: 't120,0'
        }, (900), mina.easeinout);
	currentObject.vName.node.innerHTML = objectlabel;
	currentObject.group.attr({
		onmouseover: 'messageConsole.update(\'A variable named <em>' + objectlabel + '</em> containing the string <em>' + currentObject.cName.node.innerHTML + '</em>\', \'#fff\', \'mouseover\')',
		onmouseout: 'messageConsole.clear()'
	});
}


window.onload = function () {
	window.s = Snap("#sandbox");
	messageBox.update();
	score.tasks.var.bar.innerHTML = score.tasks.var.name[0];
	score.tasks.push.bar.innerHTML = score.tasks.push.name[0];
	score.tasks.pop.bar.innerHTML = score.tasks.pop.name[0];
};

var levelup = {
	modal : document.getElementById('levelup'),
	slot : document.getElementById('levelupSlot'),
	toolIcon : document.getElementById('tool'),
	show : function(content) {
		levelup.modal.style.visibility = 'visible';
		levelup.modal.style.transition = 'opacity 1s, visibility 0s';
		levelup.slot.innerHTML = content;
		levelup.modal.style.opacity = 0.8;
		// TODO add handler for acquired icon
		levelup.toolIcon.style.visibility = 'visible';
		setTimeout(levelup.acquireTool, 3000);
		setTimeout(levelup.hide, 6000);
	},
	acquireTool : function() {
		levelup.toolIcon.style.transform = 'scale(0)';
		levelup.toolIcon.style.bottom = 0;
		levelup.toolIcon.style.right = 0;
	},
	hide : function() {
		levelup.modal.style.transition = 'opacity 3s, visibility 4s';
		levelup.modal.style.opacity = 0;
		levelup.modal.style.visibility = 'hidden';
		// update and animate progress bar to empty its container
		score.progressbarAnimate(score.levelledUp);
		// change the name of the progress bar to indicate the new goal
		score.tasks[score.levelledUp].bar.innerHTML = score.tasks[score.levelledUp].name[score.tasks[score.levelledUp].level];
		// reset tool icon to initial state
		levelup.toolIcon.style.visibility = 'hidden';
		levelup.toolIcon.style.transform = 'scale(1)';
		levelup.toolIcon.style.bottom = '50vh';
		levelup.toolIcon.style.right = '65vw';
	},
};

var about = {
	modal : document.getElementById('about'),
	show : function(content) {
		about.modal.style.visibility = 'visible';
	},
	hide : function() {
		about.modal.style.visibility = 'hidden';
	}
};

var guide = {
	// reference to the guide modal div
	modal : document.getElementById('guide'),
	// reference to the left page div
	left : document.getElementById('guideLeftContent'),
	// reference to the right page div
	right : document.getElementById('guideRightContent'),
	// open the guide
	show : function(content) {
		// close the settings and help boxes if they're open
		settings.modal.style.visibility = 'hidden';
		help.modal.style.visibility = 'hidden';
		// make the modal div visible
		guide.modal.style.visibility = 'visible';
		// fill the left page with content
		guide.left.innerHTML = guide.personalized[(guide.currentPage)];
		// fill the right page with content
		guide.right.innerHTML = guide.personalized[(guide.currentPage + 1)];
		// calculate and display page numbers
		guide.updatePgNums();
	},
	// close the guide
	hide : function() {
		// hide the modal div
		guide.modal.style.visibility = 'hidden';
	},
	// the currently open page (left side, facing pages are currentPage + 1)
	currentPage : 0,
	// handles clicks on the top corners of the guide
	turnPage : function(numPages) {
		// only fire if there are other pages available; numPages is 2 to go forward, -2 to go back
		if ((guide.currentPage + numPages) > -1 && (guide.currentPage + numPages) < (guide.personalized.length)) {
			// reset the contents of the left page to the new desired page
			guide.left.innerHTML = guide.personalized[(guide.currentPage + numPages)];
			// reset the contents of the right page to the new desired page
			guide.right.innerHTML = guide.personalized[(guide.currentPage + numPages + 1)];
			// update the currentPage variable so page numbers display properly and guide can be closed and reopened at this page
			guide.currentPage += numPages;
			// update the displayed page numbers
			guide.updatePgNums();
		}
	},
	// update the displayed page numbers
	updatePgNums : function() {
		// calculate and display left page number
		document.getElementById('guideLeftPgNm').innerHTML = (guide.currentPage + 1) + '/' + (guide.personalized.length);
		// calculate and display right page number
		document.getElementById('guideRightPgNm').innerHTML = (guide.currentPage + 2) + '/' + (guide.personalized.length);
	},
	// a library of content used to build the personalized guide as user completes tasks
	content : {
		// an array of entries for var in the order they are added
		// NOTE: since we reference an external SVG file in these entries, the <image> tag is required, as the <use> tag seen elsewhere in this code can only reference SVG fragments, not entire external files. Basically, within an SVG file, use <image> to pull in an entire file from somewhere else, or <use> to pull in a fragment of an SVG file locally or externally.
		var : [
			'<h2>var</h2>Declare a new local variable<svg class="guideIllustration"><image width="100%" height="100%" x="0" y="0" xlink:href="img/var.svg"/></svg><br><br>',
			'<code>var identifier = value</code><br><br>The var statement declares a variable in its current scope. Never declare a variable without var.<br><br>The identifier can contain digits, letters, $, or _, but may not start with a digit.<br><br>The value can be any legal expression, like a string, number, array, object, function, etc.',
			'<table class="guideTable" border="1" cellpadding="2"><tr class="guideTh"><td colspan="2">Desktop Compatibility</td></tr><tr><td>Chrome</td><td>Yes</td></tr><tr><td>Firefox</td><td>Yes</td></tr><tr><td>IE</td><td>Yes</td></tr><tr><td>Safari</td><td>Yes</td></tr><tr class="guideTh"><td colspan="2">Mobile Compatibility</td></tr><tr><td>Chrome</td><td>Yes</td></tr><tr><td>Firefox</td><td>Yes</td></tr><tr><td>IE</td><td>Yes</td></tr><tr><td>Safari</td><td>Yes</td></tr></table>'
		],
		// an array of entries for push() in the order they are added
		push : [
			'<h2>push()</h2>Add items to the end of an array<svg class="guideIllustration"><image width="100%" height="100%" x="0" y="0" xlink:href="img/push.svg"/></svg><br><br>',
			'<code>arr.push(element)</code><br><br>Append <code>.push()</code> to the name of the array you wish to modify, then list the items you want to push inside the parentheses, separated by commas.',
			'<table class="guideTable" border="1" cellpadding="2"><tr class="guideTh"><td colspan="2">Desktop Compatibility</td></tr><tr><td>Chrome</td><td>1.0</td></tr><tr><td>Firefox</td><td>1.0</td></tr><tr><td>IE</td><td>5.5</td></tr><tr><td>Safari</td><td>Yes</td></tr><tr class="guideTh"><td colspan="2">Mobile Compatibility</td></tr><tr><td>Chrome</td><td>Yes</td></tr><tr><td>Firefox</td><td>Yes</td></tr><tr><td>IE</td><td>Yes</td></tr><tr><td>Safari</td><td>Yes</td></tr></table>'
		],
		// an array of entries for pop() in the order they are added
		pop : [
			'<h2>pop()</h2>Remove the last item from the end of an array and return its value<svg class="guideIllustration"><image width="100%" height="100%" x="0" y="0" xlink:href="img/pop.svg"/></svg><br><br>',
			'<code>arr.pop()</code> would simply remove the last item from the array.<br><code>var x = arr.pop()</code> would remove the last item from the array and store its value in x.<br>',
			'<table class="guideTable" border="1" cellpadding="2"><tr class="guideTh"><td colspan="2">Desktop Compatibility</td></tr><tr><td>Chrome</td><td>1.0</td></tr><tr><td>Firefox</td><td>1.0</td></tr><tr><td>IE</td><td>5.5</td></tr><tr><td>Safari</td><td>Yes</td></tr><tr class="guideTh"><td colspan="2">Mobile Compatibility</td></tr><tr><td>Chrome</td><td>Yes</td></tr><tr><td>Firefox</td><td>Yes</td></tr><tr><td>IE</td><td>Yes</td></tr><tr><td>Safari</td><td>Yes</td></tr></table>'
		]
	},
	// Array for the personalized guide content that will be built as goals are reached. Each item in this array will represent the contents of a single page. For instance, when the var entry is first unlocked, guide.content.var[0] will be added to the array. If the user unlocks more detailed content through grinding, guide.personalized[0] will be set to guide.content.var[0] + guide.content.var[1]. They will be concatenated to form one page. When guide.show is called, the contents of the guideLeft and guideRight will be filled with guide.personalized[0] and guide.personalized[1].
	// Basically, it doesn't look like much now, but it's going to be important later. :)
	personalized : ['Complete tasks to add content to your Pocket Guide!','Practice what you\'ve learned after adding initial content to unlock deeper content.']
};

// Code Sample: Countdown Functionality
// If a visual countdown followed by a callback is needed,
// this could do the trick. Perhaps for a timed exercise.
// This is a little-known feature of Snap. Saving it here
// during development in case I decide to use it later.
/*
var theCallback = function () { alert('done'); };
function countdown(label, seconds) {
	var t = s.text(50,50,0);
	Snap.animate(seconds, 0, function (value) {
	    t.attr({
	    	text: label + Math.round(value)
	    });
	}, (seconds*1000), theCallback);
}
*/


/*
window['group' + skillNumber] = currentSVG.g().attr({
              id: 'g' + skillNumber
          });

              var rect = currentSVG.rect([skillNumber * 9], [i * 9], 8, 8);
              rect.attr({
                  id: "light" + skillNumber + lightNumber,
                  // sets the color of the rect to appear dimmed
                  fill: "#545A61",
                  // CUSTOMIZATION: sets the initial opacity of the rect to 0 so it can fade in
                  opacity: 0,
                  // CUSTOMIZATION: sets custom attributes we can access later via javascript
                  dataSkillName: bio.skillNames[skillNumber],
                  dataSkillNumber: skillNumber,
                  dataSkillLevel: skillLevel,
                  dataJob: job
              });

              rect.animate({
                  opacity: 1
              }, (lightNumber * 900), mina.easeinout);
*/
