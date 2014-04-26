jquery.poller
=============

Add multiple ajax calls to one server call using this ajax poller.

Features
-------------
- Responsive activity monitoring
	delays increase as users inactivty increases
	when user is active again the timer is reset and poller ran
- Cycle running, you can run the poll every 1,2,3,x loads, so if a base load is 30 seconds, 1 = run every 30 seconds, 2 = run every 60 seconds. (default base is 8 seconds)


Usage
-------------

- element to update (#div, .class)
- method is what will be called in your php
- cycle is how often to run it, 1,2,3,x



		$.fn.poller('add',{'id':'element', 'type':'method', 'ratio': 'ratio'});


Defaults
-------------
        defaults = {
			url: - the url to your php script
			pols:[] - array of pols, like 'add'
			default_delay: time to wait between calls (ms)
			default_delay_cap: time when user is set to inactive (seconds)
			default_max_delay: longest delay between calls you can get (ms)
        };



Controller
-------------
**This backend controller example is for Laravel 4.**

	public function postPolling(){
			$polls = json_decode(Input::get('polls'));
			$_results=array();
			if(is_array($polls) && count($polls) > 0){
				foreach($polls as $i => $_poll){
					switch($_poll->type){
						case "check_logs":
							$_results[$_poll->id]=array('type'=>'function', 'func'=>'fnUpdateGrowler', 'args'=>array('Notifaction triggered'));
						break;
						case "users_online":
							$_results[$_poll->id]=array('type'=>'html', 'args'=>View::make('admin/helpers/users-online')->render());
						break;
					}

				}
			}
		return Response::json($_results);
	}


Controller Options
-------------
- html: results are passed back in the 'args' field and updated to the element defined in fnAddPoll
- function: results are passed back to the function, func, with whatever results you want, example parses an array				

**html result**

	$_results[$_poll->id]=array('type'=>'html', 'args'=>'my html');

**function result**

	$_results[$_poll->id]=array('type'=>'function', 'func'=>'mycallback', 'args'=>array('test1','test2'));


Callbacks
-------------
Based on 'type' returned by your controller you will either be updating a div with the contents or running the results to a javascript function.

- Type html:
	The element defined on the 'add' method will be updated with your controller 'args'
- Type Function:
	The function defined in your controllers 'func' will be called with an array of your info in 'args'. Trigger it like below

		function fnUpdateGrowler(id, args){
			$.each(args, function(i,value){
				$.bootstrapGrowl(value, { type: 'success' });
			});
		}


