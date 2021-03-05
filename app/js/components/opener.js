export class Opener {
    constructor(opener, target = null) {
        this.opener = opener;
        this.oppenedClass = 'oppened';
        this.parent = this.opener.parentElement;
        this.openHandler = this.openHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.outOfAreaHandler = this.outOfAreaHandler.bind(this);
        this.target = target || this.parent;
        this.setListeners();
    }

    setListeners() {
        this.opener.addEventListener('click', this.openHandler);
    }

    openHandler(evt) {
        evt.preventDefault();
        this.parent.classList.add(this.oppenedClass);
        document.addEventListener('click', this.outOfAreaHandler);
        this.opener.removeEventListener('click', this.openHandler);
        this.opener.addEventListener('click', this.closeHandler);
    }

    closeHandler() {
        this.parent.classList.remove(this.oppenedClass);
        document.removeEventListener('click', this.outOfAreaHandler);
        this.opener.removeEventListener('click', this.closeHandler);
        this.opener.addEventListener('click', this.openHandler);
    }

    outOfAreaHandler(evt) {
        const activeElement = document.querySelector(`.${this.oppenedClass}`);
        if (activeElement && !this.target.contains(evt.target) && !this.opener.contains(evt.target)) {
            this.closeHandler();        
        } 
    }
}