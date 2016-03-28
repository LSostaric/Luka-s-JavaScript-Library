
/*
*
*	Copyright (C) 2010 Luka Sostaric. Luka's JavaScript Library is
*	distributed under the terms of the GNU General Public
*	License.
*
*	This file is part of Luka's JavaScript Library.
*
*	It is free software: You can redistribute and/or modify
*	it under the terms of the GNU General Public License, as
*	published by the Free Software Foundation, either version
*	3 of the License, or (at your option) any later version.
*
*	It is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty
*	of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*	See the GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public
*	License along with Luka's JavaScript Library. If not, see
*	<http://www.gnu.org/licenses/>.
*
*	Software Information
*	--------------------
*	Software Name: Luka's JavaScript Library
*	File Name: DOMO.js
*	External Components Used: None
*	Required Files: None
*	License: GNU GPL
*
* Description
*
*	DOMO is a JavaScript class extending the core JavaScript
*	DOM class. Its purpose is enabling a user to call "missing"
*	methods, which should have been included in the original DOM
*	of any browser. It contains cross-browser-compatible methods
*	such as getComputedWidth(), getComputedHeight(), moveLeft(n)
*	moveRight(n) moveUp(n), and moveDown(n); n is the number of
*	pixels to move in a certain direction.
*
*	Author Information
*	------------------
*	Full Name: Luka Sostaric
*	E-mail: <luka@lukasostaric.com>
*	Website: <http://lukasostaric.com>
*
*/

function Domo(element) {

	if(element.id == "") {

		window["lsCounterEggNumber"] = window["lsCounterEggNumber"] || 0;
		this.id = "ls-id-unique-" + window.lsCounterEggNumber;
		window["lsCounterEggNumber"]++;

	}
	else {

		this.id = element.id;

	}

	this.elementObject = element;
	this.style = this.elementObject.style;
	this.left = 0;
	this.top = 0;
	this.totalLeft = 0;
	this.totalTop = 0;
	this.oldHeight = 0;

}

Domo.prototype = {
	moveLeft: function(numberOfPixels) {

		this.style.left = this.left;
		this.style.position = "relative";
		var left = parseInt(this.style.left);
		var shift = left - numberOfPixels;
		this.style.left = shift + "px";
		this.left = this.style.left;

	},

	moveRight: function(numberOfPixels) {

		this.moveLeft(-numberOfPixels);

	},

	moveUp: function(numberOfPixels) {

		this.style.left = this.top;
		this.style.position = "relative";
		var top = parseInt(this.style.top);
		var shift = top - numberOfPixels;
		this.style.top = shift + "px";
		this.top = this.style.top;

	},

	moveDown: function(numberOfPixels) {

		this.moveUp(-numberOfPixels);

	},

	slideLeft: function(numberOfPixels, step, interval) {

		this.style.left = this.left;
		step = step || 10;
		interval = interval || 17;
		this.style.position = "relative";
		var left = 0;
		var style = this.style;
		var element = this.elementObject;
		var id = this.id;
		var subject = this;

		var animate = function() {

			left -= step;
			var shift = left + subject.totalLeft;
			style.left = shift + "px";

			if( Math.abs(left) >= Math.abs(-numberOfPixels) ) {

				subject.totalLeft -= numberOfPixels;
				subject.left = style.left;
				clearInterval(timer);

			}

		};

		var timer = setInterval(animate, interval);

	},

	slideRight: function(numberOfPixels, step, interval) {

		step = -step || -10;
		this.slideLeft(-numberOfPixels, step, interval);

	},

	slideUp: function(numberOfPixels, step, interval) {

		this.style.top = this.top;
		step = step || 10;
		interval = interval || 17;
		this.style.position = "relative";
		var top = 0;
		var style = this.style;
		var element = this.elementObject;
		var id = this.id;
		var subject = this;

		var animate = function() {

			top -= step;
			var shift = top + subject.totalTop;
			style.top = shift + "px";

			if( Math.abs(top) >= Math.abs(-numberOfPixels) ) {

				subject.totalTop -= numberOfPixels;
				subject.top = style.top;
				clearInterval(timer);

			}

		};

		var timer = setInterval(animate, interval);

	},

	slideDown: function(numberOfPixels, step, interval) {

		step = -step || -10;
		this.slideUp(-numberOfPixels, step, interval);

	},

	getComputedWidth: function() {

		var rectangle = this.elementObject.getBoundingClientRect();

		return (
			(rectangle.width) ? rectangle.width
			: (rectangle.right - rectangle.left)
		);

	},

	getComputedHeight: function() {

		var rectangle = this.elementObject.getBoundingClientRect();

		return (
			(rectangle.height) ? rectangle.height
			: (rectangle.bottom - rectangle.top)
		);

	},

	getChildElementNodes: function() {

		var elementNodes = new Array();

		for(var i = 0, j = 0; i < this.elementObject.childNodes.length; i++) {

			if(this.elementObject.childNodes[i].nodeType == 1) {

				elementNodes[j] = this.elementObject.childNodes[i];
				j++;

			}

		}

		return elementNodes;

	},

	animateOpacityChange: function(targetOpacity, step, interval, callback) {

		step = step || 10;
		interval = interval || 17;
		var style = this.style;
		var useFilter = false;
		var clear = false;

		if(style.opacity !== undefined) {

			var xopacity = style.opacity;
			xopacity = this.getComputedCssPropertyValue("opacity");
			xopacity = parseFloat(xopacity) * 100;

		}
		else if(style.filter !== undefined) {

			var xopacity = this.getComputedCssPropertyValue("filter");

			if(xopacity === "none") {

				xopacity = "alpha(opacity=100)";

			}

			var regExp = new RegExp("\\d+");
			xopacity = regExp.exec(xopacity);
			xopacity = parseInt(xopacity[0]);
			useFilter = true;

		}

		var animate = function() {

			if(targetOpacity < xopacity) {

				xopacity -= step;

				if(targetOpacity >= xopacity) {

					clear = true;

				}

			}
			else if(targetOpacity > xopacity) {

				xopacity += step;

				if(targetOpacity <= xopacity) {

					clear = true;

				}

			}

			if(useFilter) {

				style.filter = "alpha(opacity=" + xopacity + ")";

			}
			else {

				style.opacity = xopacity / 100;

			}

			if(clear) {

				clearInterval(timer);

				if(xopacity >= 100 && useFilter === true) {

					style.filter = "";

				}

				if(callback) {

					callback();

				}

			}

		};

		var timer = setInterval(animate, interval);

	},

	fadeOut: function(step, interval, callback) {

		step = step || 10;
		interval = interval | 17;

		this.animateOpacityChange(
			0, step, interval,
			callback
		);

	},

	fadeIn: function(step, interval, callback) {

		step = step || 10;
		interval = interval || 17;

		this.animateOpacityChange(
			100, step, interval,
			callback
		);

	},

	hide: function(display) {

		display = display || "none";
		this.elementObject.style.display = "none";

	},

	show: function(display) {

		display = display || "block";
		this.elementObject.style.display = display;

	},

	rollUp: function(step, interval) {

		var element = this.elementObject;
		step = step || 1;
		interval = interval || 1;
		element.style.overflow = "hidden";
		var currentHeightInt = this.getComputedHeight();
		var verticalPadding = this.getComputedVerticalPadding();

		if(verticalPadding != 0) {

			currentHeightInt -= verticalPadding;

		}

		var id = this.id;

		if(currentHeightInt !== 0) {

			this.oldHeight = currentHeightInt;

		}

		var thisObject = this;

		var animate = function() {

			if(currentHeightInt > 0) {

				currentHeightInt -= step;

			}

			element.style.height = currentHeightInt + "px";

			if(step < 0 && currentHeightInt >= thisObject.oldHeight) {

				element.style.height = thisObject.oldHeight + "px";
				thisObject.rollPaddingUp(-1);
				clearInterval(start);

			}
			else if(step > 0 && currentHeightInt <= 0) {

				element.style.height = "0px";
				thisObject.rollPaddingUp();
				clearInterval(start);

			}

		};

		var start = setInterval(animate, interval);

	},

	rollDown: function(step, interval) {

		step = -step || -1;
		interval = interval || 1;
		this.rollUp(step, interval);

	},

	getComputedCssPropertyValue: function(property) {

		if(window.getComputedStyle) {

			var style = getComputedStyle(this.elementObject);
			return style.getPropertyValue(property);

		}
		else {

			var style = this.elementObject.currentStyle;
			return style[property];

		}

	},

	getComputedVerticalPadding: function() {

		var top = this.getComputedCssPropertyValue("padding-top");
		var bottom = this.getComputedCssPropertyValue("padding-bottom");

		if(top == "" || top == undefined) {

			top = "0px";

		}

		if(bottom == "" || bottom == undefined) {

			bottom = "0px";

		}

		return parseInt(top) + parseInt(bottom);

	},

	getComputedHorizontalPadding: function() {

		var left = this.getComputedCssPropertyValue("padding-left");
		var right = this.getComputedCssPropertyValue("padding-right");

		if(left == "" || left == undefined) {

			left = "0px";

		}

		if(right == "" || right == undefined) {

			right = "0px";

		}

		return parseInt(left) + parseInt(right);

	},

	getComputedTopPadding: function() {

		var top = this.getComputedCssPropertyValue("padding-top");

		if(top == "" || top == undefined) {

			top = "0px";

		}

		return parseInt(top);

	},

	getComputedBottomPadding: function() {

		var bottom = this.getComputedCssPropertyValue("padding-bottom");

		if(bottom == "" || bottom == undefined) {

			bottom = "0px";

		}

		return parseInt(bottom);

	},

	getComputedLeftPadding: function() {

		var left = this.getComputedCssPropertyValue("padding-left");

		if(left == "" || left == undefined) {

			left = "0px";

		}

		return parseInt(left);

	},

	getComputedRightPadding: function() {

		var right = this.getComputedCssPropertyValue("padding-right");

		if(right == "" || right == undefined) {

			right = "0px";

		}

		return parseInt(right);

	},

	rollPaddingUp: function(step, interval) {

		step = step || 1;
		interval = interval || 1;
		var element = this.elementObject;
		var top = this.getComputedTopPadding();
		var bottom = this.getComputedBottomPadding();
		var id = this.id;

		if(top > 0 && !this.oldTop) {

			this.oldTop = top;

		}

		if(bottom > 0 && !this.oldBottom) {

			this.oldBottom = bottom;

		}

		var subject = this;

		var animate = function() {

			if(step > 0) {

				if(top > 0) {

					top -= step;
					element.style.paddingTop = top + "px";

				}

				if(bottom > 0) {

					bottom -= step;
					element.style.paddingBottom = bottom + "px";

				}

				if(top <= 0 && bottom <= 0) {

					clearInterval(start);

				}

			}
			else {

				if(top <= subject.oldTop) {

					top -= step;
					element.style.paddingTop = top + "px";

				}

				if(bottom <= subject.oldBottom) {

					bottom -= step;
					element.style.paddingBottom = bottom + "px";

				}

				if(
					top >= subject.oldTop &&
					bottom >= subject.oldBottom
				) {

					clearInterval(start);

				}
			}

		};

		var start = setInterval(animate, interval);

	},

	getAncestorNode: function(n) {

		if(n === undefined || n == 1) {

			return this.elementObject.parentNode;

		}

		if(n == 0) {

			return this.elementObject;

		}

		var currentNode = this.elementObject;

		while(n-- && (currentNode = currentNode.parentNode));

		return currentNode;

	},

	getParentNode: function() {

		return this.getAncestorNode();

	},

	getElementAncestorNode: function(n) {

		var result = this.getAncestorNode(n);

		if(result.nodeType != 1) {

			return null;

		}

		return result;

	},

	getElementParentNode: function(n) {

		return getElementAncestorNode();

	},

	getNextSiblingNode: function(n, nodeType) {

		if(n == 0) {

			return this.elementObject;

		}

		if(n === undefined) {

			n = 1;

		}

		var currentNode = this.elementObject;
		var sibling = currentNode;
		nodeType = nodeType || -1;

		while(n && (currentNode = currentNode.nextSibling)) {

			if(currentNode.nodeType == nodeType) {

				sibling = currentNode;
				n--;

			}

		}

		if(n != 0) {

			return null;

		}

		return sibling;

	},

	getPreviousSiblingNode: function(n, nodeType) {

		if(n == 0) {

			return this.elementObject;

		}

		if(n === undefined) {

			n = 1;

		}

		var currentNode = this.elementObject;
		var sibling = currentNode;
		nodeType = nodeType || -1;

		while(n && (currentNode = currentNode.previousSibling)) {

			if(currentNode.nodeType == nodeType) {

				sibling = currentNode;
				n--;

			}

		}

		if(n != 0) {

			return null;

		}

		return sibling;

	},

	getNextElementSiblingNode: function(n) {

		n = n || 1;
		return this.getNextSiblingNode(n, 1);

	},

	getPreviousElementSiblingNode: function(n) {

		n = n || 1;
		return this.getPreviousSiblingNode(n, 1);

	},

	getiFrameContent: function() {

		if(this.elementObject.tagName == "IFRAME") {

			return (
				this.elementObject.contentDocument ||
				this.elementObject.contentWindow.document
			);

		}
		else {

			throw TypeError("The element is not an iFrame.");

		}

	},

};
