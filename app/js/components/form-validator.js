export class ValidateForm {
    constructor(form) {
        this.form = form;
        this.formElements = this.form.elements;
        this.invalidities = [];
        this.handleEvent = this.handleEvent.bind(this);
        this.init();        
    }

    init() {
        [...this.formElements][0].focus();         
        this.setEventListeners();     
    }
    
    setEventListeners() { 
        [...this.formElements].forEach(input => {
            input.addEventListener('blur', this.handleEvent);
            input.addEventListener('focus', this.handleEvent);
        });
    }

    handleEvent(evt) {        
        const target = evt.target.closest('input'); 
        if (!target) return;
        switch(evt.type) {
            case 'blur':
                return this.checkValidity(target);
            case 'focus':
                return this.clearMistakes(target);
        }
    }

    checkField(input) { 
        if (!input.required) return; 
        const validity = input.validity;

        if (validity.valueMissing) {            
            this.setCustomValidity('Поле обязательно для заполнения');
        }

        if (validity.patternMismatch) {
            this.setCustomValidity('Неправильный формат ввода');
        }

        if (validity.typeMismatch) {
            this.setCustomValidity('Неправильный формат ввода');
        }
        
        if (!validity.valueMissing && input.name === 'email' && !this.checkEmail(input)) {
            this.setCustomValidity('Почта должна содержать @');
        }
    }

    checkEmail(input) {
        return input.value.indexOf('@') !== -1;
    }

    setCustomValidity(message) {
        this.invalidities.push(message);
    }

    getErrors() {
        return this.invalidities.join(',');
    }

    checkValidity(input) {
        this.checkField(input);
        if (this.invalidities.length) {
            input.classList.add('invalid');
            input.value = '';
            input.placeholder = '';            
            input.placeholder = this.getErrors();
            this.invalidities = [];
        }        
    }

    clearMistakes(input) {
        if (input.classList.contains('invalid')) {
            input.classList.remove('invalid');
            input.placeholder = '';
            this.invalidities = [];
        }
    }

    sendForm(evt) {
        evt.preventDefault();
        this.form.reset();
        this.removeEventListeners();
        return alert('Форма заполнена корректно');
    }

    removeEventListeners() {
        [...this.formElements].forEach(input => {
            input.removeEventListener('blur', this.handleEvent);
            input.removeEventListener('focus', this.handleEvent);
        });
    }
}