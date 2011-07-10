/**
 * @tag models, home
 * Wraps backend frosoco services.  Enables 
 * [frosoco.static.findAll retrieving],
 * [frosoco.static.update updating],
 * [frosoco.static.destroy destroying], and
 * [frosoco.static.create creating] frosocos.
 */
$.Model.extend('frosoco',
/* @Static */
{
	/**
 	 * Retrieves frosocos data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped frosoco objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/frosoco',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//frosoco/fixtures/frosocos.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a frosoco's data.
	 * @param {String} id A unique id representing your frosoco.
	 * @param {Object} attrs Data to update your frosoco with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/frosocos/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a frosoco's data.
 	 * @param {String} id A unique id representing your frosoco.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/frosocos/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a frosoco.
	 * @param {Object} attrs A frosoco's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/frosocos',
			type: 'post',
			dataType: 'json',
			success: success,
			error: error,
			data: attrs,
			fixture: "-restCreate" //uses $.fixture.restCreate for response.
		});
	}
},
/* @Prototype */
{});