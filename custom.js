// Хранилище для баллов
let loyaltyPoints = {};
let loyaltyTimerRunning = false; // Флаг для контроля запуска таймера

// Функция для начисления баллов
function addPoints() {
    // Проходим по всем пользователям и начисляем баллы
    Object.keys(loyaltyPoints).forEach((username) => {
        loyaltyPoints[username] += 1;
        console.log(`Пользователь ${username} получил 1 балл. Всего баллов: ${loyaltyPoints[username]}`);
    });
}

// Таймер начисления баллов
function startLoyaltySystem() {
    if (loyaltyTimerRunning) return; // Если таймер уже запущен, выходим
    loyaltyTimerRunning = true; // Устанавливаем флаг

    setInterval(() => {
        addPoints(); // Начисляем баллы всем пользователям
    }, 600000); // Каждые 10 минут
}

// Обработчик входящих сообщений
window.addEventListener("message", (event) => {
    const { username, message } = event.data;

    // Если пользователь пишет в чат, добавляем его в систему
    if (!loyaltyPoints[username]) {
        loyaltyPoints[username] = 0; // Добавляем нового пользователя
        console.log(`Добавлен новый пользователь: ${username}`);
    }

    // Запуск системы лояльности (гарантируем запуск только один раз)
    startLoyaltySystem();
});

// Команда для проверки баллов
function handleCommand(username, message) {
    if (message.toLowerCase() === "!points") {
        const points = loyaltyPoints[username] || 0;
        sendMessage(`@${username}, у вас ${points} баллов!`);
    }
}

// Функция для отправки сообщений
function sendMessage(reply) {
    window.parent.postMessage({ action: "send", message: reply }, "*");
}

// Обработчик сообщений с командами
window.addEventListener("message", (event) => {
    const { username, message } = event.data;

    // Обработка команд
    handleCommand(username, message);
});
