declare module '*.scss';
declare global {
    interface Window {
        $: JQuery;
    }
}