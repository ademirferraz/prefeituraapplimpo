@echo off
echo Procurando por setSenha, setDataNascimento ou setConfirmarSenha...
echo --------------------------------------------

for /R %%f in (*.js) do (
  findstr /I "setSenha setDataNascimento setConfirmarSenha" "%%f" >nul
  if not errorlevel 1 (
    echo %%f
  )
)

echo --------------------------------------------
echo Busca concluída.
pause
