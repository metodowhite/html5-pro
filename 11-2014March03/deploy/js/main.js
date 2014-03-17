// $("<h1>TEST</h1>").appendTo("body");
// $("<h1 id='encabezado1'>TEST1</h1>").addClass("encabezado").appendTo("body");
// // $("<h1 id='encabezado1'>TEST1</h1>").addClass("encabezado").prependTo("body");
// $("<h1>TEST2</h1>").addClass("encabezado").attr("id", "encabezado2").appendTo("body");
// $("<h1>TEST3</h1>").addClass("encabezado").insertAfter("#encabezado1");

// for (var i = 0; i < 3; i++) {
// 	$("<button>", { id:"miBoton" +i,
// 				text:"Click Me " + i,
// 				click:decirNumero
// 				}).appendTo("body");
// };

// for (var i = 0; i < 3; i++) {
// 	$("<button>", { id:"miBoton" +i,
// 				text:"Hover Me " + i,
// 				click:decirNumero
// 				}).appendTo("body");
// };


// function decirNumero(num) {
// 	alert("YEI!");
// }


// $("#miBoton1").remove();
// $("button").remove(":contains('Click')");

// $("<p>").appendTo("body");
// // $("p").html("<strong>Spoiler</strong>");
// $("p").text("<strong>Spoiler</strong>");

// alert( $("p").text() );



// $("<button>").click(function(){
// 	$(this, "bla", "ble").toggleClass("alert");
// });


// $("<button>", { 
// 				id:"miBoton",
// 				text:"Click Me "
// 			  }).appendTo("body");


// $("#miBoton").animate({"height":"44px"}, 2000).hover(
// 	function(){
// 		alert("LA");
// 	}, 
// 	function(){
// 		alert("LE");
// 	}
// );

// $("<h1>", {
// 	text:"Marca",
// 	id:"marca"
// }).appendTo("body");

// $("body").css({"height":"10000px"});

// $(window).scroll(function(){
// 	$("#marca").css({"position":"absolute"});

// 	var actualTop = $(document).scrollTop();
// 	$("#marca").stop().animate({"top":actualTop});
// });


// $("<button>", {
// 	text:"Scroll To Top",
// 	id:"top",
// 	click:scrollToTop
// }).css({"position":"fixed",
// 		"bottom":0}).appendTo("body");


// function scrollToTop(e){
// 	// debugger;
// 	$("html", "body").animate({scrollTop:0}, "slow");
// 	// e.preventDefault();
// 	return false;
// }



//TweenMax
for (var i = 0; i < 100; i++) {
	var numRand = Math.round(Math.random()*200);
	$('<img src="http://www.fillmurray.com/'+numRand+'/'+numRand+'">').appendTo("body");
};

// var miObj= $("img");
var imgArr = $("img");

for (var i = imgArr.length - 1; i >= 0; i--) {
	TweenMax.to(imgArr[i], 2.5, {scaleX:1, 
						scaleY:1, 
						rotationX:Math.random()*360,
						rotationY:Math.random()*360,
						rotationZ:Math.random()*360,
						delay:1,
						ease:"Elastic.easeOut",
						repeat:-1,
						yoyo:true});
};


TweenMax.to("body", 15, {scaleX:.5, 
						scaleY:.5, 
						rotationX:Math.random()*360,
						rotationY:Math.random()*360,
						rotationZ:Math.random()*360,
						delay:1,
						ease:"Elastic.easeOut",
						repeat:-1,
						yoyo:true});

