/**
 * @tag models, home
 * Wraps backend fsc_1112 services.  Enables 
 * [fsc_1112.static.findAll retrieving],
 * [fsc_1112.static.update updating],
 * [fsc_1112.static.destroy destroying], and
 * [fsc_1112.static.create creating] fsc_1112s.
 */
$.Model.extend('fsc_1112',
/* @Static */
{
	/**
 	 * Retrieves fsc_1112s data from your backend services.
 	 * @param {Object} params params that might refine your results.
 	 * @param {Function} success a callback function that returns wrapped fsc_1112 objects.
 	 * @param {Function} error a callback function for an error in the ajax request.
 	 */
	findAll: function( params, success, error ){
		$.ajax({
			url: '/fsc_1112',
			type: 'get',
			dataType: 'json',
			data: params,
			success: this.callback(['wrapMany',success]),
			error: error,
			fixture: "//fsc_1112/fixtures/fsc_1112s.json.get" //calculates the fixture path from the url and type.
		});
	},
	/**
	 * Updates a fsc_1112's data.
	 * @param {String} id A unique id representing your fsc_1112.
	 * @param {Object} attrs Data to update your fsc_1112 with.
	 * @param {Function} success a callback function that indicates a successful update.
 	 * @param {Function} error a callback that should be called with an object of errors.
     */
	update: function( id, attrs, success, error ){
		$.ajax({
			url: '/fsc_1112s/'+id,
			type: 'put',
			dataType: 'json',
			data: attrs,
			success: success,
			error: error,
			fixture: "-restUpdate" //uses $.fixture.restUpdate for response.
		});
	},
	/**
 	 * Destroys a fsc_1112's data.
 	 * @param {String} id A unique id representing your fsc_1112.
	 * @param {Function} success a callback function that indicates a successful destroy.
 	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	destroy: function( id, success, error ){
		$.ajax({
			url: '/fsc_1112s/'+id,
			type: 'delete',
			dataType: 'json',
			success: success,
			error: error,
			fixture: "-restDestroy" // uses $.fixture.restDestroy for response.
		});
	},
	/**
	 * Creates a fsc_1112.
	 * @param {Object} attrs A fsc_1112's attributes.
	 * @param {Function} success a callback function that indicates a successful create.  The data that comes back must have an ID property.
	 * @param {Function} error a callback that should be called with an object of errors.
	 */
	create: function( attrs, success, error ){
		$.ajax({
			url: '/fsc_1112s',
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