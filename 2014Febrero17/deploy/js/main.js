var frutasModel = ["papaya", "pera", "manzana", "mango", "platano", "maracuya", "lichi", "mandarina", "coco"];

var filas = 7; 
var columnas = 7; 
var fruityCrush;

window.onload = init;
//los metodos de js empienzan con "on" y no se escriben en camel case
// aquí el metodo va sin parentesis para que no se ejecute directamente, sino que espere al llegar terminar el evento

function init(){
	// TODO: rellenar DOM
	// FIXMI

	fruityCrush = document.getElementById('fruityCrush');
	generarPantalla();
	console.log("iniciado");

}


function generarFrutaAlAzar () {
	var frutaAlAzar = Math.random() * (frutasModel.length-1);
	var frutaAlAzarRounded = Math.round(frutaAlAzar);
	return(frutasModel[frutaAlAzarRounded]);

	//  los random tienen el problema que tienden mucho hacia el 4. hay tres tipos de random: 
	// - para generar los token, udid
	// - hash, que son parecidos a los token
	// - los que permiten que se le pueda meter seeds (perling noise); 
}

function generarFilasDeFrutasAlAzar(){
	var filaDeFruta = []; // === var filaDeFruta = new Array();
	var frutaArticle;
	var frutaAlAzar;

	for (var i = columnas - 1; i >= 0; i--) {
		frutaAlAzar = generarFrutaAlAzar(); 
		filaDeFruta.push(frutaAlAzar);
		
		frutaArticle = document.createElement("article");
		frutaArticle.setAttribute("class", frutaAlAzar);
		fruityCrush.appendChild(frutaArticle);

	};
	return filaDeFruta;
}


function generarPantalla(){
	var pantalla = [];

	for (var i = filas - 1; i >= 0; i--) {
		pantalla.push(generarFilasDeFrutasAlAzar());
	};
}


/*
métodos de los arrays:

	push: agrega alfinal
	pop: borra el del final;
	reverse: el da la vuelta
	shift: borra el primero
	sort: permite hacer tipos de ordenamiento
*/


