// window.onload = miFuncion;

window.onresize = function(e){
	// alert("RESIZ");
	console.log(e);
}


miBoton = document.getElementById('miBoton');
miBoton.onclick = saludar;
 function saludar () {
 	alert("HI!");
 }


// miBoton.onclick = despedir;
 function despedir () {
 	alert("DEU!");
 }

// miBoton.addEventListener("click", saludar, false);
// miBoton.addEventListener("click", despedir, false);

document.addEventListener("click", function(e){
	console.log(e);
}, false);


miTextArea = document.getElementById('miTextArea');
miTextArea.addEventListener("keypress", function(e){
	console.log(e.keyCode);
	console.log(String.fromCharCode(e.keyCode));
}, false);

// Custom event
// var myEvent = new customEvent(type, eventDict);


var myEvent = new customEvent("articleSelected", {
	bubbles:true,
	cancelable:true
});


miBoton.onclick = function(e){
	document.dispatchEvent(myEvent);
}


myArticle.addEventListener("articleSelected", function(){
	//TODO: consulta socket;
}, false);


ready	









