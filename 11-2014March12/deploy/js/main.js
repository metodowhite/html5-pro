var $logo = $("header figure"),
	$titulo = $("header h1"),
	$shows = $("li");

TweenLite.from($logo, 0.5, {scale:0.5, rotation:-20});
TweenLite.from($titulo, 0.5, {opacity:0});

CSSPlugin.defaultTransformPerspective = 600;
TweenMax.staggerFrom($shows,  0.4, {opacity:0, 
									rotationX:-90, 
									transformOrigin:"center top", 
									delay:1}, 0.4);
