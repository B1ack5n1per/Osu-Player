const fs = require('fs');
const $ = require('./jquery-3.3.1.js');
const songData = './data/songs.txt';
const favs = './data/favourites.txt';
const txtSpacer = '<=>';
let songFiles;
let current = 0;
let volume = 0;
let vol = true;
let col = 'all';

// Functions

function setCol() {
  if (col === 'all') {
    $('#col').html('All Songs');
  } else {
    $('#col').html('Favourites');
  };
};

function addToFav() {
  let currentFavs = fs.readFileSync(favs).toString('utf8').split(txtSpacer);
  currentFavs.length -= 1;
  let unique = true;
  for (i = 0; i < currentFavs.length; i++) {
    if (currentFavs[i] == songFiles[current]) {
      unique = false;
    };
  };

  if (unique) {
    fs.appendFileSync(favs, songFiles[current] + txtSpacer);
  };
};

function clearData() {
  fs.writeFileSync(songData, '');
};

function changeStatus() {
  $('.status').toggleClass('hidden');
};

function updateTxt() {
  let test = fs.readdirSync('./songs');
  let songs = {};
  for (i = 0; i < test.length; i++) {
    let key = test[i];
    songs[key] = fs.readdirSync('./songs/' + test[i]);
    let candidates = [];
    for (ii = 0; ii < songs[key].length; ii++) {
      if (songs[key][ii].split('.')[1] === 'mp3') {
        candidates.push(`./songs/${test[i]}/${songs[key][ii]}`);
      }
    };

    if (candidates.length > 1) {
      for (ii = 0; ii < candidates.length; ii++) {
        if (fs.statSync(candidates[ii]).size > 1000000) {
          fs.appendFileSync(songData, candidates[ii] + txtSpacer);
        };
      };
    } else {
      fs.appendFileSync(songData, candidates[0] + txtSpacer);
    };
  };
};

function updateSongs(file) {
  setCol();
  songFiles = fs.readFileSync(file).toString('utf8').split(txtSpacer);
  songFiles.length -= 1;
};

function update() {
  clearData(songData);
  updateTxt();
  updateSongs(songData);
  $('audio').attr('src', songFiles[current]);
  setTitle();
};

function play() {
  $('audio').attr('src', songFiles[current]);
  setTitle();
  $('audio').trigger('play');
  if (current < songFiles.length - 1) {
    current++;
  } else {
    current = 0;
  };
};

function changeSong(x) {
  if (x) {
    if (current < songFiles.length - 1) {
      current++;
    } else {
      current = 0;
    };
  } else {
    if (current > 0) {
      current--;
    } else {
      current = songFiles.length - 1;
    };
  };

  $('audio').attr('src', songFiles[current]);
  $('audio').trigger('play');
  setTitle();
};

function setTitle() {
  let title = () => {
    if (songFiles[current].split('/')[3] != 'audio.mp3') {
      return songFiles[current].split('/')[3].split('.')[0];
    } else {
      return songFiles[current].split('/')[2];
    };
  };

  $('#song-title').html(title);
};

// Events

$(document).ready(() => {
  col = 'all';
  update();
});
$('audio').on('ended', () => {
  play();
});
$('#set').on('click', () => {
  col = 'all';
  update();
});
$('#play').on('click', () => {
  $('audio').trigger('play');
});
$('#pause').on('click', () => {
  $('audio').trigger('pause');
});
$('.status').on('click', changeStatus);
$('#next').on('click', () => {
  changeSong(true);
});
$('#previous').on('click', () => {
  changeSong(false);
});
$('.skip').on('click', () => {
  if ($('#pause').hasClass('hidden')) {
    changeStatus();
  };
});
$('#volume').on('mousemove', () => {
  if (vol) {
    $('audio').prop('volume', $('#volume').val() / 100);
  };
});
$('.vol').on('click', () => {
  if (vol) {
    volume = $('#volume').val();
    $('.vol > i').removeClass('fa-volume-up');
    $('.vol > i').addClass('fa-volume-mute');
    $('audio').prop('volume', 0);
    vol = false;
  } else {
    $('#volume').val(volume);
    $('.vol > i').removeClass('fa-volume-mute');
    $('.vol > i').addClass('fa-volume-up');
    $('audio').prop('volume', volume / 100);
    vol = true;
  };
});
$('#fav').on('click', addToFav);
$('#play-fav').on('click', () => {
  col = 'favs';
  updateSongs(favs);
  current = 0;
  setCol();
  play();
});
$('#volume').on('change', (event) => {
  if (event.target.value == 0) {
    $('.vol > i').removeClass('fa-volume-up');
    $('.vol > i').addClass('fa-volume-mute');
    $('audio').prop('volume', 0);
    vol = false;
  } else {
    $('.vol > i').removeClass('fa-volume-mute');
    $('.vol > i').addClass('fa-volume-up');
    $('audio').prop('volume', volume / 100);
    vol = true;
  };
});
