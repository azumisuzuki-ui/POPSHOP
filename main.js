const screenTitle = document.getElementById('screen-title'); // 追加
const screenMarket = document.getElementById('screen-market');
const screenStrategy = document.getElementById('screen-strategy');
const screenShop = document.getElementById('screen-shop');
const screenResult = document.getElementById('screen-result');
const screenEnding = document.getElementById('screen-ending');

const btnStartGame = document.getElementById('btn-start-game'); // 追加
const btnToStrategy = document.getElementById('btn-to-strategy');
const btnToShop = document.getElementById('btn-to-shop');
const btnToResult = document.getElementById('btn-to-result');
const btnNextDay = document.getElementById('btn-next-day');
const btnRetry = document.getElementById('btn-retry');
const btnBgm = document.getElementById('btn-bgm');
const btnFullscreen = document.getElementById('btn-fullscreen');

const inputPrice = document.getElementById('input-price');
const priceDisplay = document.getElementById('price-display');
const selectPop = document.getElementById('select-pop');
const selectProduct = document.getElementById('select-product');
const selectPlace = document.getElementById('select-place');
const selectStock = document.getElementById('select-stock');

const displayPop = document.getElementById('display-pop');
const displayProduct = document.getElementById('display-product');
const displayPrice = document.getElementById('display-price');
const customerMessage = document.getElementById('customer-message');
const clockElement = document.getElementById('clock');
const stockElement = document.getElementById('stock');
const salesElement = document.getElementById('sales');

const resultSales = document.getElementById('result-sales');
const resultCost = document.getElementById('result-cost');
const resultPlaceCost = document.getElementById('result-place-cost');
const resultWasteCount = document.getElementById('result-waste-count');
const resultWasteCost = document.getElementById('result-waste-cost');
const resultProfit = document.getElementById('result-profit');
const resultRoi = document.getElementById('result-roi');
const moneyElement = document.getElementById('money');
const dayElement = document.getElementById('day');

let currentMoney = 10000;
let currentDay = 1;
let initialStock = 50;
let currentStock = 50;
let currentSales = 0;
let currentTime = 10;
let dailyProfit = 0;
let currentCost = 100;
let currentPlaceCost = 0;

let todayWeather = "";
let todayEvent = "";
let todayTrend = "";

// ★ タイトルからゲームスタート ★
btnStartGame.addEventListener('click', () => {
    screenTitle.style.display = 'none';
    screenMarket.style.display = 'block';
});

btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => alert("全画面表示非対応"));
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
    }
});

let audioCtx = null;
let isBgmPlaying = false;
let bgmInterval = null;

const notes = { 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50 };
const melody = ['E5', 'G5', 'C6', 'E5', 'G5', 'C6', 'D5', 'F5', 'B5', 'D5', 'F5', 'B5', 'C5', 'E5', 'G5', 'A5', 'G5', 'E5', 'C5'];
let noteIndex = 0;

function playBgmNote() {
    if (!isBgmPlaying || !audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(notes[melody[noteIndex]], audioCtx.currentTime);
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
    noteIndex = (noteIndex + 1) % melody.length;
}

btnBgm.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (isBgmPlaying) {
        isBgmPlaying = false;
        clearInterval(bgmInterval);
        btnBgm.textContent = "🎵 BGM: OFF";
    } else {
        isBgmPlaying = true;
        bgmInterval = setInterval(playBgmNote, 250);
        btnBgm.textContent = "🎵 BGM: ON";
    }
});

function playChime() {
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, audioCtx.currentTime);
        osc.frequency.setValueAtTime(1318.51, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } catch(e) {}
}

function showCoinEffect(amount) {
    const layer = document.getElementById('effect-layer');
    const coin = document.createElement('div');
    coin.className = 'coin-effect';
    coin.textContent = `+${amount}円!`;
    layer.appendChild(coin);
    setTimeout(() => coin.remove(), 800);
}

const weatherList = [
    { text: "☀️ <strong>天気:</strong> 快晴 (気温32度)", type: "hot", sky: "☀️" },
    { text: "☁️ <strong>天気:</strong> くもり (気温25度)", type: "normal", sky: "☁️" },
    { text: "☔ <strong>天気:</strong> 雨 (気温22度)", type: "rain", sky: "☔" },
    { text: "🌡️ <strong>天気:</strong> 猛暑日 (気温36度)", type: "hot", sky: "🔥" }
];
const eventList = [
    { text: "🏫 <strong>イベント:</strong> 近くの高校で体育祭", type: "student" },
    { text: "🏢 <strong>イベント:</strong> オフィス街で展示会", type: "work" },
    { text: "🏞️ <strong>イベント:</strong> 公園でフリーマーケット", type: "family" },
    { text: "なし <strong>イベント:</strong> 特になし", type: "none" }
];
const trendList = [
    { text: "📺 <strong>トレンド:</strong> チョコミント特集がテレビで放送", type: "mint" },
    { text: "📱 <strong>トレンド:</strong> SNSでマンゴー味がバズり中", type: "mango" },
    { text: "📰 <strong>トレンド:</strong> 定番のバニラが再ブーム", type: "vanilla" },
    { text: "🍓 <strong>トレンド:</strong> 高級いちごスイーツがSNSで話題", type: "strawberry" },
    { text: "🥤 <strong>トレンド:</strong> 昭和レトロなソーダ味がブーム", type: "soda" }
];

function randomizeMarketInfo() {
    const wObj = weatherList[Math.floor(Math.random() * weatherList.length)];
    const eObj = eventList[Math.floor(Math.random() * eventList.length)];
    const tObj = trendList[Math.floor(Math.random() * trendList.length)];

    document.getElementById('info-weather').innerHTML = wObj.text;
    document.getElementById('info-event').innerHTML = eObj.text;
    document.getElementById('info-trend').innerHTML = tObj.text;

    todayWeather = wObj.type;
    todayEvent = eObj.type;
    todayTrend = tObj.type;
    document.getElementById('display-sky').textContent = wObj.sky;
}

function randomizeReviews(roi, wasteCount) {
    const goodReviews = [
        "💬 「トレンドの商品がドンピシャで買えた！」",
        "💬 「場所とPOPの組み合わせが神がかってた！」",
        "💬 「今日の気候にぴったりのアイス！最高！」"
    ];
    const badReviews = [
        "💬 「この場所でその価格は高すぎるよ…」",
        "💬 「売り切れで買えなかった…もっと仕入れて！」",
        "💬 「看板と場所のターゲットがズレてる気がする」"
    ];

    let review1 = (roi >= 25) ? goodReviews[Math.floor(Math.random() * goodReviews.length)] : badReviews[Math.floor(Math.random() * badReviews.length)];
    let review2 = (wasteCount === 0) ? "💬 「完売御礼！大繁盛ですね！」" : badReviews[Math.floor(Math.random() * badReviews.length)];
    
    document.getElementById('review-1').textContent = review1;
    document.getElementById('review-2').textContent = review2;
}

randomizeMarketInfo();

inputPrice.addEventListener('input', () => priceDisplay.textContent = inputPrice.value);

btnToStrategy.addEventListener('click', () => {
    screenMarket.style.display = 'none';
    screenStrategy.style.display = 'block';
});

btnToShop.addEventListener('click', () => {
    screenStrategy.style.display = 'none';
    screenShop.style.display = 'block';

    displayPop.textContent = selectPop.options[selectPop.selectedIndex].text;
    displayProduct.textContent = selectProduct.options[selectProduct.selectedIndex].text;
    
    const setPrice = Number(inputPrice.value);
    displayPrice.textContent = setPrice;

    const costs = { soda: 50, vanilla: 100, mint: 150, mango: 200, strawberry: 300 };
    currentCost = costs[selectProduct.value] || 100;

    const placeCosts = { park: 0, school: 1500, office: 3000 };
    currentPlaceCost = placeCosts[selectPlace.value] || 0;

    initialStock = Number(selectStock.value);
    currentStock = initialStock;
    stockElement.textContent = currentStock;

    startSimulation(setPrice, currentCost, selectProduct.value, selectPop.value, selectPlace.value);
});

btnToResult.addEventListener('click', () => {
    screenShop.style.display = 'none';
    screenResult.style.display = 'block';

    const totalCost = currentCost * initialStock; 
    const wasteCount = currentStock; 
    const wasteCost = wasteCount * currentCost; 

    dailyProfit = currentSales - totalCost - currentPlaceCost;

    let roi = (totalCost + currentPlaceCost > 0) ? Math.floor((dailyProfit / (totalCost + currentPlaceCost)) * 100) : 0;

    resultSales.textContent = currentSales;
    resultCost.textContent = totalCost;
    resultPlaceCost.textContent = currentPlaceCost;
    resultWasteCount.textContent = wasteCount;
    resultWasteCost.textContent = wasteCost;
    resultProfit.textContent = dailyProfit;
    resultRoi.textContent = roi;

    randomizeReviews(roi, wasteCount);

    if (currentDay === 7) {
        btnNextDay.textContent = "🏆 7日間の最終評価を見る";
    } else {
        btnNextDay.textContent = "🌙 次の日へ進む";
    }
});

btnNextDay.addEventListener('click', () => {
    currentMoney += dailyProfit;

    if (currentDay >= 7) {
        screenResult.style.display = 'none';
        screenEnding.style.display = 'block';

        const finalMoneyElem = document.getElementById('ending-final-money');
        const rankTitleElem = document.getElementById('ending-rank-title');
        const messageElem = document.getElementById('ending-message');

        finalMoneyElem.textContent = currentMoney;

        if (currentMoney >= 50000) {
            rankTitleElem.textContent = "🌟 スーパー店長 🌟";
            messageElem.textContent = `7日間で所持金${currentMoney}円達成！需要予測もバッチリな経営の神様です！`;
            rankTitleElem.style.color = "#ff4081";
        } else if (currentMoney >= 25000) {
            rankTitleElem.textContent = "🍦 一人前の店長 🍦";
            messageElem.textContent = `7日間で所持金${currentMoney}円を達成！リスクを管理して黒字達成です！`;
            rankTitleElem.style.color = "#2e7d32";
        } else {
            rankTitleElem.textContent = "😭 だめだめ店長 😭";
            messageElem.textContent = `7日間の所持金は${currentMoney}円でした。売れ残りの廃棄コストと出店料に注意して再挑戦しよう！`;
            rankTitleElem.style.color = "#d32f2f";
        }
        return;
    }

    currentDay += 1;
    dayElement.textContent = currentDay;
    moneyElement.textContent = currentMoney;

    currentSales = 0;
    currentTime = 10;
    dailyProfit = 0;

    clockElement.textContent = "10:00";
    salesElement.textContent = "0";
    customerMessage.innerHTML = "🚶 お客さんを待っています...";
    btnToResult.style.display = 'none'; 

    randomizeMarketInfo();

    screenResult.style.display = 'none';
    screenMarket.style.display = 'block';
});

btnRetry.addEventListener('click', () => {
    location.reload();
});

function startSimulation(price, cost, selectedProductValue, selectedPopValue, selectedPlaceValue) {
    let probability = 0.3;

    if (price >= cost * 2.5) probability -= 0.2;
    else if (price <= cost * 1.3) probability += 0.15;

    let isTrendMatch = (selectedProductValue === todayTrend);
    if (isTrendMatch) probability += 0.2;

    let matchLevel = 0;
    if (selectedPopValue === 'student' && selectedPlaceValue === 'school' && todayEvent === 'student') matchLevel = 2;
    else if (selectedPopValue === 'reward' && selectedPlaceValue === 'office' && todayEvent === 'work') matchLevel = 2;
    else if (selectedPopValue === 'summer' && todayWeather === 'hot' && selectedPlaceValue === 'park') matchLevel = 2;
    else if (selectedPopValue === 'sns' && isTrendMatch) matchLevel = 2;
    else if (selectedPopValue === 'family' && selectedPlaceValue === 'park') matchLevel = 1;
    else if (selectedPopValue === 'student' && selectedPlaceValue === 'school') matchLevel = 1;
    else if (selectedPopValue === 'reward' && selectedPlaceValue === 'office') matchLevel = 1;

    if (matchLevel === 2) probability += 0.3;
    else if (matchLevel === 1) probability += 0.15;

    if (todayWeather === 'rain') probability -= 0.15;

    const timer = setInterval(() => {
        currentTime += 1;
        clockElement.textContent = currentTime + ":00";

        let traffic = 8;
        if (selectedPlaceValue === 'office') traffic = 12;
        if (selectedPlaceValue === 'school') traffic = 10;

        let soldCount = 0;
        for(let i = 0; i < traffic; i++){
            if(Math.random() < probability) soldCount++;
        }

        if (soldCount > currentStock) soldCount = currentStock;

        if (soldCount > 0) {
            playChime();
            showCoinEffect(price * soldCount);

            if (matchLevel === 2 && isTrendMatch) {
                customerMessage.innerHTML = `🔥 <strong>パーフェクトヒット！</strong><br>🚶 「大行列だ！」 (${soldCount}個売れた)`;
            } else if (isTrendMatch) {
                customerMessage.innerHTML = `📺 <strong>トレンド大ヒット！</strong><br>🚶 「バズってるやつだ！」 (${soldCount}個売れた)`;
            } else {
                customerMessage.innerHTML = `🚶 お客さん: <br>「${soldCount}人が買っていきました！」`;
            }
            currentStock -= soldCount;
            currentSales += (price * soldCount);
            
            stockElement.textContent = currentStock;
            salesElement.textContent = currentSales;
        } else {
            customerMessage.innerHTML = "🚶 お客さん: <br>「今日はいいかな…」通り過ぎた。";
        }

        if (currentTime >= 18) {
            clearInterval(timer);
            customerMessage.innerHTML = "🌙 本日の営業は終了しました。";
            btnToResult.style.display = 'block';
        }
    }, 1000);
}