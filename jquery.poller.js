(function( $ ){
    var methods = {
        init : function(options) {
			settings = $.extend({
				url: "polling",
				pols:[],
				last_active:new Date().getTime(),
				run_count:1,
				poll_timer:false,
				default_delay:8000, // ms
				default_delay_cap:300, // seconds 
				default_max_delay:15000, // ms
			}, options );

			$('*').bind('mousemove keydown scroll', function () {
				if((new Date().getTime()- settings.last_active)/1000 > settings.default_delay_cap) $.fn.poller('restart');
				settings.last_active=new Date().getTime();
			});

        },
        add : function(_c) { 
			settings.pols.push({'id':_c.id, 'type':_c.type, 'ratio':_c.ratio});
		},
        run : function( ) { 
			var _delay=settings.default_delay;
			var _delay_cap=settings.default_delay_cap;
			var _max_delay=settings.default_max_delay;
			var _d=(new Date().getTime()- settings.last_active)/1000;

			if(_d > (_delay_cap/4)) _delay = (_max_delay/4);
			if(_d > (_delay_cap/3)) _delay = (_max_delay/3);
			if(_d > (_delay_cap/2)) _delay = (_max_delay/2);
			if(_d > _delay_cap) _delay = _max_delay;

			settings.poll_timer=setTimeout(function(){
				var _final_pols=[];
				$.each(settings.pols, function(i,value){
					if(settings.run_count % value.ratio === 0){
						_final_pols.push(value);
					} 
				});

				if(_final_pols.length > 0){
					$.ajax({ 
						url: settings.url,
						type: "POST",
						data: {'polls':JSON.stringify(_final_pols)},
						complete: function(data){
							$.each(data.responseJSON, function(i,value){
								switch (value.type) {
									case "html":
										$(i).html(value.args);
									break;

									case "function":
										window[value.func](i, value.args);
									break;
								}
							});
							settings.run_count=settings.run_count+1;
							$.fn.poller('run');
						},
						dataType: "json"
					});
				} else {
					settings.run_count=settings.run_count+1;
					$.fn.poller('run');
				}
			}, _delay);			
		
		
		},
        restart : function( ) { 
			window.clearTimeout(settings.poll_timer);
			$.fn.poller('run');
		},
    };

    $.fn.poller = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.poller' );
        }    
    };


})( jQuery );


