function getPage(num) {
    $.post('/page', {num: num}, function(page) {
        nextPage++;
        var keys = []

        for(k in page.json) {
            keys.push(k);
        }

        keys.sort().reverse();
        console.log(keys);

        for(var i = 0; i < keys.length; i++) {
            var day = page.json[keys[i]];
            var date = new Date(
                keys[i].replace(/(\d{2})-(\d{2})-(\d{4})/, '$2/$1/$3')
            );

            $('.list').append(Mustache.render(dateTemp, {
                date: date.toDateString().slice(0, 10)
            }));

            for(var j = 0; j < day.length; j++) {
                var post = day[j];

                $('.list').append(Mustache.render(postTemp, {
                    title: post.title,
                    tag: post.tag,
                    url: post.url,
                    perma: post.perma,
                    score: post.score
                }));
            }
        }

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
Mustache.parse(postTemp);
Mustache.parse(dateTemp);
Mustache.parse(pageTemp);
Mustache.parse(headerPhTemp);
Mustache.parse(headerBackTemp);
var open = 'list';
var loading = true;
var nextPage = 0
getPage(nextPage);

$('.list').scroll(function() {
    if(!loading && $('.list').prop('scrollHeight') - $('.list').scrollTop() < 1500) {
        loading = true;
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
    }, 1000, this);
});

$('body').on('click', '.back', function() {
    open = 'list';
    NProgress.done();
    $('.list').css({left: 0});
    $('.page').css({left: '100%'});
    $('.header').html(Mustache.render(headerPhTemp))

    setTimeout(function() {
        if(open == 'list') {
            $('.page').html('');
        }
    }, 1000);
});
