	public function postPolling(){
			$polls = json_decode(Input::get('polls'));
			$_results=array();
			if(is_array($polls) && count($polls) > 0){
				foreach($polls as $i => $_poll){
					switch($_poll->type){
						case "check_logs":
							$_results[$_poll->id]=array('type'=>'function', 'func'=>'mycallback', 'args'=>array('test1','test2'));
						break;
						case "users_online":
							$_results[$_poll->id]=array('type'=>'html', 'args'=>'my html');
						break;
					}

				}
			}
		return Response::json($_results);
	}
