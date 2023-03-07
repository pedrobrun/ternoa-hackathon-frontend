/* eslint-disable vars-on-top */
/* eslint-disable no-var */

// https://stackoverflow.com/questions/68481686/type-typeof-globalthis-has-no-index-signature

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface global {
  isRNApp: boolean
}

declare global {
  var isRNApp: boolean
  var ReactNativeWebView: {
    postMessage(msg: string): void
  }
}
