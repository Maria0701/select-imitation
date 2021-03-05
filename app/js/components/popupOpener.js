import { ValidateForm } from "./form-validator";

export class popupOpener {
    constructor(opener) {
        this.className = 'popup';
        this.openName = 'popup--active';
        this.overlayElement = document.querySelector('.overlay');        
        this.opener = opener;
        this.form = null;
        this.popupElement = document.querySelector(`.${this.className}`);
        this.closeElement = this.popupElement.querySelector(`.${this.className}__close`);
        this.openPopupHandler = this.openPopupHandler.bind(this);
        this.closePopupHandler = this.closePopupHandler.bind(this);
        this.outOfAreaHandler = this.outOfAreaHandler.bind(this);
        this.sendFormHandler = this.sendFormHandler.bind(this);
        this.setListener();
    }

    setListener() {
        this.opener.addEventListener('click', this.openPopupHandler);        
    }

    openPopupHandler(evt) {
        this.popupElement.classList.add(`${this.openName}`);
        this.overlayElement.classList.add('overlay--active');
        this.closeElement.addEventListener('click', this.closePopupHandler);
        document.addEventListener('click', this.outOfAreaHandler);
        this.form = new ValidateForm(this.popupElement.querySelector('form'));
        this.form.form.addEventListener('submit', this.sendFormHandler);
    }

    closePopupHandler(evt) {
        this.popupElement.classList.remove(`${this.openName}`);
        this.overlayElement.classList.remove('overlay--active');
        this.closeElement.removeEventListener('click', this.closePopupHandler);
        document.removeEventListener('click', this.outOfAreaHandler);
        this.form.form.removeEventListener('submit', this.sendFormHandler);
        this.form = null;
    }

    outOfAreaHandler(evt) {
        if (this.popupElement.contains(evt.target) || this.opener.contains(evt.target)) return;
        this.closePopupHandler();      
    }

    sendFormHandler(evt) {
        this.form.sendForm(evt);
        setTimeout(() => {
            this.closePopupHandler();
        }, 1000);
    }
}