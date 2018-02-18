const RED = 'red',
      GREEN = 'green',
      BLUE = 'blue';
const arrayRGB = [RED,GREEN,BLUE];

const CYAN = "cyan",
      MAGENTA = "magenta",
      YELLOW = "yellow",
      BLACK = "black";
const arrayCMYK = [CYAN, MAGENTA, YELLOW, BLACK];

const HUE = "hue",
      SATURATION = "saturation",
      VALUE = "value";
const arrayHSV = [HUE, SATURATION, VALUE];

const Lab = "l",
      lAb = "a",
      laB = "b";
const arrayLAB = [Lab, lAb, laB];

function setInputNumber(color, value){

  if (arrayRGB.indexOf(color) > -1){
    value = parseInt(value);
    if (value < 0){
      value = 0;
    }
    if (value > 255){
      value = 255;
    }
  }

  getElementById(color + "-number").value = value;
}

function getInputNumber(color){
  return parseInt(getElementById(color + "-number").value);
}

//HELPERS
function getElementById(id) {
  return document.getElementById(id) || null;
}

function getNumbers(array){
  return array.reduce((o,c) => {
    o[c] = getElementById(c + "-number");
    return o;
  }, {});
}

function getRanges(array){
  return array.reduce((o,c) => {
    o[c] = getElementById(c + "-range");
    return o;
  }, {});
}

function update(){
  updateAll();
}

    console.log('document is ready');

    const numbersRGB = getNumbers(arrayRGB);
    const rangesRGB = getRanges(arrayRGB);

    const numbersCMYK = getNumbers(arrayCMYK);
    const rangesCMYK = getRanges(arrayCMYK);

    const numbersHSV = getNumbers(arrayHSV);
    const rangesHSV = getRanges(arrayHSV);
    
    const numbersLAB = getNumbers(arrayLAB);
    const rangesLAB = getRanges(arrayLAB);
  
    // Add event listeners

    Object.keys(rangesRGB).forEach(r => {
      rangesRGB[r] ? rangesRGB[r].addEventListener('input', handleRGBInputChange) : null;
    });

    Object.keys(numbersRGB).forEach(n => {
      numbersRGB[n] ? numbersRGB[n].addEventListener("input", handleRGBInputChange) : null;
    });
    
    Object.keys(rangesCMYK).forEach(r => {
      rangesCMYK[r] ? rangesCMYK[r].addEventListener("input", handleRGBInputChange) : null;
    })

    Object.keys(rangesHSV).forEach(r => {
      rangesHSV[r] ? rangesHSV[r].addEventListener("input", handleRGBInputChange) : null;
    })

    Object.keys(rangesLAB).forEach(r => {
      rangesLAB[r] ? rangesLAB[r].addEventListener("input", handleRGBInputChange) : null;
    })
  
    function handleRGBInputChange(e) {
      e.stopPropagation();
      e.preventDefault();
      let {id, value} = e.target;
      let color = id.substring(0, id.indexOf("-"));

      setInputNumber(color, value);
      updateAll(e);
    }
    
    function updateAll(e) {
      if (e){
        e.stopPropagation();
        e.preventDefault();

        let {id, value} = e.target;
        let color = id.substring(0, id.indexOf("-"));

        if (arrayCMYK.indexOf(color) > -1){
          updateRGBNumbersFromCMYK();
          updateRanges(numbersRGB, rangesRGB);

          updateHSVNumbersFromRGB();
          updateRanges(numbersHSV, rangesHSV);

          updateLABNumbersFromRGB();
          updateRanges(numbersLAB, rangesLAB);
          updateColors();
          return;
        }

        if (arrayHSV.indexOf(color) > -1){
          updateRGBNumbersFromHSV();
          updateRanges(numbersRGB, rangesRGB);

          updateCMYKNumbersFromRGB();
          updateRanges(numbersCMYK, rangesCMYK);

          updateLABNumbersFromRGB();
          updateRanges(numbersLAB, rangesLAB);
          updateColors();
          return;
        }

        if (arrayLAB.indexOf(color) > -1){
          updateRGBNumbersFromLAB();
          updateRanges(numbersRGB, rangesRGB);

          updateCMYKNumbersFromRGB();
          updateRanges(numbersCMYK, rangesCMYK);

          updateHSVNumbersFromRGB();
          updateRanges(numbersHSV, rangesHSV);
          updateColors();
          return;
        }        
      }

      updateRanges(numbersRGB, rangesRGB);
      updateCMYKNumbersFromRGB();
      updateRanges(numbersCMYK, rangesCMYK);
      updateHSVNumbersFromRGB();
      updateRanges(numbersHSV, rangesHSV);
      updateLABNumbersFromRGB();
      updateRanges(numbersLAB, rangesLAB);

      updateColors();
    }

    function updateColors(){
      Object.keys(numbersRGB).forEach(n => {
        document.documentElement.style.setProperty(`--${n}`, numbersRGB[n].value);
      });
    }

    function updateRanges(numbers, ranges){
      Object.keys(numbers).forEach(n => {
        ranges[n].value = parseInt(numbers[n].value);
      });
    }

    function updateCMYKNumbersFromRGB(){
        let R = getInputNumber(RED)/255;
        let G = getInputNumber(GREEN)/255;
        let B = getInputNumber(BLUE)/255;

        let K = 1 - Math.max(R, G, B);
        if(K == 1) return;
        let C = (1 - R - K)/(1 - K);
        let M = (1 - G - K)/(1 - K);
        let Y = (1 - B - K)/(1 - K);
        
        setInputNumber(CYAN, parseInt(C*100));
        setInputNumber(MAGENTA, parseInt(M*100));
        setInputNumber(YELLOW, parseInt(Y*100));
        setInputNumber(BLACK, parseInt(K*100));
    }

    function updateRGBNumbersFromCMYK(){
      let C = getInputNumber(CYAN)/100;
      let M = getInputNumber(MAGENTA)/100;
      let Y = getInputNumber(YELLOW)/100;
      let K = getInputNumber(BLACK)/100;

      let R = parseInt(255 * (1 - C)*(1 - K));
      let G = parseInt(255 * (1 - M)*(1 - K));
      let B = parseInt(255 * (1 - Y)*(1 - K));
      
      setInputNumber(RED, R);
      setInputNumber(GREEN, G);
      setInputNumber(BLUE, B);
  }

    function updateRGBNumbersFromHSV(){
      let H = getInputNumber(HUE);
      let S = getInputNumber(SATURATION)/100;
      let V = getInputNumber(VALUE)/100;

      let C = V * S;
      let X = C * (1 - Math.abs(mod(H/60, 2) - 1));
      let m = V - C;

      let Rs = 0, Gs = 0, Bs = 0;

      if (H < 60) {
        Rs = C; Gs = X; Bs = 0;
      } 
      else if(H < 120) {
        Rs = X; Gs = C; Bs = 0;
      }
      else if(H < 180) {
        Rs = 0; Gs = C; Bs = X;
      }
      else if(H < 240) {
        Rs = 0; Gs = X; Bs = C;
      }
      else if(H < 300) {
        Rs = X; Gs = 0; Bs = C;
      }
      else {
        Rs = C; Gs = 0; Bs = X;
      }

      let R = parseInt((Rs+m)*255);
      let G = parseInt((Gs+m)*255);
      let B = parseInt((Bs+m)*255);

      setInputNumber(RED, R);
      setInputNumber(GREEN, G);
      setInputNumber(BLUE, B);
    }

    function updateHSVNumbersFromRGB(){
      let R = getInputNumber(RED)/255;
      let G = getInputNumber(GREEN)/255;
      let B = getInputNumber(BLUE)/255;

      let Cmax = Math.max(R, G, B);
      let Cmin = Math.min(R, G, B);
      let delt = Cmax - Cmin;

      let H = 0;
      let S = 0;
      let V = 0;
      if (Cmax == R){
        H = parseInt(60 * mod((G - B)/delt, 6));
      }
      if (Cmax == G){
        H = parseInt(60 * ((B - R)/delt + 2));
      }
      if (Cmax == B){
        H = parseInt(60 * ((R - G)/delt + 4));
      }

      if (Cmax != 0){
        S = parseInt(delt * 100 / Cmax );
      }

      V = parseInt(Cmax * 100);

      setInputNumber(HUE, H);
      setInputNumber(SATURATION, S);
      setInputNumber(VALUE, V);
    }

    function updateLABNumbersFromRGB(){
      let R = getInputNumber(RED);
      let G = getInputNumber(GREEN);
      let B = getInputNumber(BLUE);

      let Rn = forRGBtoXYZ(R/255)*100;
      let Gn = forRGBtoXYZ(G/255)*100;
      let Bn = forRGBtoXYZ(B/255)*100;

      let X = 0.412453*Rn + 0.357580*Gn + 0.180423*Bn;
      let Y = 0.212671*Rn + 0.715160*Gn + 0.072169*Bn;
      let Z = 0.019334*Rn + 0.119193*Gn + 0.950227*Bn;

      let Xw = 95.047;
      let Yw = 100;
      let Zw = 108.883;

      let L = 116*forXYZtoLAB(Y/Yw) - 16;
      let a = 500*(forXYZtoLAB(X/Xw) - forXYZtoLAB(Y/Yw));
      let b = 200*(forXYZtoLAB(Y/Yw) - forXYZtoLAB(Z/Zw));

      setInputNumber(Lab, parseInt(L));
      setInputNumber(lAb, parseInt(a));
      setInputNumber(laB, parseInt(b));
    }

    function forRGBtoXYZ(x){
      if (x >= 0.04045){
        return Math.pow((x + 0.055)/1.055, 2.4);
      }
      return x/12.92;
    }

    function forXYZtoLAB(x){
      if (x >= 0.008856){
        return Math.pow(x, 1/3);
      }
      return 7.787*x + 16/116;
    }

    function updateRGBNumbersFromLAB(){
      let L = getInputNumber(Lab);
      let a = getInputNumber(lAb);
      let b = getInputNumber(laB);

      let Xw = 95.047;
      let Yw = 100;
      let Zw = 108.883;

      let Y = forLABtoXYZ((L + 16)/116)*Xw;
      let X = forLABtoXYZ(a/500 + (L + 16)/116)*Yw;
      let Z = forLABtoXYZ((L + 16)/116 - b/200)*Zw;

      X = X/100;
      Y = Y/100;
      Z = Z/100;

      let Rn = 3.2406*X - 1.5372*Y - 0.4986*Z;
      let Gn = -0.9689*X + 1.8758*Y + 0.0415*Z;
      let Bn = 0.0557*X -0.2040*Y + 1.0570*Z;

      let R = forXYZtoRGB(Rn)*255;
      let G = forXYZtoRGB(Gn)*255;
      let B = forXYZtoRGB(Bn)*255;

      setInputNumber(RED, R);
      setInputNumber(GREEN, G);
      setInputNumber(BLUE, B);
    }

    function forLABtoXYZ(x){
      if (Math.pow(x, 3) >= 0.008856){
        return Math.pow(x, 3);
      }
      return (x - 16/116)/7.787;
    }

    function forXYZtoRGB(x){
      if (x >= 0.0031308){
        return 1.055 * Math.pow(x, 1/2.4) - 0.055;
      }
      return 12.92*x;
    }

    function mod(value, mod){
      if (value < 0){
        return (value % mod) + mod;
      }
      return value % mod;
    }

