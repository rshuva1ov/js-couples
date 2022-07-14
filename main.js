(() => {

  // Создаем и возвращаем заголовок игры
  function createAppTitle(title) {
    const appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    appTitle.classList.add('app_title');
    return appTitle;
  }

  // Создаем и возвращаем форму для ввода кол-ва карточек
  function createNumberOfCardsForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    form.classList.add('number-card_form');
    form.innerText = 'Кол-во карточек по вертикали/горизонтали';
    input.classList.add('number-card_input');
    input.type = 'text';
    input.placeholder = 'Введите четное число от 2 до 10';
    button.classList.add('number-card_button');
    button.textContent = 'Начать игру';

    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button,
    };
  }

  let timerId; // Переменная для setTimeout

  function getNumberOfCards() { // Отрисовываем формы и передаём валидное число карточек
    const formContainer = document.querySelector('.header');
    const gameAppTitle = createAppTitle('Игра в пары');
    const numberOfCardsForm = createNumberOfCardsForm();

    formContainer.append(gameAppTitle);
    formContainer.append(numberOfCardsForm.form);

    numberOfCardsForm.form.addEventListener('submit', (e) => {  // Ввод и проверка чисел на валидность
      e.preventDefault();
      const inputValue = numberOfCardsForm.input.value;
      if (!inputValue) {
        return;
      }

      const validNumber = checkOnValidation(inputValue);
      if (!validNumber) {
        numberOfCardsForm.input.value = '4';
      } else {
        numberOfCardsForm.input.value = '';
        numberOfCardsForm.button.disabled = true;
        timerId = setTimeout(() => {
          alert('Время игры закончилось');
          window.location.reload();
        }, 180000);
        startOfGame(Math.pow(validNumber, 2));
      }
    });
  }

  function checkOnValidation(numb) {
    if (numb > 1 && numb < 11) {
      if (!(numb % 2)) {
        return numb;
      }
    }
    return null;
  }

  function shuffle(array) { // Перемешиваем значения в массиве по методу Фишера-Йетса
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
      let t = array[i];
      array[i] = array[j];
      array[j] = t;
    }
    return array;
  }

  function createCardList() {   // Создание блока для карточек, ненумерованный список
    const list = document.createElement('ul');
    list.classList.add('cards_list');
    return list;
  }

  function createCard(idValue, numberOfCards) {  // Создает и возвращает карточку с атрибутами
    const containerWidth = document.querySelector('.main').offsetWidth; // Берем ширину контейнера
    const cardWidth = containerWidth * 0.85 / (Math.sqrt(numberOfCards)); // Расчет ширины карточки
    const card = document.createElement('li');
    const button = document.createElement('button');

    card.classList.add('card');
    card.setAttribute("style", `width: ${cardWidth}px; height: ${cardWidth}px;`);
    button.classList.add('btn');
    button.id = idValue;
    button.setAttribute("style", `font-size: ${cardWidth * 0.7}px;`)

    card.append(button);

    return {
      card,
      button,
    };
  }

  let numberOfCoincidences = 0; // Счетчик совпавших пар

  function startOfGame(numberOfCards) {
    // Создаем массив пар цифр расположенных в случайном порядке
    const arrayOfCards = [];
    let valueOfCards = numberOfCards / 2;

    for (let i = 0; i < numberOfCards; ++i) {
      arrayOfCards.push(valueOfCards);
      if (i % 2) {
        --valueOfCards;
      }
    }

    const shuffledArray = shuffle(arrayOfCards); // Перемешиваем массив

    createListOfCards(numberOfCards, shuffledArray); // Создаем карточки и вешаем обработчик
  }

  // Создаем список карточек
  function createListOfCards(numberOfCards, shuffledArray) {
    const section = document.querySelector('.main');
    const listOfCards = createCardList();

    for (let i = 0; i < numberOfCards; ++i) {
      let currentCard = createCard(i, numberOfCards);
      listOfCards.append(currentCard.card);
      currentCard.button.addEventListener('click', () => {
        let valueOfCard = shuffledArray[currentCard.button.id];
        currentCard.button.innerHTML = valueOfCard;
        comparePairs(currentCard, valueOfCard);
        if (numberOfCards === numberOfCoincidences * 2) {  // Проверка на достижение конца игры
          playAgain(); // Функция повтора игры
        }
      });
    }
    section.append(listOfCards);
  }

  let firstNumberObj = {}; // Для записи значения первой карточки {card: currentCard, value: valueOfCards}
  let secondNumberObj = {}; // Для записи значения второй карточки
  let isEqual = false;

  function comparePairs(card, value) {  // Сравниваем значения карточек, показываем / скрываем их
    if (!Object.keys(firstNumberObj).length) {  // Если значение первой карточки пусто записываем переданное значение в эту карточку
      firstNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
    } else if (!Object.keys(secondNumberObj).length) { // Если значение второй карточки пусто записываем переданное значение в эту карточку
      secondNumberObj = {
        card: card,
        value: value,
      };
      card.button.setAttribute('disabled', 'true');
      if (firstNumberObj.value === secondNumberObj.value) {
        isEqual = true;
        ++numberOfCoincidences;
        return;
      }
    } else {  // Если есть значение и первой и второй карточки
      if (!isEqual) {
        firstNumberObj.card.button.innerHTML = '';
        secondNumberObj.card.button.innerHTML = '';
        firstNumberObj.card.button.removeAttribute('disabled');
        secondNumberObj.card.button.removeAttribute('disabled');
      } else {
        isEqual = false;
      }

      firstNumberObj = {
        card: card,
        value: value,
      };

      card.button.setAttribute('disabled', 'true');
      secondNumberObj = {};
    }
  }

  function playAgain() {
    const section = document.querySelector('.main');
    const button = document.createElement('button');
    alert('Вы победитель!');
    button.innerText = 'Сыграть ещё раз';
    button.classList.add('btn-1');
    section.after(button);

    clearTimeout(timerId);

    button.addEventListener('click', () => {
      console.log('Играем ещё раз!');
      window.location.reload();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    getNumberOfCards();
  });
})();
