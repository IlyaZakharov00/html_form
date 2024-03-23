import { Popover } from "./popover";

document.addEventListener("DOMContentLoaded", () => {
  console.log("загружено");

  const popover = new Popover(); //создаем экземпляр Popover

  const form = document.querySelector(".form"); // ищем форму
  const children = form.elements;

  let password;
  let confirmation;

  const getError = (element) => {
    element.setCustomValidity(""); // убираем кастомные сообщения

    const errorKey = Object.keys(ValidityState.prototype).find((checkItem) => {
      //поиск item который выдаст true
      if (!element.name) return; // пропускаем кнопки и подтверждение пароля

      if (checkItem === "valid") return; // если в checkitem попадает строка 'valid'

      if (
        password !== confirmation &&
        element.name == "confirmation" &&
        confirmation !== ""
      ) {
        // если пароли отличаются и имя элемента confirmation

        console.log(
          element,
          checkItem,
          element.validity,
          element.validity[checkItem]
        );
        return checkItem;
      }

      if (element.validity[checkItem]) {
        // если у элемента где то в объектке validity значение true то форма невалидна
        console.log(
          element,
          checkItem,
          element.validity,
          element.validity[checkItem]
        );

        return checkItem;
      }
    });
    if (!errorKey) return;
    return errorKey;
  };

  const errors = {
    // объект с возможными ошибками и нашим message на них

    login: {
      valueMissing: "Напишите пожалуйста свой логин!",
      title: "Ошибка в поле login",
    },
    email: {
      valueMissing: "Напишите пожалуйста свою электронную почту!",
      typeMismatch: "Кажется, это не электронная почта!",
      title: "Ошибка в поле email",
    },
    password: {
      valueMissing: "Напишите пожалуйста свой пароль!",
      title: "Ошибка в поле password",
    },
    confirmation: {
      customError: "Кажется, пароли не совпадают",
      valueMissing: "Подтвердите пожалуйста свой пароль!",
      title: "Ошибка в поле cofirmation",
    },
    tel: {
      valueMissing: "Напишите пожалуйста свой телефон!",
      title: "Ошибка в поле tel",
    },
  };

  let activePopover = []; // массив с активными ошибками

  const showMessage = (element, check) => {
    if (element.name == "confirmation" && confirmation == "") {
      activePopover.push({
        //создадим объект ошибки
        name: element.name,
        id: popover.showPopover(
          element,
          errors[element.name]["title"],
          errors[element.name][check]
        ), // показываем сообщение об ошибке. И метод класса вернет id ошибки
      }); // пушим в массив с активными ошибками
    } else if (password !== confirmation) {
      activePopover.push({
        //создадим объект ошибки
        name: element.name,
        id: popover.showPopover(
          element,
          errors[element.name]["title"],
          errors[element.name]["customError"]
        ), // показываем сообщение об ошибке. И метод класса вернет id ошибки
      }); // пушим в массив с активными ошибками
    } else {
      activePopover.push({
        //создадим объект ошибки
        name: element.name,
        id: popover.showPopover(
          element,
          errors[element.name]["title"],
          errors[element.name][check]
        ), // показываем сообщение об ошибке. И метод класса вернет id ошибки
      }); // пушим в массив с активными ошибками
    }
    // activePopover.push(error); // пушим в массив с активными ошибками
  };

  form.addEventListener("submit", (e) => {
    // подписались на отправку формы

    e.preventDefault(); //убираем настройки по умолчанию

    activePopover.forEach((obj) => {
      popover.removePopover(obj); //перед валдиацией удалим все сообщения об ошибках
    });
    activePopover = []; // и обнулим массив с активными ошибками

    if (form.checkValidity() && password === confirmation) {
      //если формавалидна
      console.log("valid");
    } else console.log("invalid");

    const elements = form.elements; // ищем детей у формы

    [...elements].some((element) => {
      //преобразовав коллекцию в массив проверяем есть ли в validity какой нибудь true. Проходимся по всем элементам формы
      const error = getError(element);
      if (error) {
        showMessage(element, error);
        // return true;
      }
    });
  });

  const inputOnBlur = (el) => {
    // колбэк блюра
    if (activePopover.length !== 0) {
      //удаляем показанные ошибки при потере блюра. чтобы не копилась куча
      activePopover.forEach((item) => popover.removePopover(item)); //для каждой из активных ошибок вызываем метод ее удаления
      activePopover = [];
    }
    password = document.querySelector("[name='password']").value; // ищем значение в поле пароля
    confirmation = document.querySelector("[name='confirmation']").value; // ищем значения в поле подтверждения пароля

    let element = el.target; // элемент на котором произошел блюр
    let error = getError(element); // получаем ошибку этого элемента
    if (error) {
      showMessage(element, error); // если есть ошибка, то показываем сообщение
    } else {
      // иначе ищем уже существующую ошибку
      let activeError = activePopover.filter(
        (item) => item.name === element.name
      ); // создаем массив с ошибками который исправлен
      if (activeError) {
        //если есть существующая ошибка то
        activeError.forEach((item) => popover.removePopover(item)); //для каждой из активных ошибок вызываем метод ее удаления
        activePopover = activePopover.filter(
          (item) => item.name !== element.name // перезаписываем массив активных ошибок исключая исправленные
        );
      }
    }

    element.removeEventListener("blur", inputOnBlur); // отписываемся от блюра
  };

  [...form.elements].forEach((element) => {
    //для каждого элемента формы навешиваем слушатель на фокус
    element.addEventListener("focus", () => {
      // отслеживаем фокус на инпуте и подписываемся на блюр инпута
      element.addEventListener("blur", inputOnBlur);
    });
  });

  window.addEventListener("beforeunload", () => {
    const formData = {}; // создаем объект даты
    [...form.elements].forEach((element) => {
      if (!element.name) return; //кнопки пропускаем
      formData[element.name] = element.value; // для каждого инпута записываем значение
    });
    localStorage.setItem("formData", JSON.stringify(formData)); // отправляем в localstorage
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const data = localStorage.getItem("formData"); // получаем с localstorage данные
  const form = document.querySelector(".form"); // найдем форму
  let formData;
  try {
    formData = JSON.parse(data); //пытаем распарсить данные
  } catch (error) {
    console.log(error); // если что ошибка
  }
  if (formData) {
    // если распарсить получилось
    Object.keys(formData).forEach((key) => {
      //для каждого ключа в записанных данных ищем в форме селекторы с данным ключом и записваем туда значение которое находится в formData под этим ключом
      form.querySelector(`[name="${key}"]`).value = formData[key];
    });
  }
});
