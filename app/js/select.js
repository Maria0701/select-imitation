(function() {
    const selectedForm = document.querySelector('[data-selector="selector"]');
    if (!selectedForm) return;
    const selectedInput = selectedForm.querySelector('[data-selector="search"]');
    const allOptions = selectedForm.querySelectorAll('label');
    let selectedOptions = [...allOptions].slice();
    const listToSelect = selectedForm.querySelector('[data-selector="list"]');
    let currentIndex = 0;
    let flag = false;

    const closeSelect = function() {
        listToSelect.style.display = 'none';
        listToSelect.style.visibility = 'hidden';
        selectedInput.removeEventListener('keyup', searchHandler);
        listToSelect.removeEventListener('click', inputChanger);
        listToSelect.removeEventListener('keydown', keydownHandler);
        document.removeEventListener('click', outOfAreaHandler);
        document.removeEventListener('keydown', outOfAreaHandler);
        selectedInput.addEventListener('focus', focusInHandler);

    }
    
    const outOfAreaHandler = function(evt) {
        if (selectedForm.contains(evt.target)) return;
        closeSelect();
    }

    const focusInHandler = function(evt) {
        if (flag) selectedInput.removeEventListener('keydown', focusInHandler);
        listToSelect.style.display = 'flex';
        listToSelect.style.visibility = 'visible';
        selectedInput.addEventListener('keyup', searchHandler);
        listToSelect.addEventListener('click', inputChanger);
        listToSelect.addEventListener('keydown', keydownHandler);
        document.addEventListener('click', outOfAreaHandler);
        document.addEventListener('keydown', outOfAreaHandler);
        selectedInput.removeEventListener('focus', focusInHandler);
    }

    const keydownHandler = function(evt) {
        const target = evt.target;
        const label = target.closest('label');
        currentIndex = selectedOptions.indexOf(label);

        switch (evt.keyCode) {
        case 13: 
            evt.preventDefault();
            // при клике на энтер по лэйблу выбираем элемент
            if (label) insertValueInToInput(label.textContent);
        break;    
        case 27:
            // при эскейпе закрываем окно, отключаем слушатели
            evt.preventDefault();
            closeSelect(); 
            break;
        case 40:
            // при управлении стрелкой вниз
            evt.preventDefault();
            if (label) { // если находимся на лэйбле - фокусируемся на следуещем элементе
                if (currentIndex === selectedOptions.length - 1) return;
                currentIndex += 1;
                selectedOptions[currentIndex].focus();
            } 
            break;
        case 38:
            // при управлении стрелкой вверх
            evt.preventDefault();
            if (label) { // если находимся на лэйбле - фокусируемся на предыдущем
                if (currentIndex === 0) return;
                currentIndex -= 1;
                selectedOptions[currentIndex].focus();
            }
            break;           
        }
    }

    const unCheckItem = () => {
        const checkedItem = [allOptions].find(item => item.checked);
        if (checkedItem) checkedItem.checked = false;
    };

    const searchHandler = function(evt) {
        switch (evt.keyCode) {
            case 40:
                if (currentIndex === selectedOptions.length - 1) return;
                unCheckItem();
                selectedInput.value = selectedOptions[currentIndex].textContent;
                selectedOptions[currentIndex].checked = true;
                currentIndex += 1;
                break;
            case 38:     
                if (currentIndex === 0) return;
                unCheckItem();
                selectedInput.value = selectedOptions[currentIndex].textContent;
                selectedOptions[currentIndex].checked = true;
                currentIndex -= 1;
                break;
            default:
                let val = evt.target.value.toLowerCase()
                const selectedElems = [...allOptions].filter(elem => elem.textContent
                    .toLowerCase().indexOf(val) !== -1);
                allOptions.forEach(item => [...selectedElems].includes(item) 
                    ? item.style.display = 'block' 
                    : item.style.display = 'none');

                if ([...selectedElems].length === 1 && selectedElems[0].textContent.toLowerCase() === val) {
                    selectedElems[0].checked = true;
                    insertValueInToInput(selectedElems[0].textContent);
                    flag = true;   
                    selectedInput.addEventListener('keydown', focusInHandler);  
                }
            selectedOptions = selectedElems.slice();
        }       
    }
    
    const insertValueInToInput = function(value) {
        selectedInput.value = value;
        closeSelect(); 
    }    

    const inputChanger = function(evt) {
        if (evt.target.type = 'checkbox') {
            insertValueInToInput(evt.target.closest('label').textContent);
        }
    }

    selectedInput.addEventListener('focus', focusInHandler);
})();