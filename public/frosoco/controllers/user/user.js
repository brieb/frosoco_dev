steal.plugins('jquery/controller').then(function($){

/**
 * @class Frosoco.Controllers.User
 */
$.Controller('Frosoco.Controllers.User',
/* @Static */
{
	defaults : {
	
	}
},
/* @Prototype */
{
	init : function(){
		this.element.html("Hello World!");
	}
})

});