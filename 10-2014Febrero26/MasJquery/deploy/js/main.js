// $("ul li:even img").hide();
// $("button").click(function(){
// 	$("ul li:even img, ul li:odd img").slideToggle(1000);
// });



$("img").hover(function() {
	$(this).toggleClass("showMurray");
	 $(this).css({
	 				"border" : Math.random()*10 "solid  red" ,
	 				"border-style" : "solid",
	 				"border-color" : "red",
	 			});
})