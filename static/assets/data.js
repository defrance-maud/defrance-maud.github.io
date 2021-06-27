(function (window, document) {
    const key = '9F9065DF7DC53AE2D4670530312E3FF3273892C45E6F14ACEDFCF04FC6C5C5F1';

    init();

    function init() {
        try {
            initPrint();
            requestData();
        } catch (error) {
            console.error(error);
        }
    }

    function initPrint() {
        const printHash = '#imprimer';
        const printButtons = document.querySelectorAll('[data-target="print"]');
        let index = printButtons.length;
        if (index > 1) {
            while (--index >= 0) {
                printButtons[index].href = printButtons[index].dataset['url'] + printHash;
            }
        } else {
            while (--index >= 0) {
                printButtons[index].addEventListener('click', (event) => {
                    event.preventDefault();
                    window.print();
                });
            }
        }

        if (document.location.hash === printHash) {
            window.print();
            window.history.replaceState('', document.title, window.location.pathname
                + window.location.search);
        }
    }

    function requestData() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = dataReceived;
        xhttp.open('GET', '/assets/data.json', true);
        xhttp.send();
    }

    function dataReceived() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            displayData(data);
        }
    }

    function displayData(data) {
        var index, item, element;

        for (index = 0; index < data.length; index++) {
            item = data[index];
            element = document.getElementById(item.id);
            if (element) {
                element.innerText = decryptCodes(item.text, key);

                if (item.link) {
                    element.href = decryptCodes(item.link, key);
                }
            }
        }
    }

    function encryptCodes(content, passcode) {
        var calAscii, result = '';

        for (var i = 0; i < content.length; i++) {
            calAscii = (content.charCodeAt(i) + passcode.charCodeAt(i % passcode.length));
            result += String.fromCharCode(calAscii);
        }

        return btoa(result);
    }

    function decryptCodes(content, passcode) {
        var calAscii, result = '';
        var data = atob(content);

        for (var i = 0; i < data.length; i++) {
            calAscii = (data.charCodeAt(i) - passcode.charCodeAt(i % passcode.length));
            result += String.fromCharCode(calAscii);
        }

        return result;
    }
})(window, document);