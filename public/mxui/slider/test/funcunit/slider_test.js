module("slider test", { 
	setup: function(){
		S.open("//mxui/slider/slider.html");
	}
});

test("Copy Test", function(){
	equals(S("h1").text(), "Welcome to JavaScriptMVC 3.0!","welcome text");
});

test("dragging changes value", function() {
  S("#slider").drag("+30 +0", function(){
    equals(S("#value").val(), 6);
  }).drag("-60 +0", function(){
        equals(S("#value").val(), 4);
      });
});

test("dragging out of bounds", function(){
  S("#slider").drag("+400 +0", function(){
    equals(S("#value").val(), 10);
  }).drag("-400 +0", function(){
        equals(S("#value").val(), 1);
      });
});