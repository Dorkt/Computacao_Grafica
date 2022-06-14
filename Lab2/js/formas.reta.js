function setup() {
    var canvas = createCanvas(LARGURA, ALTURA);
    canvas.parent("#screen");
  
    document.querySelector('#desenhar').onclick = function() {
      atualizarTela();
    }
  
    document.querySelector('#limpar').onclick = function() {
      novaTela();
    }
  
    document.querySelector('canvas').onmousemove = function(e) {
      let [x, y] = convertToCartesian([e.pageX - this.offsetLeft, e.pageY - this.offsetTop + 1]);
      document.querySelector('#mouseX').innerHTML = x;
      document.querySelector('#mouseY').innerHTML = y;
    };
  
    noLoop();
  }
  
  function draw() {
    novaTela();
  }
  
  function atualizarTela() {
    var inputX1 = document.querySelector("#xa");
    var inputY1 = document.querySelector("#ya");
    var inputX2 = document.querySelector("#xb");
    var inputY2 = document.querySelector("#yb");
    var algoritmo = document.querySelector("#algoritmo").value;
    var cor = 'red';
  
    if(inputX1.value == "" || inputY1.value == "" || inputX2.value == "" || inputY2.value == "") {
      alert("Preencha todas as informações da reta.");
      return false;
    } else if(algoritmo == "") {
      alert("Escolha o algoritmo para o desenho da reta.");
      return false;
    }
  
    var x1 = int(inputX1.value);
    var y1 = int(inputY1.value);
    var x2 = int(inputX2.value);
    var y2 = int(inputY2.value);
  
    if(algoritmo == 'dda') {
      desenharReta(x1, y1, x2, y2, 'dda', cor);
    } else if(algoritmo == 'ponto-medio') {
      desenharReta(x1, y1, x2, y2, 'ponto-medio', cor);
    }
    
    updatePixels();
  }
  