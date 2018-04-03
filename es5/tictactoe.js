var tiles = [
    [],
    [],
    [],
    []
  ];
  var winConditions = [
    ["11", "12", "13"],
    ["21", "22", "23"],
    ["31", "32", "33"],
    ["11", "21", "31"],
    ["12", "22", "32"],
    ["13", "23", "33"],
    ["11", "22", "33"],
    ["13", "22", "31"]
  ];
  
  var corners = ["11", "13", "33", "31"];
  
  var gOver = false;
  var playerToken = "X";
  var compToken = "O";
  var firstTurn = true;
  
  $(document).ready(function() {
    makeObjs();
    addClicks();
  });
  
  function gameOver() {
    $("#header").html("Game Over!");
    $("#data").html("");
    $("#test").html("");
    firstTurn = firstTurn ? false : true;
    setTimeout(function() {
      $("#header").html("Tic Tac Toe");
      for (var i = 1; i <= 3; i++) {
        for (var j = 1; j <= 3; j++) {
          $("#" + i + j).html("");
          tiles[i][j].state = "n";
          $("#" + i + j).prop("disabled", false);
          $("#" + i + j).css("background", "#cfd8dc");
        }
      }
    }, 3000);
  
  }
  
  function makeObjs() {
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        var tile = {};
        tile.id = i.toString() + j.toString();
        tile.state = "n";
        tiles[i][j] = tile;
        //$("#data").append("<br>" + tiles[i][j].id + " " + i + j);
      }
    }
  }
  
  function play() {
    var sId;
  
    var pIds = [];
    var cIds = [];
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        t = tiles[i][j];
        if (t.state === playerToken) {
          pIds.push(t.id);
        } else if (t.state === compToken) {
          cIds.push(t.id);
        }
      }
    }
    winConditions.forEach(function(wc) {
      var a = (pIds.indexOf(wc[0]) != -1);
      var b = (pIds.indexOf(wc[1]) != -1);
      var c = (pIds.indexOf(wc[2]) != -1);
  
      var d = (cIds.indexOf(wc[0]) != -1);
      var e = (cIds.indexOf(wc[1]) != -1);
      var f = (cIds.indexOf(wc[2]) != -1);
  
      // first check if computer can win
      if (aboutToWin(d, e, f) && !(a || b || c)) {
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
      winConditions.forEach(function(wc) {
        var a = (pIds.indexOf(wc[0]) != -1);
        var b = (pIds.indexOf(wc[1]) != -1);
        var c = (pIds.indexOf(wc[2]) != -1);
  
        var d = (cIds.indexOf(wc[0]) != -1);
        var e = (cIds.indexOf(wc[1]) != -1);
        var f = (cIds.indexOf(wc[2]) != -1);
  
        // then check if player can win and block
        if (aboutToWin(a, b, c) && !(d || e || f)) {
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
    if (sId === undefined && tiles[2][2].state === "n") {
      sId = "22";
    }
  
    // check if corners are available
    corners.forEach(function(c) {
      if (sId === undefined) {
        var cT = tiles[c.charAt(0)][c.charAt(1)];
        if (cT.state === "n") {
          sId = c;
        }
      }
    });
  
    var openSpaces = [];
  
    // create an array containing all blank tiles
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        if (tiles[i][j].state === "n") {
          openSpaces.push(tiles[i][j]);
        }
      }
    }
  
    // randomly select one of those tiles
    selection = Math.floor(Math.random() * (openSpaces.length));
  
    if (sId === undefined || alreadyMarked(sId)) {
      sId = openSpaces[selection].id;
    }
    var selectedTile = tiles[sId.charAt(0)][sId.charAt(1)];
  
    // mark the tile and change it's state and disable the button
    $("#" + sId).html(compToken);
    selectedTile.state = compToken;
    $("#" + sId).prop("disabled", true);
  
    // check if a win condition has been met
    $("#test").html(sId);
    checkWin();
    if (gOver === true) {
      gOver = false;
      return;
    } else {
      return;
    }
  }
  
  function checkWin() {
    var xIds = [];
    var oIds = [];
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        t = tiles[i][j];
        if (t.state === "X") {
          xIds.push(t.id);
        } else if (t.state === "O") {
          oIds.push(t.id);
        }
      }
    }
  
    winConditions.forEach(function(wc) {
  
      var ax = (xIds.indexOf(wc[0]) != -1);
      var bx = (xIds.indexOf(wc[1]) != -1);
      var cx = (xIds.indexOf(wc[2]) != -1);
  
      var ao = (oIds.indexOf(wc[0]) != -1);
      var bo = (oIds.indexOf(wc[1]) != -1);
      var co = (oIds.indexOf(wc[2]) != -1);
  
      // check if x won
      if (ax && bx && cx) {
        gOver = true;
        wc.forEach(function(w) {
          $("#" + w).css("background", "black");
        });
        gameOver();
        return;
      }
  
      // check if o won
      if (ao && bo && co) {
        gOver = true;
        wc.forEach(function(w) {
          $("#" + w).css("background", "black");
        });
        gameOver();
        return;
      }
      // check for tie
      if (xIds.length + oIds.length > 8) {
        gOver = true;
        gameOver();
        return;
      }
  
    });
  
  }
  
  function reset() {
    $("h1").html("Tic Tac Toe");
    for (var i = 1; i <= 3; i++) {
      for (var j = 1; j <= 3; j++) {
        tiles[i][j].state = "n";
        $("#" + i + j).html("");
        $("#" + i + j).prop("disabled", false);
      }
    }
  }
  
  function addClicks() {
    $('#11, #12, #13, #21, #22, #23, #31, #32, #33').click(function(evt) {
      var eId = evt.target.id;
      $(this).html(playerToken);
      $(this).prop("disabled", true);
      var selectedTile = tiles[eId.charAt(0)][eId.charAt(1)];
      selectedTile.state = playerToken;
      checkWin();
      if (gOver === true) {
        gOver = false;
        return;
      } else {
        play(compToken);
      }
  
    });
  }
  
  function change() {
    reset();
    if ($("#piece").html() === "Your marker: X") {
      $("#piece").html("Your marker: O");
      playerToken = "O";
      compToken = "X";
    } else {
      $("#piece").html("Your marker: X");
      playerToken = "X";
      compToken = "O";
    }
  }
  
  function aboutToWin(a, b, c) {
    return a ? (b || c) : (b && c);
  }
  
  function alreadyMarked(s) {
    var e = tiles[s.charAt(0)][s.charAt(1)].state != "n";
    $("#data2").html(e.toString());
    return tiles[s.charAt(0)][s.charAt(1)].state != "n";
  
  }