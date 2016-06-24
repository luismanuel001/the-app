:: Name:     testRedis.bat
:: Purpose:  Script to test redis server configuration
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: June 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: Library to parse JSON
SET jq=%rootdir%_internal\tools\jq\jq
:: Redis executable directory
SET redispath=%rootdir%_internal\tools\redis2.8.2400-xp32bit\
:: Config files
SET redisconfig=%rootdir%config\databases\redis.json

:: Set redis config variables (redisport, redishost, redisauth)
<%redisconfig% %jq% -r ".redis|to_entries|.[]|\"SET redis\(.key)=\(.value)\"" > %rootdir%setvars.bat
CALL %rootdir%setvars.bat
del %rootdir%setvars.bat
if "%redishost%"=="bundled" (
  SET redishost=127.0.0.1
)
ECHO Redis Host %redishost%:%redisport%

:: Testing Redis
ECHO Inserting key1="Hello": SET key1 "Hello"
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% SET key1 "Hello"
ECHO Getting value of key1: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% GET key1
ECHO Appeding " World" to the value of key1: APPEND key1 " World"
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% APPEND key1 " World"
ECHO Getting new value of key1: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% GET key1
ECHO Deleting key1: DEL key1
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% DEL key1
ECHO Verifying key1 was deleted: GET key1
%redispath%redis-cli -h %redishost% -p %redisport% -a %redisauth% GET key1

PAUSE
ECHO ON
