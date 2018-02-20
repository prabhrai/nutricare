// ------------------------------------------------------------- 

var foodJSON = {};
var exerJSON = {};
var logJSON = {};

function loadPage(element) {

    switch (element) {
        case "Home":
            checkLogin();
            getFood();
            getExercises();
            buildFLogTable();
            buildELogTable();

            setTimeout(() => {
                buildProgressChartt();

            }, 1000);

            break;

        case "weight_log":
            console.log(element + " ------------- ");
            checkLogin();
            buildTable();
            // buildChart();
            break;

        // case "weight_log":
        // buildTable();
        // break;
    }

}

function checkLogin() {
    if (sessionStorage["username"] == "" || !sessionStorage["username"]) {
        $("html").hide();
        // $("#login_status").text("Login Successful");
        alert("You are not logged in. You will be referred to login page.")
        document.location = "../";
    }
}

function buildProgressChartt() {
    // var table = document.getElementById("elogrow");
    // table.innerHTML = "";
    var user = sessionStorage["username"];
    var exerciseData = {};
    var foodData = {};

    var dateSet = new Set();

    // var arrDT = [];

    // var arrEDT = []; 
    // var arrECal = []; 

    // var arrFDT = [];    
    // var arrFCal = [];
    // var arrBMI = [];

    // mySet.add(1);
    // console.log(' logtable');

    // console.log('wlogtable' + logJSON);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../php/get_exercises_grouped.php", data: {
            'user': user
        }
        ,
        success: function (response, textStatus, jqXHR) {
            // var str1 = jQuery.trim(response);
            // console.log("get_exercises_grouped");
            $.each(response, function (i, item) {
                // console.log(item.date);
                dateSet.add(item.date);
                exerciseData[item.date] = item.cal;

            });
        }
    }
    );
    // console.log( "mySet" );

    // console.log(mySet);

    // console.log(arrset);

    // Get keys.

    // console.log(Object.keys(arrset));
    // console.log(arrset.keys);

    // console.log(Object.toString());
    // console.log(arrset.keys);
    // console.log(arrset.values);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../php/get_food_grouped.php", data: {
            'user': user
        }
        ,
        success: function (response, textStatus, jqXHR) {
            // var str1 = jQuery.trim(response);
            // console.log("get_food_grouped");

            $.each(response, function (i, item) {
                // console.log(item.date);

                dateSet.add(item.date);
                foodData[item.date] = item.cal;

                // arrFDT.push(item.date);

                // // console.log(item.cal);
                // arrFCal.push(item.cal);
            });

            // console.log("dateSet");
            // // console.log(dateSet);

            // console.log("exerciseData");
            // // console.log(exerciseData);

            // console.log("foodData");
            // console.log(foodData);
            // let arrayDATES = Array.from(mySet);
            // console.log("xxxxxxxxxxxxxxxxxxxxxxxa");

            // console.log(mySet);
            // console.log("xxxxxxxxxxxxxxxxxxxxxxxb");

            // var result = Object.keys(arrset);
            // console.log(result);

            // // ... Write the keys in a loop.
            // for (var i = 0; i < result.length; i++) {
            //     // document.write(result[i] + "; xx ");
            //     console.log(result[i] + "; xx ");
            // }

            setTimeout(() => {
                buildProgressChart(dateSet, exerciseData, foodData);

            }, 500);

        }
    }
    );

    // console.log(arrDT.toString());
    // arrDT = arrDT.sort();
    // var arrDT = squash(arrDT);
    // console.log(arrDT);

    // var arrDTT1 = squash(["A","B","V",'D']);
    // arrDTT1 = arrDTT1.sort();
    // console.log(arrDTT1);

    // var arrDTT2 = squash([1,3,1,2,3,2]);
    // arrDTT2 = arrDTT2.sort();
    // console.log(arrDTT2);

}

function squash(arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp.indexOf(arr[i]) == -1) {
            tmp.push(arr[i]);
        }
    }
    // console.log(tmp.toString())
    return tmp;
}

function buildProgressChart(dateSet, exerciseData, foodData) {
    var dateArr = [];
    // console.log("dateSet");
    // console.log(dateSet);

    dateSet.forEach(element => {
        dateArr.push(element);
    });
    dateArr.sort();

    var exerciseArr = [];
    var foodArr = [];

    dateArr.forEach(element => {
        // console.log(element);

        if (exerciseData[element] == null || exerciseData[element] == "") {
            exerciseArr.push(0);
        }
        else {
            exerciseArr.push(exerciseData[element]);
        }

        if (foodData[element] == null || foodData[element] == "") {

            // if(!foodData[element]) {
            foodArr.push(0);
        }
        else {
            foodArr.push(foodData[element]);
        }

    });

    // console.log(exerciseArr);
    // console.log(foodArr);

    // var result = Object.keys(dateSet);
    // console.log(result);

    // // ... Write the keys in a loop.
    // for (var i = 0; i < result.length; i++) {
    //     // document.write(result[i] + "; xx ");
    //     console.log(result[i] + "; xx ");
    // }

    let chart = document.getElementById('elog_chart').getContext('2d');
    let wlogChart = new Chart(chart, {

        type: 'line',
        data: {
            labels: dateArr,
            datasets: [{
                label: 'Exercise Burn Calories',
                data: exerciseArr,
            }
                ,
            {
                label: 'Food Intake Calories',
                data: foodArr,
                borderColor: "#FF0000"
            }
            ]

        },
        options: {}
    });
}

function buildChart(date, weight, bmi) {
    let chart = document.getElementById('wlog_chart').getContext('2d');
    let wlogChart = new Chart(chart, {

        type: 'line',
        data: {
            labels: date,
            datasets: [{
                label: 'Weight',
                data: weight,
                borderWidth: 2
            },
            {
                label: 'BMI',
                data: bmi,
                hidden: true
            }
            ]

        },
        options: {}
    });
}

function buildELogTable() {
    var table = document.getElementById("elogrow");
    table.innerHTML = "";
    var user = sessionStorage["username"];

    var arrDT = [];
    var arrCal = [];
    // var arrBMI = [];

    // console.log('wlogtable');
    // console.log('wlogtable' + logJSON);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../php/get_exercise_log.php", data: {
            'username': user
        }
        ,
        success: function (response, textStatus, jqXHR) {

            // var str1 = jQuery.trim(response);

            $.each(response, function (i, item) {

                // arrDT.push(item.date);
                // arrCal.push(item.calorie_burn);
                // arrBMI.push(item.bmi);

                var tr = table.insertRow();

                var fItem = tr.insertCell();
                fItem.innerHTML = item.exercise_name;

                var date = tr.insertCell();
                date.innerHTML = item.date;

                var quantity = tr.insertCell();
                quantity.innerHTML = item.calorie_burn;

            });

            // buildChart2(arrDT, arrCal);

        }
    }
    );
}

function buildFLogTable() {
    var table = document.getElementById("flogrow");
    table.innerHTML = "";
    var user = sessionStorage["username"];

    // var arrDT = [];
    // var arrWT = [];
    // var arrBMI = [];

    // console.log('wlogtable');
    // console.log('wlogtable' + logJSON);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../php/get_food_log.php", data: {
            'username': user
        }
        ,
        success: function (response, textStatus, jqXHR) {
            // console.log(("Login successful"); 
            // console.log((textStatus); 
            // var str1 = jQuery.trim(data);
            // console.log("------------------- USER LOG ARRAY INFO ------------ ");
            // console.log(str1);

            // console.log(str1 === "success");
            // processLog(str1); //
            // console.log("---------- each row pop---------------");
            // console.log(response);
            var str1 = jQuery.trim(response);
            // console.log(response);
            // logJSON = response;
            // buildTable(response);
            // var bmiTemp;
            // var wtTemp;
            // var count = 0;

            $.each(response, function (i, item) {

                // arrDT.push(item.date); 
                // arrWT.push(item.weight);
                // arrBMI.push(item.bmi);

                // console.log("---------- each row build ---------------");
                // console.log(item.date);
                // console.log(item.weight);
                // console.log(item);
                var tr = table.insertRow();

                var fItem = tr.insertCell();
                fItem.innerHTML = item.food_item;

                var date = tr.insertCell();
                date.innerHTML = item.date;

                // var Calories = tr.insertCell();
                // Calories.innerHTML = item.calories;

                var quantity = tr.insertCell();
                quantity.innerHTML = item.quantity;

                var total_calories = tr.insertCell();
                total_calories.innerHTML = item.total_calories;

            });

            // buildChart(arrDT, arrWT, arrBMI);

        }
    }
    );
}

function buildTable() {
    var table = document.getElementById("wlogrow");
    var user = sessionStorage["username"];

    var arrDT = [];
    var arrWT = [];
    var arrBMI = [];

    // console.log('wlogtable');
    // console.log('wlogtable' + logJSON);
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "../php/get_users_log.php", data: {
            'username': user
        }
        ,
        success: function (response, textStatus, jqXHR) {
            // console.log(("Login successful"); 
            // console.log((textStatus); 
            // var str1 = jQuery.trim(data);
            // console.log("------------------- USER LOG ARRAY INFO ------------ ");
            // console.log(str1);

            // console.log(str1 === "success");
            // processLog(str1); //
            // console.log("---------- each row pop---------------");
            // console.log(response);
            var str1 = jQuery.trim(response);
            // console.log(response);
            logJSON = response;
            // buildTable(response);
            var bmiTemp;
            var wtTemp;
            var count = 0;

            $.each(response, function (i, item) {

                arrDT.push(item.date);
                arrWT.push(item.weight);
                arrBMI.push(item.bmi);

                // console.log("---------- each row build ---------------");
                // console.log(item.date);
                // console.log(item.weight);
                // console.log(item.bmi);
                var tr = table.insertRow();

                var dat = tr.insertCell();
                dat.innerHTML = item.date;

                var weightt = tr.insertCell();
                weightt.innerHTML = item.weight;

                var wtDiff = tr.insertCell();

                var bmii = tr.insertCell();
                bmii.innerHTML = item.bmi;

                var bmiDiff = tr.insertCell();

                if (count > 0) {
                    var bmidif = item.bmi - bmiTemp;
                    bmidif = bmidif.toFixed(2);
                    if (bmidif > 0) {
                        bmiDiff.innerHTML = "<span style='color:red;font-weight:600;'>+" + bmidif + "</span>";
                    }
                    else {
                        bmiDiff.innerHTML = "<span style='color:green;'>" + bmidif + "</span>";

                    }

                    var wtdif = item.weight - wtTemp;
                    wtdif = wtdif.toFixed(2);
                    if (wtdif > 0) {
                        wtDiff.innerHTML = "<span style='color:red;font-weight:600;'>+" + wtdif + "</span>";
                    }
                    else {
                        wtDiff.innerHTML = "<span style='color:green;'>" + wtdif + "</span>";

                    }

                }

                bmiTemp = item.bmi;
                wtTemp = item.weight;
                count++;
            });

            buildChart(arrDT, arrWT, arrBMI);

        }
    }
    );

    // setTimeout(function () {
    //     logJSON.forEach(function (element) {
    //         console.log("---------- each row build ---------------");
    //         console.log(element.date);
    //         console.log(element.weight);
    //         console.log(element.bmi);
    //         var tr = table.insertRow();
    //         var dat = tr.insertCell();
    //         dat.innerHTML= element.date;
    //         var weightt = tr.insertCell();
    //         weightt.innerHTML= element.weight;
    //         var bmii = tr.insertCell();
    //         bmii.innerHTML= element.bmi;
    //     })

    //     console.log('wlogtable a');
    // }, 01 );

}

function setExerciseImage() {
    // alert("A");
    // console.log("\n-----------------------setExerciseImage-----------");
    // var p = document.getElementById("select_exercises");
    // var q = $('#select_exercises').val(); 
    var selectedItem = $('#select_exercises :selected').text();

    // console.log(selectedItem);
    var img = document.getElementById("exercise_image");
    var selex = document.getElementById("selectedexr");
    var selexcal = document.getElementById("selectedexrcal");
    $("#img_holder").hide();

    $("#exercisetext,#exercise_image").show();

    var srcc = '/images/' + selectedItem + ".jpg";
    img.src = srcc.toLowerCase();

    // console.log(img.src);

    exerJSON.forEach(function (element) {

        if (element["Exercise"] == selectedItem) {
            selex.innerHTML = element["Exercise"];
            selexcal.innerHTML = element["Real_Calorie_Burned_ph"];

        }

    });

}

function getFood() {
    // var user = sessionStorage["username"];

    var p = document.getElementById("food_item_list");
    p.innerHTML = "";
    var s = "<option value='' disabled selected>Select a food item</option>";


    $.getJSON('../php/get_Calories.php', function (data) {
        // console.log(data); //

        foodJSON = data;
        $.each(data, function (i, item) {
            s += "<option>" + item.Food + " </option>";
        });
        // console.log(p);

        p.innerHTML = s;


    });


}

// $(document).ready(function () {
function setCalories() {
    var quant = $("#Quantity").val();

    calcSetCalories(quant);

}

function calcSetCalories(quant) {
    // var foodData = obj;
    var p = $("#food_item_list").val();
    var c = $("#Calories");

    foodJSON.forEach(function (element) {
        // console.log(element);
        if (element["Food"] == p) {

            var cal = parseFloat(element.Calories);
            cal *= quant;
            cal = cal.toFixed(2);
            // element.Real_Calorie_Burned_ph.tofixed(2);
            $("#Calories").val(cal);
        }
    })

}

function getExercises() {

    $.getJSON('../php/get_exercises.php', function (data) {
        // console.log(data);
        // var p = document.getElementById("food_item_list");
        // p.innerHTML = "";
        // var s = "<option value='' disabled selected>Select a food item</option>";
        exerJSON = data;
        // localStorage['exerJSON'] = exerJSON;
        // $.each(data, function (i, item) {
        // s += "<option>" + item.Food + " </option>";
        // localStorage['exerJSON_Exercise'+i] = item.Exercise;
        // localStorage['exerJSON_Category'+i] = item.Category;
        // localStorage['exerJSON_Category_2'+i] = item.Category_2;
        // localStorage['exerJSON_Real_Calorie_Burned_ph'+i] = item.Real_Calorie_Burned_ph;

        // });
        // p.innerHTML = s;
        // console.log(p);

    });
    // console.log("getTEST called");
    // var p = $("#food_item_list").val();
    // var c = $("#Calories");

    // $.getJSON('../php/get_Calories.php', function (data) {
    //     foodJSON = data;
    // });
    // console.log("p ----------");

    // console.log(p);
    //

    // setTimeout(function () {
    //     foodJSON.forEach(function (element) {
    //         // console.log(element);
    //         if (element["Food"] == p) {
    //             console.log("A");
    //             console.log("_________________________________________________");
    //             console.log(element.Exercise + "- - - - - - - - - - - ");
    //             console.log(element.Category + "- - - - - - - - - - - ");
    //             console.log(element.Real_Calorie_Burned_ph + "- - - - - - - - - - - ");
    //             var cal = parseFloat(element.Calories);
    //             cal = cal.toFixed(2);
    //             // element.Real_Calorie_Burned_ph.tofixed(2);
    //             $("#Calories").val(cal);
    //         }
    //     });
    // }, 2500);

}

// });

$(function () {
    $('.add').on('click', function () {
        var $qty = $("#Quantity");
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal)) {
            $qty.val(currentVal + 1);
        }
        calcSetCalories(currentVal + 1);
    });
    $('.minus').on('click', function () {
        var $qty = $("#Quantity");
        var currentVal = parseInt($qty.val());
        if (!isNaN(currentVal) && currentVal > 1) {
            $qty.val(currentVal - 1);
            calcSetCalories(currentVal - 1);
        }

    });
});

$(document).ready(function () {
    $("#showexercises").on('click', function () {

        var exercise_item = $("#select_exercise_group").val();

        // var exercise_item = $('#select_exercise_group :selected').text();
        // console.log(" =-=-=- select_exercise_group");
        if (exercise_item == "" || !exercise_item) {
            alert("Cannot process exercises.\nPlease select an exercise preferefence and try again. ");
            return;
        }

        $("#loadImg").show();
        $("#loadMsg").show();

        var qty = $("#Quantity").val();
        var foodItem = $("#food_item_list").val();
        var cal = $("#Calories").val();
        var peg = $("#select_exercise_group").val();

        // console.log("onclick show calculate happens");

        // console.log(foodItem);
        // console.log(cal);
        // console.log(peg);

        if (exerJSON == null) {
            // console.log("exerJSON is null");

            $.getJSON('../php/get_exercises.php', function (data) {
                exerJSON = data;
            })
        }
        count = 1;

        var p = document.getElementById("select_exercises");
        p.innerHTML = "";
        var s = "<option value='' disabled selected>Select an exercise item</option>";
        p.innerHTML = s;

        exerJSON.forEach(function (element) {

            // console.log( count);
            // console.log(element["Category"]);
            // console.log(peg);
            // // console.log(element["Real_Calorie_Burned_ph"]);

            // count++;
            // // console.log("1 : ");
            // // console.log(element["Real_Calorie_Burned_ph"] >= cal);
            // // console.log("2 : " );
            // console.log(element["Category"] == peg );

            // if (element["Real_Calorie_Burned_ph"] > cal && element["Category"] == peg) {

            if (element["Category_2"] == peg || element["Category"] == peg) {
                var e_cal = element["Real_Calorie_Burned_ph"];
                // e_cal = e_cal.toFixed(2);
                var e_cat = element["Category"];
                var e_exr = element["Exercise"];

                // console.log(element);
                // // alert("asasasasasazzzzzzzzzzzzzzzzz");
                // console.log(element["Category"]);
                // console.log(element["Real_Calorie_Burned_ph"]);

                // var cal = parseFloat(element.Calories);
                // cal *= quant;
                // cal = cal.toFixed(2);
                // // element.Real_Calorie_Burned_ph.tofixed(2);
                // $("#Calories").val(cal);

                s = "<option value=" + e_exr + ">" + e_exr + "</option>";
                // + ";" + e_cat +";" + e_cal
                p.innerHTML += s;

                // console.log(s);
                var e_cal = "";
                var e_cat = "";
                var e_exr = "";
            }

        });

        setTimeout(() => {
            $("#loadImg").hide();
            $("#loadMsg").hide();
        }, 1200);

    });

    $("#submit_reg").on('click', function () {
        // var uname = document.getElementById("username_field").innerHTML;
        // var upwd = document.getElementById("password_field").innerHTML;
        // alert("HI");
        var Username = $("#Username").val();
        var fname = $("#First_Name").val();
        var lname = $("#Last_Name").val();
        var height = $("#Height").val();
        var weight = $("#initial_weight").val();
        var goal = $("#Goal").val();
        var goal_weight = $("#Goal_Amount").val();
        var address = $("#Address").val();
        var pwd = $("#password").val();
        var ini_bmi = calculateBMI(height, weight);

        // console.log("ini_bmi is : " + ini_bmi);
        // alert("ini_bmi is : " + ini_bmi);
        // console.log((uname);
        // console.log((upwd);

        // console.log(("calling login");

        if(!ValidateEmail(Username)){
            // alert("Invalid Email");
            return;
        }
        if(isNaN(height) || isNaN(weight) || isNaN(goal_weight)  ){
            return;
            
        }


        $.post("../php/register_user.php", {
            'Username': Username,
            'fname': fname,
            'lname': lname,
            'height': height,
            'weight': weight,
            'goal': goal,
            'goal_weight': goal_weight,
            'address': address,
            'pwd': pwd,
            'ini_bmi': ini_bmi
        }
            ,
            function (data, textStatus, jqXHR) {
                // console.log(("Login successful");
                // console.log((textStatus); 
                var str1 = jQuery.trim(data);
                console.log(data);
                console.log(str1);

                processRegister(str1);
            }

            // , "dataType"
        ); // post ends

    });

    $("#logout").on('click', function () {
        sessionStorage["username"] = "";
        document.location = "../index.html";

    });

    // alert("hi");// removed
    $("#btn_register").on('click', function () {

        document.location = "register/index.html";

    });

    $("#showexercises_1").on('click', function () {
        // add
        // alert("HI");
        $.getJSON('../php/get_exercises.php', function (data) {
            // console.log(data);
            var p = document.getElementById("phpelement");
            p.innerHTML = "";
            var s = "<select id='Goal'>";
            $.each(data, function (i, item) {
                // alert(item.PageName);
                // p.innerHTML += "<div><div class='button is-success pad10 border'>" + item.Exercise + " " + i + " " + " </div></div>";
                //

                s += "<option>" + item.Exercise + " </option>";

                // c

            });
            s += "</select>";
            p.innerHTML = s;
            // p.innerText = "JHI"; a
            console.log(p);
        });
    });

    $("#btn_showusers").on('click', function () {

        $.getJSON('php/get_users.php', function (data) {
            // console.log(data);
            var p = document.getElementById("phpelement");
            p.innerHTML = "";

            $.each(data, function (i, item) {
                // alert(item.PageName);
                p.innerHTML += "<div><div class='button is-success pad10 border'>" + item.username + " " + i + " " + " </div></div>";

            });

            // p.innerText = "JHI"; a
            // console.log(p);
        });
    });

    $("#btn_login").on('click', function () {
        // var uname = document.getElementById("username_field").innerHTML;
        // var upwd = document.getElementById("password_field").innerHTML;
        var uname = $("#username_field").val();
        var upwd = $("#password_field").val();

        // console.log((uname);
        // console.log((upwd);

        // console.log(("calling login");

        $.post("php/validate_user.php", {
            'username': uname,
            'password': upwd
        }
            ,
            function (data, textStatus, jqXHR) {
                // console.log(("Login successful");
                // console.log((textStatus); 
                var str1 = jQuery.trim(data);
                console.log(str1 === "success");
                processLogin(str1);
            }

            // , "dataType"
        );

    });

    $("#btn_add_log").on('click', function () {
        // var uname = document.getElementById("username_field").innerHTML;
        // var upwd = document.getElementById("password_field").innerHTML;
        var table = document.getElementById("wlogrow");

        var Current_Weight = $("#Current_Weight").val();
        var user = sessionStorage["username"];
        var date = new Date();
        // var Current_BMI = 21.00;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var full_date = year + "-" + month + "-" + day;
        // console.log((uname); 
        // console.log((upwd);

        // console.log(("calling login");
        console.log(" Current_Weight : " + Current_Weight);


        var trimmed = $.trim( Current_Weight );
        
        if (isNaN(Current_Weight) || Current_Weight < 0 || !Current_Weight  || trimmed == "") {
            alert("Invalid Input. Please try again.");
            return;
        }
        else {

            table.innerHTML = "";


            $.post("../php/add_user_log.php", {
                'Current_Weight': Current_Weight,
                'user': user,
                'full_date': full_date
            }
                ,
                function (data, textStatus, jqXHR) {
                    // console.log(("Login successful");
                    // console.log((textStatus); 
                    var str1 = jQuery.trim(data);
                    // console.log(str1 === "success");
                    logJSON = data;
                    buildTable();
                    $("#Current_Weight").val("");;
                }

                // , "dataType"
            );

        } // else
    });
    // show custom food item to user food list
    $("#show_add_exercise").on('click', function () {

        $("#field_customExerciceName").show();
        $("#field_customExerciceCal").show();

        // $("#loadImg").hide();

    });

    // cancel custom food item to user food list
    $("#cancelAddCustomExercice").on('click', function () {

        $("#field_customExerciceName").hide();
        $("#field_customExerciceCal").hide();

        // $("#loadImg").hide();

    });



    // show custom food item to user food list
    $("#show_add_food").on('click', function () {

        $("#field_customFoodName").show();
        $("#field_customFoodCal").show();

        // $("#loadImg").hide();

    });

    // cancel custom food item to user food list
    $("#cancelAddCustomFood").on('click', function () {

        $("#field_customFoodName").hide();
        $("#field_customFoodCal").hide();

        // $("#loadImg").hide();

    });

    // add custom exercise item to user food list
    $("#addCustomExercice").on('click', function () {

        var user = sessionStorage["username"];
        var exercise_item_name = $("#customExerciceName").val();
        var exercise_item_cal = $("#customExerciceal").val();

        // var total_calories = $("#Calories").val();
        // $("#loadImg").hide();

        if (exercise_item_name === "" || !exercise_item_name || exercise_item_cal< 0 || exercise_item_cal === "" || !exercise_item_cal || isNaN(exercise_item_cal)) {
            alert("Invalid input. Please try again.");
            return;
        }
        else {

            $.post("../php/add_custom_exercise.php", {
                'user': user,
                'exercise_item_name': exercise_item_name,
                'exercise_item_cal': exercise_item_cal
            }
                ,
                function (data, textStatus, jqXHR) {

                    var str1 = jQuery.trim(data);
                    // console.log(str1 === "success");
                    if (str1 === "success") {

                        // getExercise();
                        getExercises()
                    }
                    else if (str1 === "failure") {
                        alert("Custom exercise addition failed.");

                    }
                }
                // , "dataType" 
            );
        }

        $("#customExerciceal").val("");
        $("#cancelAddCustomExercice").val("");

        $("#field_customExerciceName").hide();
        $("#field_customExerciceCal").hide();

    }); 


    // add custom food item to user food list
    $("#addCustomFood").on('click', function () {

        var user = sessionStorage["username"];
        var food_item_name = $("#customFoodName").val();
        var food_item_cal = $("#customFoodCal").val();

        // var total_calories = $("#Calories").val();
        // $("#loadImg").hide();

        if (food_item_name === "" || !food_item_name || food_item_cal < 0 || food_item_cal === "" || !food_item_cal || isNaN(food_item_cal)) {
            alert("Invalid input. Please try again.");
            return;
        }
        else {

            $.post("../php/add_custom_food.php", {
                'user': user,
                'food_item_name': food_item_name,
                'food_item_cal': food_item_cal
            }
                ,
                function (data, textStatus, jqXHR) {

                    var str1 = jQuery.trim(data);
                    // console.log(str1 === "success");
                    if (str1 === "success") {

                        getFood();
                    }
                    else if (str1 === "failure") {
                        alert("Custom food addition failed.");

                    }
                } 
                // , "dataType" 
            ); 
        }

        $("#customFoodName").val("");
        $("#customFoodCal").val("");

        $("#field_customFoodName").hide();
        $("#field_customFoodCal").hide();

    });

    // add food item to log
    $("#addFoodLog").on('click', function () {

        var user = sessionStorage["username"];

        var food_item = $("#food_item_list").val();
        var quantity = $("#Quantity").val();
        var total_calories = $("#Calories").val();

        var date = new Date();
        // var Current_BMI = 21.00;
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var full_date = year + "-" + month + "-" + day;
        // console.log((uname); 
        // console.log((upwd);

        // console.log(("calling login");
        if (food_item == "" || !food_item) {
            alert("Cannot add food to log entry. Invalid input. ");
        }
        else {

            $.post("../php/add_food_log.php", {
                'user': user,
                'food_item': food_item,
                'full_date': full_date,
                'quantity': quantity,
                'total_calories': total_calories
            }
                ,
                function (data, textStatus, jqXHR) {
                    // console.log(("Login successful");
                    // console.log((textStatus); 
                    var str1 = jQuery.trim(data);
                    // console.log(str1 === "success");
                    // logJSON = data;
                    // buildTable();
                    buildFLogTable();
                    buildProgressChartt();
                }

                // , "dataType"
            );
        }

    });

    // add exercise to log
    $("#add_exer_log").on('click', function () {

        var exercise_item = $("#select_exercises").val();

        // var exercise_item = $('#select_exercise_group :selected').text();
        // console.log(" =-=-=- select_exercise_group");
        if (exercise_item == "" || !exercise_item) {
            alert("Cannot add exercise to log. Invalid input.");
            return;
        }

        var user = sessionStorage["username"];
        var select_exercises = $('#select_exercises :selected').text();
        var total_calories = $('#selectedexrcal').text();

        // var  tc = document.getElementById("selectedexrcal");
        // var total_calories = tc.value();
        // console.log( select_exercises + " cal cal cal cal cal " + total_calories);
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        var full_date = year + "-" + month + "-" + day;
        // console.log((uname); 
        // console.log((upwd);

        // console.log(("calling login");
        if (select_exercises == "" || !select_exercises) {
            alert("Cannot add exercise to log entry. Invalid input. ");
        }
        else {
            $.post("../php/add_exercise_log.php", {
                'user': user,
                'select_exercises': select_exercises,
                'full_date': full_date,
                'total_calories': total_calories,
            }
                ,
                function (data, textStatus, jqXHR) {
                    // console.log(("Login successful");
                    // console.log((textStatus); 
                    var str1 = jQuery.trim(data);
                    // console.log(str1 === "success");
                    // logJSON = data;
                    // buildTable();
                    buildELogTable();
                    buildProgressChartt();
                }

                // , "dataType"
            );
        }

    });
});

// function jquery start end
// _____________________________________________________________________ Processes Log __________________  

function processLog(data) {

    if (data == 'success') {
        // goHome();
        // document.location = "/home/index.html";
        // $("#login_status").text("Login Successful");
        // sessionStorage["username"] = $("#username_field").val() ;
        // setTimeout(function() {
        //     $("#login_view").hide();
        //     $("#log_view").show();
        // }, 1000);

    }
    else {
        // $("#login_status")
        // $("#login_status").text ("Login Unsuccessful. Please Try Again.");

        // alert("Login Failure : User Id or Password is incorrect.");
    }

}

function processLogin(data) {
    if (data == 'success') {
        // document.location = "/home/index.html";
        $("#login_status").text("Login Successful");
        sessionStorage["username"] = $("#username_field").val();
        setTimeout(function () {
            // $("#login_view").hide();
            // $("#log_view").show();
            document.location = "/weightlog/";
        }, 700);

    }
    else {
        $("#login_status")
        $("#login_status").text("Login Unsuccessful. Please Try Again.");

        // alert("Login Failure : User Id or Password is incorrect.");
    }

}

function goHome() {
    document.location = "/home/index.html";
}

function processRegister(data) {
    if (data == 'success') {
        document.location = "/home/index.html";
    }
    else {
        alert("Registration failed. Please check your entered data.");
    }
}


// _____________________________________________________________________ Processes Log __________________  

function calculateBMI(height, weight) {

    var bmi; // 

    // height = 190;
    // weight = 200;

    bmi = (703 * weight) / (height * height);

    return bmi.toFixed(2);
}




// _____________________________________________________________________ Validations __________________  


function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}