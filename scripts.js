const BASE_URL = 'https://strapi.kitek-pg.ru'
const API_URL = `${BASE_URL}/api/homes?populate=*`
const API_TOKEN = '0d97d3266f18a66139ccc63943d4f53e6c7fea3b0cd757a8a8682184ca8eec0904a12b21b1cd818796f67ede349a13c2a91c7551db4f626878980d0eca47e90d854fdaba7c612dc5217761214c3db9e752f3de1a02fc205b8ab597a7b54a1a82c185bae8421e472b23976255e8e6d97cc9d9e87b574f252b484b2c649ad77221'


function createCard(item) {
    const { address, floors, area_sqm, interior, material, year } = item;
  
    let imageUrl
    if (interior) {
        imageUrl = `${BASE_URL}${interior.url}`
    } else {
        imageUrl = 'https://placehold.co/300x200?text=No+image'
    }

    const formattedArea = area_sqm ? area_sqm.toLocaleString('ru-RU') : '—';

  
    return `
        <article class="card">
            <img class="card__image" src="${imageUrl}" alt="Интерьер по адресу ${address}" />
            <div class="card__body">
                <h2 class="card__title">${address}</h2>
                <p class="card__text">
                    Материал: ${material}<br>
                    Этажей: ${floors}<br>
                    Площадь: ${formattedArea} кв.м
                </p>
                <div class="card__footer">
                    <span class="card__year">Год: ${year}</span>
                </div>
            </div>
        </article>
    `;
}


async function loadCards() {

    const cardsEl = document.getElementById('cards');
    const statusEl = document.getElementById('status');
    try {
        statusEl.textContent = 'Загрузка...';
        statusEl.classList.remove('status--error'); 

        // 1. Делаем запрос
        const response = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${API_TOKEN}`,
            },
        });

        // 2. Проверяем статус вручную (fetch сам не бросает ошибку на 403/404/500)
        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status} ${response.statusText}`);
        }

        // 3. Читаем JSON
        const result = await response.json();

        // 4. Достаём массив записей
        const items = result.data;

   
        if (!items || items.length === 0) {
            statusEl.textContent = 'Записей пока нет';
            cardsEl.innerHTML = '';
            return;
        }

        // 5. map: каждая запись -> строка HTML. join(''): склеиваем в одну строку
        cardsEl.innerHTML = items.map(createCard).join('');
        statusEl.textContent = '';
    } catch (error) {
        console.error('Ошибка при загрузке:', error);
        cardsEl.innerHTML = '';
        statusEl.textContent = `Не удалось загрузить данные: ${error.message}`;
        statusEl.classList.add('status--error');
    }
}

loadCards();