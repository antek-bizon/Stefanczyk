# Podstawy Bash-a

## Wprowadzenie

Bash to jedna z najpopularniejszych powłok systemów uniksowych. Jest domyślną powłoką w większości dystrybucji systemu GNU/Linux oraz w systemie macOS od wersji 10.3 do 10.14, istnieją także wersje dla większości systemów uniksowych. Bash jest także domyślną powłoką w środowisku Cygwin i MinGW dla systemów Win32. 
Bash pozwala na pracę w trybie konwersacyjnym i w trybie wsadowym. Język basha umożliwia definiowanie aliasów, funkcji, zawiera konstrukcje sterujące przepływem (`if`, `while`, `for`, ...). Powłoka systemowa zachowuje historię wykonywanych poleceń i zapisuje ją domyślnie w pliku .bash_history w katalogu domowym użytkownika. 

#
## Historia

Nazwa jest akronimem od Bourne-Again Shell (angielska gra słów: fonetycznie brzmi tak samo, jak born again shell, czyli odrodzona powłoka). Wywodzi się od powłoki Bourne’a sh, która była jedną z pierwszych i najważniejszych powłok systemu UNIX oraz zawiera pomysły zawarte w powłokach Korna i csh. Bash był pisany głównie przez Briana Foksa i Cheta Rameya w 1987 roku. 

#
## Język powłoki Bash

### Tworzenie pierwszego skryptu

Aby stworzyć skrypt, należy utworzyć plik z rozszerzenie `.sh` lub bez rozszerzenia. Nadaj mu uprawnienia wykonywania (np. `chmod 755 skrypt.sh`). Następnie w pliku na samym początku piszemy `#!` i ścieżkę do pliku, który go wykonuje (np. `/bin/bash` lub `/usr/bin/bash`).

### Wypisywanie do konsoli
Do wypisywania danych dla użytkownika w konsoli używamy polecenia `echo`.

Przykład:

```bash
#!/bin/bash
echo 'Witaj w skrypcie'
```

#
### Zmienne programowe
Aby utworzyć zmienną piszemy jej nazwę_zmiennej=wartość. Aby jej użyć piszemy „$nazwa_zmiennej”. 

Przykład:

```bash
#!/bin/bash
x1=55             # Przypisz liczbę 55 do zmiennej x1. Uwaga: Nie może być spacji przed i po znaku równości!
```

#
### Zmienne specjalne

To najbardziej prywatne zmienne powłoki, są udostępniane użytkownikowi tylko do odczytu (są wyjątki). Kilka przykładów:

- `$0`: nazwa bieżącego skryptu lub powłoki

```bash
#!/bin/bash
echo "$0"
```

Pokaże nazwę uruchomionego skryptu.

- `$1..$9`: Parametry przekazywane do skryptu (wyjątek, użytkownik może modyfikować ten rodzaj $-ych specjalnych.

```bash
#!/bin/bash
echo "$1 $2 $3"
```

Jeśli wywołany zostanie skrypt z jakimiś parametrami to przypisane zostaną zmiennym: od $1 do $9. Zobacz co się stanie jak podasz za małą liczbę parametrów oraz jaki będzie wynik podania za dużej liczby parametrów.

- `$@`: Pokaże wszystkie parametry przekzywane do skryptu (też wyjątek), równoważne $1 $2 $3..., jeśli nie podane są żadne parametry $@ interpretowana jest jako nic.

```bash
#!/bin/bash
echo "Skrypt uruchomiono z parametrami: $@"
```

A teraz wywołaj ten skrypt z jakimiś parametrami, mogą być brane z powietrza np.:

```
./plik -a d
```

Efekt będzie wyglądał następująco: Skrypt uruchomiono z paramertami `-a d`

- `$?`: kod powrotu ostanio wykonywanego polecenia
- `$$`: PID procesu bieżącej powłoki

#
### Zmienne środowiskowe

Definują środowisko użytkownika, dostępne dla wszystkich procesów potomnych. Można je podzielić na:
- globalne: widoczne w każdym podshellu
- lokalne: widoczne tylko dla tego shella w którym został ustawione

Aby bardziej uzmysłowić sobie różnicę między nimi zrób mały eksperyment: otwórz xterma (widoczny podshell) i wpisz:

```bash
x="napis" # zdefiniowałeś właśnie zmienną x, która ma wartość "napis"
echo $x #wyświetli wartość zmiennej x
xterm #wywołanie podshella
```

wpisz więc jeszcze raz:

`echo $x` nie pokaże nic, bo zmienne lokalne nie są widoczne w podshellach.

Możesz teraz zainicjować zmienną globalną:

```bash
export x="napis"
```

Teraz zmienna `x` będzie widoczna w podshellach, jak widać wyżej służy do tego polecenie export, nadaje ono wskazanym zmiennym atrybut zmiennych globalnych. W celu uzyskania listy aktualnie eksportowanych zmiennych należy wpisać export, opcjonalnie `export -p` . Na tej liście przed nazwą każdej zmiennej znajduje się zapis:

```bash
declare-x
```

To wewnętrzne polecenie Bash-a, służące do definiowania zmiennych i nadawania im atrybutów, `-x` to atrybut eksportu czyli jest to, to samo co polecenie export. Ale tu uwaga! Polecenie declare występuje tylko w `Bash-u`, nie ma go w innych powłokach, natomiast `export` występuje w `ksh`, `ash` i innych, które korzystają z plików startowych `/etc/profile`. Dlatego też zaleca się stosowanie polecenia `export`.

```bash
export -n zmienna
```

spowoduje usunięcie atrybutu eksportu dla danej zmiennej

Niektóre przykłady zmiennych środowiskowych:

```bash
$HOME         #ścieżka do twojego katalogu domowego
$USER         #twój login
$HOSTNAME     #nazwa twojego hosta
$OSTYPE       #rodzaj systemu operacyjnego
```

itp. dostępne zmienne srodowiskowe można wyświetlić za pomoca polecenia:

```bash
printenv | more
```

#
### Zmienne tablicowe

`Bash` pozwala na stosowanie zmiennych tablicowych jednowymiarowych. Czym jest tablica? To zmienna która przechowuje listę jakichś wartości (rozdzielonych spacjami), w `Bash'u` nie ma maksymalnego rozmiaru tablic. Kolejne wartości zmiennej tablicowej indexowane są przy pomocy liczb całkowitych, zaczynając od 0.

```bash
#!/bin/bash
tablica=(element1 element2 element3)
echo ${tablica[0]}
echo ${tablica[1]}
echo ${tablica[2]}
```

Zadeklarowana została zmienna tablicowa o nazwie: `tablica`, zawierająca trzy wartości:
- `element1`
- `element2` 
- `element3`
  
Natomiast polecenie: `echo ${tablica[0]}` wydrukuje na ekranie pierwszy elementu tablicy. W powyższym przykładzie w ten sposób wypisana zostanie cała zawartość tablicy. Do elementów tablicy odwołuje się za pomocą wskaźników.

---

#### **Odwołanie do elementów tablicy.**

Składnia:

```bash
${nazwa_zmiennej[wskaźnik]}
```

Wskaźnikiami są indexy elementów tablicy, począwszy od 0 do n oraz `@`, `*`. Gdy odwołując się do zmiennej nie poda się wskaźnika: `${nazwa_zmiennej}` to nastąpi odwołanie do elementu tablicy o indexie 0.Jeśli wskaźnikiem będą: @ lub * to zinterpretowane zostaną jako wszytskie elementy tablicy, w przypadku gdy tablica nie zawiera żadnych elemntów to zapisy: `${nazwa_zmiennej[wskaźnik]}` lub `${nazwa_zmiennej[wskaźnik]}` są interpretowane jako nic.

Przykład:

Poniższy skrypt robi to samo co wcześniejszy.

```bash
#!/bin/bash
tablica=(element1 element2 element3)
echo ${tablica[*]}
```

Można też uzyskać długość (liczba znaków) danego elementu tablicy:

Przykład:

```bash
#!/bin/bash
tablica=(element1 element2 element3)
echo ${#tablica[0]}
```
Polecenie echo ${#tablica[0]} wydrukuje liczbę znaków z jakich składa się pierwszy element tablicy: element1 wynik to 8. W podobny sposób można otrzymać liczbę wszystkich elementów tablicy, wystarczy jako wskaźnik podać: @ lub *.

Przykład:

```bash
#!/bin/bash
tablica=(element1 element2 element3)
echo ${#tablica[@]}
```

Co da wynik: 3.

---

#### **Dodawanie elementów do tablicy**

Przykład:

```bash
#!/bin/bash
tablica=(element1 element2 element3)
tablica[3]=element4
echo ${tablica[@]}
```

Jak wyżej widać do tablicy został dodany `element4` o indexie 3. Mechanizm dodawania elementów do tablicy, można wykorzystać do tworzenia tablic, gdy nie istnieje zmienna tablicowa do której dodajemy jakiś element, to `Bash` automatycznie ją utworzy:

```bash
#!/bin/bash
linux[0]=slackware
linux[1]=debian
echo ${linux[@]}
```

Utworzona została tablica linux zawierająca dwa elementy.

---

#### **Usuwanie elementów tablic i całych tablic**

Dany element tablicy usuwa się za pomocą polecenia unset.

Przykład:

```bash
#!/bin/bash
tablica=(element1 element2 element3)
echo ${tablica[@]}
unset tablica[2]
echo ${tablica[*]}
```

Usunięty został ostatni element tablicy.

Aby usunąć całą tablicę wystarczy podać jako wskaźnik: `@` lub `*`.

```bash
#!/bin/bash
tablica=(element1 element2 element3)
unset tablica[*]
echo ${tablica[@]}
```

Zmienna tablicowa o nazwie tablica przestała istnieć, polecenie: `echo ${tablica[@]}` nie wyświetli nic. 

#
### Działania arytmetyczne

Bash, w odróżnieniu od sh, umożliwia wykonanie obliczeń za pomocą wyrażeń w podwójnych nawiasach `((...))` oraz składni `$[...]`. 

Przykład: 

```bash
 ((x1 = x1 + 1))   # Dodaj jeden do x1. Nie stawia się tutaj znaku '$'.
 echo $((x1 + 1))  # Wypisz wartość x1+1 na ekran.
 ((++x1))          # Zwiększenie o jeden w stylu języka C.
 ((x1++))          # Podobnie jak powyżej ale teraz post-inkrementacja.
 echo $[x1=x1*20]  # Pomnóż x1 przez 20, zapisz wynik do x1 i wypisz wynik na ekran.
 echo $((x1 * 20)) # To samo co powyżej, ale nie zapisuj wyniku do zmiennej.
 echo $((x1<1000)) # Sprawdź czy x1 jest mniejsze od 1000. Jeden oznacza prawdę.
```

#
### Pobieranie danych od użytkownika
Do pobrania danych od użytkownika korzystamy z `read nazwa_zmiennej`. To polecenie to czeka na wciśnięcie klawisza `Enter`, a następnie wpisane dane przypisuje do podanej zmiennej.

```bash
echo 'Jak masz na imię?'
read zmienna
echo "Twoje imie to: $zmienna"
```

Wybrane opcje:
- `-p`: pokaże znak zachęty bez kończącego znaku nowej linii

```bash
#!/bin/bash
read -p "Pisz:" odp
echo "$odp"
```

- `-a`: kolejne wartości przypisywane są do kolejnych indeksów zmiennej tablicowej

```bash

#!/bin/bash
echo "Podaj elementy zmiennej tablicowej:"
read tablica
echo "${tablica[*]}"`
```

- `-e`: jeśli nie podano żadnej nazwy zmienej, wiersz trafia do $REPLY

```bash

#!/bin/bash
echo "Wpisz coś:"
read -e
echo "$REPLY"
```

- `-t timeout`: czas wygaśnięcia w sekundach

- `-s`: nie wyświetlaj znaków wpisanych przez użytkownika

```bash
#!/bin/bash
#Hasło wpisywane bez echa, max. przez 30 sekund
read -p "Password: " -s  -t 30 password
echo $password
```

#
### Zapisywanie do pliku
Aby zapisać coś do pliku używamy `>` (nadpisuje cały plik) lub `>>` (dopisuje do pliku). 

Przykład:

```bash
#!/bin/bash
echo 'Witaj w generatorze wizytówek v. 13.666'
echo '#####################################'
echo 'Program poprosi cię o wpisanie różnych danych.'
echo 'Po wpisaniu wciśnij Enter by przejść dalej.'
echo '#####################################'
echo 'Podaj swoje Imię i Nazwisko:'
read name
echo 'Podaj swój adres E-Mail:'
read mail
echo 'Podaj numer Gadu-Gadu:'
read gg
echo '#####################################'
echo 'Pobieranie danych zakończone'
touch wizytowka.txt
echo "$name" >> wizytowka.txt
echo "Email: $mail" >> wizytowka.txt
echo "Gadu-Gadu $gg" >> wizytowka.txt
echo 'Generowanie wizytówki zakończone'
echo 'Plik wizytowka.txt gotowy!'
echo '#####################################'
```

#
### Instrukcje warunkowe

Aby wykonać instrukcję warunkową piszemy:

```bash
if komenda then
    akcja
fi
```
lub:
```bash
if komenda then
    akcja
else
    akcja
fi
```

jeżeli chcemy, by wykonała się akcja, gdy warunek nie zostanie spełniony.
Dostępne porównania i operacje logiczne to:

#### PORÓWNANIA LICZBOWE
- `-gt`: większy od
- `-lt`: mniejszy od
- `-ge`: większy, równy od
- `-le`: mniejszy, równy od
- `-eq`: równy
- `-ne`: różny od

#### PORÓWNANIA TEKSTOWE
- `-z`: sprawdza czy ciąg jest pusty
- `-n`: sprawdza wartość ciągu
- `=`: równy
- `!=`: różny
- `Str`: sprawdza czy ciąg jest zerowy 

#### OPERACJE LOGICZNE
- `-a`: Logiczne i (zamiast -a można stosować &&)
- `-o`: Logiczne lub (można stosować też ||)
- `!`: Logiczne nie

#### TESTY NA PLIKACH
- `-f`: Plik istnieje i jest zwykłym plikiem
- `-s`: Plik nie jest pusty
- `-r`: Plik jest możliwy do odczytu
- `-w`: Plik może być modyfikowany
- `-x`: Plik może być uruchamiany
- `-d`: Jest katalogiem
- `-h`: Jest dowiązaniem symbolicznym
- `-c`: Nazwa odnosi się do urządzenia
  
Przykład:

```bash
if [ "$#" -gt 2 ]
    then
        echo 'Podałeś więcej niż 2 parametry'
else
    echo 'Podałeś mniej niż 2 parametry'
fi
```
  
---

Wielkość liter operatorów i spacje mają znaczenie! Powyższy kod wyświetli "Podałeś więcej niż 2 parametr" jeżeli wywołamy skrypt z 3 lub większą ilością parametrów, a "Podałeś mniej niż 2 parametry" jeżeli będzie ich 2 lub mniej. Instrukcje warunkowe można rozbudowywać o `elif` - else if: 

```bash
if [ "$#" -gt 2 ]
    then
    echo 'Podałeś więcej niż 2 parametry'
elif [ "$#" -eq 2 ]
    then
    echo 'Podałeś 2 parametry'
else
    echo 'Podałeś mniej niż 2 parametry'
fi
```

#
### Instrukcja case

Pozwala na dokonanie wyboru spośród kilku wzorców. Najpierw sprawdzana jest wartość zmiennej po słowie kluczowym `case` i porównywana ze wszystkimi wariantami po kolei. Oczywiście musi być taka sama jak wzorzec do którego chcemy się odwołać. Jesli dopasowanie zakończy się sukcesem wykonane zostanie polecenie lub polecenia przypisane do danego wzorca. W przeciwnym wypadku użyte zostanie polecenie domyślne oznaczone symbolem gwiazdki: `*)` polecenie_domyślne. Co jest dobrym zabezpieczeniem na wypadek błędów popełnionych przez użytkownika naszego skrytpu.

Przykład:

```bash
#!/bin/bash
echo "Podaj cyfrę dnia tygodnia"
read d
case "$d" in
    "1") echo "Poniedziałek" ;;
    "2") echo "Wtorek" ;;
    "3") echo "Środa" ;;
    "4") echo "Czwartek" ;;
    "5") echo "Piątek" ;;
    "6") echo "Sobota" ;;
    "7") echo "Niedziela" ;;
    *) echo "Nic nie wybrałeś"
esac
```

Przy zastosowaniu `;;` po przypasowaniu do warunku i wykonaniu instrukcji wychodzi z konstrukcji `case`. Przy zastosowaniu `;&` wykonuje instrukcje także kolejnego warunku.
Jak widać mamy w skrypcie wzorce od 1 do 7 odpowiadające liczbie dni tygodnia, każdemu przypisane jest jakieś polecenie, tutaj ma wydrukować na ekranie nazwę dnia tygodnia. Jeśli podamy 1 polecenie `read` czytające dane ze standardowego wejścia przypisze zmiennej `d` wartość 1 i zostanie wykonany skok do wzorca 1, na ekranie zostanie wyświetlony napis Poniedziałek. W przypadku gdy podamy cyfrę o liczbie większej niż 7 lub wpiszemy inny znak na przykład literę to wykonany zostanie wariant defaultowy oznaczony gwiazdką:
`*) echo "Nic nie wybrałeś"`.

# 
### Pętle
Wyróżniamy 4 rodzaje pętl:
- `while komenda do akcja done` - while wykonuje akcję dopóki komenda ma wartość Prawda (true)

```bash
#!/bin/bash
x=1;
while [ $x -le 10 ]; do
    echo "Napis pojawił się po raz: $x"
    x=$[x + 1]
done
```

Sprawdzany jest warunek czy zmienna `x` o wartości początkowej 1 jest mniejsza lub równa 10, warunek jest prawdziwy w związku z czym wykonywane są polecenia zawarte wewnątrz pętli: `echo "Napis pojawił się po raz: $x" oraz x=$[x + 1]`, które zwiększa wartość zmiennej `x` o 1. Gdy wartość `x` przekroczy 10, wykonanie pętli zostanie przerwane.

- `until komenda do akcja done` - until wykonuje akcję dopóki komenda ma wartość Fałsz (false)

```bash
#!/bin/bash
x=1;
until [ $x -ge 10 ]; do
    echo "Napis pojawił się po raz: $x"
    x=$[x + 1]
done
```

Mamy zmienną `x`, która przyjmuje wartość 1, następnie sprawdzany jest warunek czy wartość zmiennej `x` jest większa lub równa 10, jeśli nie to wykonywane są polecenia zawarte wewnątrz pętli. W momencie gdy zmienna `x` osiągnie wartość, 10 pętla zostanie zakończona.

- `for zmienna in lista-wartości do akcja done` - pętla for-in zaprojektowana została do użytku z listami wartości. Są one kolejno przyporządkowywane zmiennej

```bash
#!/bin/bash
for plik in /home/piotr/*
do
    echo "Plik lub katalog: $plik"
done
```

Dla każdego elementu w `/home/piotr` (plik lub katalog) wykonaj (do) `echo`. Po kolei nazwa pliku/katalogu przypisywana jest zmiennej `plik`.

- `for zmienna do akcja done` - odnosi się do argumentów skryptu przyporządkowując je kolejno zmiennej

```bash
#!/bin/bash
for parametr
do
    echo "Plik $parametr ma hasza:"
    md5sum $parametr
done
```

Skrypt wywołujemy: `skrypt.sh plik1.txt plik2.txt` - z nazwami plików jako parametry. Dla każdego pliku (w tym przykładzie, nie muszą to być zawsze pliki) obliczamy sumę kontrolną w `md5`.

- `select zmienna in lista-wartości do akcja done` - Wygeneruje z listy słów po in proste ponumerowane menu, każdej pozycji odpowiada kolejna liczba od 1 wzwyż

```bash
#!/bin/bash
echo "Co wybierasz?"
select y in X Y Z Quit
do
    case $y in
        "X") echo "Wybrałeś X" ;;
        "Y") echo "Wybrałeś Y" ;;
        "Z") echo "Wybrałeś Z" ;;
        "Quit") exit ;;
        *) echo "Nic nie wybrałeś"
    esac
break
done
```

Najpierw zobaczymy proste ponumerowane menu, składające się z czterech elementów: `X`, `Y`, `Z` i `Quit`, teraz wystarczy tylko wpisać numer inetersującej nas opcji, a resztę zrobi instrukcja `case`. Polecenie `break`, które znajduje się w przedostatniej linii skryptu, kończy pracę pętli. Słowo kluczowe `continue` - przerywa wykonywanie instrukcji w ciele pętli i przechodzi do następnej iteracji.

#
### Wyjście ze skryptu

Aby zakończyć wykonywanie skryptu używamy polecenia `exit`. Jako argument przyjmuje stan zakończenia. Domyślnie status 0.

```bash
exit 10
```

#
### Funkcje

Stosuje się je gdy w naszym skrypcie powtarza się jakaś grupa poleceń, po co pisać je kilka razy, skoro można to wszystko umieścić w funkcjach. Do danej funkcji odwołujemy się podając jej nazwę, a wykonane zostanie wszystko co wpisaliśmy między nawiasy { }, skraca to znacznie długość skryptu.

Składnia:

```bash
function nazwa_funkcji
{
    polecenie1
    polecenie2
    polecenie3
}
```

lub:

```bash
function nazwa_funkcji()
{
    polecenie1
    polecenie2
    polecenie3
}
```

Przykład:

```bash
#!/bin/bash
function napis
{
    echo "To jest napis"
}

napis
```

Nazwę funkcji umieszczamy po słowie kluczowym function, w powyższym przykładzie mamy funkcje o nazwie napis, odwołujemy się do niej podając jej nazwę, wykonane zostaną wtedy wszystkie polecenia, jakie jej przypiszemy.

Funkcje moga się znajdować w innym pliku, co uczyni nasz skrypt bardziej przejrzystym i wygodnym, tworzy się własne pliki nagłówkowe, wywołuje się je tak:

```
. ~/naszplik_z_funkcjami
nazwa_funkcji
```

Trzeba pamiętać o podaniu kropki + spacja przed nazwą pliku

Przykład:

```bash
#!/bin/bash
function nasza_funkcja
{
    echo -e 'Właśnie użyłeś funkcji o nazwie "nasza_funkcja".\a'
}
```

Teraz pozostało jeszcze utworzyć skrypt w którym wywołamy funkcje: nasza_funkcja:

```bash
#!/bin/bash
echo "Test funkcji."
. funkcja
nasza_funkcja
```

---

#### **Przekazywanie parametrów**

Przekazanie parametrów do funkcji następuje dokładnie tak samo jak do każdego polecenia które jest w skrypcie:

```bash
nazwa_funkcji parametr_1 parametr_2
```

Przykład:

```bash
#!/bin/bash
funkcja_z_parametrami()
{
    echo "Przekazano $# parametrów"
    echo "Parametr $1"
    echo "Parametr $2"
}

funkcja_z_parametrami "param1" "param2"
```

Zmienna specjalna $0 przechowujaca nazwę skryptu nie jest dostępna!!! Choć na pierwszy rzut oka powinna przechowywać nazwę funkcji. 