# code visualizer

## Description
A visual tool for teaching coding.

## Live Demo
Available at [adamguttentag.github.io/codevisualizer/array.html](http://adamguttentag.github.io/codevisualizer/array.html)

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/screenshot.jpg)

## Installation
1. Visit [the project on GitHub](https://github.com/adamguttentag/codevisualizer), and use one of the following methods to download the files:

  * **If you just want to try it out,** click the "Download ZIP" button on the right side of the page, then unzip the downloaded file.
  * **If you are familiar with version control software and wish to download a copy for development purposes,** use the "HTTPS clone URL" on the right side of the page.

2. Open the array.html file in a modern Web browser.

## Using Code Visualizer

### Basics

1. Read the prompts in the message box on the left side of the window.
2. Enter your code in the console box near the bottom of the window.
3. Watch the animation play out in the middle of the window.

### Mouseover Help

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/mouseover.jpg)

If you're not sure what something is or does, move your cursor over it. Objects in the visualization will tell you what their properties are. Interface elements like dock buttons, progress bars and the message box will tell you what they do. Be inquisitive!

### Console History

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/history.jpg)

The console saves your history, just like the browser's JavaScript console or a terminal window. When the console has focus, pressing the up key on your keyboard fills the console with the last text you entered. You can scroll back and forth through your history with the up and down keys.

### Decluttering Your Workspace

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/clutter.jpg)

To temporarily slide the message box out of your way, click or tap on it. You can always bring it back into view by clicking or tapping on the tab that remains visible. It will always slide back out when it has new information for you.

### Errors

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/error_var.jpg)
![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/alert.jpg)


Error messages may appear in the console window if you try to do something silly like `push()` a variable that doesn't exist. Red text suggests you may have entered invalid code. Underlined text provides a link to relevant documentation on [Mozilla Developer Network](https://developer.mozilla.org/en-US/). Yellow alerts advise you that your code is valid but may not produce the results you expected.

### Pocket Guide

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/guide.jpg)

The Pocket Guide contains information about concepts you have learned. It's your own personalized reference guide and trophy case.

The more you practice a concept, the more detail your Pocket Guide will display about that concept. This helps you commit the concept to memory through repetition, but also gives you a handy way to recall the details later on.

Click the Pocket Guide icon in the bottom right corner of the window to open it.

(This feature not implemented yet)
Once the Pocket Guide is open, click the printer icon to print it. If you're using Chrome, you can select "Save As PDF" in the print dialog to create a file that can be viewed on your computer, phone or tablet.

### Predictive Visualization

![Screenshot](https://github.com/adamguttentag/codevisualizer/blob/master/img/pv.jpg)

Have you ever wished you could see how the browser was going to interpret your code before you wrote it? Back here in reality, we often take a stab at writing code, then save, load in the browser, tinker with the console and breakpoints, and maybe go back and insert a handful of `console.log()` lines and then try again until we get it right.

Sound familiar?

Code Visualizer evaluates the code in the console as you type and tries to guess your intentions before you hit enter. If you've already created a variable named `a` and you type `var a =` Code Visualizer guesses that you're probaby looking to do something with variable `a`. At that point, the box that represents `a` starts glowing, like a candle, to subtly let you know how the app sees your code. Change the `a` to a `b` without pressing enter and box `a` stops glowing.

If you appear to be about to push a variable into the array, the variable box glows and a line connects it to the array, indicating what the app thinks you're trying to do.

Like a classroom teacher, this kind of feedback encourages you to press on when you're on the right track, and gives you a blank anticipatory stare when your work doesn't make sense. This helps you learn faster because you start to see the code the way the browser does.

### Settings

For now, you can change the background image by entering the URL of a different image. Mostly this is just a placeholder to establish a place where other settings may be changed as the project develops.

## Project Objectives

### Low-Latency Visualization
Coding tends to be a very abstract process. Whether you are writing HTML or C, as an author you must be able to visualize what your code does. The Catch-22 here is that you cannot see what your code does until you write it, save it, possibly compile it and load it.

When an artist puts a paintbrush to a canvas, the result is instantly visible. In the process of learning, the artist engages in a cycle of brushing, observing, analyzing and formulating a plan for the next brush stroke. This is how mastery happens. If the artist painted with invisible ink, treated each brush stroke with an agent that fixed it to the canvas, processed the canvas to make the paint visible and then framed it before reaching the observation step, the latency in the cycle would be so great that the barrier to entry in the profession would be prohibitive.

The Code Visualizer guides a user through programming concepts, prompts them to type the code themselves in a console, then visually illustrates the results of their code as soon as they press enter. Visualizations are drawn in SVG on the fly and animated via the Snap.svg JavaScript library.

When a variable is created, a faux-3D box appears with labels for the variable name and its contents. When a variable is "pushed" into an array, the box slides up, drops into another box representing the array and acquires a third label representing its index in the array. When that variable is "popped" out of the array via arr.pop(), it quickly shoots up out of the array like superheated popcorn, loses its index label and acquires a new variable label.

Alan Turing called `push()` and `pop()` `BURY` and `UNBURY`, and the concept of of an ordered LIFO collection of data has been called a stack since the 1950s. These were all named for visual concepts because they were meant to be visualized. This tool trains the user to do so as they learn.

### Motivation and Repetition

Before we had computers, or electricity, or even metal tools, humans were physiologically "wired" to motivate learning through rewards. If a person ate an apple and no longer felt hungry, the brain interpreted this as a positive behavior that should be repeated. It released dopamine to create a sense of well being as a reward. The next time the person felt hungry, he would think, "I should eat another apple." And when he did, he would be rewarded with more dopamine.

The next time he felt hungry, he experienced higher dopamine levels in his quest for the next apple than he did upon eating the apple. His physiology was wired to motivate him to repeat positive behavior by providing a greater sense of well being when he was actively engaged in that behavior. The anticipation of a reward is a more powerful motivator than the reward itself.

We are still wired that way today. Steve Jobs claimed he was a disinterested troublemaker until an elementary school teacher motivated him to learn with various rewards. This is the reason people spend time playing online games that require them to grind through tedious tasks to move a progress bar. As long as they are moving the progress bar they are triggering the dopamine reward circuit. The key is to find the right variable frequency of rewards to keep the dopamine levels elevated. If the frequency is too low, the perceived value of the reward is too low to motivate the effort. If the frequency is too high, the perceived novelty of the reward is too low to warrant the effort.

The best games reward completion of the progress bar with tools that help play the game more effectively, reinforcing the anticipation that the reward is beneficial. Millions of people spend hours each week "grinding" through hunting and killing monsters in games. In the process, they become experts on where they are likely to find their prey, what tools are most effective in dispatching them and refining their technique to kill them more efficiently. The skills they develop are related to the skills required to write and optimize code. But coding is not presented in a way that triggers the dopamine reward circuit the way these games do.

The Code Visualizer aims to use the dopamine reward circuit to motivate users to "grind" through coding fundamentals. This repetition, paired with animated visual representation of the code and the dopamine reward circuit, will help users grok the concepts they learn.

### Pocket Guide

When you learn a new coding skill, you inevitably turn to your notes, books, prior work or online searches to recall the syntax you used. Every programmer does this, but this also adds latency to your development time. If you had a personalized reference guide limited to the concepts you've learned, you could pull it out on demand and refresh your memory faster.

As a user completes tasks that demonstrate basic knowledge of concepts, they are rewarded with an entry in their virtual Pocket Guide. At first the entry might contain only the name of the concept... a placeholder that reminds them they learned the concept. As they grind through subsequent iterations of that concept, more detail is added to that concept's entry in the guide. An example of the syntax is added after the user has demonstrated x iterations, then an illustration after y iterations, then a list of applicable options after z iterations. The user anticipates a reward of a real tool that makes them more efficient, and that tool motivates them more than an abstract progress bar to continue while ensuring they truly commit the concept to memory.

The Pocket Guide can be "printed" as a PDF in Chrome for those who like to keep their reference materials on the computer, phone or tablet. It can also be printed as a 4"x5.75" booklet. I'm a gadget guy, but I've learned that a small booklet in my back pocket with information important to me is a far more efficient reference than any of my gadgets. It's always at hand, doesn't need to be charged, turned on or powered up and I don't have to launch and search an app. I can look up the info I need in under 3 seconds without disrupting my workflow.


## Authors
*  Code Visualizer JavaScript, HTML, CSS and SVG images by [adamguttentag](https://github.com/adamguttentag).
* The on-the-fly SVG creation and animation relies on [Snap.svg](https://github.com/adobe-webplatform/Snap.svg/) by [Dmitry Baranovskiy](https://github.com/DmitryBaranovskiy), working for Adobe.
* The background image currently used (though this could change to something less abstract in the future, to create a more immersive learning environment) was created in SVG by Adam Guttentag based on Marc Edwards's raster image [Faux Bokeh](https://dribbble.com/shots/760031-Faux-Bokeh).
