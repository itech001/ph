function getDay(ago) {
    $.post('/day', {ago: ago}, function(posts) {
        nexDay++;

        if(posts.json.length) {
            $('.list > .above-footer').append(Mustache.render(dateTemp, {
                date: new Date(posts.json[0].day).toUTCString().slice(0, 11)
            }));

            for(var i = 0; i < posts.json.length; i++) {
                var touch = 'ontouchstart' in document.documentElement;
                if(ago == 1 && i == 5 && touch) {
                    $('.list > .above-footer').append(
                        Mustache.render(mobileTemp)
                    );
                }
                else if (ago == 0 && i == 2 && !touch) {
                    $('.list > .above-footer').append(
                        Mustache.render(desktopTemp)
                    );
                }

                $('.list > .above-footer').append(Mustache.render(postTemp, {
                    name: posts.json[i].name,
                    tag: posts.json[i].tagline,
                    url: posts.json[i].redirect_url,
                    disc: posts.json[i].discussion_url,
                    votes: posts.json[i].votes_count,
                    comments: posts.json[i].comments_count
                }));
            }
        }

        $('.footer').text((ago < 4) ? 'Load 2 more days of products'
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
var nexDay = 0
getDay(nexDay);

$('.header').click(function() {
    if(open == 'list') {
        $('.list').animate({scrollTop: 0});
    }
});

$('.footer').click(function() {
    if(nexDay < 5 && !loading) {
        loading = true;
        $('.footer').text('Loading...');
        getDay(nexDay);
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
    return text.replace(/\r/g, '<br>')
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

    $.post('/disc', {perma: this.href}, function(comments) {
        for(var i = 0; i < comments.json.length; i++) {
            var comment = comments.json[i];
            var children = ''

            for(var j = 0; j < comment.child_comments.length; j++) {
                children += Mustache.render(commentTemp, {
                    name: comment.child_comments[j].user.name,
                    handle: comment.child_comments[j].user.username,
                    text: formatComment(comment.child_comments[j].body)
                });
            }

            $('.discussion').append(Mustache.render(commentTemp, {
                name: comment.user.name,
                handle: comment.user.username,
                text: formatComment(comment.body),
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
