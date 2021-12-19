var game = (function () {
  var opt = {
		cardSize: {
			width: 73,
			height: 100
		},
    layout: {
      artist: {x:200, y:150},
      star: {x:400, y:150},
      gig: {x:200, y:280},
      hand: {w:500, x:100, y:540}
    },
    speed: 450
	};
  var zIndexCounter = 1;
  var table = document.getElementById("table");
  var ui = document.getElementById("ui");
	var gigs = [];
  var cardstodiscard = 0, cardtoplay = "", actions = 2, lastaction, status = "start of game";
  ui.innerHTML = "actions: " + actions + "<br>" + status; //should be in update function

  function init(options) {
    var artistDeck = new Deck("artist");
		for (let a of artistData) {
      artistDeck.addCard(new Artist(a[0], a[1], a[2], a[3], a[4], a[5]));
    }
    artistDeck.shuffle();
    artistDeck.render({immediate: true});
    var starDeck = new Deck("star");
    for (let s of starData) {
      starDeck.addCard(new Star(s[0], s[1], s[2], s[3], s[4]));
    }
    starDeck.shuffle();
    starDeck.render({immediate: true});
    var gigDeck = new Deck("gig");
		for (g of gigData) {
			gigDeck.addCard(new Gig(g[0], g[1], g[2], g[3], g[4], g[5]));
		}
    gigDeck.shuffle();
    gigDeck.render({immediate: true});
    var playerband = new Band;
    var playercompleted = new Completed;
    var calendar = new Calendar;
    calendar.fill();
    var playerhand = new Hand;
    playerhand.draw(starDeck.topCard());
    playerhand.draw(starDeck.topCard());
    playerhand.draw(starDeck.topCard());
	}

	function startgame() {

	}

  function action() {
    {
      function audition() {
        console.log("audition");
      };
      function draw() {
        console.log("draw");
      };
      function play() {
        console.log("play");
      };
      function tour() {
        console.log("tour");
      }
    }
    return {
      audition: audition,
      draw: draw,
      play: play,
      tour: tour
    }
  }

	function mouseEvent(ev) {
    card = this.object;
    context = card.container.name;
    if (context == "stardeck") {
      let hand = document.getElementById("hand").object;
      let deck = document.getElementById("stardeck").object;
      hand.draw(deck.topCard());
      hand.draw(deck.topCard());
    } else if (context == "artistdeck"){
      audition(card);
    } else if (context == "calendar") {
      card.container.tour(card);
    } else if (context == "hand") {
      console.log("hand clicked");
    } else if (context == "band") {
      console.log("band clicked");
    } else if (context == "gigdeck") {
      let cal = document.getElementById("calendar").object;
      cal.fill();
    }
	}

  function audition(card) {
    let band = document.getElementById("band").object;
    if (band.length > 4) {
      alert("fuck you. you already have five artists.")
    } else {
      band.addCard(card);
      band.render();
    }
  }

  function Card() {}

  Card.prototype = {
    makeCard: function(name, pipes, moves, heat, cool) {
  		this.name = name;
			this.container = null;
      this.stats = { pipes: pipes, moves: moves, heat: heat, cool: cool };
      this.targetRotate = "rotateY(0deg)";
  		this.el = document.createElement("div");
      this.el.style.transform = "rotateY(0deg)";
			this.el.object = this;
			this.el.id = name;
			this.el.className = "card";
			this.el.addEventListener("click", mouseEvent);
      this.el.style.width = opt.cardSize.width;
      this.el.style.height = opt.cardSize.height;
			let f = document.createElement("img");
			f.src = "images/" + name + ".jpg";
      f.style.transform = "rotateY(0deg)";
      table.appendChild(this.el);
			this.el.appendChild(f);
  	},
		flip: function() {
      if (this.targetRotate == "rotateY(0deg)") {
        this.el.style.transform = "rotateY(0deg)";
      } else if (this.targetRotate == "rotateY(180deg)") {
        this.el.style.transform = "rotateY(180deg)";
		  }
    },
    moveToFront: function() {
      this.el.style.zIndex = ++zIndexCounter;
    }
  }

	function Artist(name, p, m, h, c, cost) {
		this.init(name, p, m, h, c, cost);
	}

	Artist.prototype = Object.create(Card.prototype);
  Artist.prototype.constructor = Artist;

	Artist.prototype.init = function(name, pipes, moves, heat, cool, cost) {
		this.makeCard(name, pipes, moves, heat, cool);
		this.cost = cost;
    this.type = "artist";
		this.el.classList.add("artist");
		let b = document.createElement("img");
		b.src = "images/artistback.jpg";
		b.style.transform = "rotateY(180deg)";
		this.el.appendChild(b);
	}

  function Star(name, p, m, h, c) {
    this.init(name, p, m, h, c);
  }

  Star.prototype = Object.create(Card.prototype);
  Star.prototype.constructor = Star;

  Star.prototype.init = function(name, pipes, moves, heat, cool) {
    this.makeCard(name, pipes, moves, heat, cool);
    this.type = "star";
    this.el.classList.add("star");
    let b = document.createElement("img");
    b.src = "images/starback.jpg";
		b.style.transform = "rotateY(180deg)";
    this.el.appendChild(b);
  }

	function Gig(name, p, m, h, c, cash) {
		this.init(name, p, m, h, c, cash);
	}

	Gig.prototype = Object.create(Card.prototype);
  Gig.prototype.constructor = Gig;

	Gig.prototype.init = function(name, pipes, moves, heat, cool, cash) {
		this.makeCard(name, pipes, moves, heat, cool);

		this.cash = cash;
    this.type = "gig";
		this.el.classList.add("gig");
		this.el.style.width = opt.cardSize.height; //gig cards have h&w swapped
		this.el.style.height = opt.cardSize.width;
		let b = document.createElement("img");
		b.src = "images/gigback.jpg";
		b.style.transform = "rotateY(180deg)";
		this.el.appendChild(b);
	}

	function Container() {}

	Container.prototype = Object.create(Array.prototype);
  Container.prototype.constructor = Container;

	Container.prototype.setup = function (type) {
    element = document.createElement("div");
    table.appendChild(element);
    element.id = type;
    element.object = this;
		this.el = element;
    this.name = type;
	}

  Container.prototype.render = function(options) {
    options = options || {};
    var speed = opt.speed;
    this.calcPosition();
    for (let i = 0; i < this.length; i++) {
      let card = this[i].el;
      this[i].moveToFront();
      let left = card.style.left;
      let top = card.style.top;
      let transform = card.style.transform;
      if (left != this[i].targetLeft || top != this[i].targetTop || transform != this[i].targetRotate) {
        var props = [
          {left: left, top: top, transform: transform},
          {left: this[i].targetLeft, top: this[i].targetTop, transform: this[i].targetRotate}
        ];
        card.style.left = props[1].left;
        card.style.top = props[1].top;
        card.object.flip();
        if (!options.immediate) {
          card.animate(props, speed);
        }
      }
    }
  }

	Container.prototype.shuffle = function() {
		let l = this.length;
		while( l ) { 																//while there are elements remaning
			let i = Math.floor(Math.random() * l--); 	//pick an element and increment down
			let t = this[l];
			this[l] = this[i];
			this[i] = t;
		}
	}

	Container.prototype.removeCard = function(card) {
		for (obj in this) {
			if (card == this[obj]) {	//check if the card being removed matches
				card.container = "";		//remove card's container
        card.el.classList.remove(this.constructor.name.toLowerCase());
				this.splice(obj, 1);		//remove card from container
				return true;
			}
		}
		return false;
	}

	Container.prototype.addCard = function(card) {
    if (card.container != null) {
      card.el.classList.remove(card.container.type);
      card.container.removeCard(card);
    }
		this.push(card);
    card.container = this;
    card.el.classList.add(card.container.type);
	}

	Container.prototype.addCards = function(cards) {
		for (card in cards) {
			this.addCard(cards[card]);
		}
	}

  Container.prototype.topCard = function() {
    return this[this.length - 1];
  }

	function Deck(type) {
		this.init(type);
	}

	Deck.prototype = Object.create(Container.prototype);

	Deck.prototype.init = function(type) {
    this.setup(type + "deck");
    this.type = "deck";
    this.el.className = type + " deck pile";
    this.el.style.width = opt.cardSize.width;
    this.el.style.height = opt.cardSize.height;
    if (type == "gig") {
      this.el.style.width = opt.cardSize.height;
      this.el.style.height = opt.cardSize.width;
      this.el.style.left = opt.layout.gig.x;
      this.el.style.top = opt.layout.gig.y;
    } else if (type == "star") {
      this.el.style.left = opt.layout.star.x;
      this.el.style.top = opt.layout.star.y;
    } else {
      this.el.style.left = opt.layout.artist.x;
      this.el.style.top = opt.layout.artist.y;
    }
	}

  Deck.prototype.calcPosition = function(options) {
    options = options || {};
    let left = parseInt(this.el.style.left); //get left and top of deck
    let top = parseInt(this.el.style.top);
    let l = this.length;
    var condenseCount = 5;
    for (let i = 0; i < l; i++) {
      if (i > 0 && i % condenseCount == 0) {
        top -= 1;
        left -= 1;
      }
      this[i].targetLeft = left + "px";
      this[i].targetTop = top + "px";
      this[i].targetRotate = "rotateY(180deg)";
    }
  }

  function Hand() {
    this.init()
  }

  Hand.prototype = Object.create(Container.prototype);

  Hand.prototype.init = function() {
    this.name = "hand";
    this.type = "hand";
    this.el = document.createElement("div");
    this.el.id = "hand"; //eventually unique to player
    this.el.className = "hand";
    this.el.style.width = opt.layout.hand.w;
    this.el.style.height = opt.cardSize.height;
    table.appendChild(this.el);
    this.el.object = this;
    this.el.style.left = opt.layout.hand.x;
    this.el.style.top = opt.layout.hand.y;
  }

  Hand.prototype.calcPosition = function(options) {
    options = options || {};
    let width = opt.cardSize.width;   //get deck dimensions
    let left = opt.layout.hand.x;
    let top = opt.layout.hand.y;
    for (let i = 0; i < this.length; i++) {
      this[i].targetLeft = (left + (width * i)) + "px";
      this[i].targetTop = top + "px";
      this[i].targetRotate = "rotateY(0deg)";
    }
  }

  Hand.prototype.draw = function(card) {
    this.addCard(card);
    this.render();
  }

  function Band() {
    this.init()
  }

  Band.prototype = Object.create(Container.prototype);

  Band.prototype.init = function() {
    this.name = "band";
    this.type = "band";
    this.el = document.createElement("div");
    this.el.id = "band"; //eventually unique to player
    this.el.className = "band";
    this.el.style.width = opt.layout.hand.w;
    this.el.style.height = opt.cardSize.height;
    table.appendChild(this.el);
    this.el.object = this;
    this.el.style.left = opt.layout.hand.x;
    this.el.style.top = opt.layout.hand.y - opt.cardSize.height;
  }

  Band.prototype.calcPosition = function(options) {
    options = options || {};
    let width = opt.cardSize.width;
    let left = opt.layout.hand.x;
    let top = opt.layout.hand.y - opt.cardSize.height;
    for (let i = 0; i < this.length; i++) {
      this[i].targetLeft = (left + (width * i)) + "px";
      this[i].targetTop = top + "px";
      this[i].targetRotate = "rotateY(0deg)";
    }
  }

  Band.prototype.getTotal = function(stat) {
    let total = 0;
    let l = this.length;
    for (let i = 0; i < l; i++) {
      total = total + parseInt(this[i].stats[stat]);
    }
    return total;
  }

  Band.prototype.getTotalStats = function() {
    let tp = this.getTotal("pipes");
    let tm = this.getTotal("moves");
    let th = this.getTotal("heat");
    let tc = this.getTotal("cool");
    let statsreq = {pipes: tp, moves: tm, heat: th, cool: tc};
    return statsreq;
  }

  function Completed() {
    this.init()
  }

  Completed.prototype = Object.create(Container.prototype);

  Completed.prototype.init = function() {
    this.name = "completed";
    this.type = "completed";
    this.el = document.createElement("div");
    this.el.id = "completed"; //eventually unique to player
    this.el.className = "completed";
    this.el.style.width = opt.cardSize.height;
    this.el.style.height = opt.cardSize.height * 2;
    table.appendChild(this.el);
    this.el.object = this;
    this.el.style.left = opt.layout.hand.x + opt.layout.hand.w;
    this.el.style.top = opt.layout.hand.y - opt.cardSize.height;
  }

  Completed.prototype.calcPosition = function(options) {
    options = options || {};
    let gigs = this.length;
    let left = opt.layout.hand.x + opt.layout.hand.w;
    let top = opt.layout.hand.y - opt.cardSize.height;
    for (let i = 0; i < gigs; i++) {
      this[i].targetLeft = left + "px";
      this[i].targetTop = (top + ((opt.cardSize.width - 54) * i)) + "px";
      this[i].targetRotate = "rotateY(0deg)";
    }
  }

  function Calendar() {
    this.init()
  }

  Calendar.prototype = Object.create(Container.prototype);

  Calendar.prototype.init = function() {
    this.name = "calendar";
    this.type = "calendar";
    this.el = document.createElement("div");
    this.el.id = "calendar";
    this.el.className = "calendar";
    this.el.style.width = opt.cardSize.height * 2;
    this.el.style.height = opt.cardSize.width * 2;
    table.appendChild(this.el);
    this.el.object = this;
    this.el.style.left = opt.layout.gig.x + opt.cardSize.height;
    this.el.style.top = opt.layout.gig.y;
  }

  Calendar.prototype.calcPosition = function(options) {
    options = options || {};
    let width = opt.cardSize.height;
    let left = opt.layout.gig.x + opt.cardSize.height;
    let top = opt.layout.gig.y;
    for (let i = 0; i < this.length; i++) {
      this[i].targetLeft = (left + (width * i)) + "px";
      this[i].targetTop = top + "px";
      this[i].targetRotate = "rotateY(0deg)";
    }
  }

  Calendar.prototype.fill = function() {
    gigsneeded = 4 - this.length;
    let deck = document.getElementById("gigdeck").object
    for (let i = 0; i < gigsneeded; i++) {
      this.addCard(deck.topCard());
    }
    this.render();
  }

  Calendar.prototype.tour = function(card) {
    let statsreq = card.stats;
    let band = document.getElementById("band").object;
    let total = band.getTotalStats();
    let enough = true;
    let needmore = "";
    for (let stat in statsreq) {
      if (total[stat] < statsreq[stat]) {
        enough = false;
        needmore = stat;
      };
    }
    if (enough) {
      let completed = document.getElementById("completed").object;
      completed.addCard(card);
      completed.render();
    } else {
      console.log(total);
      console.log("not enough " + needmore);
    }

  }

	return {
		init: init,
		start: startgame,
		options: opt
	}

})();

game.init();
game.start();
