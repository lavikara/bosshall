import {SpreadStatusEnum} from './configuration/Spread.config';

const address = 'bosshalls.com';
const isSecure = true;

export const appConfig = {
    socket: `${(isSecure ? 'wss://' : 'ws://')}${address}`,
    host: `${(isSecure ? 'https' : 'http')}://${address}/`,
    captcha: '6LemvrQUAAAAANKnictTSuXOv4_yfkVOQ-YmzTVT',
    openTok: {},
    spread: SpreadStatusEnum,
};

//
// export const appConfig = {
//     socket: `ws://localhost:9000`,
//     host: `http://localhost:4522/`,
//     captcha: '6LemvrQUAAAAANKnictTSuXOv4_yfkVOQ-YmzTVT',
//     openTok: {},
//     spread: SpreadStatusEnum,
// };
