let currentLanguage = "zh"; // 預設語言為中文
let alarms = []; // 儲存所有鬧鐘的陣列
let isDarkMode = true; // 預設為深色模式

// 更新目前時間
function updateCurrentTime() {
    const now = new Date(); // 取得現在的時間
    const locale = currentLanguage === "zh" ? "zh-TW" : "en-US"; // 根據語言決定格式
    const timeString = now.toLocaleTimeString(locale, { hour12: true }); // 格式化時間
    document.getElementById("currentTime").innerText = timeString; // 顯示時間
}

// 每秒更新一次時間
setInterval(updateCurrentTime, 1000);
updateCurrentTime(); // 頁面載入時先顯示一次

// 切換深/淺色模式
function toggleDarkMode() {
    isDarkMode = !isDarkMode; // 切換布林值
    const body = document.body;
    const button = document.getElementById("modeToggleBtn");

    if (isDarkMode) {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
        button.innerText = currentLanguage === "zh" ? "淺色模式" : "Light Mode"; // 顯示目前是深色
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
        button.innerText = currentLanguage === "zh" ? "深色模式" : "Dark Mode"; // 顯示目前是淺色
    }
}

// 設定鬧鐘
function setAlarm() {
    const alarmTime = document.getElementById("alarmTime").value; // 取得輸入的時間
    if (!alarmTime) {
        alert(currentLanguage === "zh" ? "請輸入時間！" : "Please enter a time!");
        return;
    }

    const now = new Date();
    const alarm = new Date();
    const [hours, minutes] = alarmTime.split(":");
    alarm.setHours(hours, minutes, 0, 0); // 設定時間（秒和毫秒設為 0）

    // 如果設的時間已經過了，就加一天
    if (alarm <= now) {
        alarm.setDate(now.getDate() + 1);
    }

    const timeToAlarm = alarm.getTime() - now.getTime(); // 計算延遲時間（毫秒）

    // 建立鬧鐘物件
    const alarmObj = {
        time: alarm, // 存儲為 Date 物件，避免格式錯誤
        timeoutId: setTimeout(() => triggerAlarm(alarmObj), timeToAlarm), // 設定定時器
        isActive: true // 預設啟用狀態
    };

    alarms.push(alarmObj); // 加進陣列
    displayAlarms(); // 更新畫面
}

// 觸發鬧鐘響鈴
function triggerAlarm(alarmObj) {
    if (alarmObj.isActive) { // 確保是開啟狀態才響
        document.getElementById("alarmSound").play(); // 播放音效
        alert(currentLanguage === "zh" ? `時間到了！ ${alarmObj.time.toLocaleTimeString(currentLanguage === "zh" ? "zh-TW" : "en-US", { hour12: true })}` : `Time's up! ${alarmObj.time.toLocaleTimeString(currentLanguage === "zh" ? "zh-TW" : "en-US", { hour12: true })}`);
        alarmObj.isActive = false; // 響完關閉
        displayAlarms(); // 更新畫面
    }
}

// 顯示所有鬧鐘
function displayAlarms() {
    const alarmList = document.getElementById("alarmList");
    alarmList.innerHTML = ""; // 清空現有的列表

    alarms.forEach((alarmObj, index) => {
        const li = document.createElement("li");
        li.style.display = "flex"; // 讓裡面元素橫向排列
        li.style.alignItems = "center";
        li.style.gap = "10px"; // 元素之間間距

        // 建立開關（checkbox）
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = alarmObj.isActive; // 決定是否打開
        toggle.className = "alarm-toggle"; // 加 class 方便設計樣式
        toggle.onchange = () => {
            alarmObj.isActive = toggle.checked; // 切換啟動狀態
        };

        // 建立時間文字
        const timeText = document.createElement("span");
        timeText.innerText = alarmObj.time.toLocaleTimeString(currentLanguage === "zh" ? "zh-TW" : "en-US", { hour12: true });

        // 建立刪除按鈕
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = currentLanguage === "zh" ? "刪除" : "Delete";
        deleteBtn.onclick = () => deleteAlarm(index);

        // 組合在一起（順序：開關、時間、刪除）
        li.appendChild(toggle);
        li.appendChild(timeText);
        li.appendChild(deleteBtn);
        alarmList.appendChild(li);
    });
}

// 刪除鬧鐘
function deleteAlarm(index) {
    const alarmObj = alarms[index];
    clearTimeout(alarmObj.timeoutId); // 清除計時器
    alarms.splice(index, 1); // 從陣列中移除
    displayAlarms(); // 更新畫面
}

// 語言切換
function changeLanguage() {
    currentLanguage = document.getElementById("languageSelect").value;

    // 根據語言變更介面文字
    if (currentLanguage === "zh") {
        document.getElementById("setAlarmLabel").innerText = "設定鬧鐘";
        document.getElementById("pageTitle").innerText = "我的鬧鐘";
        document.getElementById("currentTimeText").innerText = "現在時間";
        document.getElementById("setButton").innerText = "設定";
        document.getElementById("modeToggleBtn").innerText = "淺色模式";
    } else {
        document.getElementById("setAlarmLabel").innerText = "Set Alarm";
        document.getElementById("pageTitle").innerText = "My Alarm Clock";
        document.getElementById("currentTimeText").innerText = "Current Time";
        document.getElementById("setButton").innerText = "Set";
        document.getElementById("modeToggleBtn").innerText = "Light Mode";
    }

    // 重新顯示鬧鐘
    displayAlarms(); // 重新顯示以套用語言
}
