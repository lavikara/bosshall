export interface UIListener {
    addListener(type: string, fnc: (event) => void);
}
