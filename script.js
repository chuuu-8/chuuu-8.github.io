let currentLanguage = "zh"; // 預設語言為中文
let alarms = []; // 用來儲存所有鬧鐘的數組
let isDarkMode = true; // 預設為深色模式

// 更新當前時間並顯示
function updateCurrentTime() {
    const now = new Date(); // 獲取當前時間
    const locale = currentLanguage === "zh" ? "zh-TW" : "en-US"; // 根據語言選擇格式
    const timeString = now.toLocaleTimeString(locale, { hour12: true }); // 轉換為當地時間
    document.getElementById("currentTime").innerText = timeString; // 顯示在頁面上
}

// 每秒更新一次時間
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // 初始化顯示當前時間

// 切換模式（深色模式 / 淺色模式）
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const button = document.getElementById("modeToggleBtn");

    if (isDarkMode) {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        button.innerText = "淺色模式"; // 改變按鈕文字
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        button.innerText = "深色模式"; // 改變按鈕文字
    }
}

// 設定鬧鐘
function setAlarm() {
    const alarmTime = document.getElementById("alarmTime").value; // 取得使用者設定的鬧鐘時間
    if (!alarmTime) {
        alert(currentLanguage === "zh" ? "請輸入時間！" : "Please enter a time!");
        return;
    }

    const now = new Date();
    const alarm = new Date();
    const [hours, minutes] = alarmTime.split(":");
    alarm.setHours(hours, minutes, 0, 0); // 設定鬧鐘時間

    // 如果鬧鐘時間已經過了，則設為第二天
    if (alarm <= now) {
        alarm.setDate(now.getDate() + 1);
    }

    // 計算距離鬧鐘觸發的時間
    const timeToAlarm = alarm.getTime() - now.getTime();

    // 儲存鬧鐘資訊
    const alarmObj = {
        time: alarm.toLocaleTimeString(), // 設定時間顯示格式
        timeoutId: setTimeout(() => triggerAlarm(alarmObj), timeToAlarm), // 設定定時器
        isActive: true // 鬧鐘啟動狀態
    };
    alarms.push(alarmObj); // 添加到鬧鐘數組中
    displayAlarms(); // 更新 UI 顯示
}

// 觸發鬧鐘
function triggerAlarm(alarmObj) {
    if (alarmObj.isActive) {
        document.getElementById("alarmSound").play(); // 播放鬧鐘音效
        alert(currentLanguage === "zh" ? `時間到了！ ${alarmObj.time}` : `Time's up! ${alarmObj.time}`);
        alarmObj.isActive = false; // 停用該鬧鐘
        displayAlarms(); // 更新鬧鐘列表
    }
}

// 顯示鬧鐘列表
function displayAlarms() {
    const alarmList = document.getElementById("alarmList");
    alarmList.innerHTML = ""; // 清空顯示的鬧鐘列表

    alarms.forEach((alarmObj, index) => {
        const li = document.createElement("li");
        li.innerHTML = `${alarmObj.time} <button onclick="deleteAlarm(${index})">刪除</button>`;
        alarmList.appendChild(li);
    });
}

// 刪除鬧鐘
function deleteAlarm(index) {
    const alarmObj = alarms[index];
    clearTimeout(alarmObj.timeoutId); // 取消定時器
    alarms.splice(index, 1); // 刪除該鬧鐘
    displayAlarms(); // 更新顯示
}

// 切換語言
function changeLanguage() {
    currentLanguage = document.getElementById("languageSelect").value; // 取得選擇的語言
    if (currentLanguage === "zh") {
        document.getElementById("setAlarmLabel").innerText = "設定鬧鐘"; // 中文
        document.getElementById("pageTitle").innerText = "我的鬧鐘";
        document.getElementById("currentTimeText").innerText = "現在時間";
        document.getElementById("setButton").innerText = "設定";
    } else {
        document.getElementById("setAlarmLabel").innerText = "Set Alarm"; // 英文
        document.getElementById("pageTitle").innerText = "My Alarm Clock";
        document.getElementById("currentTimeText").innerText = "Current Time";
        document.getElementById("setButton").innerText = "Set";
    }
}

