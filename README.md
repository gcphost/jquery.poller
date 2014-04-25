jquery.poller
=============

Add multiple ajax calls to one server call using this ajax poller.

Features
-------------
- Activity monitoring, delays increase as users inactivty increases, max delay limit (default 7mins). When user is active again the timer is reset and poller ran
- Cycle running, you can run the poll every 1,2,3,x loads, so if a base load is 30 seconds, 1 = run every 30 seconds, 2 = run every 60 seconds.


Usage
-------------

- element to update (shorthand)
- backend method is to refrence what to output in the backend
- cycle is how often to run it, 1,2,3,x



		$.fn.poller('add',{'id':'element', 'type':'method', 'ratio': 'ratio'});



**Controller**
The backend controller is for Laravel 4.

Simply loop the polls and trigger on their type, put results as seen

**html result**

	$_results[$_poll->id]=array('type'=>'html', 'args'=>'my html');

**function result**

	$_results[$_poll->id]=array('type'=>'function', 'func'=>'mycallback', 'args'=>array('test1','test2'));



