// Nasluchuj zawartosc DOM
document.addEventListener( 'DOMContentLoaded', function(){
    // Stworz metode ktora przechowa w zmiennej zarowno numery jak i litery aby wykorzystac ja pozniej w id za pomoca pluginu mustache
    function randomString(){
        var chars = '0123456789abcdefghijklmnoprstuvwyxzABCDEFGHIJKLMNOPRSTUVWYXZ';
        // Stworz zmienna ktora rowna sie pustej wartosci
        var str = '';
        // Stworz petle ktora przejdzie przez wszystkie znaki zmiennej chars
        for( var i = 0; i < 10; i++ ){
            // Dopisz do zmiennej str zmienna chars i uzyj funkcji Math ktora za kazdym razem losuje znaki w zmiennej chars 
            // i pomnoz przez jej dlugosc 
            str = str + chars[ Math.floor( Math.random() * chars.length ) ];
        }
        // Zwroc to co zostalo dopisane w petli do zmiennej str ktora juz nie jest pusta
        return str;
    }
    // Stworz funkcje konstruujaca ktora zawiera 3 argumenty
    function generateTemplate( name, data, basicElement ){
        // Zadeklaruj zmienna rowna wyszukaniu nazwy id zapisanej w argumencie funkcji i uzyj innerHTML aby pozniej ja wyswietlic
        var template = document.getElementById( name ).innerHTML;
        // Deklaruj zmienna i przypisz stworzenie nowego elementu do argumentu funkcji a jesli nie zostanie znaleziona wtedy
        // domyslnie uzyj elementu div za pomoca operacji logicznej OR
        var element = document.createElement( basicElement || 'div' );
        // Uzyj parametru mustache i sparsuj za pomoca metody parse aby przyspieszyc wyswietlanie szablonu na stronie
        // uzywajac zmiennej ktora szuka nazwy id  
        Mustache.parse( template );
        // Uzyj zmienna w ktorej tworzymy nowy element div i za pomoca innerHTML przypisz wygenerowany szablon
        element.innerHTML = Mustache.render( template, data );
        // Zwroc to co mustache wyrenderowal
        return element;
    }
    // Stworz funkcje konstruujaca z jednym argumentem
    function Column( name ){
        // Przypisz do zmiennej metode this aby uniknac braku kontekstu (nie jest widzialna)
        // gdy odwlujemy sie do parametru funkcji w srodku funkcji
        var self = this;
        //Stworz nowy parametr i Uzyj "this" ktory odwoluje sie do argumentu name i przypisz funkcje ktora generuje znaki losowo
        this.id = randomString();
        // Stworz nowy parametr
        this.name = name;
        // Stworz nowy parametr i przypisz funkcje ktora zwraca dwa argumenty:
        // nazwe klasy i uzycie metody mustache do wyswietlenia zawartosci w HTML
        this.element = generateTemplate( 'column-template', { name: this.name } );
        // Uzyj tego parametru aby wyszukac nazwe klasy i nasluchuj gdy przycisk usuwania elementu zostanie klikniety i zapisz
        // zdarzenie jako argument w warunku funkcji
        this.element.querySelector( '.column' ).addEventListener( 'click', function( event ){
            // Sprawdz czy zdarzenie przechowuje przycisk, jesli prawda, wykonaj operacje w przeciwnym razie nie rob nic
            if( event.target.classList.contains( 'btn-delete') ){
                // Uzyj zmiennej ktora przechowuje metode "this" aby byla widzialna w srodku funkcji ktora usuwa kolumne
                self.removeColumn();
            }
            // Jesli element zostal znaleziony dodaj nowa karte i wyswietl w nowym oknie w ktorym pytamy uzytkownika
            // o wpisanie nazwy nowej karty
            if( event.target.classList.contains( 'add-card' ) ){
                self.addCard( new Card( prompt( 'Enter the name of the card.' ) ) );
            }
        });
    }
    // Dopisz do funkcji kolumn parametr prototype i dodaj w srodku nowe metody
    Column.prototype = {
        // Dodaj metode ktora bedzie dodawala karty do szablonu
        addCard: function( card ){
            // Odwolaj sie do elementu ktory przechowuje generowanie szablonu, wyszukaj element ul a nastepnie
            // dodaj dziecko rodzica i przypisz do wygenerowanego szablonu? (nie wiem do czego sie odwoluje argument card...)
            this.element.querySelector( 'ul' ).appendChild( card.element );
        },
        // Utworz metode ktora bedzie usuwac columny z szablonu
        removeColumn: function(){
            // Usuwanie dziecka rodzica elementu z kolumny 
            this.element.parentNode.removeChild( this.element );
        }
    };
    // Utworz funkcje konstruujaca ktora przechowuje argument odnosnie opisu karty
    function Card( description ){
        // Zapisz metode "this" w nowej zmiennej
        var self = this;
        // Ponownie utworz nowe parametry ktore przechowaja losowe znaki i generowanie opisu w szablonie i umiesc w elemencie li?!
        this.id = randomString();
        this.description = description;
        this.element = generateTemplate( 'card-template', { description: this.description }, 'li' );
        // Wyszukaj element o klasie i nasluchuj klikniecie zdarzenia
        this.element.querySelector( '.card' ).addEventListener( 'click', function( event ) {
            // Uzyj argumentu aby powstrzymac przejscie linka do nowej strony
            event.stopPropagation();
            // Jesli zdarzenie posiada element klasy to usun karte
            if( event.target.classList.contains( 'btn-delete' ) ){
                self.removeCard();
            }
        });
    }
    // Utworz prototyp funkcji i przypisz do funkcji Card
    Card.prototype = {
        // Stworz metode ktora usunie karte jesli dziecko rodzica zostanie znalezione 
        // (this.element caly czas odwoluje sie do generowania szablonu co zapisalismy na poczatku w funkcji konstruujacej Columny, tak?)
        removeCard: function(){
            this.element.parentNode.removeChild( this.element );
        }
    }
    // Utworz nowa zmienna przechowujaca obiekty
    var board = {
        name: 'Kanban Board',
        // Utworz obiekt w postaci metody i dodaj dziecko elementu do kolumny
        addColumn: function( column ){
            this.element.appendChild( column.element );
            // Sortuj kolumne za pomoca unikalnej nazwy id
            initSortable( column.id );
        },
        // Utworz obiekt ktory przechowa wyszukiwanie elementu w szablonie
        element: document.querySelector( '#board .column-container' )
    }
    // Utworz funkcje ktora jako argument otrzyma nazwe id
    function initSortable( id ){
        // Utworz zmienna ktora pobierze losowa nazwe id
        var el = document.getElementById( id );
        // Utworz zmienna ktora posortuje losowe id
        var sortable = Sortable.create( el, {
            group: 'kanban',
            sort: true
        });
    }
    // Wyszukaj element w szablonie i nasluchuj na klikniecie uzytkownika
    document.querySelector( '#board .create-column').addEventListener( 'click', function(){
        // Zapisz w zmiennej wyswietlenie nowego okna dialogowego z zapytaniem o wpisanie nowej nazwy kolumny
        var name = prompt( 'Enter a column name.' );
        // Przypisz nowa instancje klasy do nowej zmiennej i uzyj zmiennej aby wyswietlic okno dialogowe
        var column = new Column( name );
        // Dopisz nowo utworzone obiekty do dodawania kolumn i uzyj zmiennej ktora przechowuje instancje klas Column
        board.addColumn( column );
    });

    // Tworzenie kolumn za pomoca instancji klasy
    var toDoColumn = new Column( 'To do' );
    var doingColumn = new Column( 'Doing' );
    var doneColumn = new Column( 'Done' );

    // Dodanie kolumn do (planszy?) board szablonu i uzywanie zadeklarowanych uwczesnie zmiennych
    // ktore przechowuja instancje klasy kolumn
    board.addColumn( toDoColumn );
    board.addColumn( doingColumn );
    board.addColumn( doneColumn );

    // Tworzenie nowych instancji kart klasy i zapisanie w zmiennych 
    var card1 = new Card( 'New task' );
    var card2 = new Card( 'Create kanban boards' );

    // Dodanie kart do kolumn i wyswietlenie tekstu (to mi chyba nie dziala...) uzywajac zmiennych 
    // przechowujacych instancje kart klasy
    toDoColumn.addCard( card1 );
    doingColumn.addCard( card2 );
});


