'use strict'
// Файл содержит собственноручно написанные методы (как в Jquery).

// Класс для работы с DOM.
class Js {
    constructor() {}

    // Возвращает DOM-элемент, соответствующий переданному селектору.
    // Если ничего не найдено, возвращает undefined.
    // @selector - селектор.
    get(selector) {
        if (selector[0] == '#') return document.getElementById(selector.slice(1));

        let elements;
        if (selector[0] == '.') {
            elements = document.getElementsByClassName(selector.slice(1));
        } else {
            elements = document.getElementsByTagName(selector);
        }

        if (elements.length == 0) return;
        if (elements.length == 1) return elements[0];
        return elements;
    }

    // Возвращает первый найденный элемент, соответствующий селектору.
    // @selectors - строка селекторов.
    query(selectors) {
        return document.querySelector(selectors);
    }

    // Возвращает массив элементов, соответствующих селектору.
    // @selectors - строка селекторов.
    queryAll(selectors) {
        let elements = document.querySelectorAll(selectors);
        if (elements.length == 1) return elements[0];
        return elements;
    }

    tap(elements, callback) {
        js.listen(elements, 'click', function(event) {
            if (!isTap(this, event)) return;

            callback.bind(this, event)();
        });
    }

    // Навешивает обработчик на элементы.
    // @elements - элемент или массив элементов.
    // @events - имена событий.
    // @listener - обработчик.
    listen(elements, events, listener) {
        if (!elements || (elements != window &&
                elements.length != undefined && elements.length == 0))  return;

        events = events.split(' ');
        if (elements.length) {
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue;
                events.forEach((event) => {
                    elements[i].addEventListener(event, listener);
                });
            }
        } else {
            events.forEach((event) => {
                elements.addEventListener(event, listener);
            });
        }
    }

    // удаление слушателя событий
    // передовать название функции для удаления
    unlisten(elements, events, listener) {
        if (!elements || (elements != window &&
                elements.length != undefined && elements.length == 0))  return;

        events = events.split(' ');
        if (elements.length) {
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i]) continue;
                events.forEach((event) => {
                    elements[i].removeEventListener(event, listener);
                });
            }
        } else {
            events.forEach((event) => {
                elements.removeEventListener(event, listener);
            });
        }
    }

    // Возвращает или устанавливает css-свойство.
    // @elements - один или более DOM-элементов.
    // @property - css-свойство, которое требуется прочитать или установить
    // @value - значение, в которое будет установлено свойство.
    // Если параметр value не передан, метод возращает текущее значение.
    css(elements, property, value) {
        if (!elements) return;

        if (value) {
            this._setCss(elements, property, value);
            return;
        }

        return this._getCss(elements, property);
    }

    // Возвращает или устанавливает значение атрибута.
    // @elements - один или более DOM-элементов.
    // @name - имя атрибута.
    // @value - значение атрибута. Если не передано, метод возращает текущее значение.
    attr(elements, name, value) {
        if (!elements) return;

        if (value) {
            this._setAttr(elements, name, value);
            return;
        }

        return this._getAttr(elements, name);
    }

    // Удаляет атрибут.
    // @elements - один или более DOM-элементов.
    // @name - имя атрибута.
    removeAttr(elements, name) {
        if (!elements) return;
        if (!elements.length) return elements.removeAttribute(name);

        for (let i = 0; i < elements.length; i++) {
            elements[i].removeAttribute(name);
        }
    }

    // Добавляет css-класс переданным элементам.
    // @elements - элемент или массив элементов.
    // @class_name - имя css-класса.
    addClass(elements, class_name) {
        if (!elements || elements.length == 0) return;

        if (!elements.length) {
            elements.classList.add(class_name);
            return;
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add(class_name);
        }
    }

    // Удаляет css-класс у переданных элементов.
    // @elements - элемент или массив элементов.
    // @class_name - имя css-класса.
    removeClass(elements, class_name) {
        if (!elements || elements.length == 0) return;

        if (!elements.length) {
            elements.classList.remove(class_name);
            return;
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove(class_name);
        }
    }

    // Добавляет или удаляет класс у css-элементов.
    // @elements - элемент или массив элементов.
    // @class_name - имя css-класса.
    toggleClass(elements, class_name) {
        if (!elements || elements.length == 0) return;

        if (!elements.length) {
            if (elements.classList) elements.classList.toggle(class_name);
            return;
        }

        for (let i = 0; i < elements.length; i++) {
            if (elements[i].classList) elements[i].classList.toggle(class_name);
        }
    }

    // Возвращает true, если переданный элемент имеет указанный класс.
    // @element - DOM-элемент.
    // @class_name - имя класса.
    hasClass(element, class_name) {
        if (!element || !element.classList) return;
        return element.classList.contains(class_name);
    }

    // Скрывает элементы.
    // @elements - один или более DOM-элементов.
    hide(elements) {
        if (!elements) return;

        this.css(elements, 'display', 'none');
    }

    // Показывает элементы.
    // @elements - один или более DOM-элементов.
    show(elements) {
        if (!elements) return;
        if (!elements.length) return elements.style.removeProperty('display');

        for (let i = 0; i < elements.length; i++) {
            elements[i].style.removeProperty('display');
        }
    }

    // Удаляет всех потомков данных элементов.
    // @elements - один или более DOM-элементов.
    empty(elements) {
        if (!elements) return;

        if (!elements.length) {
            elements.innerHTML = '';
            return;
        }

        let element_array = Array.prototype.slice.apply(elements);
        for (let i = 0; i < element_array.length; i++) {
            this._deleteChildren(element_array[i]);
        }
    }

    // Удаляет элементы.
    // @elements - один или более DOM-элементов.
    remove(elements) {
        if (!elements) return;
        if (!elements.length) return elements.remove();

        let element_array = Array.prototype.slice.apply(elements);
        for (let i = 0; i < element_array.length; i++) {
            element_array[i].remove();
        }
    }

    // Возвращает true, если элемент виден, иначе - false.
    // @element - DOM-элемент.
    isVisible(element) {
        return element.offsetWidth > 0 || element.offsetHeight > 0;
    }

    // Возвращает Dom элемент
    // @html - текст html
    getDomElement(html) {
        let div = document.createElement('div');
        div.innerHTML = html;
        return div.children;
    }

    // Добавляет в html детей
    // @block - куда вставлять
    // @children - элементы, которые нужно вставить
    append(block, children) {
        let length = children.length;
        for (let i = 0; i < length; i++) {
            block.appendChild(children[0]);
        }
    }

    // Вспомогательный метод, возвращающий значение css-свойства.
    // @elements - один или более DOM-элементов.
    // @property - css-свойство.
    _getCss(elements, property) {
        let element;
        if (!elements.length) element = elements;
        else element = elements[0];

        let style = window.getComputedStyle(element);
        let computed_value = style.getPropertyValue(property);
        return computed_value;
    }

    // Вспомогательный метод, устанавливающий значение css-свойства.
    // @elements - один или более DOM-элементов.
    // @property - css-свойство.
    // @value - значение, в которое будет установлено свойство.
    _setCss(elements, property, value) {
        if (!elements.length) {
            elements.style[property] = value;
            return;
        }

        for (let i = 0; i < elements.length; i++) {
            elements[i].style[property] = value;
        }
    }

    // Вспомогательный метод, возвращающий значение атрибута.
    // @elements - один или более DOM-элементов.
    // @name - имя атрибута.
    _getAttr(elements, name) {
        if (!elements.length) return elements.getAttribute(name);
        return elements[0].getAttribute(name);
    }

    // Вспомогательный метод, устанавливающий значение атрибута.
    // @elements - один или более DOM-элементов.
    // @name - имя атрибута.
    // @value - значение атрибута.
    _setAttr(elements, name, value) {
        if (!elements.length) elements.setAttribute(name, value);

        for (let i = 0; i < elements.length; i++) {
            elements[i].setAttribute(name, value);
        }
    }

    // Вспомогательный метод, удаляющий всех потомков элемента.
    // @element - DOM-элемент.
    _deleteChildren(element) {
        // С lastChild работает быстрее, чем с firstChild.
        while (element.lastChild) {
            element.removeChild(element.lastChild);
        }
    }
}

// Класс, содержащий методы для отправки get- и post-запросов.

class Request {
    constructor() {
        // Время, в течение которого ждём ответ от сервера.
        this._timeout = 30000;
    }

    // Отправляет get-запрос.
    // @url - адрес, на который отправляется запрос.
    // @callback - коллбэк. Вызывается, когда пришёл ответ с сервера.
    // Первым параметром callback принимает error, вторым - data.
    // Коды ошибок:
    get(url, callback, timeout) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.withCredentials = true;

        if (!timeout) xhr.timeout = this._timeout;
        else xhr.setTimeout = timeout;

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                let response = xhr.responseText;
                try {
                    response = JSON.parse(response);
                } catch (err) {

                }

                if (callback) callback(null, response);
            } else if (xhr.status) {
                if (callback) callback(xhr.status, xhr.responseText);
            }
        }

        xhr.ontimeout = (e) => {
            if (callback) callback(408);
        }

        xhr.onerror = () => {
            if (callback) callback(408);
        }

        xhr.send();
    }

    // Отправляет post-запрос.
    // @url - адрес, на который отправляется запрос.
    // @object - объект, посылаемый на указанный url.
    // @callback - коллбэк. Вызывается, когда пришёл ответ с сервера.
    // Первым параметром callback принимает error, вторым - data.
    post(url, object, callback, timeout) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);
        xhr.withCredentials = true;

        if (!timeout) xhr.timeout = this._timeout;
        else if (timeout) xhr.setTimeout = timeout;

        let data;
        try {
            if (!object) object = {};
            data = JSON.stringify(object);
            xhr.setRequestHeader('Content-type', 'application/json');
        } catch (err) {
            data = object;
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                let response = xhr.responseText;
                try {
                    response = JSON.parse(response);
                } catch (err) {

                }
                if (callback) callback(null, response);
            } else if (xhr.status) {
                if (callback) callback(xhr.status, xhr.responseText);
            }
        }

        xhr.ontimeout = () => {
            if (callback) callback(408);
        }

        xhr.onerror = () => {
            if (callback) callback(408);
        }

        xhr.send(data);
    }
}

const js = new Js();
const request = new Request();