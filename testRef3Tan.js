var i, svgContent, elm, rot, GL, ps, deg,
    d = [], point1 = [], point2 = [], points3 = [],
    rotD = 0;

window.onload = () => startDoc();

function startDoc() {
  var t;
    for(i = 0; i < 6; i++){ d[i] = Math.floor(Math.random() * 1000);} 
    rot = rotD * Math.PI / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    makePath();
    makePs(d, "pink", 4);
    tanTest();

    btn = document.createElement('input');
    btn.type = "button";
    btn.value = "restart";
    btn.className = "btn";
    btn.addEventListener('click', restart);
    svgContent.parentNode.appendChild(btn);
}

//---------------------------------
function makePath(color) {
    if (!color) { color = "black"; }
    elm = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    elm.setAttribute('d', "M" + + d[0] + "," + d[1] + " Q" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5]);
    //elm.setAttribute("transform", "rotate(" + rotD + " 100 100)");
    elm.setAttribute('stroke', 'black');
    elm.setAttribute('stroke-width', "1");
    elm.setAttribute('fill', "none");
    svgContent.appendChild(elm);
    GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgContent.appendChild(GL);
}
function makeLine(line, color){
  //console.log(line);
  if (!color) { color = "red"; }
  var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", line[0]);
    l.setAttribute("y1", line[1]);
    l.setAttribute("x2", line[2]);
    l.setAttribute("y2", line[3]);
    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", 1);
    GL.appendChild(l);
  //console.log(l);
}

function makePs(ps, color, r) {
    var i, p;
    if (!color) { color = "red"; }
    if(!r) {r = 3;}
    if (ps.length < 2) { return false; }
    else {
        for (i = 0; i < ps.length; i += 2) {
            p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            p.setAttribute("cx", ps[i]);
            p.setAttribute("cy", ps[i + 1]);
            p.setAttribute("r", 1.5*i+3);
            p.setAttribute("fill", color);
            GL.appendChild(p);
        }
    }
}

///TEST
//---------------------------
function tanTest() {
  var t = 1.0,
      p = ref3LineE(tFromTan(tanFromT(t)));
      console.log(' calc t =',tFromTan(tanFromT(t)));
      console.log('p ',p);
  makePs(p, "blue", 3);
}
//-------------------------------------------------------------------------
function tanFromT(t) {
// t --> tangent direction
  var dir,
  tLine = [(1 - t) * d[0] + t * d[2], (1 - t) * d[1] + t * d[3], (1 - t) * d[2] + t * d[4], (1 - t) * d[3] + t * d[5]];
  console.log(d)
  console.log(tLine);
  makeLine(tLine);
  dir = Math.atan2(tLine[3] - tLine[1], tLine[2] - tLine[0]) * 180 / Math.PI;
  console.log('direction = ', dir);
  if(dir > 360){ dir -= 360; }
  else if(dir < 0){ dir += 360; }
  return dir;
}

//-------------------------------------------------------------------------
// dir - direction of tangent in 
function tFromTan(dir) {
    // tangent direction --> t
    // Find t for the given tangent direction
    var slope = Math.tan(dir * Math.PI / 180.0),
        t = false,
        a = 2 * d[0] - 4 * d[2] + 2 * d[4],
        b = -2 * d[0] + 2 * d[2],
        c = 2 * d[1] - 4 * d[3] + 2 * d[5],
        dp = -2 * d[1] + 2 * d[3];

    if (c != a * slope) {
        tp = (b * slope - dp) / (c - a * slope);
        if (tp >= 0 && tp <= 1.00000001) {
            t = tp;
            if(t>1)t=1;
        }
    }
    return t;
}
//-------------------------------------------------------------------------
function ref3LineDiff(t) {
    // t --> [dx/dt , dy/dt]
    var k1 = 2 * t - 2,
        k2 = 2 - 4 * t,
        k3 = 2 * t;
    return [k1 * d[0] + k2 * d[2] + k3 * d[4], k1 * d[1] + k2 * d[3] + k3 * d[5]];
}
//-------------------------------------------------------------------------
function ref3LineE(t) {
    return [Math.pow(1 - t, 2) * d[0] + 2 * t * (1 - t) * d[2] + t * t * d[4], Math.pow(1 - t, 2) * d[1] + 2 * t * (1 - t) * d[3] + t * t * d[5]];
}
//-------------------------------------------------------------------------
function restart() {
    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
  startDoc();
}
   