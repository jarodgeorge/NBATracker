import requests
from bs4 import BeautifulSoup
import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import time
import random
from fake_useragent import UserAgent
import psycopg2
from dotenv import load_dotenv
from datetime import datetime, timezone


load_dotenv()
# postgres info
postgres_password = os.getenv('POSTGRES_PW')
postgres_url = os.getenv('POSTGRES_URL')
postgres_port = os.getenv('POSTGRES_PORT')
postgres_user = os.getenv('POSTGRES_USER')
postgres_db = os.getenv('POSTGRES_DB')


# twilio info
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')


client = Client(account_sid, auth_token)

# for random user agent headers
ua = UserAgent()
# https://botproxy.net/pricing
# get new ones
proxies={
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
nba_teams = ["76ers", "Bucks", "Bulls", "Cavaliers", "Celtics", "Clippers", "Grizzlies", "Hawks", "Heat", "Hornets", "Jazz", "Kings", "Knicks", "Lakers", "Magic",
             "Mavericks", "Nets", "Nuggets", "Pacers", "Pelicans", "Pistons", "Raptors", "Rockets", "Spurs", "Suns", "Thunder", "Timberwolves", "Trail Blazers", "Warriors", "Wizards"]

nfl_teams = ["49ers", "Bears", "Bengals", "Bills", "Broncos", "Browns",	"Buccaneers", "Cardinals", "Chargers", "Chiefs", "Colts", "Cowboys", "Dolphins", "Eagles", "Falcons",
            "Football Team", "Giants", "Jaguars", "Jets", "Lions", "Packers", "Panthers", "Patriots", "Raiders", "Rams", "Ravens", "Saints", "Seahawks", "Steelers", "Texans", "Titans", "Vikings"]
# all_teams =nba_teams+nfl_teams
# all_teams=["Patriots"]
all_teams = nfl_teams



# twilio text functionality
def sendText(teamName, phoneNumber, gameTime):
    try:
        message = client.messages \
            .create(
                body=teamName+" are live. " + gameTime,
                from_=twilio_phone_number,
                to=phoneNumber
            )

        print(message.sid)
    except TwilioRestException as e:
        print(e)

# web scrapping call


def gameStatus(teamName,league):
    url = "https://www.google.com/search?q=" + teamName + " "+league + " "+ "score"
        
    #run if proxyies are valid
    req = requests.get(url, headers=headers,proxies=proxies) 
    # req = requests.get(url, headers=headers)
    soup = BeautifulSoup(req.content, 'html.parser')
    with open("soupTest.html", "w", encoding="utf-8") as file:
        file.write(str(soup.prettify()))

    scores = soup.find_all(class_="BNeawe deIvCb AP7Wnd")

    if len(scores) > 2:
        scores = [scores[1].text, scores[2].text]

    liveGame = soup.find_all(class_="rQMQod AWuZUe")
    if liveGame:
        liveGame = liveGame[0].text

    quarters = ["Q1", "Q2", "Q3", "Q4"]
    if len(liveGame) >= 2:
        isLive = False
        for quarter in quarters:
            if quarter in liveGame:
                isLive = quarter
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


    # establishing the connection
    conn = psycopg2.connect(
        database=postgres_db, user=postgres_user, password=postgres_password, host=postgres_url, port=postgres_port)
    conn.autocommit = True
    cursor = conn.cursor()
    #app time is EST based, currentTime is UTC based, adjust accordingly
    #change durring daylight savings time
    timeMap = {"12pm":24,"11pm":23, "10pm":22, "9pm":21,"8pm":20}
    currentTime = datetime.now(timezone.utc)
    offHours = (currentTime.hour >= 5 and currentTime.hour <= 15 )
    reset = False
    while True:
        if not offHours and not reset:
            cursor.execute(
                '''UPDATE alerts SET is_active = true''')
            reset = True

        if offHours:
            reset = False
            time.sleep(1000)
        else:
            for teamName in all_teams:
                print("Team name {0}".format(teamName))
                league = "NFL" if teamName in nfl_teams else "NBA"
                isGameLive = gameStatus(teamName,league)
                
                print("Game status {0}".format(isGameLive))
                # isGameLive ="Q1 3:59"
                time.sleep(random.randint(3, 30))
                if isGameLive and (isGameLive == "Halftime" or "Q1" in isGameLive):
                    if isGameLive == "Halftime":
                         cursor.execute(
                        '''SELECT * from alerts WHERE team_name=%s AND is_active=true AND (alert_category='All Game Halftimes' OR alert_category='When the Game is Good') ''',[teamName])
                    elif "Q1" in isGameLive:
                        cursor.execute(
                            '''SELECT * from alerts WHERE team_name=%s AND is_active=true AND alert_category='All Game Starts' ''',[teamName])

                    result = cursor.fetchall()
                    print("DB result: ")
                    print(result)
                    for res in result:
                        currentTeam = res[3]
                        currentPhone = res[2]
                        currentActive = res[5]
                        currentTimeRestriction = res[4]
                        if currentTimeRestriction !="Anytime":
                            # currentTimeRestriction = int("".join(c for c in currentTimeRestriction if c not in 'pma'))
                            currentTimeRestriction = timeMap[currentTimeRestriction]
                        #adjust for est
                        currentHour = currentTime.hour - 4
                        canTextUser = currentActive and (currentTimeRestriction == "Anytime" or currentTimeRestriction>=currentHour)
                        if canTextUser:
                            sendText(teamName, currentPhone, isGameLive)
                            cursor.execute(
                            '''UPDATE alerts SET is_active=false WHERE phone_number =%s AND team_name=%s''',[currentPhone,currentTeam])

