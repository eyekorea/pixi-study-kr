$(document).ready(function () {

    function resize()   {
        document.location.reload();
    }

    if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        //
    } else {
        window.onresize = function(){ location.reload(); };
    }

    var windowHeight = $(window).height();
    var $pageContent = $('.page-content');
    var pageContentHeight = $pageContent.outerHeight();
    var middleTop = Math.round(pageContentHeight / 2 - windowHeight / 2);
    var middleBottom = Math.round(pageContentHeight / 2 + windowHeight / 2);

    // Detect whether device supports orientationchange event, otherwise fall back to the resize event.
    var supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
    var isLTIE10 = $('html').hasClass('lt-ie10');


    // NavIcon
    // Set position
    $('#NavIcon span').css({'top': Math.round(windowHeight/2) + 'px' });

    function collapseNavIcon() {
        setTimeout(function () {
            $('#NavIcon').removeClass('expanded');
        }, 4000);
    }
    var crossTimeout;
    $('#NavIcon').click(function (e) {
        e.preventDefault();
        var self = this;
        clearTimeout(crossTimeout);
        $('html').toggleClass('nav-wrap-open');
        if ($('html').hasClass('nav-wrap-open')) {
            $(this).addClass('cross');
        } else {
            crossTimeout = setTimeout(function () {
                $(self).removeClass('cross');
            }, 1000);
        }
        $('#Menu').show();
        $('#SignupForm').hide();
        $('#SignupSuccess').hide();
    });
    $('#NavIcon').addClass('expanded');
    if (!$('.page-content').hasClass('home')) {
        collapseNavIcon();
    }

    // Newsletter
    $('.signup-link').click(function () {
        $('#Menu').hide();
        $('#SignupForm').show();
    });

    $('#Menu, #SignupForm, #Nav footer a').click(function (e) {
        e.stopPropagation();
    });
    $('#Nav').click(function () {
        if ($('#SignupForm').is(':visible') || $('#SignupSuccess').is(':visible')) {
            $('#Menu').show();
            $('#SignupForm').hide();
            $('#SignupSuccess').hide();
        }
    });

    function IsEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }

    $('#SignupForm').on('submit', function (e) {
        e.preventDefault();
        var email = $('#SignupForm input').eq(0).val();
        var name = $('#SignupForm input').eq(1).val()
        var errorMSG = "Sorry, there was an error. Please try again!";
        var invalidEmailMSG = "That does not look like a valid email.";
        var alreadySubscribedMSG = "You have already subscribed to our newsletter.";
        var invalidNameMSG = 'You have to enter your name.';
        if (!IsEmail(email)) {
            $('#SignupForm input').eq(0).addClass('error');
            $('#SignupForm .sending').css('visibility', 'hidden');
            $('#SignupForm .error').text(invalidEmailMSG).css('visibility', 'visible');
            return false;
        }
        $('#SignupForm input').eq(0).removeClass('error');
        if (!$.trim(name)) {
            $('#SignupForm input').eq(1).addClass('error');
            $('#SignupForm .sending').css('visibility', 'hidden');
            $('#SignupForm .error').text(invalidNameMSG).css('visibility', 'visible');
            return false;
        }
        $('#SignupForm input').eq(1).removeClass('error');
        $('#SignupForm .error').css('visibility', 'hidden');
        $('#SignupForm .sending').css('visibility', 'visible');
        $.ajax({
            method: "POST",
            cache: false,
            //dataType: "json",
            //url: "https://us1.api.mailchimp.com/2.0/lists/subscribe.json",
            url: ajaxVars.ajaxurl,
            //data: {
            //  "apikey": "example apikey",
            //  "id": "example id",
            //  "email": {
            //      "email": email
            //  },
            //  "merge_vars": {
            //      "FNAME": name
            //  },
            //  "send_welcome": false
            //},
            data: {
                ajax_nonce: ajaxVars.ajax_nonce,
                action: 'add_to_mailchimp_list',
                email: email,
                name: name
            },
            beforeSend: function () {
            },
            success: function (responseText) {
                $('#SignupForm .sending').css('visibility', 'hidden');
                if (responseText === 'added') {
                    $('#SignupForm').hide();
                    $('#SignupSuccess').show();
                } else if (responseText === 'already subscribed') {
                    $('#SignupForm .error').text(alreadySubscribedMSG).css('visibility', 'visible');
                } else if (responseText === 'invalid email') {
                    $('#SignupForm .error').text(invalidEmailMSG).css('visibility', 'visible');
                    $('#SignupForm input').eq(0).addClass('error');
                } else {
                    $('#SignupForm .error').text(errorMSG).css('visibility', 'visible');
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#SignupForm .sending').css('visibility', 'hidden');
                $('#SignupForm .error').text(errorMSG).css('visibility', 'visible');
            }
        });

    });

    // PAGE HOME
    var seqImgPath = '/wp-content/themes/libertine/img/seq/';
    var imgPath = '/wp-content/themes/libertine/img/';

    if ($pageContent.hasClass('home')) {
        $('html').addClass('is-home');

        $('.page-content.home .link-box.female').css({'bottom': Math.round(windowHeight/2) + 'px' });
        $('.page-content.home .link-box.male').css({'top': Math.round(windowHeight/2) + 'px' });
        if( !/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            $('.page-content.home .scroll-link.male').css({'margin-top': Math.round(windowHeight/2)-50 + 'px' });
            $('.page-content.home .scroll-link.female').css({'margin-top': (Math.round(windowHeight/2)-50)*-1 + 'px' });
        }
        var scrollToMiddle = function () {
            if( /Android|webOS|iPhone|iPod|iPad|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                $('#AppWrap').scrollTop(pageContentHeight / 2 - windowHeight / 2);
            } else {
                $(window).scrollTop(pageContentHeight / 2 - windowHeight / 2);
            }
        }
        scrollToMiddle();

        $('body').addClass('page-loaded');
        $('.loading').remove();

        var ww = $(window).width();
        var wh = $(window).height();

        //PIXI.utils._saidHello = true;
        var renderer = PIXI.autoDetectRenderer(ww, wh, { transparent: true });
        $('body').prepend(renderer.view);

        var stage = new PIXI.Container(0xffffff, true);

        if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            var maleTexture = PIXI.Texture.fromImage(imgPath + 'LL-ss17-inseason-iPhone-right.png');
            var femaleTexture = PIXI.Texture.fromImage(imgPath + 'LL-ss17-inseason-iPhone-left.png');
        } else {
            var maleTexture = PIXI.Texture.fromImage(imgPath + 'LL-ss17-inseason-right.png');
            var femaleTexture = PIXI.Texture.fromImage(imgPath + 'LL-ss17-inseason-left.png');
        }

        // Male
        var male = new PIXI.Sprite(maleTexture);
        male.anchor.x = 0.5;
        male.anchor.y = 0.5;
        male.position.x = ww/2;
        male.position.y = wh/2;
        stage.addChild(male);

        // Female
        var female = new PIXI.Sprite(femaleTexture);
        female.anchor.x = 0.5;
        female.anchor.y = 0.5;
        female.position.x = ww/2;
        female.position.y = wh/2;
        stage.addChild(female);

        var femaleBlurFilter = new PIXI.filters.BlurFilter();
        femaleBlurFilter.blur = 0;

        var maleBlurFilter = new PIXI.filters.BlurFilter();
        maleBlurFilter.blur = 0;

        var femaleTwistFilter = new PIXI.filters.TwistFilter();
        femaleTwistFilter.radius = 0;
        femaleTwistFilter.angle = 1.8;
        femaleTwistFilter.offset.x = 0.55;
        femaleTwistFilter.offset.y = 0.9;

        var maleTwistFilter = new PIXI.filters.TwistFilter();
        maleTwistFilter.radius = 0;
        maleTwistFilter.angle = 1.8;
        maleTwistFilter.offset.x = 0.55;
        maleTwistFilter.offset.y = 0.2;

        if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            femaleTwistFilter.angle = -2;
            femaleTwistFilter.offset.x = 1;
            femaleTwistFilter.offset.y = 0.5;
            maleTwistFilter.angle = 2;
            maleTwistFilter.offset.x = 0;
            maleTwistFilter.offset.y = 0.5;

            // Place the containers
            var offset = 50;
            female.position.y = -offset;
            male.position.y = wh+offset;
        }

        var femaleDisplacementSprite = PIXI.Sprite.fromImage(imgPath + 'displacement_map.jpg');
        stage.addChild(femaleDisplacementSprite);
        var femaleDisplacementFilter = new PIXI.filters.DisplacementFilter(femaleDisplacementSprite);
        femaleDisplacementFilter.scale.x = 0;
        femaleDisplacementFilter.scale.y = 0;

        var maleDisplacementSprite = PIXI.Sprite.fromImage(imgPath + 'displacement_map.jpg');
        stage.addChild(maleDisplacementSprite);
        var maleDisplacementFilter = new PIXI.filters.DisplacementFilter(maleDisplacementSprite);
        maleDisplacementFilter.scale.x = 0;
        maleDisplacementFilter.scale.y = 0;

        female.filters = [
            femaleBlurFilter,
            femaleTwistFilter,
            femaleDisplacementFilter,
        ];
        male.filters = [
            maleBlurFilter,
            maleTwistFilter,
            maleDisplacementFilter,
        ];

        var middle = Math.floor(pageContentHeight/2 - windowHeight/2);
        var count = 0;

        function animate() {

            if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

                $('#AppWrap').scroll(function(e) {
                var scroll = $('#AppWrap').scrollTop();
                    var delay = windowHeight/2;
                    var factorFemale = (scroll-middle-delay)/(wh*3);
                    var factorMale = (scroll-middle+delay)/(wh*3);

                    //Female
                    if (scroll > middle) {
                        stage.setChildIndex(female, 2);
                        stage.setChildIndex(male, 1);
                        female.position.y = ((scroll-middle)/4)*4 - offset;
                        male.position.y = wh + scroll - middle + offset;

                        // When scrolled half way, fix position and apply effects
                        if (scroll > (middle+delay+offset)) {
                            femaleBlurFilter.blur = (scroll-middle-delay)/400;
                            femaleTwistFilter.radius = factorFemale
                            femaleDisplacementFilter.scale.x = factorFemale * 200;
                            femaleDisplacementFilter.scale.y = factorFemale * 200;
                            female.scale = new PIXI.Point(factorFemale*3 + 1, factorFemale*3 + 1);
                            female.position.y = wh/2; // Fix position
                        }

                    } else {
                        femaleBlurFilter.blur = 0;
                        femaleTwistFilter.radius = 0;
                    }

                    //Male
                    if (scroll < middle) {
                        stage.setChildIndex(male, 2);
                        stage.setChildIndex(female, 1);
                        male.position.y = wh + ((scroll-middle)/4)*4 + offset;
                        female.position.y = scroll - middle - offset;

                        // When scrolled half way, fix position and apply effects
                        if (scroll < (middle-delay-offset)) {
                            maleBlurFilter.blurX = (scroll-middle-delay)/400;
                            maleTwistFilter.radius = -factorMale;
                            maleDisplacementFilter.scale.x = factorMale * 200;
                            maleDisplacementFilter.scale.y = factorMale * 200;
                            male.scale = new PIXI.Point(-factorMale*3 + 1, -factorMale*3 + 1);
                            male.position.y = wh/2; // Fixed position
                        }
                    } else {
                        maleBlurFilter.blurX = 0;
                        maleTwistFilter.radius = 0;
                    }
                });

            } else if( /iPad/i.test(navigator.userAgent) ) {

                $('#AppWrap').scroll(function(e) {
                var scroll = $('#AppWrap').scrollTop();
                    var factorFemale = (scroll-middle)/(wh*3);
                    var factorMale = (scroll-middle)/(wh*3);

                    //Female
                    if (scroll > middle) {
                        stage.setChildIndex(female, 2);
                        stage.setChildIndex(male, 1);

                        femaleBlurFilter.blur = (scroll-middle)/400;
                        femaleTwistFilter.radius = factorFemale
                        femaleDisplacementFilter.scale.x = factorFemale * 200;
                        femaleDisplacementFilter.scale.y = factorFemale * 200;
                        female.scale = new PIXI.Point(factorFemale*3 + 1, factorFemale*3 + 1);

                    } else {
                        femaleBlurFilter.blur = 0;
                        femaleTwistFilter.radius = 0;
                    }

                    //Male
                    if (scroll < middle) {
                        stage.setChildIndex(male, 2);
                        stage.setChildIndex(female, 1);

                        maleBlurFilter.blurX = (scroll-middle)/400;
                        maleTwistFilter.radius = -factorMale;
                        maleDisplacementFilter.scale.x = factorMale * 200;
                        maleDisplacementFilter.scale.y = factorMale * 200;
                        male.scale = new PIXI.Point(-factorMale*3 + 1, -factorMale*3 + 1);

                    } else {
                        maleBlurFilter.blurX = 0;
                        maleTwistFilter.radius = 0;
                    }
                });

            } else {

                $(window).scroll(function(e) {
                var scroll = $(window).scrollTop();
                    var delay = 100; // number of pixels to wait before applying effect
                    var factorFemale = (scroll-middle-delay)/(wh*3);
                    var factorMale = (scroll-middle+delay)/(wh*3);

                    //Female
                    if (scroll > (middle+100)) {
                        stage.setChildIndex(female, 2);
                        stage.setChildIndex(male, 1);
                        femaleBlurFilter.blur = (scroll-(middle-100))/400;
                        femaleTwistFilter.radius = factorFemale;
                        femaleDisplacementFilter.scale.x = factorFemale * 200;
                        femaleDisplacementFilter.scale.y = factorFemale * 200;
                        female.scale = new PIXI.Point(factorFemale*2 + 1, factorFemale*2 + 1);
                    } else {
                        femaleBlurFilter.blur = 0;
                        femaleTwistFilter.radius = 0;
                    }

                    //Male
                    if (scroll < middle-100) {
                        stage.setChildIndex(male, 2);
                        stage.setChildIndex(female, 1);
                        maleBlurFilter.blurX = (scroll-middle)/400;
                        maleTwistFilter.radius = -factorMale;
                        maleDisplacementFilter.scale.x = factorMale * 200;
                        maleDisplacementFilter.scale.y = factorMale * 200;
                        male.scale = new PIXI.Point(-factorMale*2 + 1, -factorMale*2 + 1);
                    } else {
                        maleBlurFilter.blurX = 0;
                        maleTwistFilter.radius = 0;
                    }
                });
            }

            // Animate displacement
            femaleDisplacementSprite.x = count*10;
            femaleDisplacementSprite.y = count*10;
            maleDisplacementSprite.x = count*10;
            maleDisplacementSprite.y = count*10;
        count += 0.05;

        requestAnimationFrame(animate);
        renderer.render(stage);
        }
        animate();

/*
        // Transist to next page (collapse
        $('.link-box').on('click', function(e){
            e.preventDefault();
            $('body').animate({ scrollTop: pageContentHeight / 2 - windowHeight / 2 }, 1000);
            scrollToMiddle();
        });
*/

    }

    // Page title
    if (!$('.page-content').hasClass('home') && !$('.page-content').hasClass('contact')) {
        var pageTitleHTML = [
            '<div id="PageTitleWrap" class="page-overlay">',
                '<div id="PageTitle">',
                    'Libertine',
                    '<h1><span>' + $('#Nav #Menu li.current-menu-item').text() + '</span></h1>',
                    'libertine',
                '</div>',
            '</div>'
        ].join('\n');
        $('#NavWrap').after(pageTitleHTML);
        setTimeout(function () {
            $('#PageTitleWrap').addClass('close');
            $('.page-content.contact').addClass('load');
        }, 1500);
    }

    // PAGE COLLECTION
    if ($('.page-content').hasClass('collection')) {
        $('html').addClass('collection');
        $.getScript(seqImgPath + '../../js/lib/jquery.lazyload.min.js', function () {
            $('.group-products').each(function () {
                var self = this;
                $(self).imagesLoaded(function () {
                    $(self).masonry({
                        columnWidth: 'li',
                        itemSelector: 'li',
                        transitionDuration: 0,
                    });
                });
            });

            function buildProducts(data) {
                if (!data || typeof data.collection == 'undefined' || !data.collection.length) {
                    return;
                }
                for (var i = 0; i < data.collection.length; i++) {
                    var group = data.collection[i];
                    var $group = $pageContent.find('#Group' + group.groupd_id);
                    var $groupProducts = $group.children('.group-products');

                    function makeProductsHTML($group) {
                        if (!group[0].product) {
                            return '';
                        }
                        var productsHTML = '';
                        for (var j = 0; j < group[0].product.length; j++) {
                            var product = group[0].product[j];
                            if (product.img && !$group.find('#Product' + product.id).length) {
                                var productHTML = [
                                    '<li id="Product' + product.id + '">',
                                        '<a href="#">',
                                            '<img class="lazy" data-original="' + product.img + '" alt="' + product.product_name + '" />',
                                            '<strong>' + product.product_name + '</strong>',
                                            product.product_info,
                                        '</a>',
                                    '</li>'
                                ].join('\n');
                                productsHTML += productHTML;
                            }
                        }
                        return productsHTML;
                    }

                    if ($group.length) {
                        var productsHTML = makeProductsHTML($group);
                        if (productsHTML) {
                            $groupProducts.append(productsHTML);
                        }
                    } else {
                        $pageContent.append([
                            '<div class="group" id="Group' + group.groupd_id + '">',
                                group.img ? '<img src="' + group.img + '" alt="' + group.group_name + '" class="group-image" />' : '',
                                '<ul class="group-products"></ul>',
                            '</div>'
                        ].join('\n'));
                        var $group = $pageContent.find('#Group' + group.groupd_id);
                        var $groupProducts = $group.children('.group-products');
                        var productsHTML = makeProductsHTML($group);
                        if (productsHTML) {
                            $groupProducts.append(productsHTML);
                        }
                    }
                }
                // $groupProductImgs = $('.group-products img');
            }

            var $pageGroups = [];
            function fnAllProductsLoaded() {
                $pageGroups = $('.page-content .group');
                $("img.lazy").each(function () {
                    $(this).css('height', $(this).outerWidth() * 1.2 + 'px');
                }).load(function () {
                    if (this.src.indexOf('data:image/') == -1) {
                        $(this).parents('li').first().addClass('load');
                        $(this).addClass('load');
                        $(this).parents('.group-products').first().masonry({
                            columnWidth: 'li',
                            itemSelector: 'li',
                            transitionDuration: 0,
                        });
                    }
                });
                $("img.lazy").lazyload({
                    threshold: 500
                });

                $('.group-products a').click(function (e) {
                    e.preventDefault();
                });
            }

            var productsPage = 0;
            var loading = true;
            var $window = $(window);
            var allProductsLoaded = false;
            var url = window.location.href;
            var loadMoreProducts = function () {
                productsPage++;
                $.ajax({
                    type: "POST",
                    cache: false,
                    data: { numPosts: 2, pageNumber: productsPage, collection: url },
                    url: location.protocol + '//' + location.host + "/wp-content/themes/libertine/loopProduct.php",
                    beforeSend: function () {
                    },
                    success: function (data) {
                        if (data) {
                            var data = $.parseJSON(data);
                            buildProducts(data);
                            loadMoreProducts();
                        } else {
                            allProductsLoaded = true;
                            fnAllProductsLoaded();
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }

            loadMoreProducts();

            var browserW = $(window).width();
            var browserH = $(window).height();
            $(window).on(orientationEvent, function () {
                browserW = $(window).width();
                browserH = $(window).height();
            });

            // var $groupProductImgs = $('.group-products img');
            $(window).scroll(function () {
                if (browserW >= 800) {
                    var scrollTop = $(window).scrollTop();
                    // $pageGroups.not(':last').each(function () {
                    // $pageGroups.eq(0).each(function () {
                    if($pageGroups.length/* && $groupProductImgs.length*/){
                        var $groupFirst = $pageGroups.eq(0);
                        var $groupLast = $pageGroups.eq($pageGroups.length - 1);
                        $groupFirst.children('.group-image').css('transform', 'translate3d(0px,' + Math.floor((scrollTop - $groupFirst.offset().top) * .35) + 'px,0px)');
                        $groupLast.children('.group-image').css('transform', 'translate3d(0px,' + Math.floor((scrollTop - $groupLast.offset().top) * .35) + 'px,0px)');
                        if (scrollTop === 0) {
                            $('.group-image').first().css('transform', 'none');
                        }
                    }
                }
            });
        });
    }

});
