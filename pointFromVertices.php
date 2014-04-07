<?php

$numVer = 5;
$vertx = array(-79.2024066690499, -79.2023691181244, -79.2019292358454, -79.2019614223536, -79.2019775156081);
$verty = array(-3.99114188169433,-3.99161815690077,-3.99159139987399,-3.99111512465203, -3.99111512465203);
$testx = -79.20231483333333;
$testy = -3.9913196666666666;

$isOn = pointOnVertice($numVer, $verty, $vertx, $testy, $testx);

if ($isOn) {
    echo "Esta Dentro";
} else {
    echo "Esta Fuera";
}

function pointOnVertice($numVer, $verty, $vertx, $testy, $testx) {
    $c = false;
    for ($i=0, $j = $numVer-1; $i < $numVer; $j = $i++) { 
        if ((($vertx[$i] > $testx) != ($vertx[$j] > $testx)) 
            && ($testy < ($verty[$j] - $verty[$i])
            * ($testx - $vertx[$i])
            / ($vertx[$j] - $vertx[$i]) + $verty[$i])) {
            $c = !$c;
        }
    }
    return $c;
}
?>