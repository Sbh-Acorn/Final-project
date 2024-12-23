// 요소 선택
let $alarm = document.querySelector("#header_alarm");
let $profile = document.querySelector("#header_profile");

let $alarm_drop = document.querySelector("#header_alarm_dropdown");
let $profile_drop = document.querySelector("#header_profile_dropdown");
let $profile_drop2 = document.querySelector("#header_profile_dropdown2");
let $drop = document.querySelector(".dropdown");

let $searchInput = document.querySelector("#header_input");
let $searchResults = document.createElement("ul"); // 검색 결과 목록을 위한 <ul> 생성
$searchResults.id = "search_results";
$searchResults.className = "search-dropdown";
$searchInput.parentNode.appendChild($searchResults);

// 알람 드롭다운 이벤트
$alarm.addEventListener("click", () => {
    $drop.classList.remove("active");
    $alarm_drop.classList.toggle("active");
});

// 프로필 드롭다운 이벤트
$profile.addEventListener("click", () => {
    $alarm_drop.classList.remove("active");
    $drop.classList.toggle("active");
});

// 검색창 이벤트: 입력 감지 및 AJAX 요청
$searchInput.addEventListener("input", () => {
    let query = $searchInput.value.trim();

    if (query.length >= 2) {
        fetch(` /search?query=${encodeURIComponent(query)}`)
            .then(response => {

               if (!response.ok) {
                console.error(`HTTP Error: ${response.status} ${response.statusText}`);
                throw new Error("Network response was not ok");
               }
               return response.json();
            })
            .then(data => {
                $searchResults.innerHTML = "";
                if (data.length > 0) {
                    data.forEach(product => {
                        let listItem = document.createElement("li");
                        listItem.className = "search-result-item";

                        let link = document.createElement("a");
                        link.href = `/product/${product.product_id}`;
                        link.textContent = product.name;

                        listItem.appendChild(link);
                        $searchResults.appendChild(listItem);
                    });
                } else {
                    $searchResults.innerHTML = "<li class='search-result-empty'>검색 결과가 없습니다.</li>";
                }
            })
            .catch(error => {
                console.error("Error fetching search results:", error);
                $searchResults.innerHTML = "<li class='search-result-error'>검색 중 오류가 발생했습니다.</li>";
            });
    } else {
        $searchResults.innerHTML = "";
    }
});


// 외부 클릭 시 검색 결과 숨기기
document.addEventListener("click", (e) => {
    if (!$searchInput.contains(e.target) && !$searchResults.contains(e.target)) {
        $searchResults.innerHTML = ""; // 검색 결과 숨기기
    }
});



function loadNotification(){
    $.ajax({
        url: "/notification",
        type: "GET",
        success: function(response){
            if(response.status === "fetch_success"){
                console.log(response);
                if(!response.notificationList || response.notificationList.length === 0){
                    $("#header_alarm_dropdown").html("<li class='header_alarm_dropdown_list' style='text-decoration: none; cursor: auto'>알림이 없습니다.</li>");
                    return;
                }
                let notificationHtml = "";
                response.notificationList.forEach((notification) => {
                    notificationHtml += `
                        <li class="header_alarm_dropdown_list"
                        onclick="readNotification(this)"
                        data-notification-id="${notification.notificationId}"
                        data-product-id="${notification.productId}">
                            [${notification.productName}] 제품의 가격이 하락했습니다.<br>
                            이전 가격: €${notification.previousPrice}<br>
                            현재 가격: €${notification.currentPrice}<br>
                            ${notification.createdAt}
                        </li>
                    `;
                });
                $("#header_alarm_dropdown").html(notificationHtml);
            }
        },
        error: function(xhr, status, error){
            console.log("Error", error);
        }
    });
}

function readNotification(element){
    let notificationId = element.dataset.notificationId;
    let productId = element.dataset.productId;
    console.log(element);
    console.log(notificationId);
    console.log(productId);
    $.ajax({
        url: "/notification/read",
        type: "POST",
        data: {
            notificationId: notificationId
        },
        success: function(response){
            if(response.status === "update_success"){
                if(element){
                    element.remove();
                    checkNotification();
                }
                window.location.href = "/product/" + productId;
            }
        },
        error: function(xhr, status, error){
            console.log("Error:", error);
        }
    });
}

function checkNotification(){
    let notifications = document.querySelectorAll(".header_alarm_dropdown_list");
        if(!notifications || notifications.length === 0){
            $("#header_alarm_dropdown").html("<li class='header_alarm_dropdown_list' style='text-decoration: none; cursor: auto'>알림이 없습니다.</li>");
            return;
        }
}