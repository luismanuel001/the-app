:: Name:     hexo-admin.bat
:: Purpose:  Wrapper for running hexo-admin on Windows
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: July 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: NodeJS
SET node=%rootdir%..\_internal\runtime\nodejs\nodejs

%node% %rootdir%..\_internal\bin\hexo-admin.js

:: PAUSE
ECHO ON
