# code visualizer

## Description
A visual tool for teaching coding.

## Live Demo
Available at [adamguttentag.github.io/codevisualizer/array.html](adamguttentag.github.io/codevisualizer/array.html)

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

### Console History

The console saves your history, just like the browser's JavaScript console or a terminal window. When the console has focus, pressing the up key on your keyboard fills the console with the last text you entered. You can scroll back and forth through your history with the up and down keys.

### Decluttering Your Workspace

To temporarily slide the message box out of your way, click or tap on it. You can always bring it back into view by clicking or tapping on the tab that remains visible. It will always slide back out when it has new information for you.

### Errors

Error messages may appear in the console window if you try to do something silly like push() a variable that doesn't exist. Yellow text is simply advising you of an issue with the program. Red text suggests you may have entered invalid code.

### Pocket Guide

The Pocket Guide contains information about concepts you have learned. It's your own personalized reference guide and trophy case.

The more you practice a concept, the more detail your Pocket Guide will display about that concept. This helps you commit the concept to memory through repetition, but also gives you a handy way to recall the details later on.

Click the Pocket Guide icon in the bottom right corner of the window to open it.

Once the Pocket Guide is open, click the printer icon to print it. If you're using Chrome, you can select "Save As PDF" in the print dialog to create a file that can be viewed on your computer, phone or tablet.

### Settings

For now, you can change the background image by entering the URL of a different image. Mostly this is just a placeholder to establish a place where other settings may be changed as the project develops.

## Objectives

### Low-Latency Visualization
Coding tends to be a very abstract practice. Whether you are writing HTML or C, as an author you must be able to visualize what your code does. The Catch-22 here is that you cannot see what your code does until you write it, save it, possibly compile it and load it.

When an artist puts a paintbrush to a canvas, the result is instantly visible. In the process of learning, the artist engages in a cycle of brushing, observing, analyzing and formulating a plan for the next brush stroke. This is how mastery happens. If the artist painted with invisible ink, treat each brush stroke with an agent that fixed it to the canvas, process the canvas to make the paint visible and then frame it before reaching the observation step, the latency in the cycle would be so great that the barrier to entry in the profession would be prohibitive.

The Code Visualizer guides a user through programming concepts, prompts them to type the code themselves in a console, then visually illustrates the results of their code as soon as they press enter. Visualizations are drawn in SVG on the fly and animated via the Snap.svg JavaScript library.

When a variable is created, a faux-3D box appears with labels for the variable name and its contents. When a variable is "pushed" into an array, the box slides up, drops into another box representing the array and acquires a third label representing its index in the array. When that variable is "popped" out of the array via arr.pop(), it quickly shoots up out of the array like superheated popcorn, loses its index label and acquires a new variable label.

The fact that common methods like pop() are named pop() indicates they were meant to be imagined this way to help the programmer visualize their code. This tool trains the user to do so as they learn.

### Motivation and Repetition

Before we had computers, or electricity, or even metal tools, humans were physiologically "wired" to learn. If a person ate an apple and no longer felt hungry, the brain interprets this as a positive behavior that should be repeated. It released dopamine to create a sense of well being as a reward. The next time the person felt hungry, he would think, "I should eat another apple." And when he did, he would be rewarded with more dopamine.

The next time he felt hungry, he experienced higher dopamine levels in his quest for the next apple than he did upon eating the apple. His physiology was wired to motivate him to repeat positive behavior by providing a greater sense of well being when he was actively engaged in that behavior. The anticipation of a reward is a more powerful motivator than the reward itself.

We are still wired that way today. This is the reason people spend time playing online games that require them to grind through tedious tasks to move a progress bar. As long as they are engaged in that activity, moving the progress bar, they are triggering the dopamine reward circuit. The best games reward completion of the progress bar with tools that help play the game more effectively, reinforcing the sense of anticipation that the user is engaged in self-beneficial behavior.

Millions of people spend hours each week "grinding" through hunting and killing monsters in games. In the process, they become experts on where they are likely to find their prey, what tools are most effective in dispatching them and refining their technique to kill them more efficiently. The skills they have developed are related to the skills required to write and optimize code. But coding is not presented in a way that triggers the dopamine reward circuit the way these games do.

The Code Visualizer aims to use the dopamine reward circuit to motivate users to "grind" through coding fundamentals. This repetition, paired with animated visual representation of the code and the dopamine reward circuit, will help users grok the concepts they learn.

### Pocket Guide

When you learn a new coding skill, you inevitably end up later referencing your notes, books, prior work, or searching online to recall the syntax you used. Every programmer does this, but this also adds latency to your development time. If you had a personalized reference guide to just the concepts you've learned, you could pull it out on demand and refresh your memory faster.

As a user completes tasks that demonstrate basic knowledge of concepts, they are rewarded with an entry in their virtual pocket guide. At first it might be just the name of the concept... a placeholder that reminds them that they learned the concept. As they grind through iterations of that concept, more detail is added to that concept's entry in the guide. An example of the syntax is added after the user has demonstrated x iterations, then an illustration after y iterations, then a list of applicable options after z operations. The user anticipates a reward of a real tool that makes them more efficient, and that motivates them to continue while ensuring they truly commit the concept to memory.

The pocket guide can be "printed" as a PDF in Chrome for those who like to keep their reference materials on the computer, phone or tablet. It can also be printed as a 4"x5" booklet. I'm a gadget guy, but over time I've learned that a booklet that size in my back pocket with information important to me is a far more efficient reference than any of my gadgets. It's always at hand, doesn't need to be charged, turned on, powered up or launched. I can look up the info I need in under 3 seconds without cluttering my workspace.

## Authors
*  Code Visualizer JavaScript, HTML, CSS and SVG images by [adamguttentag](https://github.com/adamguttentag).
* The on-the-fly SVG creation and animation relies on [Snap.svg](https://github.com/adobe-webplatform/Snap.svg/) by [Dmitry Baranovskiy](https://github.com/DmitryBaranovskiy), working for Adobe.
* The background image currently used (though this could change to something less abstract in the future, to create a more immersive learning environment) was created in SVG by Adam Guttentag based on Marc Edwards's raster image [Faux Bokeh](https://dribbble.com/shots/760031-Faux-Bokeh).
