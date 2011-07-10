steal.plugins('funcunit').then(function(){

module("Frosoco.Controllers.User", { 
	setup: function(){
		S.open("//frosoco/controllers/user/user.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Frosoco.Controllers.User Demo","demo text");
});


});