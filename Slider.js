
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
*	File Name: Slider.js
*	External Components Used: None
*	Required Files: DOMO.js
*	License: GNU GPL
*
*	Author Information
*	------------------
*	Full Name: Luka Sostaric
*	E-mail: <luka@lukasostaric.com>
*	Website: <http://lukasostaric.com>
*
*/

var SLIDERCONTROLID = "slider-control";
var CONTROLELEMENT = "span";
var CONTROLID1 = "left-arrow";
var CONTROLID2 = "right-arrow";

function Slider(id) {

	var x = document.getElementById(id);
	this.slider = new Domo(x);
	this.sliderPane = this.slider.elementObject.parentNode;
	this.sliderPane.style.overflow = "hidden";
	this.sliderPane.style.position = "relative";

	if(this.slider.elementObject.style.cssFloat !== undefined) {

		this.slider.elementObject.style.cssFloat = "left";

	}
	else {

		this.slider.elementObject.style.styleFloat = "left";

	}

	var pane = new Domo(this.sliderPane);
	this.paneWidth = pane.getWidth();
	var children = this.slider.getChildElementNodes();
	this.numberOfChildren = children.length;

	this.slider.elementObject.style.width =
	children.length * this.paneWidth + "px";

	this.slideIndex = 0;
	var sliderControl = document.getElementById(SLIDERCONTROLID);
	var controlSpan = document.createElement(CONTROLELEMENT);
	controlSpan.id = CONTROLID1;
	controlSpan.prototype = this;
	controlSpan.onclick = this.previousSlide;
	sliderControl.appendChild(controlSpan);

	for(var i = 0; i < children.length; i++) {

		if(children[i].style.cssFloat !== undefined) {

			children[i].style.cssFloat = "left";

		}
		else {

			children[i].style.styleFloat = "left";

		}

		children[i].style.display = "block";
		children[i].style.width = this.paneWidth + "px";
		controlSpan = document.createElement(CONTROLELEMENT);
		controlSpan.innerHTML = (i + 1) + "";
		controlSpan.id = i + id;
		controlSpan.className = id;
		sliderControl.appendChild(controlSpan);
		controlSpan = new Object(controlSpan);
		controlSpan.prototype = this;
		controlSpan.onclick = this.jumpToSlide;

	}

	controlSpan = document.createElement(CONTROLELEMENT);
	controlSpan.id=CONTROLID2;
	controlSpan.prototype = this;
	controlSpan.onclick = this.nextSlide;
	sliderControl.appendChild(controlSpan);

}

Slider.prototype = {
	nextSlide: function(step, interval) {

		if(this.prototype.slideIndex == this.prototype.numberOfChildren - 1) {

			this.prototype.jumpToSlide(0);
			return;

		}

		this.prototype = this.prototype || this;
		step = step || 10;
		interval = interval || 17;
		this.prototype.slider.slideLeft
		(this.prototype.paneWidth, 10, 17);
		this.prototype.slideIndex++;

	},

	previousSlide: function(step, interval) {

		if(this.prototype.slideIndex == 0) {

			this.prototype.jumpToSlide(this.prototype.numberOfChildren - 1);
			return;

		}

		this.prototype = this.prototype || this;
		step = step || 10;
		interval = interval || 17;
		this.prototype.slider.slideRight
		(this.prototype.paneWidth, 10, 17);
		this.prototype.slideIndex--;

	},

	jumpToSlide: function(slideIndex) {

		this.prototype = this.prototype || this;

		if(isNaN(slideIndex)) {

			slideIndex = parseInt(this.id);

		}

		if(slideIndex > this.prototype.slideIndex) {

			var difference = slideIndex - this.prototype.slideIndex;

			this.prototype.slider.slideLeft(
				difference * this.prototype.paneWidth,
				50, 17
			);

		}

		else if(slideIndex<this.prototype.slideIndex) {

			var difference = -1 * (slideIndex - this.prototype.slideIndex);

			this.prototype.slider.slideRight(
				difference * this.prototype.paneWidth,
				50, 17
			);

		}

		this.prototype.slideIndex = slideIndex;

	}

};
