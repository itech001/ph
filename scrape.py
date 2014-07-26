import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup
from time import time



def scrape_page(num):
    print('scraping page ' + str(num))
    page = db.pages.find_one({'num': num})

    if not page or time() - page['updated'] > 300:
        page = {'num': num, 'days': {}, 'updated': time()}
        ph = requests.get(ph_url + '?page=' + str(num))
        soup = BeautifulSoup(ph.text)

        for ph_day in soup.find_all(class_='day'):
            date = ph_day.find(class_='date')['datetime']
            page['days'][date] = []

            for post in ph_day.find_all(class_='post'):
                url = post.find(class_='post-url')['href']
                data = {'title': post.find(class_='post-url').text,
                        'tag': post.find(class_='post-tagline').text,
                        'url': requests.get(ph_url + url, verify=False).url,
                        'score': post.find(class_='vote-count').text,
                        'perma': post.find(class_='view-discussion')['href']}
                page['days'][date].append(data)
                scrape_disc(data['perma'])

        try:
          db.pages.update({'num': num}, page, True)
        except:
          print('Exception updating page :0')
          pass

        print('updated page ' + str(num))



def scrape_disc(perma):
    print('scraping discussion ' + perma)
    disc = {'perma': perma, 'comments': [], 'updated': time()}
    ph = requests.get(ph_url + perma)
    soup = BeautifulSoup(ph.text)

    for thread in soup.find_all(class_='comment-thread'):
        data = {'name': thread.find(class_='comment-user-name').text,
                'handle': thread.find(class_='comment-user-handle').text,
                'text': str(thread.find(class_='actual-comment')),
                'children': []}

        for child in thread.find_all(class_='comment child'):
            data['children'].append({
                'name': child.find(class_='comment-user-name').text,
                'handle': child.find(class_='comment-user-handle').text,
                'text': str(child.find(class_='actual-comment'))})

        disc['comments'].append(data)

    db.discs.update({'perma': perma}, disc, True)
    print('updated discussion ' + str(perma))



def loop():
    for i in range(5):
        scrape_page(i)

    loop()



ph_url = 'http://www.producthunt.com'
db = MongoClient().ph

if __name__ == '__main__':
    loop()
