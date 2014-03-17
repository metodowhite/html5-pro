// Fruity Crush v0.1
var frutasModel = ["papaya", "pera", "manzana", "mango", "platano", "maracuya", "lichi", "mandarina", "coco"];

var columnas = 7;
var filas = 7;
var fruityCrush;

//window.onload = init;
$(init);

function init () {
	fruityCrush = document.getElementById('fruityCrush');
	generarPantalla();
}


function generarFrutaAlAzar() {
	var frutaAlAzar = Math.random() * (frutasModel.length -1);
	var frutaAlAzarRounded = Math.round(frutaAlAzar);
	return(frutasModel[frutaAlAzarRounded]);
}

function generaFilaDeFrutasAlAzar() {
	var filaDeFruta = [];
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

function generarPantalla() {
	var pantalla = [];
	for (var i = filas - 1; i >= 0; i--) {
		pantalla.push(generaFilaDeFrutasAlAzar());
	};
	return pantalla;
}

