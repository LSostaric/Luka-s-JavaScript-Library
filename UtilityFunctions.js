/*
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
*	File Name: UtilityFunctions.js
*	External Components Used: None
*	Required Files: DOMO.js
*	License: GNU GPL
*
*	Author Information
*	------------------
*	Full Name: Luka Sostaric
*	E-mail: luka@lukasostaric.com
*	Website: www.lukasostaric.com
*/

function getScrollerPositions(aWindow) {
    var aDocument = null;
    aWindow = (aWindow != undefined) ? aWindow : window;
    if(aWindow.pageYOffset != undefined && aWindow.pageXOffset != undefined) {
        return {
            horizontal_position: aWindow.pageXOffset,
            vertical_position: aWindow.pageYOffset
        };
    }
    else if( (aDocument = aWindow.document).compatMode == "CSS1Compat" ) {
        return {
            horizontal_position: aDocument.documentElement.scrollLeft,
            vertical_position: aDocument.documentElemnt.scrollTop
        };
    }
    else {
        return {
            horizontal_position: aDocument.body.scrollLeft,
            vertical_position: aDocument.body.scrollTop
        };
    }
    return undefined;
}

function getElementsByClass(aClassName, parent) {
    parent = parent || document;
    if(parent.getElementsByClassName) {
        return parent.getElementsByClassName(aClassName);
    }

    if(parent.querySelectorAll) {
        return parent.querySelectorAll("." + aClassName);
    }

    var children = parent.getElementsByTagName("*");
    var resultElements = new Array();
    for(var i = 0, j = 0; i < children.length; i++) {
        if(children[i].nodeType == 1 && children[i].className == aClassName) {
            resultElements[j++] = children[i];
        }
    }
    return resultElements;
}

function getElementsByName(name, parent) {
    parent = parent || document;
    if(parent.getElementsByName) {
        return parent.getElementsByName(name);
    }

    var elements = parent.getElementsByTagName("*");
    var result = new Array();
    for(var i = 0; i < elements.length; i++) {
        if(elements[i].name == name) {
            result.push(elements[i]);
        }
    }
    return result;
}

function isLeapYear(year) {
    if(year % 4 != 0) {
        return false;
    }
    else if(year % 100 != 0) {
        return true;
    }
    else if(year % 400 == 0) {
        return true;
    }
    else {
        return false;
    }
}

function dateDifference(firstDate, secondDate) {
    var difference = secondDate - firstDate;
    var days = difference / (1000 * 60 * 60 * 24);
    var hours = (days - Math.floor(days)) * 24;
    var minutes = (hours - Math.floor(hours)) * 60;
    var seconds = (minutes - Math.floor(minutes)) * 60;
    days = Math.floor(days);
    hours = Math.floor(hours);
    minutes = Math.floor(minutes);
    seconds = Math.floor(seconds);
    return {
        days: days, hours: hours, minutes: minutes,
        seconds: seconds
    };
}

function leadingZero(number) {
    if(number < 10) {
        number = "0" + number;
    }
    return number;
}

function collectionToArray(collection) {
    var newArray = new Array();
    for(var i = 0; i < collection.length; i++) {
        newArray.push(collection[i]);
    }
    return newArray;
}

function createHttpRequest() {
    if(window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }
    catch(exception) {
        try {
            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
        }
        catch(fatalException) {
            throw new Error(
                "Your browser doesn't seem to support any " +
                "form of background HTTP request dispatch."
            );
        }
    }
}

function urlEncodeObject(keyValuePairs) {
    var urlEncodedString = "";
    for(var key in keyValuePairs) {
        if(keyValuePairs.hasOwnProperty(key) === false) {
            continue;
        }
        if(typeof(keyValuePairs[key]) == "function") {
            continue;
        }
        if(urlEncodedString !== "") {
            urlEncodedString += "&";
        }
        var urlEncodedKey = encodeURIComponent(key);
        var urlEncodedValue = encodeURIComponent(keyValuePairs[key]);
        urlEncodedString += urlEncodedKey + "=" + urlEncodedValue;
    }
    return urlEncodedString;
}

function urlSerializeToObject(urlString) {
    var pairs = urlString.split("&");
    var resultObject = {};
    for(var i in pairs) {
        var pair = pairs[i].split("=");
        var decodedKey = decodeURIComponent(pair[0]);
        var decodedValue = decodeURIComponent(pair[1]);
        resultObject[decodedKey] = decodedValue;
    }
    return resultObject;
}

function submitDataByHttpRequest(serverSideScript, 
        callbackFunction, method, dataObject) {
    var httpRequest = createHttpRequest();
    var urlEncodedData = urlEncodeObject(dataObject);
    if(method == "GET") {
        serverSideScript += "?" + urlEncodedData;
    }
    httpRequest.open(method, serverSideScript);
    httpRequest.setRequestHeader(
        "Content-Type", "application/x-www-form-urlencoded"
    );
    httpRequest.onreadystatechange = function() {
        if(httpRequest.readyState === 4 && 
                httpRequest.status === 200 
                && callbackFunction !== undefined) {
            callbackFunction(httpRequest);
        }
    };
    if(method == "POST") {
        httpRequest.send(urlEncodedData);
    }
    else {
        httpRequest.send(null);
    }
}

function submitDataByPostMethod(serverSideScript, 
    callbackFunction, dataObject) {
        submitDataByHttpRequest(
            serverSideScript,
            callbackFunction, "POST", dataObject
        );
}

function submitDataByGetMethod(serverSideScript, 
        callbackFunction, dataObject) {
    submitDataByHttpRequest(serverSideScript,
        callbackFunction, "GET", dataObject
    );
}

function getSiblingElementsByTagName(tag, parent) {
    parent = parent || document;
    var elements = parent.getElementsByTagName(tag);
    var result = new Array();
    result.push(elements[0]);
    for(var i = 1; i < elements.length; i++) {
        if(elements[0].parentNode == elements[i].parentNode) {
            result.push(elements[i]);
        }
    }
    return result;
}

function parseHash(selector, parent) {
    parent = parent || document;
    var idName = selector.substring(1);
    if(parent != document) {
        var elements = parent.getElementsByTagName("*");
        for(var i = 0; i < elements.length; i++) {
            if(elements[i].id == idName) {
                return elements[i];
            }
        }
    }
    else {
        return document.getElementById(idName);
    }
}

function parseDot(selector, parent) {
    parent = parent || document;
    var xClassName = selector.substring(1);
    return getElementsByClass(xClassName, parent);
}

function parseTagName(selector, parent) {
    parent = parent || document;
    return parent.getElementsByTagName(selector);
}

function filterElementsByParentNode(elements, xNode) {
    var result = new Array();
    for(var i = 0; i<elements.length; i++) {
        if(elements[i].parentNode == xNode) {
            result.push(elements[i]);
        }
    }
    return result;
}

function isLatterElementSibling(whatElement, ofAnElement) {
    var currentElement = ofAnElement;
    while( (currentElement = currentElement.nextElementSibling) != null ) {
        if(currentElement == whatElement) {
            return true;
        }
    }
    return false;
}

function parseClosedAngleBracket(selector, parent) {
    var lastObject;
    var tokens = selector.split(">");
    var result = new Array();
    parent = parent || document;
    for(var i = 0; i < tokens.length; i++) {
        if(i == 0) {
            lastObject = parseExpression(tokens[i]);
        }
        else {
            if(lastObject.length!==undefined) {
                var y = new Array();
                for(var j = 0; j < lastObject.length; j++) {
                    var x = parseExpression(
                        tokens[i], lastObject[j]
                    );
                    y = y.concat(
                        filterElementsByParentNode(x, lastObject[j])
                    );
                }
                if(i == tokens.length - 1) {
                    result = result.concat(y);
                }
                lastObject = y;
            }
            else {
                var x = parseExpression(tokens[i], lastObject);
                if(x.length === undefined) {
                    x = new Array(x);
                }
                lastObject = filterElementsByParentNode(x, lastObject);
                if(i == tokens.length - 1) {
                    result = result.concat(lastObject);
                }
            }
        }
    }
    return result;
}

function parsePlus(selector) {
    var tokens = selector.split("+");
    var result = new Array();
    for(var i = 0; i<tokens.length; i++) {
        if(i == 0) {
            var lastObject = parseExpression(tokens[i]);
        }
        else {
            if(lastObject.length !== undefined) {
                var x = parseExpression(tokens[i]);
                if(x.length !== undefined) {
                    for(var j = 0; j < x.length; j++) {
                        for(var k = 0; k < lastObject.length; k++) {
                            if(x[j].previousElementSibling == lastObject[k]) {
                                result.push(x[j]);
                            }
                        }
                    }
                }
                else {
                    for(var k = 0; k < lastObject.length; k++) {
                        if(x.previousElementSibling == lastObject[k]) {
                            result.push(x);
                        }
                    }
                }
            }
            else {
                var x = parseExpression(tokens[i]);
                if(x.length !== undefined) {
                    for(var j = 0; j < x.length; j++) {
                        if(x[j].previousElementSibling == lastObject) {
                            result.push(x[j]);
                        }
                    }
                }
                else {
                    if(x.previousElementSibling == lastObject) {
                        result.push(x);
                    }
                }
            }
            lastObject = x;
        }
    }
    return result;
}

function parseTilde(selector) {
    var tokens = selector.split("~");
    var result = new Array();
    for(var i = 0; i < tokens.length; i++) {
        if(i == 0) {
            var lastObject = parseExpression(tokens[i]);
        }
        else {
            if(lastObject.length !== undefined) {
                var x = parseExpression(tokens[i]);
                if(x.length !== undefined) {
                    for(var j = 0; j < x.length; j++) {
                        for(var k = 0; k < lastObject.length; k++) {
                            if( isLatterElementSibling(x[j], lastObject[k]) ) {
                                result.push(x[j]);
                            }
                        }
                    }
                }
                else {
                    for(var k = 0; k < lastObject.length; k++) {
                        if( isLatterElementSibling(x, lastObject[k]) ) {
                            result.push(x);
                        }
                    }
                }
            }
            else {
                var x = parseExpression(tokens[i]);
                if(x.length !== undefined) {
                    for(var j = 0; j < x.length; j++) {
                        if( isLatterElementSibling(x[j], lastObject) ) {
                            result.push(x[j]);
                        }
                    }
                }
                else {
                    if( isLatterElementSibling(x, lastObject) ) {
                        result.push(x);
                    }
                }
            }
            lastObject = x;
        }
    }
    return result;
}

function parseExpression(expression, parent) {
    parent = parent || document;
    var expressionType = expression.charAt(0);
    x = expression.indexOf(">");
    if(x != -1) {
        return parseClosedAngleBracket(expression);
    }
    x = expression.indexOf("+");
    if(x != -1) {
        return parsePlus(expression);
    }
    x = expression.indexOf("~");
    if(x != -1) {
        return parseTilde(expression);
    }
    var x = expression.indexOf(" ");
    if(x != -1) {
        return parseSpace(expression);
    }
    switch(expressionType) {
        case '#':
            return parseHash(expression, parent);
        break;
        case '.':
            return parseDot(expression, parent);
        break;
        case '*':
            return parent.getElementsByTagName("*");
        break;
        default:
            return parseTagName(expression, parent);
        break;
    }
}

function parseSpace(selector) {
    var tokens = selector.split(" ");
    var lastObject;
    var result = new Array();
    for(var i = 0; i<tokens.length; i++) {
        if(i == 0) {
            lastObject = parseExpression(tokens[i]);
        }
        else {
            if(lastObject.length!==undefined) {
                for(var j = 0; j<lastObject.length; j++) {
                    var x = parseExpression(tokens[i], lastObject[j]);
                    if(x.length !== undefined) {
                        for(var k = 0; k < x.length; k++) {
                            if(indexOfArrayValue(result, x[k]) == -1 
                                    && i == tokens.length - 1) {
                                result.push(x[k]);
                            }
                        }
                    }
                    else {
                        if(indexOfArrayValue(result, x) == -1 &&
                                i == tokens.length - 1) {
                            result.push(x);
                        }
                    }
                }
            }
            else {
                lastObject = parseExpression(tokens[i], lastObject);
                if(lastObject.length!==undefined) {
                    for(var j = 0; j < lastObject.length; j++) {
                        if(indexOfArrayValue(result, lastObject[j]) == -1 &&
                                i==tokens.length - 1) {
                            result.push(lastObject[j]);
                        }
                    }
                }
                else {
                    if(indexOfArrayValue(result, lastObject) !== - 1 &&
                            i == tokens.length - 1) {
                        result.push(lastObject);
                    }
                }
            }
        }
    }
    return result;
}

function indexOfArrayValue(array, value, start) {
    start = start || 0;
    if(this.indexOf) {
        return array.indexOf(value, start);
    }
    else {
        for(var i = start; i < array.length; i++) {
            if(array[i] == value) {
                return i;
            }
        }
    }
    return -1;
};

function selectByCss(selector) {
    var x = parseExpression(selector);
    if(x instanceof Array) {
        var y = new Array();
        for(var i = 0; i < x.length; i++) {
            var z = new Domo(x[i]);
            y.push(z);
        }
        return y;
    }
    return new Domo(x);
}

function removeErrorOnKeyup(identifierList, removalFunction, prefix) {
    prefix = prefix || "e-";
    removalFunction = removalFunction || function(element) {
        element.style.display = "none";
    };
    for(var i in identifierList) {
        var element = document.getElementById(identifierList[i]);
        element.onkeyup = function() {
            var id = prefix + this.id;
            var errorToHide = document.getElementById(id);
            if(errorToHide != null) {
                removalFunction(errorToHide);
            }
        };
    }
}

function fetchPage(pageNumber, parentElement, headerClass, elementsPerPage, 
        displayStyle, hiddenStyle) {
    elementsPerPage = elementsPerPage || 5;
    displayStyle = displayStyle || "";
    hiddenStyle = hiddenStyle || "none";
    var childrenTags = getElementsByClass(headerClass, parentElement);
    var b = elementsPerPage * (pageNumber - 1);
    var e = pageNumber * elementsPerPage;
    for(var i = 0; i < b; i++) {
        if(childrenTags[i]) {
            childrenTags[i].style.display = hiddenStyle;
        }
    }
    for(i = e; i < childrenTags.length; i++) {
        if(childrenTags[i]) {
            childrenTags[i].style.display = hiddenStyle;
        }
    }
    for(i = b; i < e; i++) {
        if(childrenTags[i]) {
            childrenTags[i].style.display = displayStyle;
        }
    }
}

function clearForm(formObject) {
    var innerInputElements = formObject.getElementsByTagName("input");
    var innerTextAreas = formObject.getElementsByTagName("textarea");
    var innerSelectElements = formObject.getElementsByTagName("option");
    for(var i = 0; i < innerInputElements.length; i++) {
        switch(innerInputElements[i].type) {
            case "text":
                innerInputElements[i].value = "";
            break;
            case "radio":
                innerInputElements[i].removeAttribute("checked");
            break;
            case "checkbox":
                innerInputElements[i].removeAttribute("checked");
            break;
            case "password":
                innerInputElements[i].value = "";
            break;
        }
    }
    for(var i = 0; i < innerTextAreas.length; i++) {
        innerTextAreas[i].value = "";
    }
    for(var i = 0; i < innerSelectElements.length; i++) {
        innerSelectElements[i].removeAttribute("selected");
    }
}

function isTypicalEmailAddress(someString) {
    var pattern = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z]{2,}$/;
    return pattern.test(someString);
}

function removeFormErrors(errorClass, parentElement) {
    parentElement = parentElement || document;
    var errors = getElementsByClass(errorClass, parentElement);
    for(var i = 0; i < errors.length; i++) {
        errors[i].style.display = "none";
    }
}

function showPage(triggerDomElementId, allIds, display, prefix) {
    display = display || "block";
    prefix = prefix || "view-";
    for(var i in allIds) {
        document.getElementById(allIds[i]).style.display = "none";
    }
    document.getElementById(
        prefix + triggerDomElementId
    ).style.display = display;

}

function deepCopyLastChild(parentElement, inputClass, clone) {
    if(clone === undefined) {
        var fields = getElementsByClass(inputClass, parentElement);
        clone = fields[fields.length - 1].cloneNode();
    }
    else {
        clone = clone.cloneNode();
    }
    parentElement.appendChild(clone);
    return clone;
}

function replaceWithAsciiEquivalents(someString) {
    var searches = new Array(
        'Š', 'Đ', 'Č', 'Ć', 'Ž', 'š',
        'đ','č', 'ć', 'ž'
    );
    var replacements = new Array(
        'S', 'D', 'C', 'C', 'Z', 's',
        'd', 'c', 'c', 'z'
    );
    for(var i in searches) {
        var pattern = new RegExp(searches[i], "g");
        someString = someString.replace(pattern, replacements[i]);
    }
    return someString;
}

function countDown(targetDate, targetId, classDays, classHours, 
        classMinutes, classSeconds) {
    this.spansMeta = new Array(classDays || "days", classHours || "hours",
    classMinutes || "minutes", classSeconds || "seconds");
    var callbackSpansMeta = this.spansMeta;
    var callback = function() {
        var difference = dateDifference(new Date(), targetDate);
        var names = new Array("days", "hours", "minutes", "seconds");
        var timerSpans = "";
        var j = 0;
        for(var i in callbackSpansMeta) {
            timerSpans += '<span class="' + callbackSpansMeta[i] + '">' +
            leadingZero(difference[names[j++]]) + '</span> ';
        }
        document.getElementById(targetId).innerHTML = timerSpans;
    };
    setInterval(callback, 1000);
}

rules = {
    Letters: 'abcdefghijklmnoprst',
    CapitalLetters: 'ABCDEFGHIJKLMNOPRST',
    Digits: '0123456789',
    Punctuation: '.:,;()',
    Other: '%&/$',
    minDigits: 3,
    minLetters: 3,
    minPunctuation: 1,
    minOther: 1,
    minCapitalLetters: 3
};

function generateRandomPassword(rules) {
    var keys = new Array('Letters', 'Digits',
        'Punctuation', 'Other', 'CapitalLetters'
    );
    var minTotalLength = rules['minDigits'] +
    rules['minLetters'] + rules['minPunctuation'] +
    rules['minOther'] + rules['minCapitalLetters'];
    var password = new Array();
    for(var rk in keys) {
        var min = "min" + keys[rk];
        var minSth = rules[min];
        for(var i = 0; i < minTotalLength; i++) {
            if(rules[min] > 0) {
                var ri = Math.floor(Math.random() *
                    (minTotalLength - 1));
                var rc = rules[keys[rk]]
                .charAt(Math.floor(Math.random() *
                  (rules[keys[rk]].length - 1)));
                if(ri in password) {
                    var j = minTotalLength - 1;
                    while(j >= 0) {
                        if(!(j in password)) {
                            password[j] = rc
                            break;
                        }
                        j--;
                    }
                }
                else {
                    password[ri] = rc;
                }
            }
            rules[min]--;
        }
        rules[min] = minSth;
    }
    return password.join("");
}
