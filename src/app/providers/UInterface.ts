import {UiOption} from './UiOption';

export interface UInterface {
    draw(container: HTMLElement, option?: UiOption);
    update(data: string);
    uiClass();
}
