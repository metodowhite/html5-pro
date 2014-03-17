// window.onclick = saludar;

var miBoton = document.getElementById("miBoton");
//los eventos en js siempre se escriben con la palabra "on" delante y en minusculas

function saludar(){
	alert("hi");
}
// de esta manera sólo se le puede asignar un evento por elemento

function despedir(){
	alert("hi");
}

miBoton.addEventListener("click", saludar, false);
miBoton.addEventListener("click", despedir, false);
// esta manera de ejecutar eventos permite eliminar el bubbling, y además me perminte añadir tantos eventos como yo quiera a un mismo nodo.
//el contra de esto es que no es soportado en IE8 e inferiores

miBoton.addEventListener("click", function(e){
	console.log(e)
}, false);

window.onresize = function (e){
	// alert(resize);
	console.log(e);
}

miTextArea = document.getElementById("miTextArea");
miTextArea.addEventListener("keypress", function(e){
	//TODO: hacer algo
	console.log(e.keyCode);
	console.log(String.fromCharCode(e.keyCode));
	//esta clase me devuelve qué tecla ha sido apretada
}, false);


// Custom Event

// var myEvent = new customEvent (type, EventDict);

var myEvent = new customEvent ("articleSelected", {
	bubbles: true, 
	cancelable: true
});
//los eventos se escriben con participio

miBoton.onclick = function(e){
	document.dispatchEvent(myEvent);
}

myArticle.addEventListener("articleSelected", function(){
	// TODO: consulta Socket
}, false);


























