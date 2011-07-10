module("Model: frosoco")

asyncTest("findAll", function(){
	stop(2000);
	frosoco.findAll({}, function(frosocos){
		ok(frosocos)
        ok(frosocos.length)
        ok(frosocos[0].name)
        ok(frosocos[0].description)
		start()
	});
	
})

asyncTest("create", function(){
	stop(2000);
	new frosoco({name: "dry cleaning", description: "take to street corner"}).save(function(frosoco){
		ok(frosoco);
        ok(frosoco.id);
        equals(frosoco.name,"dry cleaning")
        frosoco.destroy()
		start();
	})
})
asyncTest("update" , function(){
	stop();
	new frosoco({name: "cook dinner", description: "chicken"}).
            save(function(frosoco){
            	equals(frosoco.description,"chicken");
        		frosoco.update({description: "steak"},function(frosoco){
        			equals(frosoco.description,"steak");
        			frosoco.destroy();
        			start()
        		})
            })

});
asyncTest("destroy", function(){
	stop(2000);
	new frosoco({name: "mow grass", description: "use riding mower"}).
            destroy(function(frosoco){
            	ok( true ,"Destroy called" )
            	start();
            })
})