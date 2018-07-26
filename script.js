$(document).ready(function() {

  //Variaveis globais
  var chaveAPI = 'nrXeeq9i2Hv2pcSIkAEyuEUrvmlT7PIa'; // API key MapQuest

  // Funcao para ajax SÍNCRONO
  function callAjax(url, callback) {
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      }
    }
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
  }

  //Funcao q checa se existe um atributo
  $.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
  };

  $('#add-route').click(() => {

    // Declara novo campo de endereco
    var novoEndereco = $(
      '<div class="row mt-5 mb-5 endereco"> <div class="col-12"> <div class="card"> <h5 class="card-header info-color white-text text-center py-4"> <strong>Endereço</strong> <span class="excluir" style="cursor: pointer;">[x]</span> </h5> <div class="card-body px-lg-5 pt-0"> <form class="text-center" style="color: #757575;"> <div class="row"> <div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-endereco"> <label>Endereço</label> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-numero"> <label>Número</label> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-cidade" value="Joinville"> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-pais" value="Brasil"> </div></div></div></form> </div></div></div></div>'
    );

    //Adiciona campo de endereco acima dos botoes
    $('#botoes').before(novoEndereco);

  });

  // //Retorna longitude e latitude de um form de Endereco
  // function retornaLngLat(div) {
  //   var rua = div.find('.input-endereco').val();
  //   var numero = div.find('.input-numero').val();
  //   var cidade = div.find('.input-cidade').val();
  //   var pais = div.find('.input-pais').val();
  //
  //   var endereco = formataEndereco(rua, numero, cidade, pais);
  //   var coordenadas = buscaCoordenadas(endereco, chaveAPI);
  //
  //   console.log(coordenadas);
  //   return coordenadas;
  // }

  //Iterar sobre as divs de endereço para capturar o conteudo dos inputs


  function formataEndereco(rua, numero, cidade, pais) {
    var endereco = String(rua.replace(/ /g, '+') + ',' + String(numero) + ',' + cidade + ',' + pais);
    return endereco;
  }
  //Funcao para buscar array de coordenadas pelo Endereco
  function buscaCoordenadas(endereco, chaveAPI) {
    var coordenadas = new Array();
    var url = "http://www.mapquestapi.com/geocoding/v1/address?key=" + chaveAPI + "&location=" + endereco;

    callAjax(url, function (response) {
      var jsonResponse = JSON.parse(response);
      var lng = jsonResponse.results[0].locations[0].latLng.lng;
      var lat = jsonResponse.results[0].locations[0].latLng.lat;
      // Longitude na posicao 0:
      coordenadas.push(lng);
      // Latitude na posicao 1;
      coordenadas.push(lat);
    });
    return coordenadas;
  };

  $('#gerar-rota').click(() => {

    //TODO: Checar se algum endereco foi criado

    var jsonData = {
      "vehicles": [{
        "id": 0,
        "start": [],
        "end": []
      }],
      "jobs": [],
      "options": {
        "g": true
      }
    };

    //Pega coordenadas de partida
    var divPartida = $('#partida');

    var ruaPartida = divPartida.find('.input-endereco').val();
    var numeroPartida = divPartida.find('.input-numero').val();
    var cidadePartida = divPartida.find('.input-cidade').val();
    var paisPartida = divPartida.find('.input-pais').val();

    var enderecoPartida = formataEndereco(ruaPartida, numeroPartida, cidadePartida, paisPartida);
    var coordenadasPartida = buscaCoordenadas(enderecoPartida, chaveAPI);

    var LngPartida = coordenadasPartida[0];
    var LatPartida = coordenadasPartida[1];

    jsonData.vehicles[0].start = coordenadasPartida;

    var LngChegada = undefined;
    var LatChegada = undefined;

    // Checa se endereco de chegada é diferente:
    var inputSwitch = $('.is-switch-input');
    if (inputSwitch.is(':checked')) {
      LngChegada = coordenadasPartida[0];
      LatChegada = coordenadasPartida[1];
      jsonData.vehicles[0].end = coordenadasPartida;
    } else {
      var divChegada = $('#chegada');
      var ruaChegada = divChegada.find('.input-endereco').val();
      var numeroChegada = divChegada.find('.input-numero').val();
      var cidadeChegada = divChegada.find('.input-cidade').val();
      var paisChegada = divChegada.find('.input-pais').val();
      var enderecoChegada = formataEndereco(ruaChegada, numeroChegada, cidadeChegada, paisChegada);
      var coordenadasChegada = buscaCoordenadas(enderecoChegada, chaveAPI);
      LngChegada = coordenadasChegada[0];
      LatChegada = coordenadasChegada[1];
      jsonData.vehicles[0].end = coordenadasChegada;
    }

    console.log(jsonData);

    //TODO: Implementar geracao de rota // EM CONSTRUCAO


    var rota = $('#rota');
    var partiu = $('#partiu');

    if (rota.hasClass('d-none')) {
      rota.removeClass('d-none');
    }

  });

  // Comportamento do switch que exibe form de edereco de chegada caso nao seja o mesmo da partida
  $('.is-switch-input').click((e) => {
    var inputSwitch = $('.is-switch-input');
    var chegada = $('#chegada');
    if (!inputSwitch.is(':checked')) {
      if (chegada.hasClass('d-none')) {
        chegada.removeClass('d-none');
        // e.stopPropagation();
      }
    } else {
      if (!chegada.hasClass('d-none')) {
        chegada.addClass('d-none');
      }
    }

  })

  $(document).on('click', '.excluir', function(){
    $(this).parent().parent().parent().parent().remove();
  });

  $('#botao-comecar').click(() => {
    $('html, body').animate({
    scrollTop: $("#partida").offset().top - 75
  }, 800)
  });

});
