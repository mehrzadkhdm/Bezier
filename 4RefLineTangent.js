
//---------------------------------
var i, svgContent, elm, rot, GL, ps,
    d = [],
    rotD = 0;

window.onload = () => startDoc();

function startDoc() {
    for(i = 0; i < 8; i++){ d[i] = Math.floor(Math.random() * 400);}
    rot = rotD * Math.PI / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    makePath();
    makePs(d, "pink", 4);
    bb();

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
  console.log()
    elm.setAttribute('d', "M"+ d[0] + "," + d[1] + " C" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5] + " " + d[6] + "," + d[7] );
    //elm.setAttribute("transform", "rotate(" + rotD + " 100 100)");
    elm.setAttribute('stroke', 'black');
    elm.setAttribute('stroke-miterlimit', '1');
    elm.setAttribute('stroke-linejoin', 'round');
    elm.setAttribute('shape-rendering', 'geometricPrecision');
    elm.setAttribute('stroke-width', "1");
    elm.setAttribute('fill', "none");
    svgContent.appendChild(elm);

    GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgContent.appendChild(GL);
}

function restart() {
    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
  startDoc();
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
            p.setAttribute("r", r);
            p.setAttribute("fill", color);
            GL.appendChild(p);
        }
    }
}

//---------------------------
function bb() {
    var p, q, min, max, t1, t2, tp,
        xm = [], exterm = [];

    // horizontal
    t1 = 0;
    t2 = 0;
    //console.log('d=',d)
    p = -d[0] + 3 * d[2] - 3 * d[4] + d[6];
    q = 2 * d[0] - 4 * d[2] + 2 * d[4];
    r = -d[0] + d[2];

    if (p == 0) {
        if (q != 0) {
            t1 = r / q;
            t2 = r / q;
            if (t1 < 0 || t1 > 1) {
                t1 = 0;
                t2 = 0;
            }
        }
    }
    else {
        delta = q * q - 4 * p * r;
        if (delta >= 0) {
            t1 = (-q - Math.sqrt(delta)) / p / 2.0;
            t2 = (-q + Math.sqrt(delta)) / p / 2.0;
            if (t1 < 0 || t1 > 1) {
                t1 = 0;
            }
            if (t2 < 0 || t2 > 1) {
                t2 = 0;
            }
        }
    }
    //console.log('t1, t2 =', t1, t2)
    xm = [d[0], ref4LineE(t1, d)[0], ref4LineE(t2, d)[0], d[6]];
    //console.log('xm =', xm)

    //left
    min = Math.min.apply(Math, xm);
    if (min == xm[0]) { tp = 0; }
    else if (min == xm[1]) { tp = t1; }
    else if (min == xm[2]) { tp = t2; }
    else { tp = 1; }
    //console.log('tp = ', tp, ref4LineE(tp, d))
    exterm = exterm.concat(ref4LineE(tp, d));

    //right
    max = Math.max.apply(Math, xm);
    if (max == xm[0]) { tp = 0; }
    else if (max == xm[1]) { tp = t1; }
    else if (max == xm[2]) { tp = t2; }
    else { tp = 1; }
    //console.log('tp = ', tp, ref4LineE(tp, d))
    exterm = exterm.concat(ref4LineE(tp, d));

    //vertical
    t1 = 0;
    t2 = 0;

    p = -d[1] + 3 * d[3] - 3 * d[5] + d[7];
    q = 2 * d[1] - 4 * d[3] + 2 * d[5];
    r = -d[1] + d[3];

    if (p == 0) {
        if (q != 0) {
            t1 = r / q;
            t2 = r / q;
            if (t1 < 0 || t1 > 1) {
                t1 = 0;
                t2 = 0;
            }
        }
    }
    else {
        delta = q * q - 4 * p * r;
        if (delta >= 0) {
            t1 = (-q - Math.sqrt(delta)) / p / 2.0;
            t2 = (-q + Math.sqrt(delta)) / p / 2.0;
            if (t1 < 0 || t1 > 1) {
                t1 = 0;
            }
            if (t2 < 0 || t2 > 1) {
                t2 = 0;
            }
        }
    }
    xm = [d[1], ref4LineE(t1, d)[1], ref4LineE(t2, d)[1], d[7]];

    //bottom
    min = Math.min.apply(Math, xm);
    if (min == xm[0]) { tp = 0; }
    else if (min == xm[1]) { tp = t1; }
    else if (min == xm[2]) { tp = t2; }
    else { tp = 1; }

    exterm = exterm.concat(ref4LineE(tp, d));

    //top
    max = Math.max.apply(Math, xm);
    if (max == xm[0]) { tp = 0; }
    else if (max == xm[1]) { tp = t1; }
    else if (max == xm[2]) { tp = t2; }
    else { tp = 1; }

    exterm = exterm.concat(ref4LineE(tp, d));


    console.log(exterm);
    makePs(exterm, "blue", 3);
}
//-------------------------------------------------------------------------
function ref4LineE(t, d) {
    k1 = Math.pow(1 - t, 3);
    k2 = 3 * Math.pow(1 - t, 2) * t;
    k3 = 3 * (1 - t) * t * t;
    k4 = Math.pow(t, 3);
    return [k1 * d[0] + k2 * d[2] + k3 * d[4] + k4 * d[6],
    k1 * d[1] + k2 * d[3] + k3 * d[5] + k4 * d[7]];
}
//-------------------------------------------------------------------------

   