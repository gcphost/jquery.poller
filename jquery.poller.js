var _pols=[];
var _last_active=new Date().getTime();
var _run_count=1;
var _poll_timer;
var _default_delay=3000;
var _default_delay_cap=300;
var _default_max_delay=15000;

$('*').bind('mousemove keydown scroll', function () {
	if((new Date().getTime()- _last_active)/1000 > _default_delay_cap) fnResetPollTimer();
	_last_active=new Date().getTime();
});

function fnResetPollTimer(){
	window.clearTimeout(_poll_timer);
	fnRunPoll();
}

function fnRunPoll(){
	var _delay=_default_delay;
	var _delay_cap=_default_delay_cap;
	var _max_delay=_default_max_delay;
	var _d=(new Date().getTime()- _last_active)/1000;

	if(_d > (_delay_cap/4)) _delay = (_max_delay/4);
	if(_d > (_delay_cap/3)) _delay = (_max_delay/3);
	if(_d > (_delay_cap/2)) _delay = (_max_delay/2);
	if(_d > _delay_cap) _delay = _max_delay;

	_poll_timer=setTimeout(function(){
		var _final_pols=[];

		$.each(_pols, function(i,value){
			if(_run_count % value.ratio === 0){
				_final_pols.push(value);
			} 
		});

		if(_final_pols.length > 0){
			$.ajax({ 
				url: "admin/polling",
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
					_run_count=_run_count+1;
					fnRunPoll();
				},
				dataType: "json"
			});
		} else {
			_run_count=_run_count+1;
			fnRunPoll();
		}
	}, _delay);
}

function fnAddPoll(id, type, ratio, callback){
	pol={'id':id, 'type':type, 'ratio':ratio};
	_pols.push(pol);
}
