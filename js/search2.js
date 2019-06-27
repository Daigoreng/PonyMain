$(function () {
  var map;
  var marker;
  var img;
  var degree2;
  var degree3 = 0;
  var trace_time = 0;
  var time = new Date();
  var info;
  var read_data_done = false;
  var LatLng = [];
  var infoWindow;

  if (!map) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(31.58, 130.72),
      zoom: 10
    });
  }


  // 指定した追跡データを取得する
  var getTraceData = function () {
    var start_date = $("#list" + i + "-bt-start").data('start_date');
    var end_date = $("#list" + i + "-bt-start").data('end_date');
    var url = $("#list" + i + "-bt-start").data('url');
    $('#last_update').text(time);
    $.ajax({
      url: 'search.php',
      type: 'post',
      datatype: 'json',
      data: {
        start_date: start_date,
        end_date: end_date,
      },
      timeout: 5000
    }).done(function (data) {
      console.log(data);
      info = JSON.parse(data);
      console.log(info);
      trace_time = 0;
      for (trace_time = 0; trace_time < info.length; trace_time++) {
        LatLng[trace_time] = new google.maps.LatLng(info[trace_time].lat, info[trace_time].lng);
      }
      lines = new google.maps.Polyline({
        path: LatLng,
        strokeColor: "#FF0000",
        strokeOpacity: .7,
        strokeWeight: 7
      });
      lines.setMap(map);

      marker = new google.maps.Marker({ //最初のマーカーを置く
        map: map,
        position: new google.maps.LatLng(info[info.length - 1].lat, info[info.length - 1].lng),
        animation: google.maps.Animation.BOUNCE,
        icon: {
          url: 'https://sakura.mbc.co.jp/pony_trace/ver1/img/ponycar-0.png',
          scaledSize: new google.maps.Size(60, 60),
        }
      });
      infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
        content: '<div class="sample">ブログが見れるよ</div>' // 吹き出しに表示する内容
      });
      infoWindow.open(map, marker); // 吹き出しの表示
      marker.addListener('click', function () { // マーカーをクリックしたとき
        window.open(url, 'mywindow', 'width=700, height=1000, menubar=no, toolbar=no, scrollbars=yes');
        window.location.reload();
      });
    }).fail(function () {
      alert("失敗");
    });


  }

  var mapRenew = function () {
    if (LatLng != 0) {
      lines.setMap(null);
      marker.setMap(null);
      //      map = new google.maps.Map(document.getElementById("map_canvas"), {
      //        center: new google.maps.LatLng(31.58, 130.72),
      //        zoom: 10
      //      });
    }
  }


  // ページの更新タイミングの設定
  $('#list0-bt-start').click(function () {
    mapRenew();
    getTraceData(i = 0);
    console.log("Timer started");
  });
  $('#list1-bt-start').click(function () {
    mapRenew();
    getTraceData(i = 1);
    console.log("Timer started");
  });
  $('#list2-bt-start').click(function () {
    mapRenew();
    getTraceData(i = 2);
    console.log("Timer started");
  });
  $('#list3-bt-start').click(function () {
    mapRenew();
    getTraceData(i = 3);
    console.log("Timer started");
  });
  $('#list4-bt-start').click(function () {
    mapRenew();
    getTraceData(i = 4);
    console.log("Timer started");
  });





});
