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

def create_graph(pages, page_links):
    graph = {}
    for page in pages:
        graph[page['name']]= [[],0]
    for link in page_links:
        source =link['source']
        target = link['target']
        graph[source][0].append(target)
        graph[target][1] = graph[target][1] +1
        
    return graph
        
def start_ranking(crawling_result):
    if not bool(crawling_result):
        return []
    if len(crawling_result['links']) == 0:
        return []
    pages = crawling_result['nodes']
    page_links = crawling_result['links']
    graph = create_graph(pages, page_links)
    rank = compute_ranks(graph)
    ranks = convert_graph_to_array(rank,graph)
    #ranks = { "ranks": rank}
    ranks_json = {"ranks_send":ranks, "ranks_keep":rank}
    return ranks_json 
    
def convert_graph_to_array(rank,graph):
    ranks = []
    for page in sorted(rank, key=rank.get, reverse = True):
        ranks.append({"page_name": page,"rank": rank[page],"to":len(graph[page][0]), "from":graph[page][1]} )
    return ranks
    
def compute_ranks(graph):
    d = 0.8 # damping factor
    numloops = 10
    
    ranks = {}
    npages = len(graph)
    for page in graph:
        ranks[page] = 1.0 / npages
    
    for i in range(0, numloops):
        newranks = {}
        for page in graph:
            newrank = (1 - d) / npages
            for node in graph:
                if page in graph[node][0]:
                    newrank=newrank + d*(ranks[node]/len(graph[node][0]))
            newranks[page] = newrank
            
        ranks = newranks
        
    return ranks

