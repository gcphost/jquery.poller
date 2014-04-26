/*
 *  Project: jquery.poller
 *  Description: Ajax polling for background tasks with responsive delay
 *  Author: William Bowman
 *  License: MIT
 *  Website: https://github.com/gcphost/jquery.poller
 */


;(function ( $, window, document, undefined ) {

	var settings='';
	var pluginName = 'poller',
        defaults = {
			url: "pollytfing",
			pols:[],
			last_active:new Date().getTime(),
			run_count:0,
			poll_timer:false,
			default_delay:8000, // ms
			default_delay_cap:300, // seconds 
			default_max_delay:16000 // ms
        };

    function Plugin(options ) {
        this.options = $.extend( {}, defaults, options) ;
		settings=this.options;
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype.init = function () {
		$('*').bind('mousemove keydown scroll', function () {		
			if((new Date().getTime()- settings.last_active)/1000 > settings.default_delay_cap) Plugin.prototype.restart();
			settings.last_active=new Date().getTime();
		});
	};

    Plugin.prototype.add = function (_c) {
		settings.pols.push({'id':_c.id, 'type':_c.type, 'ratio':_c.ratio});
    };

    Plugin.prototype.run = function () {
		var _delay=settings.default_delay;
		var _default_delay=settings.default_delay;
		var _delay_cap=settings.default_delay_cap;
		var _max_delay=settings.default_max_delay;
		var _d=(new Date().getTime()- settings.last_active)/1000;

		if(_d > (_delay_cap/4)) _delay = (_default_delay+(_default_delay/4));
		if(_d > (_delay_cap/3)) _delay = (_default_delay+(_default_delay/3));
		if(_d > (_delay_cap/2)) _delay = (_default_delay+(_default_delay/2));
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
						if(data.responseJSON){
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
						}
						settings.run_count=settings.run_count+1;
						Plugin.prototype.run();
					},
					dataType: "json"
				});
			} else {
				settings.run_count=settings.run_count+1;
				Plugin.prototype.run();
			}
		}, _delay);	
	};

    Plugin.prototype.restart = function () {
		window.clearTimeout(settings.poll_timer);
		this.run();
	};

    $.fn.poller = function ( options ) {
        var args = arguments;
        if (options === undefined || typeof options === 'object') {
			if (!$.data(this, 'plugin_' + pluginName)) {
				$.data(this, 'plugin_' + pluginName, new Plugin( options ));
			}
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            var returns;
			var instance = $.data(this, 'plugin_' + pluginName);
			if (instance instanceof Plugin && typeof instance[options] === 'function') {
				returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
			}
			if (options === 'destroy') {
			  $.data(this, 'plugin_' + pluginName, null);
			}
            return returns !== undefined ? returns : this;
        }
    };

}(jQuery, window, document));
