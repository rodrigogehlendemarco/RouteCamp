$(document).ready(function() {
  // Initialize the internationalization module
  if (window.initI18n) {
    window.initI18n();
  }

  //Variaveis globais
  var arrayGlobalEnderecos = [];

  // Funcao para ajax GET SÍNCRONO
  function callAjaxGET(url, callback) {
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

  // Funcao para ajax POST SÍNCRONO
  function callAjaxPOST(JSONdata, callback) {
    var xmlhttp;
    var requestURL = 'http://solver.vroom-project.org';
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", requestURL, false);
    xmlhttp.setRequestHeader('Content-type', 'application/json');

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        callback(xmlhttp.responseText);
      }
    }
    xmlhttp.send(JSON.stringify(JSONdata));
  }

  //Funcao q checa se existe um atributo
  $.fn.hasAttr = function(name) {
    return this.attr(name) !== undefined;
  };

  $('#add-route').click(() => {

    // Declara novo campo de endereco
    var novoEndereco = $(
      `<div class="row mt-5 mb-5 endereco"> <div class="col-12"> <div class="card"> <h5 class="card-header info-color white-text text-center py-4"> <strong>${getTranslation('address_label')}</strong> <span class="excluir" style="cursor: pointer;">[x]</span> </h5> <div class="card-body px-lg-5 pt-0"> <form class="text-center" style="color: #757575;"> <div class="row"> <div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-endereco"> <label>${getTranslation('address')}</label> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-numero"> <label>${getTranslation('number')}</label> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-cidade"> <label>${getTranslation('city')}</label> </div></div><div class="col-6"> <div class="md-form"> <input type="text" class="form-control input-pais"> <label>${getTranslation('country')}</label> </div></div></div></form> </div></div></div></div>`
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

    callAjaxGET(url, function(response) {
      var jsonResponse = JSON.parse(response);
      var lng = jsonResponse.results[0].locations[0].latLng.lng;
      var lat = jsonResponse.results[0].locations[0].latLng.lat;
      var stringEndereco = jsonResponse.results[0].providedLocation.location;
      console.log(stringEndereco)
      // Longitude na posicao 0:
      coordenadas.push(lng);
      // Latitude na posicao 1;
      coordenadas.push(lat);
      //String de endereco na posicao 2;
      coordenadas.push(stringEndereco);
    });
    return coordenadas;
  };

  $('#gerar-rota').click(() => {

    //TODO: Checar se algum endereco foi criado

    // Esqueleto do JSON a ser enviado
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

    //Centraliza mapa sobre as coordenadas de Partida
    var mymap = L.map('mapid').setView([LatPartida, LngPartida], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1Ijoicm9kcmlnb2dkZW1hcmNvIiwiYSI6ImNqazJ6aGFhNzBkamYzcnRoaHN0MGsweXcifQ.esOIBfSZx5tNYtDxwXUpDA'
    }).addTo(mymap);

    var markerPartida = L.marker([LatPartida, LngPartida]).addTo(mymap);
    markerPartida.bindPopup(getTranslation('start_point_popup')).openPopup();

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

      var stringEnderecoChegada = coordenadasChegada[2];
      //Passa objeto para array global de enderecos
      var objetoCoordenadasComEnderecoChegada = {
        "coordenadas": coordenadasChegada.slice(0, 2),
        "endereco": stringEnderecoChegada
      }
      arrayGlobalEnderecos.push(objetoCoordenadasComEnderecoChegada);
    }

    console.log(jsonData);

    //Itera sobre os enderecos
    $('.endereco').each(function(index) {
      console.log(index);
      var divEndereco = $(this);
      var rua = divEndereco.find('.input-endereco').val();
      var numero = divEndereco.find('.input-numero').val();
      var cidade = divEndereco.find('.input-cidade').val();
      var pais = divEndereco.find('.input-pais').val();
      var endereco = formataEndereco(rua, numero, cidade, pais);
      var coordenadas = buscaCoordenadas(endereco, chaveAPI);
      var stringEndereco = coordenadas[2];

      //Cria objeto que representa endereco
      var objetoEndereco = {
        "id": index,
        "location": coordenadas
      }

      jsonData.jobs.push(objetoEndereco);

      //Passa objeto para array global de enderecos
      var objetoCoordenadasComEndereco = {
        "coordenadas": coordenadas.slice(0, 2),
        "endereco": stringEndereco
      }
      arrayGlobalEnderecos.push(objetoCoordenadasComEndereco);
    })

    console.log(jsonData);

    //Envia para API de roteirizacao
    callAjaxPOST(jsonData, function(response) {
      console.log("ROTEIRO:");
      var responseJson = JSON.parse(response);
      console.log(responseJson.routes[0].steps);
      responseJson.routes[0].steps.forEach((step, index) => {
        console.log(step.type); // Job, start ou end
        console.log(step.location); // coordenadas
        console.log(step.job); // ID
        console.log(step.distance); // distancia em metros
        if (step.type == "job" || step.type == "end" && !inputSwitch.is(':checked')) {
          var arrayFiltro = arrayGlobalEnderecos.filter(function(item) {
            return (item.coordenadas[0] == step.location[0] && item.coordenadas[1] == step.location[1]);
          });
          step.endereco = arrayFiltro[0].endereco;
          console.log(step.endereco);

          //Plota ponto no mapa
          L.marker([step.location[1], step.location[0]]).addTo(mymap).bindPopup(`${index}. - ${step.endereco}`);

          if (step.type == "end" && !inputSwitch.is(':checked')) {
            L.marker([step.location[1], step.location[0]]).addTo(mymap).bindPopup(getTranslation('end_point_popup'));
          }

          var mapStringEndereco = step.endereco.replace(/ /g, '+');
          var mapStringEnderecoGoogle = "https://www.google.com/maps/search/?api=1&query=" + mapStringEndereco;

          // Declara novo campo de rota
          var novaRotaString = `<div class="col-12"> <div class="card"> <h5 class="card-header peach-gradient white-text text-center py-2"> </h5> <div class="card-body px-lg-5 pt-0"> <form class="text-center" style="color: #757575;"> <div class="row"> <div class="col-3 col-lg-2 my-auto"> <p class="display-4">${index}</p></div><div class="col-9 col-lg-6 my-auto"> <p class="">${step.endereco}</p></div><div class="col-12 col-lg-4 my-auto"> <a target="_blank" rel="noopener noreferrer" href="${mapStringEnderecoGoogle}" class="btn peach-gradient btn-lg" id="botao-partiu"><i class="fas fa-truck fa-2x mr-3"></i>${getTranslation('lets_go')}</a> </div></div></form> </div></div></div>`;

          var novaRota = $(novaRotaString);

          $('#rota').append(novaRota);
        }
      })
    });

    //Implementar Embedding do google map


    var rota = $('#rota');
    var partiu = $('#partiu');
    if (rota.hasClass('d-none')) {
      rota.removeClass('d-none');
    }
    //Scroll ate a rota
    $('html, body').animate({
      scrollTop: rota.offset().top - 75
    }, 800)

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

  $(document).on('click', '.excluir', function() {
    $(this).parent().parent().parent().parent().remove();
  });

  $('#botao-comecar').click(() => {
    $('html, body').animate({
      scrollTop: $("#partida").offset().top - 75
    }, 800)
  });

});
