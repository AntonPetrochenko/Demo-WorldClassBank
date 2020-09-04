<?php
    header("Content-Type: application/json");
    $request = json_decode(file_get_contents("php://input"),true);
    
    // --------------------------------
    //Настало время самой настоящей валидации
    //У нас есть валидация на стороне клиента, поэтому мы можем позволить себе подробные сообщения об ошибках
    //Эти сообщения должны быть видны исключительно разработчику

    //Самая сложная часть - проверяем количество и качество даты
    
    if (isset($request["date"]) and is_array($request["date"])) {
        $reqDate = $request["date"];
        //А был ли мальчик?
        if (!(isset($reqDate["month"]) and isset($reqDate["day"]) !== null and isset($reqDate["year"]))) {
            reject("Дата передана некорректно");
        }
        //32 августа?
        if (!checkdate($reqDate["month"],$reqDate["day"],$reqDate["year"])) {
            reject("Недопустимая дата");
        }
    } else {
        reject("Дата не передана, или передана некорректно");
    }

    //Проверяем сумму вклада. Должно *быть* *число* от 1000 до 3000000
    if (!validNumeric($request["sumInitial"],1000,3000000)) {
        reject("Недопустимое значение суммы вклада");
    }

    //Срок вклада
    if(!validNumeric($request["term"],1,5)) {
        reject("Недопустимое значение срока вклада");
    }

    //Пополнение вклада. Должно быть обозначено в любом случае. Если значение истинно, также нужно проверить значение суммы вклада.
    //Если значене ложно, значение суммы вклада не требуется и не передаётся клиентом
    if(!(isset($request["replinish"]) and is_bool($request["replinish"]))) {
        reject("Данные о пополнении вклада не указаны или переданы неверно");
    }
    
    if($request["replinish"]) {
        if (!validNumeric($request["sumReplinish"],1000,3000000)) {
            reject("Недопустимое значение суммы пополнения");
        }
    }

    // --------------------------------
    // Входные данные проверены, переходим к вычислениям
    
    // Переложим поля реквеста в переменные формулы
    
    $summ_nm1 = $request["sumInitial"]; //На этом-то моменте и был мой вопрос. Надеемся, что правильно
    $summ_add = $request["replinish"] ? $request["sumReplinish"] : 0;
    $days_n = cal_days_in_month(CAL_GREGORIAN,$request["date"]["month"],$request["date"]["year"]);
    $days_y = date('L',strtotime("{$request["date"]["year"]}-01-01")) ? 366 : 365;
    $percent = 0.1;
    //Срок вклада не используется?

    // Посчитаем
    

    // Формула чистым текстом в документе msword - веселье для всей семьи. Считаем, что формула такова: summ_n = summ_nm1 + (summ_nm1 + summ_add) * days_n * (0.1 / days_y)

    $summ_n = round($summ_nm1 + ($summ_nm1 + $summ_add) * $days_n * ($percent / $days_y));


    $response = json_encode([
        "success" => true,
        "humanResponse" => "Результат: $summ_n руб"
    ]);
    
    echo $response;
    // --------------------------------
    // Вспомогательные функции

    function reject($reason) {
        die(json_encode([
            "success" => false,
            "humanResponse" => $reason
        ]));
    }

    function validNumeric($value,$min,$max) {
        return (isset($value) and is_numeric($value) and $value >= $min and $value <= $max);
    }
?>