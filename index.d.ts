
// @ts-nocheck - Everything pass this line is manually written and not auto generated!
declare global {
    var React: typeof import("react");
    var ReactNative: typeof import("react-native");

    /** This object in this scope is exclusive to this plugin and is not the same as `global.bunny` */
    let bunny: BunnyObject & { plugin: BunnyPluginProperty; };

    /** This only exists in plugin's scope, useful for typings */
    let definePlugin: (p: PluginInstance) => PluginInstance;

    interface Window {
        bunny: BunnyObject;
    }
}

export type BunnyObject = typeof import(".");
