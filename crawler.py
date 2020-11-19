import sqlite3
import urllib.error
import ssl
from urllib.parse import urljoin
from urllib.parse import urlparse
from urllib.request import urlopen
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import string
import os 
dir_path = os.path.dirname(os.path.realpath(__file__))
import json
import requests
import re

def create_ssl():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    return ctx

#get the list of crawled websites
def change_to_crawled(cur):
    crawled =cur.fetchall()
    return [i[0] for i in crawled]

#tokenizing the page
def return_content(page_content):
    content=[]
    words_set = set()
    for sentence in page_content:
        words=sentence.text.split()
        for word in words: 
            if not word.lower() in words_set:
                content.append(word.lower())
                words_set.add(word.lower())
    return content

def get_cleaned_content(content):
    stop_words = set(stopwords.words('english'))
    table = str.maketrans('', '', string.punctuation)
    content = word_tokenize(content)
    content = [w.translate(table) for w in content]
    content= [w.lower().strip() for w in content if not w in stop_words]
    return content   

def create_nodes(crawled_url):
    nodes = []
    for url in crawled_url:
        nodes.append({"name":url})
    return nodes

def create_links(crawled_url_index, from_to_urls):
    links = []
    for from_to_url in from_to_urls:
        source = from_to_url[0]
        target = from_to_url[1]
        links.append ({"source": source, "target":target})
    return links

def create_json(crawled_url,crawled_url_index, from_to_urls):
    nodes = create_nodes(crawled_url)
    links = create_links(crawled_url_index, from_to_urls)
    json_data = {
        "nodes": nodes,
        "links" : links
    }
    return json_data

def update_unique_url(url, all_unique_urls, all_unique_urls_set, crawled_url_index):
    if url not in all_unique_urls_set:
            crawled_url_index[url] = len(all_unique_urls_set)
            all_unique_urls_set.add(url)
            all_unique_urls.append(url)
            
    return all_unique_urls, all_unique_urls_set, crawled_url_index

def dump_json_file(json_data):
    with open('static/json/data.json', 'w', encoding='utf-8') as f:
        json.dump(json_data, f, ensure_ascii=False, indent=4)
    return

def checkForValidUrl(url):
    print(url)
    regex = re.compile(
            r'^(?:http|ftp)s?://' # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
            r'localhost|' #localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
            r'(?::\d+)?' # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)

    return (re.match(regex, url) is not None) # True

def web_crawl(seed_url, max_iteration):
    max_pages_collect = 50
    to_crawl_url = []
    crawled_url = []
    crawled_url_index = {}
    indexed = {}
    crawled_url_set =set()
    to_crawl_url_set =set()
    from_to_urls =[]
    all_unique_urls =[]
    all_unique_urls_set = set()
    ctx = create_ssl()
    to_crawl_url.append(seed_url)
    to_crawl_url_set.add(seed_url)
    url_page_title_map = {}
    
    while to_crawl_url and max_iteration>0:
        max_iteration = max_iteration-1
        curr_len = len(to_crawl_url)
        if max_pages_collect <= len(crawled_url):
            break
        while curr_len>0:
            if max_pages_collect <= len(crawled_url) :
                break
            max_pages_collect = max_pages_collect-1
            curr_len = curr_len-1
            url_to_visit=to_crawl_url[0]
            to_crawl_url_set.remove(url_to_visit)
            del to_crawl_url[0]
            #cur.execute('INSERT OR IGNORE INTO Pages (url) VALUES ( ? )', ( url, ) )
            #conn.commit()
                        
            all_unique_urls, all_unique_urls_set, crawled_url_index = update_unique_url(url_to_visit, all_unique_urls, all_unique_urls_set, crawled_url_index)
            #print("going to :",url_to_visit)

            if not checkForValidUrl(url_to_visit) :
                continue
            document = requests.get(url_to_visit, verify =False)
            print(document)
            html = document.text
            print(html)
            if document.status_code != 200 :
                print("Error on page: ",document.status_code)
                #cur.execute('DELETE FROM Pages WHERE url=?', ( url ,) )
                #conn.commit()
                continue
                
            if "text/html" not in document.headers["content-type"]:
                print("Ignore non text/html page")
                #cur.execute('DELETE FROM Pages WHERE url=?', ( url, ) )
                #conn.commit()
                continue
            
            soup = BeautifulSoup(html, "html.parser")
            
            urls=soup.find_all('a')
            title = soup.find('title').text
            url_page_title_map[url_to_visit]=title
            body=soup.find_all('body')
            content=" ".join(return_content(body))
            
            #cleaning and tokenizeing
            content = get_cleaned_content(content)
            
            #print(content) 
            #keyword to url mapping     
            for word in content:
                if word not in indexed:
                    indexed[word] ={"pages":set()}
                if url_to_visit not in indexed[word]:
                    indexed[word]["pages"].add(url_to_visit)
                    indexed[word][url_to_visit] = 0
                indexed[word][url_to_visit]  = indexed[word][url_to_visit] +1
                # if (word,url_to_visit) not in index:
                    # index.append((word,url_to_visit))
                    #cur.execute("INSERT OR IGNORE INTO Indexing (keyword, url) VALUES ( ?,? )", (word, url, ) )
                    # conn.commit()
            
            #adding new index        
            for url in urls:
                # cur.execute("INSERT OR IGNORE INTO Popularity (from_id, to_id) VALUES ( ?,? )", (url, i['href'], ) )
                # conn.commit()
                # cur.execute('SELECT url FROM Pages')
                # crawled=change_to_crawl_urled(cur)
                try:
                    
                    current_link = url['href']
                    if (current_link in to_crawl_url_set) or (current_link in crawled_url_set): continue
                    to_crawl_url.append( current_link) 
                    to_crawl_url_set.add(current_link)
                    from_to_urls.append([url_to_visit, current_link])
                    all_unique_urls, all_unique_urls_set, crawled_url_index = update_unique_url(current_link, all_unique_urls, all_unique_urls_set, crawled_url_index)
                    
                except:
                    print("href not present")
            
            crawled_url_index[url_to_visit] = len(crawled_url)
            crawled_url.append(url_to_visit)
            
            
      
            
    print("Crawling complete")
    crawling_result = create_json(all_unique_urls,crawled_url_index, from_to_urls)
    json_data = {"crawling_result":crawling_result, "indexed":indexed, "url_page_title_map":url_page_title_map}
    return json_data

