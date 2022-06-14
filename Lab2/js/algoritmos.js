// tamanho da tela
const LARGURA = 1000;
const ALTURA = 1000;

// intervalo de entrada
const INTERVALO_X_INPUT = [-parseInt(LARGURA / 2), parseInt(LARGURA / 2)];
const INTERVALO_Y_INPUT = [-parseInt(ALTURA / 2), parseInt(ALTURA / 2)];

// intervalo NDC: [-1, 1] para X e Y
const INTERVALO_X_NDC = [-1, 1];
const INTERVALO_Y_NDC = [-1, 1];

// resolução de saída DC (screen)
const INTERVALO_X_DC = [0, LARGURA];
const INTERVALO_Y_DC = [0, ALTURA];

// Criar nova Tela
function novaTela() {
  // limpa objetos da tela
  clear();

  // altera a cor do plano de fundo do gráfico
  background('green');

  // limpa os pixels
  loadPixels();
  pixels = [];

  // desenha eixo x
  desenharReta(
    parseInt(LARGURA / 2),
    0,
    -parseInt(LARGURA / 2),
    0,
    "ponto-medio",
    "#ccc"
  );

  // desenha eixo y
  desenharReta(
    0,
    -parseInt(ALTURA / 2),
    0,
    parseInt(ALTURA / 2),
    "ponto-medio",
    "#ccc"
  );

  // atualiza os pixels
  updatePixels();
}

// Desenhar Reta na tela
function desenharReta(xa, ya, xb, yb, algoritmo = "ponto-medio", cor = "red") {
  let pontos = [];

  if (algoritmo == "ponto-medio") {
    pontos = getRetaPontoMedio(xa, ya, xb, yb);
  } else if ("dda") {
    pontos = getRetaDDA(xa, ya, xb, yb);
  } else {
    return false;
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar Pixel na tela
function desenharPixel(x, y, cor = "red") {
  [x, y] = convertToCartesian([x, y]);
  set(x, y, color(cor));
}


// Calcular reta utilizado algoritmo do ponto médio
function getRetaPontoMedio(x0, y0, x1, y1) {
  [x0, y0] = [round(x0), round(y0)];
  [x1, y1] = [round(x1), round(y1)];
  let [x,y] = [x0,y0];

  // incrementa ou decrementa
  let incX = x1 > x0 ? 1 : x1 < x0 ? -1 : 0;
  let incY = y1 > y0 ? 1 : y1 < y0 ? -1 : 0;

  // variacao de x e y
  let dx = abs(x1 - x0);
  let dy = abs(y1 - y0);
  
  let steep = false;

  // declive da reta
  if(dy > dx) {
    steep = true;
    [x,y] = [y,x];
    [dx,dy] = [dy,dx];
    [incX,incY] = [incY,incX];
  }

  // dstart
  let d = dx - (2 * dy);
  
  const pontos = [];

  if (steep) {
    pontos.push([y, x]);
  } else {
    pontos.push([x, y]);
  }

  for(let count = 1; count <= dx; ++count) {
    if(d <= 0) {
      y += incY;
      d += 2 * dx;
    }

    x += incX;
    d -= 2 * dy;

    if (steep) {
      pontos.push([y, x]);
    } else {
      pontos.push([x, y]);
    }
  }
  
  return pontos;
}

// Calcular reta utilizado Algoritmo DDA
function getRetaDDA(x0, y0, xEnd, yEnd) {
  var pontos = [];

  let dx = xEnd - x0,
    dy = yEnd - y0,
    steps,
    k;
  let xIncrement,
    yIncrement,
    x = x0,
    y = y0;

  //declive
  if (abs(dx) > abs(dy)) {
    steps = abs(dx);
  } else {
    steps = abs(dy);
  }

  //incremento
  xIncrement = float(dx) / float(steps);
  yIncrement = float(dy) / float(steps);

  pontos.push([x, y]);

  for (k = 0; k < steps; k++) {
    x += xIncrement;
    y += yIncrement;
    pontos.push([x, y]);
  }

  return pontos;
}

function to_ndc(ponto, intervalo_x, intervalo_y) {
  let [x, y] = ponto;
  let [xmin, xmax] = intervalo_x;
  let [ymin, ymax] = intervalo_y;
  let [ndcxmin, ndcxmax] = INTERVALO_X_NDC;
  let [ndcymin, ndcymax] = INTERVALO_Y_NDC;

  // fórmula completa para calcular o NDC
  ndcx = ((x - xmin) * (ndcxmax - ndcxmin)) / (xmax - xmin) + ndcxmin;
  ndcy = ((y - ymin) * (ndcymax - ndcymin)) / (ymax - ymin) + ndcymin;

  // fórmula reduzida do NDC
  ndcx_aux = (x - xmin) / (xmax - xmin);
  ndcy_aux = (y - ymin) / (ymax - ymin);

  return [ndcx, ndcy, ndcx_aux, ndcy_aux];
}

function to_coordinates(ponto, intervalo_x, intervalo_y) {
  let [ndcx, ndcy, ndcx_aux, ndcy_aux] = ponto;
  let [xmin, xmax] = intervalo_x;
  let [ymin, ymax] = intervalo_y;
  let [ndh, ndv] = [xmax - xmin, ymax - ymin];

  dcx = round(ndcx_aux * (ndh - 1));
  dcy = round(ndcy_aux * (ndv - 1));

  return [dcx, dcy];
}

function inp_to_ndc(ponto) {
  return to_ndc(ponto, INTERVALO_X_INPUT, INTERVALO_Y_INPUT);
}

function ndc_to_user(ponto) {
  return to_coordinates(ponto, INTERVALO_X_USER, INTERVALO_Y_USER);
}

function user_to_ndc(ponto) {
  return to_ndc(ponto, INTERVALO_X_USER, INTERVALO_Y_USER);
}

function ndc_to_dc(ponto) {
  return to_coordinates(ponto, INTERVALO_X_DC, INTERVALO_Y_DC);
}

function inp_to_dc(ponto) {
  return ndc_to_dc(inp_to_ndc(ponto));
}

function convertToCartesian(point) {
  let [pointScreenX, pointScreenY] = [point[0], point[1]];
  let [screenXMin, screenXMax] = INTERVALO_X_DC;
  let [screenYMin, screenYMax] = INTERVALO_Y_DC;
  let [screenWidth, screenHeight] = [
    screenXMax - screenXMin,
    screenYMax - screenYMin,
  ];
  return [
    pointScreenX - parseInt(screenWidth / 2),
    -pointScreenY + parseInt(screenHeight / 2),
  ];
}

function convertToScreen(point) {
  let [pointCartesianX, pointCartesianY] = [point[0], point[1]];
  let [cartesianXMin, cartesianXMax] = INTERVALO_X_DC;
  let [cartesianYMin, cartesianYMax] = INTERVALO_Y_DC;
  let [cartesianWidth, cartesianHeight] = [
    cartesianXMax - cartesianXMin,
    cartesianYMax - cartesianYMin,
  ];
  return [
    pointCartesianX - parseInt(cartesianWidth / 2),
    -pointCartesianY + parseInt(cartesianHeight / 2),
  ];
}

// Convert graus para radiano
function grausParaRadiano(angulo) {
  var resultado = angulo * (3.14 / 180)
  return resultado.toPrecision(3)
}

// Desenhar elipse por meio do ponto medio
function desenharElipsePontoMedio(xOrigem, yOrigem, raioX, raioY, cor = "red") {
  var pontos = [];
  var x = 0
  var y = raioY;
  var p1, p2;

  // simetria 4
  pontos.push([x + xOrigem, y + yOrigem]);
  pontos.push([-x + xOrigem, y + yOrigem]);
  pontos.push([x + xOrigem, -y + yOrigem]);
  pontos.push([-x + xOrigem, -y + yOrigem]);


  // regiao 1
  p1 = raioY * raioY - raioX * raioX * raioY + 0.25 * raioX * raioX;
  while (2 * raioY * raioY * x <= 2 * raioX * raioX * y) {
    if (p1 < 0) {
      x = x + 1;
      p1 = p1 + 2 * raioY * raioY * x + raioY * raioY;
    } else {
      x = x + 1;
      y = y - 1;
      p1 = p1 + 2 * raioY * raioY * x - 2 * raioX * raioX * y + raioY * raioY;
    }

    // simetria 4
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
  }


  // regiao 2
  p2 =
    (x + 0.5) * (x + 0.5) * raioY * raioY +
    (y - 1) * (y - 1) * raioX * raioX -
    raioX * raioX * raioY * raioY;
  while (y != 0) {
    if (p2 > 0) {
      y = y - 1;
      p2 = p2 - 2 * y * raioX * raioX + raioX * raioX;
    } else {
      x = x + 1;
      y = y - 1;
      p2 = p2 - 2 * y * raioX * raioX + 2 * x * raioY * raioY + raioX * raioX;
    }
    
    // simetria 4
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio do ponto medio
function desenharCircunferenciaPontoMedio(xOrigem, yOrigem, raio, cor = "red") {
  var x = 0;
  var y = raio;
  var p;
  var pontos = [];
  pontos.push([x + xOrigem, y + yOrigem]);
  p = Number.isInteger(raio) ? 1 - raio : 5 / 4 - raio;

  while (x <= y) {
    if (p < 0) {
      x = x + 1;
      p = p + 2 * x + 1;
    } else {
      x = x + 1;
      y = y - 1;
      p = p + 2 * x - 2 * y + 1;
    }
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
    pontos.push([y + xOrigem, x + yOrigem]);
    pontos.push([-y + xOrigem, x + yOrigem]);
    pontos.push([y + xOrigem, -x + yOrigem]);
    pontos.push([-y + xOrigem, -x + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio do metodo trigonometrico
function desenharCircunferenciaMetodoTrigonometrico(
  xOrigem,
  yOrigem,
  raio,
  cor = "red"
) {
  var angulo = 0;
  var pontos = [];
  var x;
  var y;
  while (angulo <= 2 * Math.PI) {
    x = xOrigem + raio * Math.cos(angulo);
    y = yOrigem + raio * Math.sin(angulo);
    angulo = angulo + Math.PI / 180;
    pontos.push([x, y]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}

// Desenhar circunferencia por meio da equação explicita
function desenharCircunferenciaEquacaoExplicita(
  xOrigem,
  yOrigem,
  raio,
  cor = "red"
) {
  var x = 0;
  var y = raio;
  var pontos = [];
  pontos.push([x + xOrigem, y + yOrigem]);
  while (x <= y) {
    x = x + 1;
    y = Math.sqrt(raio * raio - x * x);
    pontos.push([x + xOrigem, y + yOrigem]);
    pontos.push([-x + xOrigem, y + yOrigem]);
    pontos.push([x + xOrigem, -y + yOrigem]);
    pontos.push([-x + xOrigem, -y + yOrigem]);
    pontos.push([y + xOrigem, x + yOrigem]);
    pontos.push([-y + xOrigem, x + yOrigem]);
    pontos.push([y + xOrigem, -x + yOrigem]);
    pontos.push([-y + xOrigem, -x + yOrigem]);
  }

  pontos.forEach(function (ponto, i) {
    desenharPixel(ponto[0], ponto[1], cor);
  });
}
