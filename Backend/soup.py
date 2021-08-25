import requests
from bs4 import BeautifulSoup
import os
from twilio.rest import Client
import time
import random
from fake_useragent import UserAgent
import psycopg2

#twilio info
account_sid = os.environ['TWILIO_ACCOUNT_SID']
auth_token = os.environ['TWILIO_AUTH_TOKEN']
phone_number = os.environ['TWILIO_PHONE_NUMBER']

client = Client(account_sid, auth_token)

# for random user agent headers
ua = UserAgent()
#https://botproxy.net/pricing
proxies = {
    'http': 'http://pxu25216-0:XfEtgTiKDFsZA1aL8dou@x.botproxy.net:8080',
    'https': 'http://pxu25216-0:XfEtgTiKDFsZA1aL8dou@x.botproxy.net:8080'
    }

headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '3600',
    'User-Agent': ua.random
    }

# array of all team names
teams = ["76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic", "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards"]





# twilio text functionality
def sendText(teamName,phoneNumber,gameTime):
    message = client.messages \
                .create(
                     body=teamName+" are live. "+ gameTime,
                     from_=phone_number,
                     to='+16034945442'
                 )

    print(message.sid)

# web scrapping call
def gameStatus(teamName):
    # url = "https://www.google.com/search?q=" + teamName + " NBA+Score"
    url = "https://www.google.com/search?q=" + "Patriots" + " NFL+Score"
    #req = requests.get(url, headers=headers,proxies=proxies) turn on once you pay for a proxy
    req = requests.get(url, headers=headers)
    soup = BeautifulSoup(req.content, 'html.parser')
    with open("soupTest.html","w", encoding="utf-8") as file:
        file.write(str(soup.prettify()))
    
    scores = soup.find_all(class_="BNeawe deIvCb AP7Wnd")
    
    if len(scores)>2:
        scores = [scores[1].text,scores[2].text]
        

    liveGame = soup.find_all(class_="rQMQod AWuZUe")
    if liveGame:
        liveGame = liveGame[0].text

    quarters = ["Q1","Q2","Q3","Q4"]
    if len(liveGame)>=2:
        isLive = False 
        for quarter in quarters:
            if quarter in liveGame:
                isLive = True
        if isLive or liveGame == "Halftime":
            return liveGame

    return False

# while true
# get data from database
# iterate through all teams
# check if game is live
# iterate through all active users
# send messages
# repeate

# have active and non active user flags
# after every alert move user to non active and no longer need to check
# need to fool google
# proxy changing

# data gives us team, number, alert
if __name__ == "__main__":
    phoneNumber = "16034945442"
    #"Celtics":[["16034945442",True]], "Kings":[["16034945442",True]],
    users = {"Clippers":[["16034945442",True]]}
    # do i need this?? or can i just make the db call
    # data strucutre from DB. Dictoinary of teams to user mapping. Each user should have phone number etc.
    # from table where team = blah and user = active
    # at 11 am each day reset all users to active
    # if user texts to remove remove row from DB

    #establishing the connection
    conn = psycopg2.connect(
        database="nba_alerts", user='postgres', password='jewmuffin1', host='127.0.0.1', port= '5432')
    conn.autocommit = True
    cursor = conn.cursor()

    while True:
        print(users)
        for teamName in teams:
            isGameLive = gameStatus(teamName)
            time.sleep(random.randint(3,30))
            if isGameLive and teamName in users:
                cursor.execute('''SELECT * from alerts WHERE team_name='''+"'"+teamName+"'")
                result = cursor.fetchall();
                print(result)
                for user in users[teamName]:
                    if user[1]:
                        sendText(teamName,user[0],isGameLive)
                        user[1]=False














# print(soup.get_text())
# scoresParsed = []
# for element in scores:
#     if
# print(soup.find_all(class_="BNeawe deIvCb AP7Wnd"))
# print(soup.find_all(text="Celtics"))