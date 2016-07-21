:: Name:     hexo.bat
:: Purpose:  Wrapper for running hexo commands on Windows
:: Author:   Luis Manuel <luisman40@gmail.com>
:: Revision: July 2016 - initial version

@ECHO OFF
SETLOCAL ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

:: variables
SET rootdir=%~dps0
:: NodeJS
SET node=%rootdir%..\_internal\runtime\nodejs\nodejs

SET args=%*

%node% %rootdir%hexo.js %args%

:: PAUSE
ECHO ON
