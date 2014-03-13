// Fruity Crush v0.2
var frutasModel = ["papaya", "pera", "manzana", "mango", "platano", "maracuya", "lichi", "mandarina", "coco"];

var columnas = 7;
var filas = 7;
var fruityCrush;

var grid = [];

var fruta = {
	var crearFrutaConNombreYNodo : function (nombre, nodo) {
										this.nombre = nombre;
										this.nodo = nodo;
									}
	

}

ffruta.crearFrutaConNombreYNodo("platano", $("#pedro").html());

//window.onload = init;
$(function () {
	fruityCrush = document.getElementById('fruityCrush');
	generarPantalla();
});


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

		frutaArticle = document.createElement("article");
		frutaArticle.setAttribute("class", frutaAlAzar);
		fruityCrush.appendChild(frutaArticle);
		frutaArticle.fruta = frutaAlAzar;
		// frutaArticle.gritar = function(){alert("ay!")};

		filaDeFruta.push(frutaArticle);
		debugger;
	};
	return filaDeFruta;
}

function generarPantalla() {
	var pantalla = [];
	for (var i = filas - 1; i >= 0; i--) {
		pantalla.push(generaFilaDeFrutasAlAzar());
	};
	grid = pantalla;
	return pantalla;
}


function checkHorizontalMatches() {
	var matches;
	var fruitType;


	for(var col = 0; col < grid.length; col++){
		matches = 0;        
	    // fruitType = 0;

	    for(i = 0; i < grid[0].length; i++){
	    	// console.log("fruta: "+grid[col][i].fruta);
	    	// console.log(fruitType);

	    	if(grid[col][i].fruta == fruitType){
	    		matches++;
	    	}

	        if(grid[col][i].fruta != fruitType || i == grid[0].length - 1){ //subtract 1 because arrays start at 0
	        	if(matches >= 3){
	        		$(grid[col][i]).addClass("match");

	        		// removeMatches(blah);
	        		console.log("removeMatches(blah)");

	        	}
	        	fruitType = grid[col][i].fruta;
	        	matches = 1;
	        }
	    }
	}
	// console.log(matches, fruitType);
}