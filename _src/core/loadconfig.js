(function(){

    UE.Editor.prototype.loadServerConfig = function(){
        var me = this;
        setTimeout(function(){

            var config = {
              "imageActionName": "uploadimage",
              "imageMaxSize": 10485760,
              "imageFieldName": "upfile",
              "imageUrlPrefix": "",
              "imagePathFormat": "",
              "imageAllowFiles": [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".bmp"
              ],
              "fileActionName": "uploadfile",
              "filePathFormat": "",
              "fileFieldName": "upfile",
              "fileMaxSize": 204800000,
              "fileUrlPrefix": "",
              "fileAllowFiles": [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".bmp"
              ],
              "imageManagerActionName": "listimage",
              "imageManagerListPath": "",
              "imageManagerListSize": 30,
              "imageManagerAllowFiles": [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".bmp"
              ],
              "imageManagerUrlPrefix": "",
              "fileManagerActionName": "listfile",
              "fileManagerListPath": "",
              "fileManagerUrlPrefix": "",
              "fileManagerListSize": 30,
              "fileManagerAllowFiles": [
                ".png",
                ".jpg",
                ".jpeg",
                ".gif",
                ".bmp",
                ".tif",
                ".psd"
              ]
            }
            utils.extend(me.options, config);
            me.fireEvent('serverConfigLoaded');
            me._serverConfigLoaded = true;
            return;
            try{
                me.options.imageUrl && me.setOpt('serverUrl', me.options.imageUrl.replace(/^(.*[\/]).+([\.].+)$/, '$1controller$2'));

                var configUrl = me.getActionUrl('config'),
                    isJsonp = utils.isCrossDomainUrl(configUrl);

                /* 发出ajax请求 */
                me._serverConfigLoaded = false;

                configUrl && UE.ajax.request(configUrl,{
                    'method': 'GET',
                    'dataType': isJsonp ? 'jsonp':'',
                    'onsuccess':function(r){
                        try {
                            var config = isJsonp ? r:eval("("+r.responseText+")");
                            utils.extend(me.options, config);
                            me.fireEvent('serverConfigLoaded');
                            me._serverConfigLoaded = true;
                        } catch (e) {
                            showErrorMsg(me.getLang('loadconfigFormatError'));
                        }
                    },
                    'onerror':function(){
                        showErrorMsg(me.getLang('loadconfigHttpError'));
                    }
                });
            } catch(e){
                showErrorMsg(me.getLang('loadconfigError'));
            }
        });

        function showErrorMsg(msg) {
            console && console.error(msg);
            //me.fireEvent('showMessage', {
            //    'title': msg,
            //    'type': 'error'
            //});
        }
    };

    UE.Editor.prototype.isServerConfigLoaded = function(){
        var me = this;
        return me._serverConfigLoaded || false;
    };

    UE.Editor.prototype.afterConfigReady = function(handler){
        if (!handler || !utils.isFunction(handler)) return;
        var me = this;
        var readyHandler = function(){
            handler.apply(me, arguments);
            me.removeListener('serverConfigLoaded', readyHandler);
        };

        if (me.isServerConfigLoaded()) {
            handler.call(me, 'serverConfigLoaded');
        } else {
            me.addListener('serverConfigLoaded', readyHandler);
        }
    };

})();
