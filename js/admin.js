(function ($) {
    'use strict';
    $(function () {

        /**
         * Generate a query string with a hash
         * @param  {string} url        base url
         * @param  {object} parameters key=value,key2=value2...
         * @return {string}            url + get variables
         */
        var buildUrl = function(url, parameters) {
            var qs = '';

            for (var key in parameters) {
                var value = parameters[key];

                if (typeof value === 'string' || typeof value === 'boolean') {
                    qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }

            if (qs.length > 0) {
                qs = qs.substring(0, qs.length - 1);
                url = url + '?' + qs;
            }

            return url;
        };

        /**
         * Iframe generation for preview
         * @param  {bool} notrack=true
         * @return {string} html code of the iframe
         */
        var generateHtmlIframe = function() {
            var chooseContent = $('#choose-content');
            var chooseMode = $('#choose-mode');
            var notrack = $('#notrack').val();
            var parameters = {};

            if (chooseContent.val() === 'myfeed') {
                parameters.choice = 'myfeed';
                parameters.username = $('#username').val();
                parameters.show_infos = $('#infos').is(':checked');
            }

            if (chooseContent.val() === 'hashtag') {
                parameters.choice = 'hashtag';
                parameters.hashtag = $('#hashtag').val();
                parameters.show_infos = false;
            }

            parameters.linking = $('#linking').val();
            parameters.width = $('#width').val();
            parameters.height = $('#height').val();
            parameters.photo_border = $('#photo-border').is(":checked");
            parameters.background = $('#background').val();
            parameters.text = $('#text').val();
            parameters.widget_border = $('#widget-border').is(':checked');
            parameters.radius = $('#radius').val();
            parameters['border-color'] = $('#border-color').val();
            parameters.title = $('#custom_title').val();
            parameters['title-align'] = $('#title_align').val().toLowerCase();
            parameters.responsive = $('#responsive_bool').is(":checked");

            if (chooseMode.val() === 'grid') {
                parameters.mode = 'grid';
                parameters.layout_x = $('#layoutX').val();
                parameters.layout_y = $('#layoutY').val();
                parameters.padding = $('#padding').val();
            }

            if (chooseMode.val() === 'slideshow') {
                parameters.mode = 'slideshow';
                parameters.pace = $('#pace').val();
            }

            if (parameters.responsive) {
              parameters.width = "100%";
              parameters.height = "100%";
              $('#width').hide();
              $('#height').hide();
              $('.hideSize').hide();
            } else {
              $('#width').show();
              $('#height').show();
              $('.hideSize').show();
            }

            // todo
            parameters.user_id = 'todo';
            parameters.time = new Date().getTime().toString();
            parameters.notrack = notrack;

            var domain = 'https://pro.iconosquare.com/';
            var url = buildUrl(domain + 'widget/gallery', parameters);

            if (parameters.width == "100%" && parameters.height == "100%") {
              var widthStr = "100%";
              var heightStr = "100%"
            } else {
              var widthStr = parameters.width + 'px';
              var heightStr = parameters.height + 'px';
            }

            var iframeContent = '<iframe src="'+url+'" allowTransparency="true" frameborder="0" scrolling="no" style="border:none; overflow:hidden; width:'+widthStr+'; height:'+heightStr+';"></iframe>';

            return iframeContent;
        };

        if (document.getElementById('wrap-iconosquare')) {

            var iframeWrapper = $('#content-iframe');
            iframeWrapper.html(generateHtmlIframe);

            $('#choose-content').change(function() {
                if ($(this).val() === 'myfeed') {
                    $('.hash-group').hide();
                    $('.user-group').show();
                }

                if ($(this).val() === 'hashtag') {
                    $('.user-group').hide();
                    $('.hash-group').show();
                }
            });

            $('#username').change(function() {
                if ($.trim($(this).val()) === '') {
                    $(this).val($('#user').val());
                }
            });

            $('#hashtag').change(function() {
                if ($.trim($(this).val()) === '') {
                    $(this).val('iconosquare');
                }
            });

            $('#choose-mode').change(function() {
                if ($(this).val() === 'slideshow') {
                    $('.mode-grid').hide();
                    $('.mode-slideshow').show();
                }

                if ($(this).val() === 'grid') {
                    $('.mode-slideshow').hide();
                    $('.mode-grid').show();
                }
            });

            $('#wrap-iconosquare #widgets-left input, #wrap-iconosquare #widgets-left select').each(function() {
                $(this).change(function() {
                    iframeWrapper.html(generateHtmlIframe);

                    var iframeId = $(this).attr('id');
                    var showLoader = (iframeId === 'choose-content' || 'hashtag' || 'username');

                    var iframe = $('#content-iframe iframe');

                    if (showLoader) {
                        iframe.hide();
                        iframeWrapper.append('<img height=32 width=32 src="'+ $('#loader').val() +'" id="loaderFlux">');
                    }

                    iframe.load(function() {
                        if (showLoader) {
                            iframe.show();
                            $('#loaderFlux').remove();
                        }
                    });
                });
            });

        }
    });
}(jQuery));
