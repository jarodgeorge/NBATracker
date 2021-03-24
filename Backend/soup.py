import requests
from bs4 import BeautifulSoup


headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'
    }

url = "https://www.google.com/search?q=Celtics+NBA+Score"
req = requests.get(url, headers)
soup = BeautifulSoup(req.content, 'html.parser')
with open("soupTest.html","w") as file:
    file.write(str(soup.prettify()))
# print(soup.prettify())
scores = soup.find_all(class_="BNeawe deIvCb AP7Wnd")[1].text
liveGame = soup.find_all(class_="rQMQod AWuZUe")[0].text
quarters = ["Q1","Q2","Q3","Q4"]
if len(liveGame)>=2:
    if liveGame[0:2] in quarters:
        print("Celtics Game is Live!")
print(liveGame)


# print(soup.get_text())
scoresParsed = []
# for element in scores:
#     if
# print(soup.find_all(class_="BNeawe deIvCb AP7Wnd"))
# print(soup.find_all(text="Celtics"))