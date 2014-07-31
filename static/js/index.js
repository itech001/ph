function getPage(num) {
    console.log('getting page ' + num);
    $.post('/page', {num: num}, function(page) {
        nextPage++;
        var keys = []

        for(k in page.json) {
            keys.push(k);
        }

        keys.sort().reverse();

        for(var i = 0; i < keys.length; i++) {
            var day = page.json[keys[i]];
            var date = new Date(
                keys[i].replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3')
            );

            $('.list > .above-footer').append(Mustache.render(dateTemp, {
                date: date.toDateString().slice(0, 10)
            }));

            for(var j = 0; j < day.length; j++) {
                var touch = 'ontouchstart' in document.documentElement;
                if(j == 5 && num == 0) {
                    if(touch) {
                        $('.list > .above-footer').append(Mustache.render(mobileTemp));
                    }
                    else {
                        $('.list > .above-footer').append(Mustache.render(desktopTemp));
                    }
                }

                var post = day[j];

                $('.list > .above-footer').append(Mustache.render(postTemp, {
                    title: post.title,
                    tag: post.tag,
                    url: post.url,
                    perma: post.perma,
                    score: post.score,
                    comments: post.comments
                }));
            }
        }

        $('.footer').text((num < 4) ? 'Load 2 more days of products'
                                    : "You can't scroll any farther back! :0");
        loading = false;
    });
}

NProgress.configure({
    minimum: 0.2,
    trickleRate: 0.04,
    template: '<div class="bar" role="bar"><div class="peg"></div></div>'
});
var postTemp = $('.post-temp').html();
var dateTemp = $('.date-temp').html();
var pageTemp = $('.page-temp').html();
var headerBackTemp = $('.header-back-temp').html();
var headerPhTemp = $('.header-ph-temp').html();
var commentTemp = $('.comment-temp').html();
var desktopTemp = $('.desktop-plug-temp').html();
var mobileTemp = $('.mobile-plug-temp').html();
Mustache.parse(postTemp);
Mustache.parse(dateTemp);
Mustache.parse(pageTemp);
Mustache.parse(headerPhTemp);
Mustache.parse(headerBackTemp);
Mustache.parse(commentTemp);
var open = 'list';
var loading = true;
var nextPage = 0
getPage(nextPage);

$('.header').click(function() {
    if(open == 'list') {
        $('.list').animate({scrollTop: 0});
    }
});

$('.footer').click(function() {
    if(nextPage < 5 && !loading) {
        loading = true;
        $('.footer').text('Loading...');
        getPage(nextPage);
    }
});

$('body').on('click', '.link', function(e) {
    e.preventDefault();
    open = 'page';
    $('.list').css({left: '-100%'});
    $('.page').css({left: 0});
    $('.header').html(Mustache.render(headerBackTemp, {
        url: this.href
    }));

    setTimeout(function(link) {
        if(open == 'page') {
            NProgress.start();
            $('.page').html(Mustache.render(pageTemp, {
                url: link.href
            }));
            $('iframe').load(function() {
                NProgress.done();
            });
        }
    }, 500, this);
});

function formatComment(text) {
    var urlExp = /(\bhttps?:\/\/\S+)/ig;
    return text.replace(/\r/g, '<br><br>')
               .replace(urlExp, '<a href="$1" target="_blank">$1</a>')
}

$('body').on('click', '.perma', function(e) {
    e.preventDefault();
    open = 'discussion';
    $('.list').css({left: '-100%'});
    $('.discussion').css({left: 0});
    $('.discussion').html('');
    $('.header').html(Mustache.render(headerBackTemp, {
        url: this.href
    }));

    $.post('/disc', {perma: this.href.split('.com')[1]}, function(comments) {
        for(var i = 0; i < comments.json.length; i++) {
            var comment = comments.json[i];
            var children = ''

            for(var j = 0; j < comment.children.length; j++) {
                children += Mustache.render(commentTemp, {
                    name: comment.children[j].name,
                    handle: comment.children[j].handle,
                    text: formatComment(comment.children[j].text)
                });
            }

            $('.discussion').append(Mustache.render(commentTemp, {
                name: comment.name,
                handle: comment.handle,
                text: formatComment(comment.text),
                children: children
            }));
        }
    });
});

$('body').on('click', '.back', function() {
    open = 'list';
    NProgress.done();
    $('.list').css({left: 0});
    $('.page, .discussion').css({left: '100%'});
    $('.header').html(Mustache.render(headerPhTemp))

    setTimeout(function() {
        if(open == 'list') {
            $('.page, .discussion').html('');
        }
    }, 500);
});
