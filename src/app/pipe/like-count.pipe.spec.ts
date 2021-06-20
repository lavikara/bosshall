import {LikeCountPipe} from './like-count.pipe';

describe('LikeCountPipe', () => {
    it('create an instance', () => {
        const pipe = new LikeCountPipe();
        expect(pipe).toBeTruthy();
    });
});
