/*
 * Ім'я виконавця: Каріна Мурженко
 * Навчальна група: ФЕМП 5-3з
 * Файл: script.js
 * Оновлено: Список міст скорочено до 20.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи ми на сторінці калькулятора (delivery.html)
    if (document.getElementById('delivery-calculator')) {
        initializeCalculator();
    }
});

const deliveryData = {
    // Міста України та їх базові тарифи (Тільки 20 найбільших)
    cityBaseRates: [
        { city: "Київ", baseRate: 70, coefficient: 1.0 },
        { city: "Харків", baseRate: 65, coefficient: 0.95 },
        { city: "Одеса", baseRate: 65, coefficient: 0.95 },
        { city: "Дніпро", baseRate: 60, coefficient: 0.9 },
        { city: "Донецьк", baseRate: 60, coefficient: 0.9 }, 
        { city: "Запоріжжя", baseRate: 55, coefficient: 0.85 },
        { city: "Львів", baseRate: 65, coefficient: 1.05 }, 
        { city: "Кривий Ріг", baseRate: 50, coefficient: 0.8 },
        { city: "Миколаїв", baseRate: 50, coefficient: 0.8 },
        { city: "Севастополь", baseRate: 50, coefficient: 0.8 }, 
        { city: "Маріуполь", baseRate: 50, coefficient: 0.8 }, 
        { city: "Луганськ", baseRate: 50, coefficient: 0.8 }, 
        { city: "Вінниця", baseRate: 55, coefficient: 0.85 },
        { city: "Сімферополь", baseRate: 50, coefficient: 0.8 }, 
        { city: "Макіївка", baseRate: 45, coefficient: 0.75 }, 
        { city: "Херсон", baseRate: 50, coefficient: 0.8 },
        { city: "Полтава", baseRate: 55, coefficient: 0.85 },
        { city: "Чернігів", baseRate: 55, coefficient: 0.85 },
        { city: "Черкаси", baseRate: 55, coefficient: 0.85 },
        { city: "Житомир", baseRate: 50, coefficient: 0.8 }
    ],
    // Додаткові тарифи за вагу (грн за кг)
    weightRates: {
        upTo1kg: 10,
        upTo5kg: 8,
        over5kg: 6
    },
    // Коефіцієнти для різних типів доставки
    typeCoefficients: {
        standard: 1.0,  
        express: 1.5,   
    }
};

function initializeCalculator() {
    const citySelect = document.getElementById('city');
    const calculateButton = document.getElementById('calculate-btn');
    
    // Динамічне заповнення випадаючого списку міст
    deliveryData.cityBaseRates
        .sort((a, b) => a.city.localeCompare(b.city, 'uk')) 
        .forEach(item => {
            const option = document.createElement('option');
            option.value = item.city;
            option.textContent = item.city;
            citySelect.appendChild(option);
        });

    calculateButton.addEventListener('click', calculateDeliveryCost);
}

function calculateDeliveryCost() {
    // 1. Отримання даних з форми
    const city = document.getElementById('city').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const deliveryType = document.getElementById('delivery-type').value;
    const resultElement = document.getElementById('result');
    
    // Скидання стилів результату
    resultElement.style.backgroundColor = '#e9ecef';
    resultElement.style.color = '#333';

    // 2. Валідація
    if (!city || city === "" || isNaN(weight) || weight <= 0) {
        resultElement.innerHTML = '⚠️ Будь ласка, оберіть місто та введіть коректну вагу (> 0).';
        resultElement.style.backgroundColor = '#f8d7da'; 
        resultElement.style.color = '#721c24';
        return;
    }
    
    // 3. Знаходження базового тарифу міста
    const cityRateInfo = deliveryData.cityBaseRates.find(item => item.city === city);
    
    // 4. Розрахунок вартості за вагу
    let weightCost = 0;
    if (weight <= 1) {
        weightCost = weight * deliveryData.weightRates.upTo1kg;
    } else if (weight <= 5) {
        weightCost = (1 * deliveryData.weightRates.upTo1kg) + ((weight - 1) * deliveryData.weightRates.upTo5kg);
    } else {
        weightCost = (1 * deliveryData.weightRates.upTo1kg) + 
                     (4 * deliveryData.weightRates.upTo5kg) + 
                     ((weight - 5) * deliveryData.weightRates.over5kg);
    }
    
    // 5. Розрахунок загальної базової вартості
    let baseCost = cityRateInfo.baseRate + weightCost;
    
    // 6. Застосування коефіцієнта типу доставки
    const typeCoefficient = deliveryData.typeCoefficients[deliveryType] || 1.0;
    
    // 7. Остаточна вартість (округлення до 2 знаків)
    const finalCost = (baseCost * typeCoefficient).toFixed(2);
    
    // 8. Виведення результату
    resultElement.style.backgroundColor = '#d4edda'; 
    resultElement.style.color = '#155724';
    resultElement.innerHTML = `
        <p>✅ <strong>Розрахунок завершено:</strong></p>
        <p>Місто: <strong>${city}</strong></p>
        <p>Вага: <strong>${weight.toFixed(2)} кг</strong></p>
        <p>Тип доставки: <strong>${deliveryType === 'standard' ? 'Звичайна' : 'Експрес'}</strong></p>
        <hr>
        <p>Базова вартість міста: ${cityRateInfo.baseRate.toFixed(2)} грн</p>
        <p>Вартість за вагу: ${weightCost.toFixed(2)} грн</p>
        <p style="font-size: 1.5em; color: #007bff; margin-top: 10px;"><strong>Остаточна вартість: ${finalCost} грн</strong></p>
    `;
}