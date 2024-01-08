<?php
function local_seach($lat,$lng,$range){
    $count = 100;
    $appid = "03ed625098114e76";
    $url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=".$appid."&count=".$count."&lat=".$lat."&lng=".$lng."&range=".$range;
    
    $xml = file_get_contents( $url );
    $obj = simplexml_load_string($xml);
    $array = json_decode(json_encode($obj), true);
    return $array;
    }

function search($area,$keyword,$budget,$party_capacity,$needs){
    $count = 100;
    $appid = "03ed625098114e76";
    $url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=".$appid."&count=".$count."&large_area=".$area."&keyword=".$keyword."&budget=".$budget."&party_capacity=".$party_capacity;
    foreach($needs as $item){
        $url .= "&".$item."=1";
    }

    $xml = file_get_contents( $url );
    $obj = simplexml_load_string($xml);
    $array = json_decode(json_encode($obj), true);
    return $array;
}

function budget(){
    $appid = "03ed625098114e76";
    $url = "http://webservice.recruit.co.jp/hotpepper/budget/v1/?key=".$appid;

    $xml = file_get_contents( $url );
    $obj = simplexml_load_string($xml);
    $array = json_decode(json_encode($obj), true);
    return $array;
}


function area(){
    $appid = "03ed625098114e76";
    $url = "http://webservice.recruit.co.jp/hotpepper/large_area/v1/?key=".$appid;

    $xml = file_get_contents( $url );
    $obj = simplexml_load_string($xml);
    $array = json_decode(json_encode($obj), true);
    return $array;
}


$mode = "";
if(isset($_POST['mode'])){
    if($_POST['mode'] == "local"){
        $lat = $_POST['lat'];
        $lng = $_POST['lng'];
        $range = $_POST['range'];
        $array = local_seach($lat,$lng,$range);
        header('Content-type: application/json');
        echo json_encode($array,JSON_UNESCAPED_UNICODE, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    
    }
    if($_POST['mode'] == "search"){
        $area = $_POST['area'];
        $keyword = $_POST['keyword'];
        $budget = $_POST['budget'];
        $party_capacity = $_POST['party_capacity'];
        if($_POST['flag'] == 1){
            $needs = $_POST['needs'];
        }
        else{
            $needs = [];
        }
        
        $array = search($area,$keyword,$budget,$party_capacity,$needs);

        header('Content-type: application/json');
        echo json_encode($array,JSON_UNESCAPED_UNICODE, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }


    //サービスエリアマスタAPI
    if($_POST['mode'] == "area"){

        $array = area();

        header('Content-type: application/json');
        echo json_encode($array,JSON_UNESCAPED_UNICODE, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }

    //検索用ディナー予算マスタAPI
    if($_POST['mode'] == "budget"){

        $array = budget();

        header('Content-type: application/json');
        echo json_encode($array,JSON_UNESCAPED_UNICODE, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    }
}




    
    

?>

