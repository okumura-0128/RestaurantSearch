let lat = 0;
let lon = 0;
var data_array = [];
var shop_num = 0;
var map;
var marker_array;
area();
budget();

function initMap() {
    // Geolocation APIに対応している
    marker_array = new google.maps.MVCArray();
    if (navigator.geolocation) {
      // 現在地を取得
      navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
        function(position) {
            // 緯度・経度を変数に格納
            var mapLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            // マップオプションを変数に格納
            var mapOptions = {
            zoom : 15,          // 拡大倍率
            center : mapLatLng  // 緯度・経度
            };
            // マップオブジェクト作成
            map = new google.maps.Map(
            document.getElementById("map"), // マップを表示する要素
            mapOptions         // マップオプション
            );
            //　マップにマーカーを表示する
            var marker = new google.maps.Marker({
                map : map,             // 対象の地図オブジェクト
                position : mapLatLng   // 緯度・経度
            });
              
            marker_array.push(marker);
            var infowindow = new google.maps.InfoWindow({
            content: '現在地'
            });
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

              
        },
        // 取得失敗した場合
        function(error) {
          // エラーメッセージを表示
          switch(error.code) {
            case 1: // PERMISSION_DENIED
              alert("位置情報の利用が許可されていません");
              break;
            case 2: // POSITION_UNAVAILABLE
              alert("現在位置が取得できませんでした");
              break;
            case 3: // TIMEOUT
              alert("タイムアウトになりました");
              break;
            default:
              alert("その他のエラー(エラーコード:"+error.code+")");
              break;
          }
        }
      );
    // Geolocation APIに対応していない
    } else {
      alert("この端末では位置情報が取得できません");
    }
}


//マーカーを削除する
function deleteMakers() {
    if (marker_array != null) {
        let i = 0;
        marker_array.forEach(function (element, index) {
            if (index == 0) {
                return true;
            }
            element.setMap(null);
        })

    }

}


function shopMap(locations) {

    /*
    var markers = locations.map(function(location) {
        return new google.maps.Marker({
            position: location,
            map: map,
    });
    });*/

    deleteMakers();
    locations.forEach(function (element, index) {
        var mapLatLng = new google.maps.LatLng(element['lat'], element['lng']);
        var marker = new google.maps.Marker({
            map : map,             // 対象の地図オブジェクト
            position : mapLatLng   // 緯度・経度
        });
        marker_array.push(marker);

        var box = '<div class="map_item">' +
            `<img src='${element['photo']['pc']['l']}' onclick='detail(${index})'>` +
            `<h3>${element['name']}</h3>` +
            `<h6>${element['genre']['name']}</h6>` +
            `<h5>${element['genre']['catch']}</h5>` +
            `<p>${element['catch']}</p>` +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: box
        });
        marker.addListener('click', function() {
            infowindow.open(map, marker);
        });
        //console.log(marker);

    })
    

}




function getPosition() {
    // 現在地を取得

    navigator.geolocation.getCurrentPosition(
      // 取得成功した場合
      function(position) {
            //alert("緯度:" + position.coords.latitude + ",経度" + position.coords.longitude);
            //console.log(position.coords.latitude);
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;


            let range = document.local.range.value;
            shop_list(lat, lng, range);
            
      },
      // 取得失敗した場合
      function(error) {
        switch(error.code) {
          case 1: //PERMISSION_DENIED
            alert("位置情報の利用が許可されていません");
            break;
          case 2: //POSITION_UNAVAILABLE
            alert("現在位置が取得できませんでした");
            break;
          case 3: //TIMEOUT
            alert("タイムアウトになりました");
            break;
          default:
            alert("その他のエラー(エラーコード:"+error.code+")");
            break;
        }
      }
    );
}


function shop_list(lat, lng, range) {
    console.log(lat);
    console.log(lng);

    $.ajax({
        url: './api.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'lat': lat,
            'lng': lng,
            'range': range,
            'mode':"local"
        }


    })
    // Ajax通信が成功した時
    .done(function (data) {
        
        if (data['results_returned'] != 0) {
            var local_array = [];
            data['shop'].forEach(function (element, index) {
                //var arrVar = { lat: data['shop'][index]['lat'], lng:data['shop'][index]['lng']};
                //var arrVar = element;
                local_array.push(element);
            });
            shopMap(local_array);
        }


        data_display(data);

            
    })
    // Ajax通信が失敗した時
    .fail( function(data) {
        console.log('通信失敗');
        console.log(data);
    })

}




function search() {

    let needs = document.search.need;
    let keyword = document.search.keyword.value;
    let budget = document.search.budget.value;
    let party_capacity = document.search.party_capacity.value;
    let area = document.search.area.value;
    console.log(keyword);
    console.log(party_capacity);
    let flag = 0;
    
    const arr = [];
    for (let i = 0; i < needs.length; i++) {
        if (needs[i].checked) { 
            arr.push(needs[i].value);
            flag = 1;
            //console.log(needs[i].value);
        }
    }
    
    
    $.ajax({
        url: './api.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'area': area,
            'keyword': keyword,
            'budget': budget,
            'party_capacity': party_capacity,
            'needs': arr,
            'flag':flag,
            'mode':"search"
        }


    })
    // Ajax通信が成功した時
    .done(function (data) {
    
        if (data['results_returned'] != 0) {
            var local_array = [];
            data['shop'].forEach(function (element, index) {
                //var arrVar = { lat: data['shop'][index]['lat'], lng:data['shop'][index]['lng']};
                //var arrVar = element;
                local_array.push(element);
            });
            shopMap(local_array);
        }


        data_display(data);
        
            
    })
    // Ajax通信が失敗した時
    .fail( function(data) {
        console.log('通信失敗');
        console.log(data);
    })
}

//サービスエリアマスタAPI
function area() {

    
    $.ajax({
        url: './api.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'mode':"area"
        }


    })
    // Ajax通信が成功した時
    .done( function(data) {
        data_array = data;
        shop_num = data['results_returned'];
        console.log('通信成功');
        console.log(data);

        var area = document.getElementById('area');

        for (let i = 0; i < data['results_returned']; i++){
            
            var option = document.createElement("option");
            option.textContent = data['large_area'][i]['name'];
            option.setAttribute('value',data['large_area'][i]['code']);
            area.appendChild(option);
        }

        
    })
    // Ajax通信が失敗した時
    .fail( function(data) {
        console.log('通信失敗');
        console.log(data);
    })
}


//検索用ディナー予算マスタAPI
function budget() {

    
    $.ajax({
        url: './api.php', //送信先
        type: 'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data: {
            'mode':"budget"
        }


    })
    // Ajax通信が成功した時
    .done( function(data) {
        data_array = data;
        shop_num = data['results_returned'];
        console.log('通信成功');
        console.log(data);

        var budget = document.getElementById('budget');

        for (let i = 0; i < data['results_returned']; i++){
            
            var option = document.createElement("option");
            option.textContent = data['budget'][i]['name'];
            option.setAttribute('value',data['budget'][i]['code']);
            budget.appendChild(option);
        }

        
    })
    // Ajax通信が失敗した時
    .fail( function(data) {
        console.log('通信失敗');
        console.log(data);
    })
}


//レスポンスのデータ表示
function data_display(data){
    data_array = data;
        shop_num = data['results_returned'];
        console.log('通信成功');
        console.log(data);
        console.log("debug:" + data['results_returned']);
        
        var place = document.getElementById('place');
        while (place.querySelector('div')) {
            place.querySelector('div').remove();
        }
        while (place.querySelector('h3')) {
            place.querySelector('h3').remove();
        }

        var result = document.createElement("div");
        var details = document.createElement("div");

        result.classList.add('items');


        if (data['results_returned'] != 0) {
            for (let i = 0; i < data['results_returned']; i++){
                /* 
                if (i % 4 == 0) {
                    if (i != 0) {
                        place.appendChild(div);
                    }
                    var div = document.createElement("div");
                    div.classList.add('selection');
                    
                    let page = Math.floor(i / 4) + 1;
                    console.log('page-' + String(page));
                    div.id = 'page-' + String(page);
                }
                var name = document.createElement("h3");
                name.textContent = data['shop'][i]['name'];
                console.log(data['shop'][i]['name']);
                div.appendChild(name);
                */
                
                //店一覧
                var child_div = document.createElement("div");
                child_div.classList.add('item');
                


                var img = document.createElement("img");
                img.setAttribute('src', data['shop'][i]['photo']['pc']['l']);
                img.setAttribute('alt', i);
                img.setAttribute('onclick', `detail(${i})`); 
                child_div.appendChild(img);



                var name = document.createElement("h3");
                name.textContent = data['shop'][i]['name'];
                child_div.appendChild(name);


                var h6 = document.createElement("h6");
                h6.textContent = data['shop'][i]['genre']['name'];
                child_div.appendChild(h6);

                var h5 = document.createElement("h5");
                h5.textContent = data['shop'][i]['genre']['catch'];
                child_div.appendChild(h5);


                var p = document.createElement("p");
                p.textContent = data['shop'][i]['access'];
                child_div.appendChild(p);

                
                result.appendChild(child_div);


                //詳細画面

                var child_div = document.createElement("div");
                child_div.setAttribute('onclick', `detail_close(${i})`); 
                child_div.classList.add('popup');
                child_div.id = `shop-${i}`;
                var content = document.createElement("div");
                content.classList.add('content');

                var h3 = document.createElement("h3");
                h3.textContent = data['shop'][i]['name'];
                content.appendChild(h3);

                var p = document.createElement("p");
                p.style.textAlign = "center";
                p.textContent = data['shop'][i]['catch'];
                content.appendChild(p);

                var div = document.createElement("div");
                div.style.textAlign = "center";
                var img = document.createElement("img");
                img.setAttribute('src', data['shop'][i]['photo']['pc']['l']);
                div.appendChild(img);
                content.appendChild(div);

                var detail_area = document.createElement("div");
                detail_area.classList.add('detail_area');

                var table = document.createElement("table");
                table.classList.add('detail_table');


                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.classList.add('td1');
                var span = document.createElement("span");
                span.classList.add('td_str');
                span.textContent = "アクセス";
                td.appendChild(span);
                var div = document.createElement("div");
                div.classList.add('td_icon');
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-subway');
                div.appendChild(icon);
                td.appendChild(div);
                tr.appendChild(td);
                var td = document.createElement("td");
                td.textContent = data['shop'][i]['access'];
                tr.appendChild(td);
                table.appendChild(tr);

                


                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.classList.add('td1');
                var span = document.createElement("span");
                span.classList.add('td_str');
                span.textContent = "住所";
                td.appendChild(span);
                var div = document.createElement("div");
                div.classList.add('td_icon');
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-map-marker-alt');
                div.appendChild(icon);
                td.appendChild(div);
                tr.appendChild(td);
                var td = document.createElement("td");
                td.textContent = data['shop'][i]['address'];
                tr.appendChild(td);
                table.appendChild(tr);


                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.classList.add('td1');
                var span = document.createElement("span");
                span.classList.add('td_str');
                span.textContent = "営業時間";
                td.appendChild(span);
                var div = document.createElement("div");
                div.classList.add('td_icon');
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-clock');
                div.appendChild(icon);
                td.appendChild(div);
                tr.appendChild(td);
                var td = document.createElement("td");
                td.textContent = data['shop'][i]['open'];
                tr.appendChild(td);
                table.appendChild(tr);


                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.classList.add('td1');
                var span = document.createElement("span");
                span.classList.add('td_str');
                span.textContent = "料金";
                td.appendChild(span);
                var div = document.createElement("div");
                div.classList.add('td_icon');
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-money-bill-alt');
                div.appendChild(icon);
                td.appendChild(div);
                tr.appendChild(td);
                var td = document.createElement("td");
                td.textContent = data['shop'][i]['budget']['average'];
                tr.appendChild(td);
                table.appendChild(tr);



                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.classList.add('td1');
                var span = document.createElement("span");
                span.classList.add('td_str');
                span.textContent = "予約ページ";
                td.appendChild(span);
                var div = document.createElement("div");
                div.classList.add('td_icon');
                var icon = document.createElement("i");
                icon.classList.add('fas', 'fa-calendar-alt');
                div.appendChild(icon);
                td.appendChild(div);
                tr.appendChild(td);
                var td = document.createElement("td");
                var a = document.createElement("a");
                a.setAttribute('href', data['shop'][i]['urls']['pc']);
                a.setAttribute('target', "_blank");
                a.setAttribute('ref', "noopener noreferrer");
                a.textContent = data['shop'][i]['urls']['pc'];
                td.appendChild(a);
                tr.appendChild(td);
                table.appendChild(tr);


                detail_area.appendChild(table);
                content.appendChild(detail_area);
                

                var close = document.createElement("a");
                close.classList.add('close');
                var icon = document.createElement("i");
                icon.classList.add('fas','fa-times-circle');
                close.appendChild(icon);
                close.setAttribute('href', `javascript: detail_close(${i})`);
                content.appendChild(close);

                child_div.appendChild(content);
                details.appendChild(child_div);

                
            }
            place.appendChild(result);
            place.appendChild(details);
            $('.items').pagination({
                itemElement : '> .item' // アイテムの要素
            });
  
        }
        else {
            var h3 = document.createElement("h3");
            h3.textContent = "検索結果はありません";
            h3.classList.add('none_message');
            place.appendChild(h3);
            console.log('検索結果はありません');
        }
}






const button1 = document.getElementById('button1');

button1.addEventListener('click', (e) => {
    // デフォルトのイベントをキャンセル
    e.preventDefault();

    getPosition();
});
  
const button2 = document.getElementById('button2');

button2.addEventListener('click', (e) => {
    // デフォルトのイベントをキャンセル
    e.preventDefault();

    search();
});




function detail(i) {
    $(`#shop-${i}`).addClass('show').fadeIn();
}
function detail_close(i) {
    $(`#shop-${i}`).addClass('show').fadeOut();


    //コンテンツにクリックは閉じない
    $( '.content' ).on( 'click', function( e ){
        e.stopPropagation();
    } );

}



function tag_change(i){
    tag_array = ["box1","box2"];

    tag_array.forEach(function(element, index){
        if(index == i){
            content = document.getElementById(element);
            content.style.display ="block";

            tag = document.getElementById("tag"+String(index+1));
            tag.classList.add('tag_current');
        }
        else{
            content = document.getElementById(element);
            content.style.display ="none";

            tag = document.getElementById("tag"+String(index+1));
            tag.classList.remove('tag_current');
        }
    });
    
}

function sp_tag_change(i){
    tag_array = ["box3","box4"];

    tag_array.forEach(function(element, index){
        if(index == i){
            content = document.getElementById(element);
            content.style.display ="block";

            tag = document.getElementById("tag"+String(index+3));
            tag.classList.add('tag_current');
        }
        else{
            content = document.getElementById(element);
            content.style.display ="none";

            tag = document.getElementById("tag"+String(index+3));
            tag.classList.remove('tag_current');
        }
    });
    
}




//window.addEventListener('DOMContentLoaded', area);




