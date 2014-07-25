window.onload = function() {
	log("onload");
	
	var game = new ASTEROIDS.Game( document.getElementById("game") );
	
};

/*
function sendStorage() {
	log("sendStorage");

	localStorage.clear();
	
	var myNum = 12345;
	var myStr = "Hello Storage!";
	var myAry = [ 1, 2, 3, 4, 5 ];

	localStorage["num"] = myNum;
	localStorage["str"] = myStr;
	localStorage["ary"] = myAry;
	
};

function getStorage() {
	log("getStorage");

	log( localStorage.getItem("str") );
	log( localStorage["str"] );
	log( localStorage.str );

};
*/