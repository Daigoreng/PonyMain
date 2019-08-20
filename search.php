<?php
  // 到着日時を指定して、その到着場所へのトレース情報を得る
  // 到着時刻より前にstat=2の情報があれば、その時刻が開始時刻
  // ない場合はその日のトレース情報をすべて取得する
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/trace_info_class.php";
    
  $end_date=$_POST['end_date'];
  $start_date=date("Y-m-d 00:00:00",strtotime($end_date));

  $info=trace_info_select("where time_stamp>='".$start_date."' and time_stamp<='".$end_date."' and stat=2","order by time_stamp desc limit 1");
  if(count($info)>0){
    $start_date=$info[0]->time_stamp;
  }
  $info=trace_info_select("where time_stamp>='".$start_date."' and time_stamp<='".$end_date."'","order by time_stamp asc");
  echo json_encode($info,JSON_UNESCAPED_UNICODE);
?>
