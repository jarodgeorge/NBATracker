https://www.youtube.com/watch?v=ldYcgPKEZC8&t=1958s&ab_channel=freeCodeCamp.org
CREATE DATABASE sports_alerts;


CREATE TABLE alerts(
    alert_id SERIAL PRIMARY KEY,
    alert_category VARCHAR(255),
    phone_number VARCHAR(255),
    team_name VARCHAR(255),
    time_restriction VARCHAR(255),
    is_active BOOLEAN,
    UNIQUE (phone_number,team_name)
);
