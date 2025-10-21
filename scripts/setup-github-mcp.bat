@echo off
REM 🐙 GitHub MCP Setup Script para ClubNath (Windows)
REM Este script configura automaticamente o GitHub MCP no Claude Desktop

setlocal enabledelayedexpansion

echo ========================================
echo    GitHub MCP Setup - ClubNath
echo ========================================
echo.

REM Definir caminho do config
set CONFIG_DIR=%APPDATA%\Claude
set CONFIG_FILE=%CONFIG_DIR%\claude_desktop_config.json

echo Caminho do config: %CONFIG_FILE%
echo.

REM Verificar Node.js
echo Verificando Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado
    echo Instale Node.js 18+ de: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% encontrado
echo.

REM Verificar npx
echo Verificando npx...
where npx >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] npx nao encontrado
    pause
    exit /b 1
)

echo [OK] npx encontrado
echo.

REM Solicitar GitHub Token
echo ┌─────────────────────────────────────────────┐
echo │  GITHUB PERSONAL ACCESS TOKEN NECESSARIO   │
echo └─────────────────────────────────────────────┘
echo.
echo Para criar um token:
echo 1. Acesse: https://github.com/settings/tokens/new
echo 2. Nome: 'Claude MCP - ClubNath'
echo 3. Selecione scopes:
echo    - [x] repo (acesso completo a repositorios)
echo    - [x] workflow (GitHub Actions)
echo    - [x] read:org (ler organizacoes)
echo 4. Gere e copie o token (comeca com 'ghp_')
echo.
set /p GITHUB_TOKEN="Cole seu GitHub Token (ghp_...): "

REM Validar token
echo %GITHUB_TOKEN% | findstr /R "^ghp_" >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Token invalido. Deve comecar com 'ghp_'
    pause
    exit /b 1
)

echo.
echo Testando token...

REM Testar token via curl (se disponível)
curl --version >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    curl -s -o nul -w "%%{http_code}" -H "Authorization: token %GITHUB_TOKEN%" https://api.github.com/user > temp_response.txt
    set /p HTTP_CODE=<temp_response.txt
    del temp_response.txt

    if "!HTTP_CODE!" NEQ "200" (
        echo [ERRO] Token invalido ou sem permissoes
        pause
        exit /b 1
    )
    echo [OK] Token valido!
) else (
    echo [AVISO] curl nao encontrado, pulando validacao do token
)

echo.

REM Obter caminho do projeto
set PROJECT_PATH=%~dp0..
pushd %PROJECT_PATH%
set PROJECT_PATH=%CD%
popd

echo Caminho do projeto: %PROJECT_PATH%
echo.

REM Solicitar senha do PostgreSQL (opcional)
echo Configuracao do PostgreSQL (Supabase)
echo Deixe em branco para pular esta etapa
set /p POSTGRES_PASSWORD="Senha do PostgreSQL (Supabase): "
echo.

REM Criar diretório de config se não existir
if not exist "%CONFIG_DIR%" (
    echo Criando diretorio de configuracao...
    mkdir "%CONFIG_DIR%"
)

REM Backup do config existente
if exist "%CONFIG_FILE%" (
    set BACKUP_FILE=%CONFIG_FILE%.backup.%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
    set BACKUP_FILE=!BACKUP_FILE: =0!
    echo Fazendo backup da configuracao existente...
    copy "%CONFIG_FILE%" "!BACKUP_FILE!" >nul
    echo [OK] Backup salvo em: !BACKUP_FILE!
    echo.
)

REM Criar configuração
echo Criando configuracao MCP...

if "%POSTGRES_PASSWORD%"=="" (
    REM Sem PostgreSQL
    (
        echo {
        echo   "mcpServers": {
        echo     "clubnath-github": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-github"
        echo       ],
        echo       "env": {
        echo         "GITHUB_PERSONAL_ACCESS_TOKEN": "%GITHUB_TOKEN%"
        echo       }
        echo     },
        echo     "clubnath-filesystem": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-filesystem",
        echo         "%PROJECT_PATH:\=\\%"
        echo       ]
        echo     },
        echo     "clubnath-memory": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-memory"
        echo       ]
        echo     }
        echo   }
        echo }
    ) > "%CONFIG_FILE%"
) else (
    REM Com PostgreSQL
    (
        echo {
        echo   "mcpServers": {
        echo     "clubnath-github": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-github"
        echo       ],
        echo       "env": {
        echo         "GITHUB_PERSONAL_ACCESS_TOKEN": "%GITHUB_TOKEN%"
        echo       }
        echo     },
        echo     "clubnath-filesystem": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-filesystem",
        echo         "%PROJECT_PATH:\=\\%"
        echo       ]
        echo     },
        echo     "clubnath-postgres": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-postgres",
        echo         "postgresql://postgres:%POSTGRES_PASSWORD%@db.bbcwitnbnosyfpfjtzkr.supabase.co:5432/postgres"
        echo       ]
        echo     },
        echo     "clubnath-memory": {
        echo       "command": "npx",
        echo       "args": [
        echo         "-y",
        echo         "@modelcontextprotocol/server-memory"
        echo       ]
        echo     }
        echo   }
        echo }
    ) > "%CONFIG_FILE%"
)

echo [OK] Configuracao criada com sucesso!
echo.

REM Resumo
echo ┌─────────────────────────────────────────────┐
echo │          CONFIGURACAO CONCLUIDA! 🎉         │
echo └─────────────────────────────────────────────┘
echo.
echo MCPs configurados:
echo   [OK] clubnath-github (GitHub API)
echo   [OK] clubnath-filesystem (Arquivos locais)
if not "%POSTGRES_PASSWORD%"=="" (
    echo   [OK] clubnath-postgres (Supabase DB)
)
echo   [OK] clubnath-memory (Memoria persistente)
echo.
echo Proximos passos:
echo 1. Reinicie o Claude Desktop completamente
echo 2. Abra o Claude e teste: 'Liste as issues do ClubNath'
echo 3. Consulte docs\GITHUB_MCP_SETUP.md para mais informacoes
echo.
echo Setup completo! 🚀
echo.

pause
