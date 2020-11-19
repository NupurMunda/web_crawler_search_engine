from flask import Flask, redirect, url_for, request,render_template
import sqlite3
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
from autocorrect import spell 
import string
conn = sqlite3.connect('search_engine.db')
cur = conn.cursor()
cur.execute('''CREATE TABLE IF NOT EXISTS Ranking
    (url TEXT PRIMARY KEY, rank INTEGER DEFAULT 1)''')
cur.execute('''CREATE TABLE IF NOT EXISTS Popularity
   (from_id TEXT, to_id TEXT , PRIMARY KEY (from_id, to_id)  )''')

cur.execute("SELECT keyword, Indexing.url,rank from Indexing INNER JOIN Ranking on Indexing.url=Ranking.url")
ind=cur.fetchall()
porter=PorterStemmer()
app = Flask(__name__)

@app.route('/')
@app.route('/home')
def index():
    return render_template('homepage.html')
	
@app.route('/result/<name>')
def result(xx):
	Query = word_tokenize(xx )
	Query=[spell(w) for w in Query]
	rest=searching(xx)
	return render_template('result.html',name=" ".join(Query),rest = rest)
   
def searching(Query):
	stop_words = set(stopwords.words('english')) 
	table = str.maketrans('', '', string.punctuation)
	Query = word_tokenize(Query)
	Query = [w.translate(table) for w in Query]
	Query= [w.lower().strip() for w in Query if not w in stop_words]
	'''Query=[spell(w) for w in Query] 

	Query=[porter.stem(i) for i in Query]  
	'''
	result=[]
	for word in Query:
		for row in ind:
			roww=[]
			if word in row[0]:
				roww.append(row[1])
				roww.append(row[2])
				result.append(roww)
	return sorted(result,key=lambda l:l[1], reverse=True)
	
@app.route('/home',methods = ['POST', 'GET'])
def home():
	if request.method=='POST':
		Query=request.form['srh']
		rest=searching(Query)
	else:
		Query=request.args.get('srh')
		rest=searching(Query)
	return render_template('result.html', name=Query,rest=rest)

if __name__ == '__main__':
   app.run(debug = True)

