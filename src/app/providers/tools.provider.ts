import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ToolsProvider {

    static setupEmojiContainer() {
        const classList = 'initialized';

        let appendEmoji = () => {};
        // tslint:disable-next-line:no-shadowed-variable
        const mutationCallback = (mutationsList: any, observer: any) => {
            const emojiContainer = document.querySelector('.js-emoji-container');
            if (
                !document.contains(emojiContainer) &&
                emojiContainer &&
                emojiContainer.classList &&
                !emojiContainer.classList.contains(classList)
            ) {
                appendEmoji();
            }
        };

        const config = {attributes: true, childList: true, subtree: true};



        const observer = new MutationObserver(mutationCallback);
        appendEmoji = () => {
            const emojiContainers = document.querySelectorAll('.js-emoji-container');
            observer.disconnect();
            emojiContainers.forEach((el: HTMLElement) => {
                el.classList.add(classList);
                el.addEventListener('mouseover', (event) => {
                    (el.querySelector('.js-emoji-hover') as HTMLElement).style.display = 'block';
                }, false);

                el.addEventListener('mouseleave', (event) => {
                    (el.querySelector('.js-emoji-hover') as HTMLElement).style.display = 'none';
                });

            });
        };

        appendEmoji();
        observer.observe(document, config);
    }


}
