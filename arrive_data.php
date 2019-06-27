<?php
  // ブログ情報が入っている到着情報をすべて持ってくる
  require "../common/common.php";
  require "../common/sql_server.php";
  require "../common1/pony_arrive_class.php";
    
  $arrive = new pony_arrive();
  $ret=pony_arrive_select("where url != '' && blog_title != ''","order by id desc");
  echo json_encode($ret,JSON_UNESCAPED_UNICODE);
?>

