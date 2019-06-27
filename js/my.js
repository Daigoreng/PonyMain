$(function () {
  var map;
  var arrive; // すべての到着情報
  var LatLng = null;
  var lines = null;
  var marker = null;
  var blog_disp_id = 0;
  var page_size = 5;

  // 失敗処理
  var processFail = function (msg) {
    console.log("Fail:" + msg);
  }

  // 指定したブログの経路を表示する
  var dispRoute2 = function (data) {
    var info = JSON.parse(data);
    var id = this.id;
    if (LatLng != null) {
      lines.setMap(null);
      marker.setMap(null);
    }
    LatLng = [];
    console.log(info);
    for (var t = 0; t < info.length; t++) {
      LatLng[t] = new google.maps.LatLng(info[t].lat, info[t].lng);
    }
    console.log(LatLng);
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
    var infoWindow = new google.maps.InfoWindow({ // 吹き出しの追加
      content: '<div class="sample">ブログが見れるよ</div>' // 吹き出しに表示する内容
    });
    infoWindow.open(map, marker); // 吹き出しの表示
    marker.addListener('click', function () { // マーカーをクリックしたとき
      window.open(arrive[id].url, 'mywindow', 'width=700, height=1000, menubar=no, toolbar=no, scrollbars=yes');
      //window.location.reload();
    });
  }
  var dispRoute = function () {
    var id = $(this).data("id");
    var end_dt = arrive[id].trace_info_time;
    $.ajax({
        url: "search.php",
        type: "post",
        datatype: "json",
        data: {
          end_date: end_dt,
        },
        timeout: 5000,
        id: id,
      })
      .done(dispRoute2)
      .fail(processFail, "dispRoute");
  }

  // 1行分のブログ行を作成
  var makeBlogRow = function (id, tbl) {
    if (id >= arrive.length) return; // データがない場合
    var tr = $("<tr></tr>");
    var dt = arrive[id].trace_info_time;
    var ti = arrive[id].blog_title;
    tr.append("<td rowspan=2><button id='bt_blog" + id + "' data-id=" + id + ">表示</button>");
    tr.append("<td class='blog_date'>" + dt + "</td>");
    tbl.append(tr);
    tr = $("<tr></tr>");
    tr.append("<td class='blog_title'>" + ti + "</td>");
    tbl.append(tr);
    $("#bt_blog" + id).click(dispRoute);
  }
  // ブログテーブルの作成
  // dateから過去へn件分のブログの表を作る
  // date=nullなら最新のn件
  var makeBlogTable = function (n) {
    var tbl = $("#tbl_blog");
    tbl.empty();
    for (var i = 0; i < n; i++)
      makeBlogRow(blog_disp_id + i, tbl);
  }

  // 前のページへ
  var goPrevPage = function () {
    blog_disp_id -= page_size;
    if (blog_disp_id < 0)
      blog_disp_id = 0;
    makeBlogTable(page_size);
  }

  // 次のページへ
  var goNextPage = function () {
    blog_disp_id += page_size;
    if (blog_disp_id >= arrive.length)
      blog_disp_id = arrive.length - page_size;
    if (blog_disp_id < 0)
      blog_disp_id = 0;
    makeBlogTable(page_size);
  }

  // すべての到着情報を読み込む
  var gotArriveInfo = function (data) {
    arrive = JSON.parse(data);
    makeBlogTable(page_size);
  }
  var getArriveInfo = function () {
    $.ajax({
        url: "arrive_data.php",
        type: "post",
        datatype: "json",
        timeout: 5000,
      })
      .done(gotArriveInfo)
      .fail(processFail, "getArriveInfo");
  }

  /***** 読み込み時の処理 *****/

  // マップがなければ読み込む
  if (!map) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(31.58, 130.72),
      zoom: 10
    });
  }

  // Slick関係
  //  $('.articles').slick({
  //    infinite: true,
  //    dots: true,
  //    slidesToShow: 3,
  //    //slidesToScroll: 1,
  //    autoplay: true,
  //    autoplaySpeed: 2000,
  //    variableWidth: true,
  //  });

  // 到着情報を取り出し、
  // 最初のブログテーブルの作成
  getArriveInfo();

  // 前へ・次へボタンの処理
  $("#bt_prev").click(goPrevPage);
  $("#bt_next").click(goNextPage);
})
