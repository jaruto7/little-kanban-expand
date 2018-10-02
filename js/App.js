var baseUrl = 'https://kodilla.com/pl/bootcamp-api';
var myHeaders = {
    'X-Client-Id': 3239,
    'X-Auth-Token': '4b7e36984dcfbe3af1e978f88232d161'
};

fetch( baseUrl + '/board', { headers: myHeaders } )
    .then( function( resp ) {
        return resp.json();
    })
    .then( function( resp ) {
        setupColumns( resp. columns );
    });

function setupColumns( columns ) {
    columns.forEach( function( column ) {
        var col = new Column( column.id, column.name );
        board.addColumn( col );
        setupCards( col, column.cards );
    });
}

function setupCards( col, cards ) {
    cards.forEach( function( card ) {
        var cardObj = new Card( card.id, card.name );
        col.addCard( cardObj );
    });
}

Column.prototype = {
    addCard: function( card ) {
      this.element.querySelector( 'ul' ).appendChild( card.element );
    }
};

// OGÓLNA FUNKCJA - JUZ NIE POTRZEBNA
// function randomString() {
// 	var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ'.split();
// 	var str = '', i;
// 	for (i = 0; i < 10; i++) {
// 	  str += chars[Math.floor(Math.random() * chars.length)];
// 	}
// 	return str;
// }

function generateTemplate(name, data, basicElement) {
  	var template = document.getElementById(name).innerHTML;
  	var element = document.createElement(basicElement || 'div');
  
  	Mustache.parse(template);
  	element.innerHTML = Mustache.render(template, data);
  
  	return element;
}