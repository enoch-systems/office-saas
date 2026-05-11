declare module 'jsvectormap' {
    interface JsVectorMapOptions {
        map?: string;
        [key: string]: unknown;
    }
    
    const jsVectorMap: (container: string | HTMLElement, options?: JsVectorMapOptions) => void;
    export default jsVectorMap;
}
