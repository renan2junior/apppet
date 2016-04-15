angular.module('starter.configs', [])

.constant('WS_FIREBASE_CFG', (function () {
    var baseUrl = 'https://apppetidentidade.firebaseio.com';

    return {
        secret: 'qMrMrW1o2vRqdOBHgYhFrxHncP9qxPgzmT4StTak',
        baseUrl: baseUrl,
        baseRef: new Firebase(baseUrl)
    };
}()));