var app = angular.module('boggle', [])

var words = ["a", "akesi", "ala", "ale", "ali", "anpa", "ante", "anu", "awen", "e", "en", "esun", "ijo", "ike", "ilo", "insa", "jaki", "jan", "jelo", "jo", "kala", "kalama", "kama", "kasi", "ken", "kepeken", "kili", "kin", "kiwen", "ko", "kon", "kule", "kute", "kulupu", "la", "lape", "laso", "lawa", "len", "lete", "li", "lili", "linja", "lipu", "loje", "lon", "luka", "lukin", "lupa", "ma", "mama", "mani", "meli", "mi", "mije", "moku", "moli", "monsi", "mu", "mun", "musi", "mute", "namako", "nanpa", "nasa", "nasin", "nena", "ni", "nimi", "noka", "o", "oko", "olin", "ona", "open", "pakala", "pali", "palisa", "pan", "pana", "pi", "pilin", "pimeja", "pini", "pipi", "poka", "poki", "pona", "sama", "seli", "selo", "seme", "sewi", "sijelo", "sike", "sin", "sina", "sinpin", "sitelen", "sona", "soweli", "suli", "suno", "supa", "suwi", "tan", "taso", "tawa", "telo", "tenpo", "toki", "tomo", "tu", "unpa", "uta", "utala", "walo", "wan", "waso", "wawa", "weka", "wile"];
var chooseLetter = function() {

  var v = ~~(Math.random() * 470);

  switch (true) {
    case (v < 75):
      return 'a';
      break;
    case (v >= 75 && v < 116):
      return 'e';
      break;
    case (v >= 116 && v < 171):
      return 'i';
      break;
    case (v >= 171 && v < 181):
      return 'j';
      break;
    case (v >= 181 && v < 211):
      return 'k';
      break;
    case (v >= 211 && v < 254):
      return 'l';
      break;
    case (v >= 254 && v < 276):
      return 'm';
      break;
    case (v >= 276 && v < 326):
      return 'n';
      break;
    case (v >= 326 && v < 362):
      return 'o';
      break;
    case (v >= 362 && v < 388):
      return 'p';
      break;
    case (v >= 388 && v < 417):
      return 's';
      break;
    case (v >= 417 && v < 432):
      return 't';
      break;
    case (v >= 432 && v < 456):
      return 'u';
      break;
    case (v >= 432 && v < 470):
      return 'w';
      break;
    default:
      return 'a';
      break;
  }
}

app.directive('boggleBoard', ['$timeout', function($timeout) {
  return {
    // template: '',
    replace: 'E',
    controllerAs: 'bbCtrl',
    controller: ['$scope',
      function($scope) {
        var self = this;
        var size = 5;
        var minLength = 2;
        var animation = 'zoomInDown';

        self.showme = false;
        $scope.foundWords = [];
        $scope.shake = function() {
          self.showme = false;
          $('#boggle').show();
          $('.dice span').hide();
          $('.dice').removeClass('animated').removeClass(animation);
          $('.highlight').removeClass('highlight').removeClass('first');
          $scope.foundWords = [];
          $scope.r = [];
          for (var r = 0; r < size; r++) {
            var row = {
              c: [],
              i: r
            };
            for (var c = 0; c < size; c++) {
              row.c.push(chooseLetter());
            }
            $scope.r.push(row);
          }

          var checkNextLetter = function(r, c, current, locs, success) {

            if (_(locs).filter(function(v) {
                return v[0] == r && v[1] == c;
              }).length) {
              //been in this location before
              return;
            }

            locs.push([r, c])

            var word = current + $scope.r[r].c[c];

            var found = _(words).filter(function(v) {
              return v.indexOf(word) == 0 && v.length == word.length && v.length > minLength;
            })

            if (found.length) {
              success.push([r, c])
              $scope.foundWords = _.chain($scope.foundWords).push({
                  word: found[0],
                  locs: success
                })
                .uniq(function(v) {
                  return [v.locs[0][0],
                    v.locs[0][1],
                    v.word
                  ].join('');
                })
                .value();
            }

            var possible = words.filter(function(v) {
              return v.indexOf(word) == 0 && v.length > word.length;
            });

            possible.forEach(function(v) {
              var mysuccess = success.filter(function(loc) {
                return current.indexOf($scope.r[loc[0]].c[loc[1]]) > -1;
              })
              mysuccess.push([r, c]);
              
              for(var ro = r-1; ro <= r+1; ro++){
                for(var co = c-1; co <= c+1; co++){
                    if($scope.r[ro]){
                      if($scope.r[ro].c[co]){
                        checkNextLetter(ro, co, word, locs, mysuccess);    
                      }
                    }
                }
              }
            });

          };

          for (var r = 0; r < size; r++) {
            for (var c = 0; c < size; c++) {
              checkNextLetter(r, c, '', [], []);
            }
          }

          $timeout(function() {
            $('.dice span').hide().each(function(i, v) {
              setTimeout(function() {
                $(v).show().parent().addClass('animated').addClass(animation)
              }, (size * size * 50) - (i * 50) + (Math.random() * 500));
            })
          })
        }

        $scope.highlight = function(locs) {
          $('.highlight').removeClass('highlight').removeClass('first');
          $('#letter' + locs[0][0] + locs[0][1]).addClass('first');
          locs.forEach(function(v) {
            $('#letter' + v[0] + v[1]).addClass('highlight');
          })
        };

        $scope.shake();

      }
    ]
  }
}])