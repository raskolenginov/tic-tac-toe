class Game {
  constructor() {
    console.info("Game");

    this.tiles = [[], [], [], []];

    this.winConditions = [
      ["11", "12", "13"],
      ["21", "22", "23"],
      ["31", "32", "33"],
      ["11", "21", "31"],
      ["12", "22", "32"],
      ["13", "23", "33"],
      ["11", "22", "33"],
      ["13", "22", "31"]
    ];

    this.corners = ["11", "13", "33", "31"];

    this.gOver = false;
    this.playerToken = "X";
    this.compToken = "O";
    this.firstTurn = true;

    this.makeObjs();
    this.addClicks();
  }

  makeObjs() {
    for (let i = 1; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        let tile = {};
        tile.id = i.toString() + j.toString();
        tile.state = "n";
        this.tiles[i][j] = tile;
        //$("#data").append("<br>" + tiles[i][j].id + " " + i + j);
      }
    }
  }

  /*

  Eventin kendi scope var 

  Kurtulmak için 
  1. Game scopunu değişkene ata
  2. bind metoduyla eventin içine Game scopunu gönder
  3. Arrow function kullanımı
  */

  /*
  1.


  addClicks() {
    let that = this;

    $(".tile").on("click", function(evt) {
      var eId = evt.target.id;
      $(this).html(that.playerToken);
      $(this).prop("disabled", true);
      var selectedTile = that.tiles[eId.charAt(0)][eId.charAt(1)];
      selectedTile.state = that.playerToken;
      that.checkWin();
      if (that.gOver === true) {
        that.gOver = false;
        return;
      } else {
        play(that.compToken);
      }
    });
  } */

  /*
  2.
  addClicks() {
    $(".tile").on(
      "click",
      function(evt) {
        var eId = evt.target.id;
        $(evt.target).html(this.playerToken);
        $(evt.target).prop("disabled", true);
        var selectedTile = this.tiles[eId.charAt(0)][eId.charAt(1)];
        selectedTile.state = this.playerToken;
        this.checkWin();
        if (this.gOver === true) {
          this.gOver = false;
          return;
        } else {
          play(this.compToken);
        }
      }.bind(this)
    );
  }*/

  addClicks() {
    $(".tile").on("click", evt => {
      var eId = evt.target.id;
      $(evt.target).html(this.playerToken);
      $(evt.target).prop("disabled", true);
      var selectedTile = this.tiles[eId.charAt(0)][eId.charAt(1)];
      selectedTile.state = this.playerToken;
      this.checkWin();
      if (this.gOver === true) {
        this.gOver = false;
        return;
      } else {
        this.play(this.compToken);
      }
    });

    $(".btn-lg").on("click", e => this.change());
  }

  checkWin() {
    var xIds = [];
    var oIds = [];
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        let t = this.tiles[i][j];
        if (t.state === "X") {
          xIds.push(t.id);
        } else if (t.state === "O") {
          oIds.push(t.id);
        }
      }
    }

    this.winConditions.forEach(wc => {
      var ax = xIds.indexOf(wc[0]) != -1;
      var bx = xIds.indexOf(wc[1]) != -1;
      var cx = xIds.indexOf(wc[2]) != -1;

      var ao = oIds.indexOf(wc[0]) != -1;
      var bo = oIds.indexOf(wc[1]) != -1;
      var co = oIds.indexOf(wc[2]) != -1;

      // check if x won
      if (ax && bx && cx) {
        this.gOver = true;
        wc.forEach(w => {
          $("#" + w).css("background", "black");
        });
        this.gameOver();
        return;
      }

      // check if o won
      if (ao && bo && co) {
        this.gOver = true;
        wc.forEach(w => {
          $("#" + w).css("background", "black");
        });
        this.gameOver();
        return;
      }
      // check for tie
      if (xIds.length + oIds.length > 8) {
        this.gOver = true;
        this.gameOver();
        return;
      }
    });
  }

  play() {
    var sId;

    var pIds = [];
    var cIds = [];
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        let t = this.tiles[i][j];
        if (t.state === this.playerToken) {
          pIds.push(t.id);
        } else if (t.state === this.compToken) {
          cIds.push(t.id);
        }
      }
    }

    this.winConditions.forEach(wc => {
      var a = pIds.indexOf(wc[0]) != -1;
      var b = pIds.indexOf(wc[1]) != -1;
      var c = pIds.indexOf(wc[2]) != -1;

      var d = cIds.indexOf(wc[0]) != -1;
      var e = cIds.indexOf(wc[1]) != -1;
      var f = cIds.indexOf(wc[2]) != -1;

      // first check if computer can win
      if (this.aboutToWin(d, e, f) && !(a || b || c)) {
        if (!d) {
          sId = wc[0];
        } else if (!e) {
          sId = wc[1];
        } else {
          sId = wc[2];
        }
        $("#data").html("comp can win at: " + sId);
        return;
      }
    });

    if (sId === undefined) {
      this.winConditions.forEach(wc => {
        var a = pIds.indexOf(wc[0]) != -1;
        var b = pIds.indexOf(wc[1]) != -1;
        var c = pIds.indexOf(wc[2]) != -1;

        var d = cIds.indexOf(wc[0]) != -1;
        var e = cIds.indexOf(wc[1]) != -1;
        var f = cIds.indexOf(wc[2]) != -1;

        // then check if player can win and block
        if (this.aboutToWin(a, b, c) && !(d || e || f)) {
          if (!a) {
            sId = wc[0];
          } else if (!b) {
            sId = wc[1];
          } else {
            sId = wc[2];
          }
          $("#data").html("user can win at: " + sId);
          return;
        }
      });
    }
    // take center square if available
    if (sId === undefined && this.tiles[2][2].state === "n") {
      sId = "22";
    }

    // check if corners are available
    this.corners.forEach(c => {
      if (sId === undefined) {
        var cT = this.tiles[c.charAt(0)][c.charAt(1)];
        if (cT.state === "n") {
          sId = c;
        }
      }
    });

    var openSpaces = [];

    // create an array containing all blank tiles
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        if (this.tiles[i][j].state === "n") {
          openSpaces.push(this.tiles[i][j]);
        }
      }
    }

    // randomly select one of those tiles
    let selection = Math.floor(Math.random() * openSpaces.length);

    if (sId === undefined || this.alreadyMarked(sId)) {
      sId = openSpaces[selection].id;
    }
    var selectedTile = this.tiles[sId.charAt(0)][sId.charAt(1)];

    // mark the tile and change it's state and disable the button
    $("#" + sId).html(this.compToken);
    selectedTile.state = this.compToken;
    $("#" + sId).prop("disabled", true);

    // check if a win condition has been met
    $("#test").html(sId);
    this.checkWin();
    if (this.gOver === true) {
      this.gOver = false;
      return;
    } else {
      return;
    }
  }

  reset() {
    $("h1").html("Tic Tac Toe");
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        this.tiles[i][j].state = "n";
        $("#" + i + j).html("");
        $("#" + i + j).prop("disabled", false);
      }
    }
  }

  change() {
    this.reset();
    if ($("#piece").html() === "Your marker: X") {
      $("#piece").html("Your marker: O");
      this.playerToken = "O";
      this.compToken = "X";
    } else {
      $("#piece").html("Your marker: X");
      this.playerToken = "X";
      this.compToken = "O";
    }
  }

  aboutToWin(a, b, c) {
    return a ? b || c : b && c;
  }

  alreadyMarked(s) {
    var e = this.tiles[s.charAt(0)][s.charAt(1)].state != "n";
    $("#data2").html(e.toString());
    return this.tiles[s.charAt(0)][s.charAt(1)].state != "n";
  }

  gameOver() {
    $("#header").html("Game Over!");
    $("#data").html("");
    $("#test").html("");
    this.firstTurn = this.firstTurn ? false : true;

    setTimeout(() => {
      $("#header").html("Tic Tac Toe");
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          $("#" + i + j).html("");
          this.tiles[i][j].state = "n";
          $("#" + i + j).prop("disabled", false);
          $("#" + i + j).css("background", "#cfd8dc");
        }
      }
    }, 3000);
  }
}
