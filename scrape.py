#!/usr/bin/env python3

import requests
from pymongo import MongoClient
from bs4 import BeautifulSoup
from time import time, sleep

def scrape_page(num):
    print('scraping page ' + str(num))
    page = {'num': num, 'days': {}, 'updated': time()}
    ph = requests.get(ph_url + '?page=' + str(num))
    soup = BeautifulSoup(ph.text)

    # for some reason Product Hunt starts page 1 one day after page 0, so on
    # page 0 we only want the first day
    if num == 0:
        days = [soup.find(class_='day')]
    else:
        days = soup.find_all(class_='day')

    for ph_day in days:
        date = ph_day.find(class_='date')['datetime']
        page['days'][date] = []

        for post in ph_day.find_all(class_='post'):
            url = ph_url + post.find(class_='post-url')['href']

            try:
                url = requests.get(url, verify=False).url
            except Exception:
                print('an exception occured, using PH redirect URL')
                pass

            perma = post.find(class_='view-discussion')['href']
            comments = scrape_disc(perma)
            data = {'title': post.find(class_='post-url').text,
                    'tag': post.find(class_='post-tagline').text,
                    'url': url,
                    'score': post.find(class_='vote-count').text,
                    'perma': perma,
                    'comments': comments}
            page['days'][date].append(data)
            sleep(2)

    db.pages.update({'num': num}, page, True)

def scrape_disc(perma):
    disc = {'perma': perma, 'comments': [], 'updated': time()}
    ph = requests.get(ph_url + perma)
    soup = BeautifulSoup(ph.text)
    count = 0

    for thread in soup.find_all(class_='comment-thread'):
        count += 1
        data = {'name': thread.find(class_='comment-user-name').text,
                'handle': thread.find(class_='comment-user-handle').text,
                'text': ''.join(thread.find(class_='actual-comment')
                                      .find_all(text=True)),
                'children': []}

        for child in thread.find_all(class_='comment child'):
            count += 1
            data['children'].append({
                'name': child.find(class_='comment-user-name').text,
                'handle': child.find(class_='comment-user-handle').text,
                'text': ''.join(child.find(class_='actual-comment')
                                     .find_all(text=True))})

        disc['comments'].append(data)

    db.discs.update({'perma': perma}, disc, True)
    return count

def loop():
    for i in range(5):
        scrape_page(i)
        print('sleeping for 30 seconds')
        sleep(30)

    print('sleeping for 5 minutes')
    sleep(300)
    loop()

if __name__ == '__main__':
    ph_url = 'http://www.producthunt.com'
    db = MongoClient().ph
    loop()
