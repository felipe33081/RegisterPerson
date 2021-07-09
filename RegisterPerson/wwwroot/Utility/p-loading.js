/*
 *  p-loading - v1.1.1
 *  Loading mask plugin for jQuery.
 *  http://joseshiru.github.io/p-loading/
 *
 *  Made by Jose Zuniga
 *  Under MIT License
 */
( function( $ ) {
     "use strict";

     $.fn.ploading = function( options ) {
        var $selectedNode       = this;
        var pluginTask           = {};
        var pluginPublicAction   = {};
        var pluginPrivateAction  = {};
        var settings;

        pluginTask.definePluginSettings = function() {
            var defaults;            //Default settings
            var defaultShowAnimation;//Default animation for show the loading
            var defaultHideAnimation;//Default animation for hide the loading

            //Param $container is the container of the loading
            defaultHideAnimation = function( $container ) {
                $container.hide();
            };
            defaultShowAnimation = function( $container ) {
                $container.show();
            };

            //Default settings.
            defaults = {
                action: "show",                                  //Action to execute
                containerHTML: "<div/>",                         //HTML of the container
                containerAttrs: {},                              //Container Attributes and custom attributes (class,id,for,etc)
                containerClass: "p-loading-container",           //Container CSS classes
                spinnerHTML: "<div/>",                           //HTML of the spinner
                spinnerAttrs: {},                                //Spinner Attributes and custom attributes (class,id,for,etc)
                spinnerClass: "p-loading-spinner piano-spinner", //Spinner CSS classes
                onShowContainer: undefined,                      //A function to execute when the container get displayed
                onHideContainer: undefined,                      //A function to execute when the container get hidden
                onDestroyContainer: undefined,                    //A function to execute when the container is destroyed
                hideAnimation: defaultHideAnimation,             //A function to hide the container
                showAnimation: defaultShowAnimation,             //A function to show the container
                destroyAfterHide: false,                         //Destoy the container after it gets hidden
                idPrefix: "loader",                              //ID prefix of the container
                pluginNameSpace: "p-loader",                     //Namespace of the plugin used in the data attribute of the selected node
                maskHolder: true,                                //Add the p-loading-mask class to the selected node
                useAddOns: []
            };

            settings = $.extend( defaults, $.fn.ploading.defaults, options );
        };

        pluginTask.definePrivateActions = function() {
            pluginPrivateAction.buildPluginMarkup = function() {
                var renderPlugin;
                var buildPlugin = {};

                buildPlugin.$container = function() {
                    var containerHTML = settings.containerHTML;
                    var $container = $( containerHTML );
                    var randomNumberId = Math.round( new Date().getTime() + ( Math.random() * 100 ) );
                    var containerId = settings.idPrefix + randomNumberId;

                    $selectedNode.data( settings.pluginNameSpace + "id", containerId );
                    $container.prop( "id", containerId );
                    $container.attr( settings.containerAttrs );
                    $container.addClass( settings.containerClass );

                    return $container;
                };

                buildPlugin.$spinner = function() {
                    var spinnerHTML = settings.spinnerHTML;
                    var $spinner = $( spinnerHTML );

                    $spinner.attr( settings.spinnerAttrs );
                    $spinner.addClass( settings.spinnerClass );

                    return $spinner;
                };

                renderPlugin = function() {
                    var $container = buildPlugin.$container();
                    var $spinner = buildPlugin.$spinner();

                    $container.append( $spinner );

                    //Prevent to display the container without the desire animation
                    $container.hide();

                    $selectedNode.prepend( $container );
                };

                renderPlugin();
            };

           pluginPrivateAction.utils = function( utilsSettings ) {
                var utilsAction = {};

                utilsAction.getPluginContainerId = function() {
                    var containerId = $selectedNode.data( settings.pluginNameSpace + "id" );

                    return containerId;
                };

                utilsAction.getPluginContainer = function() {
                    var containerId = pluginPrivateAction.utils( { action: "getPluginContainerId" } );
                    var $container = $( "#" + containerId );

                    return $container;
                };

                return utilsAction[ utilsSettings.action ]();
           };

           pluginPrivateAction.addOnInstaller = function() {
                var initialize;
                var managerAction = {};

                managerAction.getAddOns = function() {
                    return $.fn.ploading.addOns;
                };

                //Parameters to send to the plugins
                managerAction.getParamsToSend = function() {
                    var params = {
                        pluginPublicAction: pluginPublicAction,
                        pluginSettings: settings,
                        pluginPrivateAction: {
                            utils: pluginPrivateAction.utils
                        },
                        $pluginElement: $selectedNode
                    };

                    return params;
                };

                managerAction.applyAddOnData = function( addOnData ) {
                    settings = $.extend( settings, addOnData.pluginSettings );
                    settings = $.extend( settings, addOnData.pluginPublicAction );
                };

                managerAction.installAddOn = function() {
                    var addOns;
                    var usingAddOns = settings.useAddOns.length > 0;

                    if ( !usingAddOns ) {
                        return;
                    }

                    addOns = managerAction.getAddOns();

                    for ( var i = 0, l = settings.useAddOns.length; i < l; i++ ) {
                        var addOnName = settings.useAddOns[ i ];
                        var currentAddOn = addOns[ addOnName ];
                        var addOnExist = currentAddOn ? true : false;
                        var addOnParams;

                        if ( addOnExist ) {
                            addOnParams = managerAction.getParamsToSend();
                            managerAction.applyAddOnData( currentAddOn( addOnParams ) );
                        }
                    }
                };

                initialize = function() {
                    managerAction.installAddOn();
                };

                initialize();
           };
        };

        pluginTask.definePublicActions = function() {

            pluginPublicAction.destroy = function() {
                var $container = pluginPrivateAction.utils( { action: "getPluginContainer" } );

                $container.remove();
                $selectedNode.removeData( settings.pluginNameSpace + "id" );

                if ( settings.onDestroyContainer ) {
                    settings.onDestroyContainer();
                }
            };

            pluginPublicAction.show = function() {

                //Get the container ID of the last plugin's usage in the current element.
                var $container = pluginPrivateAction.utils( { action: "getPluginContainer" } );
                var containerExist = $container.length === 0 ? false : true;

                if ( containerExist ) {
                    settings.showAnimation( $container, $selectedNode );
                } else {
                    pluginPrivateAction.buildPluginMarkup();
                    $container = pluginPrivateAction.utils( { action: "getPluginContainer" } );
                }

                settings.showAnimation( $container, $selectedNode );

                if ( settings.maskHolder ) {
                    $selectedNode.addClass( "p-loading-element-mask" );
                }

                if ( settings.onShowContainer ) {
                    settings.onShowContainer();
                }
            };

            pluginPublicAction.hide = function() {

                //Get the container ID of the last plugin's usage in the current element.
                var $container = pluginPrivateAction.utils( { action: "getPluginContainer" } );

                settings.hideAnimation( $container, $selectedNode );

                if ( settings.maskHolder ) {
                    $selectedNode.removeClass( "p-loading-element-mask" );
                }

                if ( settings.onHideContainer ) {
                    settings.onHideContainer();
                }

                if ( settings.destroyAfterHide ) {
                    pluginPublicAction.destroy();
                }
            };
        };

        pluginTask.runPlublicAction = function() {

            //Refresh the settings of the plugin, in case there're new values
            pluginTask.definePluginSettings();
            pluginPrivateAction.addOnInstaller();
            pluginPublicAction[ settings.action ]();
        };

        pluginTask.initialize = function() {
            pluginTask.definePluginSettings();
            pluginTask.definePrivateActions();
            pluginTask.definePublicActions();
            pluginTask.runPlublicAction();
        };

        pluginTask.initialize();

        return $selectedNode;
    };

    $.fn.ploading.addOns = {};

}( jQuery ) );
