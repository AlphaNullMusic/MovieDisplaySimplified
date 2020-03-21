function clock() {
    var time = new Date().toLocaleTimeString().replace(/\s.M/, "");
    $('.clockTime').text(time);
}

// Returns true if we can reach the API
function hostReachable(cb) {
    var xhr = new XMLHttpRequest();
    var file = "https://shorelinecinema.co.nz/api/today.php";
    var randomNum = Math.round(Math.random() * 10000);
 
    xhr.open('HEAD', file + "?rand=" + randomNum, true);
    xhr.send();
     
    xhr.addEventListener("readystatechange", processRequest, false);
 
    function processRequest(e) {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 304) {
                console.log('Connection exists.');
                cb(true);
            } else {
                console.error("Couldn't connect! Trying again soon.");
                cb(false);
            }
      }
    }
}

function initData() {
    hostReachable(function (isConnected) {
        if (isConnected) {
            var url = "https://shorelinecinema.co.nz/api/today.php";
            $.get(url, function(response){ 
                console.log(response);
                if (typeof window.movie_list != undefined && window.movie_list == response['list']) {
                    console.log("Movie list exists, moving on");
                    displayData();
                } else {
                    console.log("Movie list doesn't exist, saving.");
                    window.movie_list = response['list'];
                    displayData();
                }
            });
        } else {
            if (window.movie_list && window.movie_list['status'] == 200) {
                console.log("Can't connect but have data");
                displayData();
            } else {
                console.error("Can't connect! Will try again soon.");
                $('img#loader').fadeOut();
                $('#sorry-msg').text("Can't connect, will try again soon").fadeIn();
                return false;
            }
        }
    });
}

function displayData() {
    $('img#loader').fadeOut();
    for (var movie in window.movie_list) {
        console.log(window.movie_list[movie]['title']);
    }
}