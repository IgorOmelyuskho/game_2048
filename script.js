var c0 = 'rgb(35, 35, 35)';
var c2 = 'rgb(150, 0, 255)';
var c4 = 'rgb(240, 20, 90)';
var c8 = 'rgb(255, 201, 27)';
var c16 = 'rgb(0, 200, 25)';
var c32 = 'rgb(0, 149, 214)';
var c64 = 'rgb(200, 0, 125)';
var c128 = 'rgb(255, 87, 27)';
var c256 = 'rgb(40, 215, 166)';
var c512 = 'rgb(60, 20, 175)';
var c1024 = 'rgb(240, 0, 35)';
var c2048 = 'rgb(70, 5, 110)';

var backgroundDiv = null;
var backgroundDivSize = 500;
var newSize = 4;
var minSize = 2;
var maxSize = 8;
var size = 4;
var squareSize = 100;
var distanceBetweenSquares = 10;
var allSquare = null;
var allNumber = null;
var direction = 0;
var unlockShift = true;
var score = 0;
var divScoreValue = null;
var divRecordValue = null;
var divDeltaScore = null;
var divMainScore = null;
var centerOfDivMainScore = 0;
var recordScore = [-1, -1, 0, 0, 0, 0, 0, 0, 0];
var divRecordString = null;
var fieldSize = null;
var loadFromServer = true;
var recordCookie = 0;

window.onload = function(){	
	window.onresize = function(e){
		setScaleAndMarginLeft();
	}
	
	document.getElementById("modal-overlay").onclick = function(e){
		document.getElementById("modal-overlay").style.display = "none";	
	}
	
	document.getElementById("modal-form").onclick = function(e){
		e.stopPropagation();	
	}
	
	document.getElementById("modal-close").onclick = function(e){
		document.getElementById("modal-overlay").style.display = "none";
	}
	
 	backgroundDiv = document.getElementById("backgroundDiv");
	
	divScoreValue = document.getElementById("scoreValue");
	
	divDeltaScore = document.getElementById("deltaScore");
	
	divMainScore = document.getElementById("mainScore");
	var x1 = divMainScore.getBoundingClientRect().left;
	var x2 = divMainScore.getBoundingClientRect().right;
	centerOfDivMainScore = (x2 - x1) / 2;
	
	fieldSize = document.getElementById("fieldSize");
	
	divRecordValue = document.getElementById("recordValue");
	
	divRecordString = document.getElementById("recordString");
	
	setCookie('testcookie', 'test', {expires: 1000});
	var testCookie = getCookie('testcookie');
	if (testCookie === undefined || testCookie === '')
	loadFromServer = false;
	deleteCookie('testcookie');
	
	initializationNewGame(); 
}

function createSquare(x, y){
	var div = document.createElement('div');
	div.className = "square";
	div.style.width = squareSize + "px";
	div.style.height = squareSize + "px";
	div.style.margin = distanceBetweenSquares + "px"; 
	div.style.left = x + 'px';
	div.style.top = y + 'px';
	backgroundDiv.appendChild(div);
	return div;
}

function matrixArray(rows,columns){
	var arr = new Array(size);
	for(var i = 0; i < columns; i++){
		arr[i] = new Array(size);
		for(var j = 0; j < rows; j++){
			arr[i][j] = 0;
		}
	}
	return arr;
}

function fillArrayAllSquare(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
			allSquare[x][y] = createSquare(x * (squareSize + distanceBetweenSquares), y * (squareSize + distanceBetweenSquares));
		}
	}
}

function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomColor(){
	var r = getRandomInt(0, 255);
	var g = getRandomInt(0, 255);
	var b = getRandomInt(0, 255);
	var color = 'rgb(' + r + ',' + g + ',' + b + ')';
	return color;
}

function assignColor(number){
	if (number == 0) {return c0} 
	else if (number == 2) {return c2} 
	else if (number == 4) {return c4} 
	else if (number == 8) {return c8} 
	else if (number == 16) {return c16} 
	else if (number == 32) {return c32} 
	else if (number == 64) {return c64} 
	else if (number == 128) {return c128}
	else if (number == 256) {return c256} 
	else if (number == 512) {return c512} 
	else if (number == 1024) {return c1024} 
	else if (number == 2048) {return c2048} 
	else return c2048;
}

function setColorForAllSquare(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
			allSquare[x][y].style.background = assignColor(allNumber[x][y]);
		}
	}
}

function assignNumberForAll(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
			var square = allSquare[x][y];
			square.innerHTML = allNumber[x][y];
		}
	}
}

function setToZeroAllNumber(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
			allNumber[x][y] = 0;
		}
	}
}

function keyDown(e){
	var x = e.keyCode;
	if (x == 38) direction = 1; 
	else if (x == 39) direction = 2; 
	else if (x == 40) direction = 3; 
	else if (x == 37) direction = 4; 
	else direction = 0;		
	shift(direction);
	
	e = e || event;
	e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}	

function keyUp(e){
	var x = e.keyCode;
	var uniteLeftRight = undefined;
	var uniteUpDown = undefined;
	
	if (x == 38 || x == 39 || x == 40 || x == 37){
		uniteLeftRight = canUniteLeftRight();
		uniteUpDown = canUniteUpDown()
		if (uniteUpDown == false && uniteLeftRight == false)
	   	endOfGame();
	} 
	
	unlockShift = true;
	
	e = e || event;
	e.preventDefault ? e.preventDefault() : (e.returnValue = false);
}

function initializationNewGame(){
	score = 0;
	divScoreValue.innerHTML = score;
	size = newSize;
	
	setBackgroundDivSize();
	
	if (loadFromServer === true){
		recordCookie = readRecordFromCookie("record_" + size);
		if (recordCookie === undefined){
			setRecordInCoookie("record_" + size, 0);
			recordCookie = 0;
		}
		divRecordValue.innerHTML = recordCookie;
	}
	else{
		divRecordValue.innerHTML = recordScore[size];	
	}
	
	divRecordString.innerHTML = "Record in field " + size + "x" + size;
	
	removeSquare();
	allSquare = null;
	allSquare = matrixArray(size, size);
	fillArrayAllSquare();
	
	allNumber = null;
	allNumber = matrixArray(size, size);
	setToZeroAllNumber();
	
	randomSquare();
	
	setColorForAllSquare();
	assignNumberForAll();
	
	setScaleAndMarginLeft();
}

function newGame(){
	initializationNewGame();
}

function setBackgroundDivSize(){
	backgroundDivSize = size * squareSize + (+size + 1) * distanceBetweenSquares; //+size!!!
	backgroundDiv.style.width = backgroundDivSize + "px";
	backgroundDiv.style.height = backgroundDivSize + "px";
}

function removeSquare(){
	if (backgroundDiv.hasChildNodes() == false){
		return;
	}
	
	while (backgroundDiv.hasChildNodes() == true){
		backgroundDiv.removeChild(backgroundDiv.firstChild);
	}
}

function randomSquare(){
	var x, y;
	if (isZeroSquare() == false){
		return;
	}
	x = getRandomInt(0, size - 1);
	y = getRandomInt(0, size - 1);
	while (allNumber[x][y] != 0){
		x = getRandomInt(0, size - 1);
		y = getRandomInt(0, size - 1);
	}
	allNumber[x][y] = 2;
	setColorForAllSquare();
	assignNumberForAll();
}

function isZeroSquare(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size; y++){
			if (allNumber[x][y] == 0)
			return true;
		}
	}
	return false;
}

function canUniteUpDown(){
	for (var x = 0; x < size; x++){
		for (var y = 0; y < size - 1; y++){
			if (allNumber[x][y] == allNumber[x][y + 1] || allNumber[x][y] == 0 || allNumber[x][y + 1] == 0) {
				return true;
			}
		}
	}
	return false;
}

function canUniteLeftRight(){
	for (var x = 0; x < size - 1; x++){
		for (var y = 0; y < size; y++){
			if (allNumber[x][y] == allNumber[x + 1][y] || allNumber[x][y] == 0 || allNumber[x + 1][y] == 0) {
				return true;
			}
		}
	}
	return false;
}

function canUniteUpDown0(){
	alert(canUniteUpDown());
}

function canUniteLeftRight0(){
	alert(canUniteLeftRight());
}

function showAllNumber(){
	divAllNumber.innerHTML = '';
	for (var x = 0; x < size; x++){
		divAllNumber.innerHTML += 'nl';
		for (var y = 0; y < size; y++){
			divAllNumber.innerHTML += allNumber[x][y] + ' ';
		}
	}
}

function nextIndexForShiftToMin(current, arr){ //Вспомогательная для shiftToMin
	for (var i = current + 1; i < size; i++){
		if (arr[i] != 0)
		return i;
	}
	return current;
}

function shiftToMin(arr){  //Сдвигает все елементы arr в сторону к min
	var next = 0;
	for (var i = 0; i < size; i++){
		if (arr[i] != 0)
		continue;
		next = nextIndexForShiftToMin(i, arr);
		arr[i] = arr[next];
		arr[next] = 0;
	}
}

function nextIndexForShiftToMax(current, arr){ //Вспомогательная для shiftToMax
	for (var i = current - 1; i >= 0; i--){
		if (arr[i] != 0)
		return i;
	}
	return current;
}

function shiftToMax(arr){ //Сдвигает все елементы arr в сторону к max
	var next = 0;
	for (var i = size - 1; i >= 0; i--){
		if (arr[i] != 0)
		continue;
		next = nextIndexForShiftToMax(i, arr);
		arr[i] = arr[next];
		arr[next] = 0;
	}
}

function joinToMin(arr){ //Соединяет соседние ячейки с одинковыми номерами от 0 к size - 1 
	var deltaScore = 0;
	for (var i = 0; i < size - 1; i++){
		if (arr[i] == 0)
		continue;
		if (arr[i] == arr[i + 1]){
			arr[i] = arr[i] + arr[i + 1]; // arr[i] = arr[i] * 2
			arr[i + 1] = 0;
			deltaScore += arr[i];
		}			
	}
	return deltaScore;
}

function joinToMax(arr){ //Соединяет соседние ячейки  с одинаковыми номерами от size -1 к 0
	var deltaScore = 0;
	for (var i = size - 1; i > 0; i--){
		if (arr[i] == 0)
		continue;
		if (arr[i] == arr[i - 1]){
			arr[i] = arr[i] + arr[i - 1]; // arr[i] = arr[i] * 2
			arr[i - 1] = 0;
			deltaScore += arr[i];
		}			
	}
	return deltaScore;
}

function rowForShiftLeftOrRight(current){ //Возвращает строку с индексом + current (для сдвигов влево и вправо)
	var arr = [];  
	for (var i = 0; i < size; i++){
		arr[i] = allNumber[i][current];
	}
	return arr;
}

function setRowForAllNumber(current, arr){ //Устанавливает значение для строки с индексом current в массиве allNumber
	for (var i = 0; i < size; i++){
		allNumber[i][current] = arr[i];
	}
} 

function columnForShiftUpOrDown(current){  //Возврвщает столбец с индексом current (для сдвигов вверх и вниз)
	var arr = [];
	for (var i = 0; i < size; i++){
		arr[i] = allNumber[current][i];
	}
	return arr;
}

function setColumnForAllNumber(current, arr){//Устанавливает значения для столбца с индексом current в массиве allNumber
	for (var i = 0; i < size; i++){
		allNumber[current][i] = arr[i];
	}
}

function shiftAllLeft(){ //Сдвигает все строки влево
	var arr = [];
	var deltaScore = 0;
	for (var i = 0; i < size; i++){
		arr = rowForShiftLeftOrRight(i);
		shiftToMin(arr);
		deltaScore += joinToMin(arr);
		shiftToMin(arr);
		setRowForAllNumber(i, arr);
	}
	return deltaScore;
}	

function shiftAllRight(){ //Сдвигает все строки вправо
	var arr = [];
	var deltaScore = 0;
	for (var i = 0; i < size; i++){
		arr = rowForShiftLeftOrRight(i);
		shiftToMax(arr);
		deltaScore += joinToMax(arr);
		shiftToMax(arr);
		setRowForAllNumber(i, arr);
	}
	return deltaScore;
}

function shiftAllUp(){ //Сдвигает все столбцы вверх
	var arr = [];
	var deltaScore = 0;
	for (var i = 0; i < size; i++){
		arr = columnForShiftUpOrDown(i);
		shiftToMin(arr);
		deltaScore += joinToMin(arr);
		shiftToMin(arr);
		setColumnForAllNumber(i, arr);
	}
	return deltaScore;
}

function shiftAllDown(){ //Сдвигает все столбцы вниз
	var arr = [];
	var deltaScore = 0;
	for (var i = 0; i < size; i++){
		arr = columnForShiftUpOrDown(i);
		shiftToMax(arr);
		deltaScore += joinToMax(arr);
		shiftToMax(arr);
		setColumnForAllNumber(i, arr);
	}
	return deltaScore;
}

function endOfGame(){
	document.getElementById('modal-overlay').style.display = 'flex';
	if (loadFromServer === true){
		document.getElementById('modal-text').textContent = "Game over, score: " + score + ", record: " + parseInt(readRecordFromCookie("record_" + size), 10);
	}
	else{
		document.getElementById('modal-text').textContent = "Game over, score: " + score + ", record: " + recordScore[size];
	}
}

function shift(direction){
	if (unlockShift === false){
		return;
	}
	var uniteLeftRight = canUniteLeftRight();
	var uniteUpDown = canUniteUpDown();
	var deltaScore = 0;
	if (direction == 1 && uniteUpDown == true) 
	deltaScore = shiftAllUp();
	else if (direction == 2 && uniteLeftRight == true)
	deltaScore = shiftAllRight();
	else if (direction == 3 && uniteUpDown == true)
	deltaScore = shiftAllDown();
	else if (direction == 4 && uniteLeftRight == true)
	deltaScore = shiftAllLeft();
	else return;
	
	randomSquare();
	setColorForAllSquare();
	assignNumberForAll();
	showScore(deltaScore);
	animateDeltaScore(deltaScore);
	
	var recordScoreCookie = undefined; 
	if (loadFromServer === true){
		recordScoreCookie = parseInt(readRecordFromCookie("record_" + size), 10);
		if (score > recordScoreCookie){
			setRecordInCoookie("record_" + size, score);
			divRecordValue.innerHTML = score;
			animateScale(divRecordValue);
		}
	}
	else{
		if (score > recordScore[size]){
			recordScore[size] = score;
			divRecordValue.innerHTML = score;;	
			animateScale(divRecordValue);
		}
	}	
	unlockShift = false;
}	

function showScore(deltaScore){		
	score += deltaScore;
	divScoreValue.innerHTML = score;
	if (deltaScore != 0)
	animateScale(divScoreValue);
}

// Рисует функция draw
// Продолжительность анимации duration
function animate(draw, duration) {
	var start = performance.now();
	
	requestAnimationFrame(function animate(time) {
		// определить, сколько прошло времени с начала анимации
		var timePassed = time - start;
		
		// возможно небольшое превышение времени, в этом случае зафиксировать конец
		if (timePassed > duration) timePassed = duration;
		
		// нарисовать состояние анимации в момент timePassed
		draw(timePassed);
		
		// если время анимации не закончилось - запланировать ещё кадр
		if (timePassed < duration) {
			requestAnimationFrame(animate);				
		}		
	});
}

function animateDeltaScore(deltaScore){
	if (deltaScore == 0){
		return;
	}
	var animationDuration = 1500;	
	
	var start = 60;
	var finish = 0;
	var deltaTop = finish - start;					
	
	var astart = 1;
	var afinish = 0;
	var deltaA = afinish - astart;		
	
	divDeltaScore.innerHTML = "+" + deltaScore;	
	
	var clientRect = divDeltaScore.getBoundingClientRect();
	var selfLeft = clientRect.left;
	var selfRight = clientRect.right;
	var selfCenter = selfRight - selfLeft;
	divDeltaScore.style.marginLeft = centerOfDivMainScore - selfCenter / 2 + "px";
	
	animate(function(timePassed) {
		//if (timePassed > animationDuration) 
		//divDeltaScore.style.color = "rgba(0, 0, 255, 1)";		
		divDeltaScore.style.top = start + (timePassed * deltaTop) / animationDuration + 'px';
		var alpha = astart + (timePassed * deltaA) / animationDuration;
		divDeltaScore.style.color = "rgba(10, 215, 25," + alpha + ")"; 
	}, animationDuration);
}	

function animateScale(obj){	
	var animationDuration = 200;	
	var halfAnimationDuration = animationDuration / 2;	
	var scale = 1;
	
	animate(function(timePassed) {	
		if (timePassed < halfAnimationDuration){
			scale = 1 + 0.005 * timePassed;
		} 
		else if (timePassed > halfAnimationDuration){
			scale = 2 - 0.005 * timePassed;
		}
		if (obj.id == "fieldSize")
		fieldSize.style.transform = "scale(" + scale + ")";
		else if (obj.id == "scoreValue")
		scoreValue.style.transform = "scale(" + scale + ")";
		else if (obj.id == "recordValue")
		recordValue.style.transform = "scale(" + scale + ")";
	}, animationDuration);
}

function changeSize(e){
	if (e.target.id == "plus"){
		newSize++;
	}
	else if (e.target.id == "minus"){
		newSize--;
	}
	
	if (newSize <= minSize){
		newSize = minSize;
	}
	else if (newSize >= maxSize){
		newSize = maxSize;
	}
	
	fieldSize.innerHTML = newSize + "x" + newSize;
	animateScale(fieldSize);
}

function setCookie(name, value, options) {
	options = options || {};
	
	var expires = options.expires;
	
	if (typeof expires == "number" && expires) {
		var d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}
	
	value = encodeURIComponent(value);
	
	var updatedCookie = name + "=" + value;
	
	for (var propName in options) {
		updatedCookie += "; " + propName;
		var propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}
	
	document.cookie = updatedCookie;
}

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
	var matches = document.cookie.match(new RegExp(
	"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}	

function deleteCookie(name) {
	setCookie(name, "", {
		expires: -1
	})
}

function readRecordFromCookie(size){ //size = [2...8]
	if (size < minSize || size > maxSize){
		return undefined;
	}
	return getCookie(size.toString());
}

function setRecordInCoookie(size, value){ //size = [2...8]
	if (size < minSize || size > maxSize){
		return;
	}
	setCookie(size.toString(), value, {expires: 10000000});
}

function setScaleAndMarginLeft(){
	var wrapperWidth = window.getComputedStyle(document.getElementById('wrapper')).width;
	var wrapperHeight = window.getComputedStyle(document.getElementById('wrapper')).height;
	
	var innerElement = document.getElementById('mainDiv');
	var innerElementHeight = window.getComputedStyle(innerElement).height;
	var innerElementWidth = window.getComputedStyle(innerElement).width;
	
	if (innerElementHeight <= wrapperHeight){
		//scale = 1;
		//innerElement.style.transform = 'scale(' + scale + ')';
		//return;
	}
	
	var scale = 0.95 * parseInt(wrapperHeight) / parseInt(innerElementHeight);
	
	
	innerElement.style.transform = 'scale(' + scale + ')';
}

