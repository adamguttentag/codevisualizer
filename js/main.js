// Detect Safari and change background image to raster for performance improvement.
// I would rather not use browser detection here, but I wanted to demonstrate a single-page
// app that uses no raster images. Unfortunately, Safari has performance issues
// with full-page SVG backgrounds, but every other major browser (including IE!)
// is using only SVG images.
if ((navigator.userAgent.indexOf('Safari') > -1) && (navigator.userAgent.indexOf('Chrome') < 0)) {
	document.body.style.backgroundImage = "url('img/bokeh_safari.jpg')";
}


// an object containing 3 arrays representing what variables are inside the array, and which are on either side of it. This is useful for tracking the locations of variables whether they are inside or outside the visual array.
var arrayModel = {
	// contains variables that are to the left of the array
	pre : [],
	// contains variables that are inside the array
	in : [],
	// contains variables that are to the right of the array
	post : [],
	// increments with each new box so it can have its own unique serial number
	boxNumber : -1,
	// various functions will store and share a reference to their working object here
	currentObject : '',
	// various functions will store and share the working variable name here
	var : '',
	// flag indicating thether the working object is in pre or post
	currentLocation : '',
	// indicates the index of the next open slot in an array. Usually equals array.length-1, but it may be a different value if a variable is undefined and removed from the model so the next new variable can take its place.
	openSlot : 0,
	// indicates x offset of a variable so additional columns may be created
	xOffset : 0,
	// indicates y offset of a variable so additional rows may be created
	yOffset : 0,
	// reset the mouseover attribute of the object to reflect the new variable
	objectRename : function() {
		// if object does not have an index assigned, update mouseover label to reflect variable
		if (!arrayModel.currentObject.iName.node.innerHTML) {
			arrayModel.currentObject.group.attr({
				onmouseover: 'messageConsole.update(\'A variable named <em>' + arrayModel.var + '</em> containing the string <em>' + arrayModel.currentObject.cName.node.innerHTML + '</em>\', \'#fff\', \'mouseover\')'
			});
		// else update mouseover label to reflect the index
		} else {
			arrayModel.currentObject.group.attr({
				onmouseover: 'messageConsole.update(\'An object in array "arr" at index <em>' + arrayModel.currentObject.iName.node.innerHTML + '</em> containing the string <em>' + arrayModel.currentObject.cName.node.innerHTML + '</em>\', \'#fff\', \'mouseover\')'
			});
		}
	},
	// reset the mouseover attribute of the object to reflect the new variable
	objectContentReplace : function(variable, content, color) {
		// display a message alerting user that they're replacing the content, not adding a new variable
		messageConsole.update('Variable <em>' + arrayModel.var + '</em> already in use. Replacing content (<em>' + ios[iosTable.indexOf(arrayModel.var)].cName.node.innerHTML + '</em>) of existing variable with your new content (<em>' + cmd.var.content + '</em>).', 'yellow', 'alert');
		// update the visible label of the object
		ios[iosTable.indexOf(arrayModel.var)].cName.node.innerHTML = content;
		// change the color of the label
		ios[iosTable.indexOf(variable)].cName.attr({fill: color});
		// animate the color of the label to off-white with a bounce timing function
		ios[iosTable.indexOf(variable)].cName.animate({fill: '#f1f2f2'},2000, mina.bounce);
		// redefine the object's mouseover function to reflect the new content
		ios[iosTable.indexOf(arrayModel.var)].group.attr({onmouseover: 'messageConsole.update(\'A variable named <em>' + variable + '</em> containing the string <em>' + content + '</em>\', \'#fff\', \'mouseover\')'});
	}
};

// an object containing functions and variables pertaining to the settings box
var settings = {
	// set a reference to the settings modal
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
			settings.variableLimit = 8;
		} else {
			settings.variableLimit = 1000;
		}
	},
	variableLimit : 8
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
			goal : [100, 100, 100, 1000],
			bar : document.getElementById('skillBar'),
			contentIndex : 0
		},
		push : {
			name : ['push() definition','push() syntax','push() compatibility'],
			score : 0,
			level : 0,
			goal : [100, 100, 100, 1000],
			bar : document.getElementById('taskBar'),
			contentIndex : 2
		},
		pop : {
			name : ['pop() definition','pop() syntax','pop() compatibility'],
			score : 0,
			level : 0,
			goal : [100, 100, 100, 1000],
			bar : document.getElementById('levelBar'),
			contentIndex : 4
		}
	},
	levelledUp : '',
	currTaskLevel : '',
	update : function(selectedScore, newValue, color) {
		// show points earned by the object
		setTimeout(anim.points, 200, newValue, color);
		// increment score by the amount to be added
		score.tasks[selectedScore].score += Number(newValue);
		// update displayed score in progress bar
		score.tasks[selectedScore].bar.innerHTML = score.tasks[selectedScore].name[score.tasks[selectedScore].level] + ' [' + score.tasks[selectedScore].score + '/' + score.tasks[selectedScore].goal[score.tasks[selectedScore].level] + ']';
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
			if (currContentLevel === 0) {
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
	progressbarAnimate : function(selectedScore) {
		// set width of progress bar to the percentage of the goal represented by the current score
		score.tasks[selectedScore].bar.style.width = ((score.tasks[selectedScore].score / score.tasks[selectedScore].goal[score.tasks[selectedScore].level]) * 100) + '%';
	},
	randomizer : function(baseScore) {
		// Randomly add or subtract an amount no greater than 10% to or from the base score.
		// This breaks the monotony of a fixed reward and create anticipation.

		// I once had an unpleasant, repetitive task I needed employees to perform, so I created
		// a very simple JavaScript game that rewarded them with a random piece of candy every 10th
		// time they performed it (and kept the candies displayed until the end of their shift when
		// they could collect them), but they had a slim chance of winning a small candy bar instead.
		// Over the course of a month, the group's performance of this task improved 18%.
		// It was too difficult to earn at first... people were frustrated chasing after the candy bar
		// when they had a 1-2% chance of winning, but at 30% it was no longer novel. They seemed most
		// motivated to chase after that candy bar at 8%. This is different, but I think 10% up or down,
		// or maybe 5%, is in the right ballpark to create enough motivational anticipation for the task.
		return (1+(Math.random()*(0.21)-0.1)*baseScore + baseScore).toFixed(0);
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
// Array of tasks to be performed, displayed by messageWindow. kd function checks
// against conditions for completion before advancing to the next task.
// Completing a var task 6 times won't count toward push tasks.
// FORMAT: [task title, task text, completion requirement]
var messages = [
	[
		'Creating Variables 1/3',
		'<p>We\'re going to take a visual look at how to work with JavaScript arrays.</p><p>An <em>array</em> is just a container for a collection of things. Before we can work with <em>arr</em> (the name of the empty array here) we need something to put in our container.</p><ol><li>Create a variable named <em>a</em><li>Set its value to <em>apple</em></ol>Type this command in the Console box:</p><p><code>var a = \'apple\'</code></p>',
		'var'
	],
	[
		'Creating Variables 2/3',
		'<p>Fantastic! Now try this:</p><ol><li>Create another variable named <em>b</em><li>Set its value to some other fruit</ol></p><hr size="1"><p><em>Hint <svg version="1.1" id="upButton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 403 206" enable-background="new 0 0 403 206" xml:space="preserve"><path d="M0,206L0,31.2c0,0-2-31,31-31s341,0,341,0s31-4,31,28s0,177.8,0,177.8H0z"/><rect y="190" fill="#414649" width="403" height="15"/><polygon fill="#FCFFFD" points="201.5,62 221,113 179,113"/></svg><br>When the cursor is in the console, you can press the up arrow on your keyboard to access commands you\'ve entered before.</em></p>',
		'var'
	],
	[
		'Creating Variables 3/3',
		'<p>One more should do it.<ol><li>Create a variable named <em>c</em><li>Set its value to another fruit</ol></p>',
		'var'
	],
	[
		'Pushing Data Into An Array 1/3',
		'<p>One of the most common ways to add data to an array is to <em>push()</em> it. Try it!</p><p><ol><li>Push <em>a</em> into the array named <em>arr</em></ol></p><p><code>arr.push(a)</code></p>',
		'push'
	],
	[
		'Pushing Data Into An Array 2/3',
		'<p>Notice that the variable you pushed into the array is now labelled <em>[0]</em>. That\'s the <em>index</em> of that item in the array.</p><p>It\'s an an automatically-assigned address you can use to find it later, which is pretty cool. I wish my sock drawer did that.</p><p><ol><li>Push another variable into the array</ol></p><p><em>Hint<br>You don\'t have to push b next, you could push c if you want to. Experiment!</em></p>',
		'push'
	],
	[
		'Pushing Data Into An Array 3/3',
		'<p>One left to go.<ol><li>Push a third variable into the array</ol></p>',
		'push'
	],
	[
		'Popping Data Out Of An Array 1/3',
		'<p>So you\'ve got all your variables in the array. Great. At some point, you\'re going to want to remove things from the array. You can use <em>pop()</em> to remove the last item in an array.<ol><li>Pop the last item out of the array and store its value in a new variable called <em>x</em></ol></p><p><code>x = arr.pop()</code></p>',
		'pop'
	],
	[
		'Popping Data Out Of An Array 2/3',
		'<p>Some key points to remember:<p><em>push()</em> adds to an array<li>lets you specify the source<li>does not let you specify the destination (always the end of the array)</p><p><p><em>pop()</em> adds removes from an array<li>lets you specify the destination<li>does not let you specify the source (always the end of the array)<ol><li>Pop another item out of the array and store its value in a new variable called <em>y</em></ol></p></p>',
		'pop'
	],
	[
		'Popping Data Out Of An Array 3/3',
		'<p>One left to go. You choose a variable name this time.<ol><li>Pop a third variable out of the array</ol></p>',
		'pop'
	],
	[
		'Clearing Variables',
		'<p>Since this demo has a limited amount of space, you may want to delete some variables to make room for new ones. JavaScript doesn\'t provide a way to delete variables, but you can "undefine" them.<ol><li>Undefine <em>x</em></ol></p><p><code>x = undefined</code></p>',
		'undefine'
	],
	[
		'End of Line',
		'<p>That\'s all the coding I have time for right now. Stay tuned for future updates which will go over <em>shift()</em>, <em>unshift()</em>, <em>splice()</em>, and other favorite JavaScript array methods.</p><p>Also, to avoid the need to grind in this demo to see what the Pocket Guide could offer, check out the debug section of the settings window.</p>',
		'splice'
	],
];

//ovum pascha diripienda
var ee = ['nkco knkcok','aWti , Inkwot ih sno.e..','vomup sahc aidiripnead','rTnalstadef or maLit:n" aEtsree ggs rcmalb.e "hWtaveret ah temna.s','vomup sahca','rTnalstadef or maLit:n" aEtsree gg".M su teba t py.o','umun sriereptrsu','rTnalstadef or maLit:n" nUidcsvoredef nutcoi.n "oWdnrew ah ttid eo.s',' 2 3 5 731','hTso era ela lrpmi eunbmre!sI t ihknt ehh muna sra ertiygnt  oocmmnucita!e','poitum srpmie','eBofert mi eebag,nt eherw sat ehC bu.eW  enkwon tow eheri  tocem srfmo ,noylt ah ttih losdt ehp woret  orcaeetw rodl sna difllt eh miwhtl fi.e','lkaautb rada aintko','iLttelk onnwf ca:t< >iabaradn kiot/<>il tirelaylt arsnalet ssa< >iassyq iu tlcwoingna ornu dna darsi eemf or mht eedda/<>i','vee','awaaAAAAAAeleeee','simorohpcia glrotimhs','iB-oidigat laJzz ,am.n..','2r2d','ebpeb oo pebpe .ebpeb olpob ol plbee pobpo.','3cop',' Ies eoyrup iotn ,is.rI s guegtsa n wes rttage:yl tet ehW ooik ew ni.',' inkwoj lusev reen','O=W ah\'t sehl ki?e!','it cat cote','tSargn eagem .hT enoylw niingnm vo esin tot  olpya<.rbH>woa obtua n ci eagemo  fhcse?s','√','nI1 29 0eYgvne yaZymtaniw oreta d syotipnan volet ah talet rnipsrideO wrle,lV noenug tna dopssbiylH xuel.yI  nhcpaet r 8 aocpmturet aehcses utedtn sbauo triaritnolan muebsr ,na dht ecserma sfo"  Iodn tow na t-√!1T ka etio tuo  fem ,htsi√ 1-"!t uahg tht euahtroo  fhtsia ppt ah tdecutaoi nsit eha tro  famikgnt ehi rrtaoian laritnola.','aetsregeg','hW yowlu dhtre eeba yno  fhtso eeher ?eLraingna dnf nua erm tuaull yxelcsuvi!e','ducatiy','hT eufutero  fdecutaoi.n','odcgwo','lCrasut ehd gooc wassyM oo!f'];

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
var Box = function(vLabel,cLabel) {
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
	// clean up; no need to keep this array in memory after paths are created
	delete this.boxPaths;
	// add a label for the variable name
	this.vName = s.text(7, 136, vLabel).attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.vName);

	// add a blank label for the index
	this.iName = s.text(14, 124, '').attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.iName);

	// add a blank label for points awarded
	this.points = s.text(14, 112, '').attr({
		fill : 'none',
		fontFamily : 'helvetica',
		fontSize : 8,
		opacity: 0
	});
	this.group.add(this.points);

	// add a label for the content
	this.cName = s.text(22, 136, cLabel).attr({
		fill : '#f1f2f2',
		fontFamily : 'helvetica',
		fontSize : 8
	});
	this.group.add(this.cName);
	// TODO: calculate positions using modulo instead of if statements
	if (arrayModel.openSlot > 5) {
		this.boxX = -100;
		this.boxY = -40*(arrayModel.openSlot-6);
	} else if (arrayModel.openSlot > 2) {
		this.boxX = -50;
		this.boxY = -40*(arrayModel.openSlot-3);
	} else {
		this.boxX = 0;
		this.boxY = -40*(arrayModel.openSlot);
	}
	this.group.transform('T' + this.boxX + ',' + this.boxY);
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
		} else if (type == 'ee') {
			icon = '<svg style="height:12pt;width:12pt;margin:4px 3px -4 0;"><use x="0" y="0" xlink:href="#ee"/></svg>';
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
			document.getElementsByTagName('label')[0].innerHTML = '(history: ' + (cnsl.hist.index + 1) + '/' + cnsl.hist.data.length + ')';
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
			document.getElementsByTagName('label')[0].innerHTML = '';
		},
	}
};

// stores functions and references related the left message box
// This area is intended to assign tasks for the user to complete
// TODO: implement right message box to display instructor video
var messageBox = {
	// index of the task message to be displayed
	currentMessage : -1,
	// reference to the div where task messages will be displayed
	box : document.getElementById('messageBoxLeft'),
	// state of the div: 1=visible, 0=minimized
	// may be toggled by user clicks on the div
	state : 1,
	// called when a new task is assigned to the user
	update : function(task) {
		// if the type of task meets the requirements for advancement...
		if (messageBox.currentMessage < 0 || task === messages[messageBox.currentMessage][2]) {
			// increments currentMessage so the next task is displayed when messageBox.show is called
			messageBox.currentMessage += 1;
			// hides the messageBox to make it more visually apparent that its contents have changed
			messageBox.hide();
			// calls messageBox.show after a half-second delay so contents can update offscreen
			setTimeout(messageBox.show, 500);
		}
	},
	// hides the messageBox
	hide : function() {
		messageBox.box.style.left = '-30vw';
	},
	// minimizes the messageBox so it is out of the way, but still displays enough to be restored onclick
	min : function() {
		messageBox.box.style.left = '-23vw';
	},
	// shows the messageBox and replaces its contents
	show : function() {
		// slides the messageBox so its left edge is at the left edge of the screen
		messageBox.box.style.left = '0vw';
		// fills the messageBox with the contents of messages[currentMessage]
		// the first item in that array is the message title, second is the message body
		messageBox.box.innerHTML = '<h3>' + messages[messageBox.currentMessage][0] + '</h3>' + messages[messageBox.currentMessage][1];
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

var cmd = {
	var : {
		content : '',
		exec : function() {
			arrayModel.var = cnsl.enteredValue.split(/var|[=\']+/)[1].trim();
			cmd.var.content = cnsl.enteredValue.split(/var|[=\']+/)[3];
			// Block variables after 9 are already created (can be disabled in settings)
			if (ios.length > settings.variableLimit) {
				messageConsole.update('This demo is limited to 9 variables due to screen space limitations.', 'yellow', 'alert');
			// Block variable creation if variable name already in use to avoid duplicates.
			// Replace content of existing variable object and alert user.
			} else if (iosTable.indexOf(arrayModel.var) > -1) {
				arrayModel.objectContentReplace(arrayModel.var, cmd.var.content, 'skyblue');
			// Block variables that start with illegal characters.
			// The first ^ matches the beginning of the string, but the second ^ negates
			// the pattern, so any character not in that set matches and triggers this.
			} else if (/^[^a-zA-Z\$_]/.test(arrayModel.var)){
				// inform user, link to MozDev documentation on legal identifiers
				messageConsole.update('<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Variables" target="_blank">Variables must start with a letter, $ or underscore.</a><br>The character <em>' + arrayModel.var.slice(0,1) + '</em> is not allowed at the beginning of the identifier.', 'red', 'error');
			// Allow variable to be created if above conditions passed
			} else {
				// increment arrayModel.boxNumber
				arrayModel.boxNumber += 1;
				// if a previously-used spot exists on the board, fill it
				if (arrayModel.pre.indexOf('') > -1) {
					arrayModel.openSlot = arrayModel.pre.indexOf('');
				// otherwise, put the new variable after any existing ones
				} else {
					arrayModel.openSlot = arrayModel.pre.length;
				}
				// create a new Box in Instantiated ObjectS array, with variable name and variable content string-
				ios.push(new Box(arrayModel.var, cmd.var.content));
				// set currentObject to our new box, so functions in any scope can work with it
				arrayModel.currentObject = ios[arrayModel.boxNumber];
				// push the variable name into the pre-array portion of arrayModel so we know it's on the left side of the visual
				arrayModel.pre.splice(arrayModel.openSlot, 1, arrayModel.var);
				// push the variable name into the iosTable array
				iosTable.push(arrayModel.var);
				// increment the task in the messageBox if we just completed a task
				messageBox.update('var');
				// update appropriate score and progress bar
				score.update('var', score.randomizer(30), '#def7ff');
			}
		}
	},
	push : {
		exec : function() {
			// parse the variable name from the submitted string
			arrayModel.var = cnsl.enteredValue.split(/[()]+/)[1];
			// throw an error message if user tries to push a nonexistent variable
			if (iosTable.indexOf(arrayModel.var) == -1) {
				messageConsole.update('Sorry, I can\'t find a variable named <em>' + arrayModel.var + '</em>', 'red', 'error');
			} else {
				// look up indexOf the variable in iosTable, use that to select object in ios
				arrayModel.currentObject = ios[iosTable.indexOf(arrayModel.var)];
				// if arrayModel.var is in pre, set location to pre
				if (arrayModel.pre.indexOf(arrayModel.var) > -1) {
					arrayModel.currentLocation = 'pre';
				// else if arrayModel.var exists in post, set location to pre
				} else if (arrayModel.post.indexOf(arrayModel.var) > -1) {
					arrayModel.currentLocation = 'post';
				}
				// remove arrayModel.var from its location
				arrayModel[arrayModel.currentLocation].splice(arrayModel[arrayModel.currentLocation].indexOf(arrayModel.var),1,'');
				// push the object's index into arrayModel.in
				arrayModel.in.push(arrayModel.in.length+1);
				// fire push animation (and remove variable name from visual object)
				anim.push.up();
				// update iosTable so it points to the array index, since the variable name no longer applies to this object
				iosTable.splice(iosTable.indexOf(arrayModel.var), 1, arrayModel.in.length -1);
				// increment the task in the messageBox if we just completed a task
				messageBox.update('push');
				// update appropriate score and progress bar
				score.update('push', score.randomizer(33), 'red');
			}
		}
	},
	pop : {
		test : '',
		exec : function() {
			// block execution if arr is empty
			if (arrayModel.in.length === 0) {
				messageConsole.update('There\'s nothing in the array to pop. Try pushing something in first.', 'red', 'error');
			} else {
				// parse the variable name
				arrayModel.var = cnsl.enteredValue.split(/ [=]+/)[0];
				// if variable name already exists, undefine it so this can take its place
				if (iosTable.indexOf(arrayModel.var) > -1) {
					cmd.undefine.exec();
					messageConsole.update('Variable ' + arrayModel.var + ' already in use. It will be replaced by the object you are popping out of the array.', 'yellow', 'alert');
				}
				// delete indicated variable from arrayModel.in (an empty slot would interfere with push emulation)
				arrayModel.in.pop();
				// look up the index of object in iosTable, and use that index to set it as the currentObject
				arrayModel.currentObject = ios[iosTable.indexOf(arrayModel.in.length)];
				// find the first open slot in arrayModel.post
				cmd.pop.findOpenSlot();
				// push variable into arrayModel.post
				arrayModel.post.splice(arrayModel.openSlot, 1, arrayModel.var);
				// fire the pop animation (and change the variable label)
				anim.pop.up();
				// update iosTable so the new variable name points to the object's index
				iosTable.splice(iosTable.indexOf(arrayModel.in.length), 1, arrayModel.var);
				// increment the task in the messageBox if we just completed a task
				messageBox.update('pop');
				// update appropriate score and progress bar
				score.update('pop', score.randomizer(35), 'lime');
			}
		},
		findOpenSlot : function() {
			// find the index of the first open slot in arrayModel.post
			if (arrayModel.post.indexOf('') > -1) {
				arrayModel.openSlot = arrayModel.post.indexOf('');
			} else {
				arrayModel.openSlot = arrayModel.post.length;
			}
			// based on the slot's index, determine its coordinates
			if (arrayModel.openSlot > 5) {
				arrayModel.xOffset = 100;
				arrayModel.yOffset = arrayModel.openSlot-6;
			} else if (arrayModel.openSlot > 2) {
				arrayModel.xOffset = 50;
				arrayModel.yOffset = arrayModel.openSlot-3;
			} else {
				arrayModel.xOffset = 0;
				arrayModel.yOffset = arrayModel.openSlot;
			}
		}
	},
	ee : {
		//ovum pascha
		exec : function() {
			arrayModel.var = cnsl.enteredValue.split(/\//)[2];
			if (ee.indexOf(cmd.ee.unscramble(arrayModel.var)) > -1) {
				messageConsole.update(cmd.ee.unscramble(ee[ee.indexOf(cmd.ee.unscramble(arrayModel.var)) + 1]), '#f6a926', 'ee');
			}
		},
		//munus irrepertus
		unscramble : function(thetext) {
			var theOutput = '';
			for (var i=0;i<thetext.length;i++) {
 				if (!thetext[i+1]) {
 					theOutput += thetext[i];
 				} else {
 					theOutput += thetext[i+1];
 					theOutput += thetext[i];
 				i++;
 				}
			}
			return theOutput;
		}
	},
	undefine : {
		exec : function() {
			// parse the variable name, and remove the var prefix if it exists
			arrayModel.var = cnsl.enteredValue.split(/ [=]+/)[0].replace('var ','');
			// throw an error message if user tries to undefine a nonexistent variable
			if (iosTable.indexOf(arrayModel.var) == -1) {
				messageConsole.update('Sorry, I can\'t find a variable named <em>' + arrayModel.var + '</em>', 'red', 'error');
			} else {
				//locate variable in arrayModel.pre to free up its slot for new variables
				if (arrayModel.pre.indexOf(arrayModel.var) > -1) {
					arrayModel.pre.splice(arrayModel.pre.indexOf(arrayModel.var),1,'');
				// otherwise it's in .post, so free up its slot there
				} else {
					arrayModel.post.splice(arrayModel.post.indexOf(arrayModel.var),1,'');
				}
				// increment the task in the messageBox if we just completed a task
				messageBox.update('undefine');
				// run disposal animation
				anim.porthole.appear();
			}
		}
	}
};

var anim = {
	push : {
		// move the object up above the array
		up : function() {
			arrayModel.currentObject.group.animate({
				transform: 't60,-108'
        		}, (900), mina.easeinout, anim.push.in);
		},
		// move the object down into the array
		in : function() {
			arrayModel.currentObject.group.animate({
				transform: 't60,'+(-20*(arrayModel.in.length -1))
		        }, (900), mina.easeinout);
			// clear the array variable label of this object
			arrayModel.currentObject.vName.node.innerHTML = '';
			// change the array index label of this object
			// note: could also use node.textContent to get to access the text
			// note: possibly also available: .attr({'#text':'new text'})
			// todo: test and compare them to see if one has a performance advantage
			arrayModel.currentObject.iName.node.innerHTML = '[' + (arrayModel.in.length -1) + ']';
			// reset the mouseover attribute of the object to reflect the new index
			arrayModel.objectRename();
		},
	},
	pop : {
		// move the object up above the array
		up : function() {
			arrayModel.currentObject.group.animate({
				transform: 't60,-108'
        		}, (200), mina.easeinout, anim.pop.out);
		},
		// move the object out and to an open slot on the right
		out : function() {
			// clear the array index label of this object
			arrayModel.currentObject.iName.node.innerHTML = '';
			// move the object to the open slot
			arrayModel.currentObject.group.animate({
				transform: 't' + (120+arrayModel.xOffset) + ','+(-40*(arrayModel.yOffset))
		        }, (900), mina.easeinout);
			// change the variable label of this object
			arrayModel.currentObject.vName.node.innerHTML = arrayModel.var;
			// reset the mouseover attribute of the object to reflect the new variable
			arrayModel.objectRename();
		},
	},
	flame: {
		draw : function(x, y) {
			// use snap to create the vertical gradient (brief documentation of)
			/*	Brief explanation of Snap gradient syntax follows:
			 *	l indicates a linear gradient.
			 *	Each hyphen-delimited string like this rgba(rrr,ggg,bbb,a):%% represents a color stop.
			 *	r, g, and b are the values of red, green and blue between 0 and 255.
			 *	a is the alpha channel, with 0 indicating transparent and 1 indicating opaque,
			 *	or any decimal in between. The %% is the position of the each color stop as a percentage
			 *	along the gradient. The first and last color stops are assumed to be 0 and 100 if unspecified.*/
			pv.activeFlameGradientV = s.gradient('l(0,0,1,0)rgba(255,255,255,0.5)-rgba(136,136,136,0.5):02-rgba(136,136,136,0.5):25-rgba(255,255,255,0.8):50-rgba(136,136,136,0.5):75-rgba(136,136,136,0.5):98-rgba(255,255,255,0.5)');
			// use snap to create the horizontal gradient
			pv.activeFlameGradientH = s.gradient('l(0,0,0,1)rgba(0,0,0,0):100-rgba(255,255,255,1):100');
			// use snap to create a rect with the horizontal gradient as fill
			pv.activeFlameRect = s.rect(0, 0, 104, 99).attr({fill: pv.activeFlameGradientH});
			// use snap to create a shadow filter that appears to glow because it's based on #ff0, not #000
			pv.activeFlameShadow = s.filter(Snap.filter.shadow(-2, 0, 10,'#ff0'));
			// use snap to create the path of the flame and position w/ vert gradient as fill and rect as mask
			pv.activeFlame = s.path('M103.5,98.5H0.5v-64c0,0,20-34,51.5-34s5.5,73,51.5,24V98.5z').attr({id: 'wave', fill: pv.activeFlameGradientV, stroke: 'none', mask: pv.activeFlameRect, filter: pv.activeFlameShadow, transform: 'T' + x + ',' + y +'s0.311'});
			// init flicker animation
			anim.flame.flicker();
			// animate the offset of the 1st color stop on the horiz gradient in the mask so the flame appears to rise on instantiation
			pv.activeFlameGradientH.selectAll("*")[0].animate({offset: 0.75}, 1000);
		},
		flicker : function() {
			pv.activeFlameAnim = pv.activeFlame.animate({
				d: 'M103.5,98.5H0.5L0,2.2c0,0,1.3,47.3,32.8,47.3s31.3-90,70.7-25V98.5z'
				}, (1000), mina.easeinout, anim.flame.flicker2);
			pv.activeFlameGradientAnim = pv.activeFlameGradientH.selectAll("*")[0].animate({
				offset: 0.05
				}, (1000), mina.easeinout);
		},
		flicker2 : function() {
			pv.activeFlameAnim = pv.activeFlame.animate({
				d: 'M103.5,98.5H0.5v-64c0,0,20-34,51.5-34s5.5,73,51.5,24V98.5z'
				}, (2000), mina.easeinout, anim.flame.flicker3);
			pv.activeFlameGradientAnim = pv.activeFlameGradientH.selectAll("*")[0].animate({
				offset: 0
				}, (1000), mina.easeinout);
		},
		flicker3 : function() {
			pv.activeFlameAnim = pv.activeFlame.animate({
				d: 'M103,98.5H0v-74c0,0,25.2-55.7,48.8,7.3c12.6,33.6,52.4,21,54.8-29.7L103,98.5z'
				}, (1000), mina.easeinout, anim.flame.flicker4);
			pv.activeFlameGradientAnim = pv.activeFlameGradientH.selectAll("*")[0].animate({
				offset: 0.2
				}, (1000), mina.easeinout);
		},
		flicker4 : function() {
			pv.activeFlameAnim = pv.activeFlame.animate({
				d: 'M103.5,98.5H0.5v-64c0,0,20-34,51.5-34s5.5,73,51.5,24V98.5z'
				}, (1000), mina.easeinout, anim.flame.flicker);
			pv.activeFlameGradientAnim = pv.activeFlameGradientH.selectAll("*")[0].animate({
				offset: 0.35
				}, (1000), mina.easeinout);
		},
		stop : function() {
			pv.activeFlameAnim.stop();
			pv.activeFlameGradientAnim.stop();
		}
	},
	line: {
		draw : function(startX, startY, endX, endY) {
			// draw the line from the object to itself (so we have two coordinates but no line yet)
			pv.activeLine = s.path('M' + startX + ',' + startY + ' ' + startX + ',' + startY).attr({
				stroke: '#ff0',
				strokeDasharray: 2,
				strokeWidth: 4,
				opacity: 0
			});
			// change the second coordinates to the end point, so the line is drawn to it
			pv.activeLine.animate({
				d: 'M' + startX + ',' + startY + ' ' + endX + ',' + endY,
				strokeWidth: 0.5,
				opacity: 1
			}, (300), mina.easeout);
			// animate the dashArrayoffset loop
			anim.line.crawl();
		},
		crawl : function() {
			// animate the dashArrayoffset loop, and call crawlRepeat after 2s
			pv.activeLine.attr({strokeDashoffset: '100%'});
			pv.activeLineAnim = pv.activeLine.animate({
				strokeDashoffset: '90%',
				opacity: '1',
				}, (2000), mina.linear, anim.line.crawlRepeat);
		},
		crawlRepeat : function() {
			// animate the dashArrayoffset loop, and call crawl after 2s
			pv.activeLine.attr({strokeDashoffset: '100%'});
			pv.activeLineAnim = pv.activeLine.animate({
				strokeDashoffset: '90%',
				opacity: '0.3',
				}, (2000), mina.linear, anim.line.crawl);
		},
		stop : function() {
			// send stop animation signal to whichever line animation is active
			pv.activeLineAnim.stop();
		}
	},
	points : function(pointValue, color) {
		// set the points label to the passed pointValue
		arrayModel.currentObject.points.node.innerHTML = pointValue;
		// set label color based on the color of the associated progressbar
		arrayModel.currentObject.points.attr({
			fill : color,
			opacity : 1
		});
		// animate the opacity to fade out and transform to drift up
		arrayModel.currentObject.points.animate({
			opacity : 0,
			transform : 't0,-10',
		}, 2500, mina.backin);
	},
	porthole: {
		draw : function(x, y) {
			console.log('portholedraw fired');
			// use snap to create a shadow filter
			pv.portholeFilter = s.filter(Snap.filter.shadow(-2, 0, 10,'#000'));
			// use snap to create a the path for the porthole mask (shows #fff areas, hides #000 areas)
			pv.portholeMask = s.path('M433,356.5c0,0,0-236.5,0-295.5S383.5,0.5,383.5,0.5H217H50.5C50.5,0.5,1,2,1,61s0,295.5,0,295.5s-9.5,58,55,58s161,0,161,0s96.5,0,161,0C442.5,414.5,433,356.5,433,356.5z').attr({
				fill : '#fff'
			});
			// use snap to create a the path for the porthole hole
			pv.portholeHole = s.path('M433,356.5c0,0,0-236.5,0-295.5S383.5,0.5,383.5,0.5H217H50.5C50.5,0.5,1,2,1,61s0,295.5,0,295.5s-9.5,58,55,58s161,0,161,0s96.5,0,161,0C442.5,414.5,433,356.5,433,356.5z').attr({
				fill : '#000'
			});
			// use snap to create a the path for the porthole cover, using the mask
			pv.portholeCover = s.path('M433,356.5c0,0,0-236.5,0-295.5S383.5,0.5,383.5,0.5H217H50.5C50.5,0.5,1,2,1,61s0,295.5,0,295.5s-9.5,58,55,58s161,0,161,0s96.5,0,161,0C442.5,414.5,433,356.5,433,356.5z').attr({
				mask : pv.portholeMask,
				fill : '#92ce84',
				opacity : 1,
				transform : ''
			});
			pv.porthole = s.g(pv.portholeFilter, pv.portholeHole, pv.portholeCover).attr({
				transform : 'T-197,-80s0.085',
				opacity : 0
			});
			// init flicker animation
			//anim.flame.flicker();
		},
		appear : function() {
			pv.porthole.animate({
				opacity:1
			}, (300), mina.linear, anim.porthole.open);
		},
		open : function() {
			pv.portholeCover.animate({transform:'T0,400'},400, mina.easeout, anim.porthole.dispose);
		},
		dispose : function() {
			//sucks object visual off the screen like a vacuum cleaner
			ios[iosTable.indexOf(arrayModel.var)].group.animate({transform:'s0,20,120'},500, mina.easein, anim.porthole.close);
		},
		close : function() {
			pv.portholeCover.animate({transform:'T0,0'},400, mina.easeout, anim.porthole.disappear);
		},
		disappear : function() {
			pv.porthole.animate({opacity:0},300);
			// track object location in ios and iosTable
			loc = iosTable.indexOf(arrayModel.var);
			// remove the visual of the variable from the SVG
			ios[loc].group.remove();

			// remove the object from the instantiated objects array
			ios.splice(loc,1);
			// remove the reference to the object from iosTable
			iosTable.splice(loc,1);
		}
	}
};

// when the console box has focus and a key is pressed...
function kd(evt) {
	// store the value of the console box in cnsl.enteredValue
	cnsl.enteredValue = cnsl.in.value;
	// DETECT CERTAIN KEYPRESSES
	// Enter key = command is being sent
	if (evt.keyCode == 13) {
		// clear PV visuals; they are invalid because the input box is changing
		pv.clearVisuals();
		// push the entered text into the hist array (console history) so we can retrieve it on demand
		cnsl.hist.data.push(cnsl.enteredValue);
		// clear the console and history indicator to get ready for new input
		cnsl.clear();
		cnsl.hist.clearLabel();
		// set the index of the current command to the length of the hist.data array
		cnsl.hist.index = cnsl.hist.data.length;

		// handle arr.push() //pushing a value into the array
		if (/arr\.push\(.*\)/.test(cnsl.enteredValue)) {
			cmd.push.exec();
		// handle _ = arr.pop() //popping a value out of the array and storing in a variable
		} else if (/^[a-zA-Z\$_]* = arr\.pop\(\)/.test(cnsl.enteredValue)) {
			cmd.pop.exec();
		// handle var _ = '_' //creating a variable
		} else if (/var .* = \'.*\'/.test(cnsl.enteredValue)) {
			cmd.var.exec();
		// handle var _ = undefined //'deleting' a variable from the visualization
		} else if (/.* = undefined/.test(cnsl.enteredValue)) {
			cmd.undefine.exec();
		// ???
		} else if (/^\/\//.test(cnsl.enteredValue)) {
			cmd.ee.exec();
		}
	}
	// Up Arrow key = scroll back through console history
	if (evt.keyCode == 38) {
		// clear PV visuals; they are invalid because the input box is changing
		pv.clearVisuals();
		// if index is a positive number
		if (cnsl.hist.index > 0) {
			// decrement the index
			cnsl.hist.dec();
			// update the input box with the value at the new index
			cnsl.hist.update();
			// update the input box label with the current history index like this (history: 1/4)
			cnsl.hist.display();
		// if the index is 0, there are no older entries, so
		} else if (cnsl.hist.index === 0) {
			// decrement the index to -1, so any further up keypresses are ignored
			cnsl.hist.dec();
			// clear the input box, because there are no older entries
			cnsl.clear();
			// clear the input box label so it's clear we're not looking at data from our history
			cnsl.hist.clearLabel();
		}
	}
	// Down Arrow key = scroll forward through console history
	if (evt.keyCode == 40) {
		// clear PV visuals; they are invalid because the input box is changing
		pv.clearVisuals();
		// if index is a positive number
		if (cnsl.hist.index < cnsl.hist.data.length -1 ) {
			// increment the index
			cnsl.hist.inc();
			// update the input box with the value at the new index
			cnsl.hist.update();
			// update the input box label with the current history index like this (history: 1/4)
			cnsl.hist.display();
		// if the index equals the length of the history array, there are no newer entries, so
		} else if (cnsl.hist.index === cnsl.hist.data.length -1) {
			// increment the index to data.length+1, so any further down keypresses are ignored
			cnsl.hist.inc();
			// clear the input box, because there are no newer entries
			cnsl.clear();
			// clear the input box label so it's clear we're not looking at data from our history
			cnsl.hist.clearLabel();
		}
	// Anything else = user still typing, run predictive visualization to guess user intent
	} else {
		// user likely to send a PUSH command, highlight variable & draw line from it to array
		if (/push\(.*\)/.test(cnsl.in.value)) {
			// parse the variable name and task
			pv.parsedVariable = cnsl.in.value.split(/[()]+/)[1];
			// set parsed task value so other functions know what we detected here
			pv.parsedTask = 'push';
			// check to see if the variable and task are current
			pv.checkActives(pv.parsedVariable, pv.parsedTask);
		// user likely to send a POP command, highlight variable & draw line from it to openslot
		} else if (/^[a-zA-Z\$_]* = arr/.test(cnsl.in.value)) {
			//pv.parsedVariable = cnsl.in.value.split(/ [=]+/)[0];
			pv.parsedVariable = arrayModel.in.length -1;
			// set parsed task value so other functions know what we detected here
			pv.parsedTask = 'pop';
			// check to see if the variable and task are current
			pv.checkActives(pv.parsedVariable, pv.parsedTask);
		// user likely to send a VAR command, highlight variable
		} else if (/var .* =.*/.test(cnsl.in.value)) {
			pv.parsedVariable = cnsl.in.value.split(/var|[=\']+/)[1].trim();
			// set parsed task value so other functions know what we detected here
			pv.parsedTask = 'var';
			// check to see if the variable and task are current
			pv.checkActives(pv.parsedVariable, pv.parsedTask);
		// no clear intent detected
		} else {
			// clear pv because nothing matched
			pv.clearVisuals();
		}
	}
}

// init: things to do when the window loads
window.onload = function () {
	// enable snap to access the main SVG sandbox area
	window.s = Snap("#sandbox");
	// draw a transparent hole in the background before instantiating any boxes
	// so it appears to be behind them (SVG layers are determined by instantiation
	// order, not z-index like CSS)
	anim.porthole.draw(0,0);
	// load the first task and slide the messageBox in
	messageBox.update();
	// set the labels of the progress bars to their task categories
	score.tasks.var.bar.innerHTML = score.tasks.var.name[0];
	score.tasks.push.bar.innerHTML = score.tasks.push.name[0];
	score.tasks.pop.bar.innerHTML = score.tasks.pop.name[0];
};

// an object containing functions and variables pertaining to level up events
var levelup = {
	// set a reference to the level up modal div
	modal : document.getElementById('levelup'),
	// set a reference to the container for level up message content
	slot : document.getElementById('levelupSlot'),
	// set a reference to the tool icon, animates when new guide entries are made
	toolIcon : document.getElementById('tool'),
	// show the level up modal
	show : function(content) {
		levelup.modal.style.visibility = 'visible';
		levelup.modal.style.transition = 'opacity 1s, visibility 0s';
		levelup.slot.innerHTML = content;
		levelup.modal.style.opacity = 0.8;
		levelup.toolIcon.style.visibility = 'visible';
		// animate the tool icon after 2 seconds
		setTimeout(levelup.acquireTool, 2000);
		// hide the modal window after 4 seconds
		setTimeout(levelup.hide, 4000);
	},
	// animate the tool icon
	acquireTool : function() {
		// scale the tool icon to 0 so it appears to vanish
		levelup.toolIcon.style.transform = 'scale(0)';
		// translate the icon to the bottom right corner, indicating the guide
		levelup.toolIcon.style.bottom = 0;
		levelup.toolIcon.style.right = 0;
	},
	// hide the level up modal, reset tool icon position, update scores
	hide : function() {
		levelup.modal.style.transition = 'opacity 1s, visibility 2s';
		levelup.modal.style.opacity = 0;
		levelup.modal.style.visibility = 'hidden';
		// update and animate progress bar to empty its container
		score.progressbarAnimate(score.levelledUp);
		// change the name of the progress bar to indicate the new goal
		score.tasks[score.levelledUp].bar.innerHTML = score.tasks[score.levelledUp].name[score.tasks[score.levelledUp].level] + ' [' + score.tasks[score.levelledUp].score + '/' + score.tasks[score.levelledUp].goal[score.tasks[score.levelledUp].level] + ']';
		// reset tool icon to initial state
		levelup.toolIcon.style.visibility = 'hidden';
		levelup.toolIcon.style.transform = 'scale(1)';
		levelup.toolIcon.style.bottom = '50vh';
		levelup.toolIcon.style.right = '65vw';
	},
};

// an object containing functions and variables pertaining to the about box
var about = {
	// set a reference to the about modal
	modal : document.getElementById('about'),
	// show the about modal
	show : function(content) {
		about.modal.style.visibility = 'visible';
	},
	// hide the about modal
	hide : function() {
		about.modal.style.visibility = 'hidden';
	}
};

// an object containing functions and variables pertaining to the guide
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
		// TODO: build the HTML for these pages dynamically.  Once I've settled on the structure and types of content in the guide I'll go back and refactor this, but for now it's easier to tinker with static code.
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

// Predictive Visualization object
// contains functions and variables specific to the PV features of the app
var pv = {
	// cleans up any active PVs
	clearVisuals : function() {
		// only fire if there is an active pv task
		if (pv.activeObject[1]) {
			// call function that turns off pv for this task
			pv[(pv.activeObject[1] + 'Off')]();
			// reset active object to
			pv.activeObject = ['', ''];
		}
	},
	// Check to see if the variable exists and matches the current active PV.
	// It serves as gatekeeper for PV to filter out false positives and limit work
	// done on each keystroke unless there really is a need to generate a new PV.
	checkActives : function(variable, task) {
		// if the variable or task are not the currently active pv, replace with new pv
		if ((pv.activeObject[0] !== variable) || (pv.activeObject[1] !== task)) {
			// clear the old pv since it is no longer active
			pv.clearVisuals();
			// if the new variable exists in iosTable
			if (iosTable.indexOf(variable) > -1) {
				// set activeObject to the new variable and task
				pv.activeObject = [variable, task];
				// call function that turns on pv for this task; pass in the variable object
				pv[(task + 'On')](ios[iosTable.indexOf(variable)]);
			}
		}
	},
	parsedVariable : '',
	parsedTask : '',
	activeObject : ['', ''],
	activeLine : '',
	activeLineAnim : '',
	activeFlame : '',
	activeFlameAnim : '',
	activeFlameGradientAnim : '',
	activeFlameGradientH : '',
	activeFlameGradientV : '',
	activeFlameRect : '',
	activeFlameShadow : '',
	activeFlamePath : '',
	varOn : function(object) {
		// call flame.draw and pass coordinates
		anim.flame.draw(object.boxX-32, object.boxY+55.1);
	},
	varOff : function(object) {
		// stop the animation
		pv.activeFlameAnim.stop();
		// remove the flame
		pv.activeFlame.remove();
	},
	pushOn : function(object) {
		// call flame.draw and pass coordinates
		anim.flame.draw(object.boxX-32, object.boxY+55.1);
		// call line.draw and pass coordinates
		anim.line.draw(object.boxX+20, object.boxY+130, 80, (-20*(arrayModel.in.length -1)+110)); //was 80/100
	},
	pushOff : function(object) {
		// stop the line animation
		anim.line.stop();
		// remove the line
		pv.activeLine.remove();
		// stop the flame animation
		pv.activeFlameAnim.stop();
		// remove the flame
		pv.activeFlame.remove();
	},
	popOn : function(object) {
		// call flame.draw and pass coordinates
		anim.flame.draw(28, (55-((arrayModel.in.length -1)*20)));
		// find the first open slot in arrayModel.post (dest coordinates of the line)
		cmd.pop.findOpenSlot();
		// call line.draw and pass coordinates
		// TODO calculate column based first openslot '' in arraymodel.post
		anim.line.draw(80, (130-((arrayModel.in.length -1)*20)), (140+arrayModel.xOffset), (-40 * arrayModel.yOffset + 130));
	},
	popOff : function(object) {
		// stop the line animation
		anim.line.stop();
		// remove the line
		pv.activeLine.remove();
		// stop the flame animation
		pv.activeFlameAnim.stop();
		// remove the flame
		pv.activeFlame.remove();
	},
};
