export class Popover {
  constructor() {
    this.popovers = []; // массив со всеми сообщениями
  }

  showPopover(element, title, message) {
    const popoverContainer = document.createElement("div"); // создаем popover
    const popoverElementMessage = document.createElement("div"); // создаем блок с сообщением
    const popoverElementTitle = document.createElement("div"); // создаем блок с названием
    const popoverElementArrow = document.createElement("div"); // создаем блок с названием

    popoverContainer.classList.add("form-error"); // добавляем класс form-error
    popoverElementMessage.classList.add("form-error-text"); // добавляем класс form-error-text
    popoverElementTitle.classList.add("form-error-title"); // добавляем класс form-error
    popoverElementArrow.classList.add("form-error-arrow"); // добавляем класс form-error

    popoverElementMessage.textContent = message; // добавляем в него сообщение
    popoverElementTitle.textContent = title; // добавляем в него сообщение

    const id = performance.now(); // id

    this.popovers.push(
      //пушим объект в массив со всеми popover
      {
        id,
        element: popoverContainer,
      }
    );
    popoverContainer.appendChild(popoverElementArrow); //добавляем стрелку название в контейнер
    popoverContainer.appendChild(popoverElementTitle); //добавляем название в контейнер
    popoverContainer.appendChild(popoverElementMessage); //добавляем сообщение в контейнер
    document.body.appendChild(popoverContainer); //добавляем контейнер в body

    const { right, top, bottom, left } = element.getBoundingClientRect(); //координаты верхнего и правого края элемента на котором возникла ошибка

    popoverContainer.style.top =
      top + element.offsetHeight / 2 - popoverContainer.offsetHeight / 2 + "px"; // считаем верхнюю границу ошибки
    popoverContainer.style.left = right + 23 + "px"; // считаем левую границу ошибки

    let { height } = popoverContainer.getBoundingClientRect();
    popoverElementArrow.style.top = height / 2 - 8 + "px";
    return id; //возвращаем id
  }

  removePopover(obj) {
    const popover = this.popovers.find((element) => element.id === obj.id); // ищем popover в массиве по id
    // console.log(popover);
    popover.element.remove(); //и удаляем его
    this.popovers = this.popovers.filter((element) => element.id !== obj.id); //фильтруем массив и убираем удаленный элемент по id
  }
}
