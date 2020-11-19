from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
from autocorrect import spell 
from flask import jsonify
import string
from crawler import get_cleaned_content
    
def calculate_weightage(pages_list, ranks, url_page_title_map):
    page_weight ={}
    for page_info in pages_list:
        page = page_info["page"]
        word = page_info["word"]
        count = page_info["count"]
        if page not in page_weight:
            page_weight[page] = {"words":[], "weight":0, "page":page, "page_name" : url_page_title_map[page]}
        page_weight[page]["words"].append(word)
        page_weight[page]["weight"] = page_weight[page]["weight"]+ count*ranks[page]
    
    page_weight = [page_weight[info] for info in page_weight]
    page_weight.sort(key=lambda x: x["weight"], reverse=True)
    print("page weight")
    print(page_weight)
    return page_weight
        
def searching (query, indexed, ranks, url_page_title_map):
    query = get_cleaned_content(query)
    result =[]
    for word in query:
        if word in indexed:
            pages = indexed[word]
            for page in pages:
                if(type(indexed[word][page]) == int) :
                    result.append({"page":page, "word":word, "count":indexed[word][page]})
    page_weight = calculate_weightage(result, ranks, url_page_title_map)
    
    return page_weight
    