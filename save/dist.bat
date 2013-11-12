rem  --  Distributes saving.html  --

if not "%1"=="" goto telocyklu
rem for %%x in (*.exe) do echo %%x
for %%x in (0 1 2 3 4 5 6 7 8 9 A B C D E F G H) do call dist.bat %%x
goto end


:telocyklu
copy saving.html %1\saving.html
copy loading.html %1\loading.html
:end