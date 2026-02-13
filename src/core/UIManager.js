
export class UIManager {
    constructor() {
        this.uiLayer = document.getElementById('ui-layer');
        this.currentUI = null;
    }

    createUI(id, htmlContent) {
        const container = document.createElement('div');
        container.id = `ui-${id}`;
        container.className = 'scene-ui';
        container.innerHTML = htmlContent;
        this.uiLayer.appendChild(container);
    }

    showUI(id) {
        if (this.currentUI) {
            this.currentUI.classList.remove('active');
        }

        const nextUI = document.getElementById(`ui-${id}`);
        if (nextUI) {
            nextUI.classList.add('active');
            this.currentUI = nextUI;
        }
    }
}
