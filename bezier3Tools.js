
//---------------------------------
var i, svgContent, elm, rot, GL, ps, distance, deg,
    d = [], point1 = [], point2 = [], points3 = [],
    rotD = 0;

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 6; i++) { d[i] = Math.floor(Math.random() * 800); }
    point1 = ref3LineE(Math.random(), d);
    deg = Math.floor(Math.random() * 360 - 180) / 10.0;
    distance = Math.floor(Math.random() * 100 - 50);
    console.log("point1 = " + point1);
    console.log("deg = " + deg);
    console.log("distance = " + distance);

    rot = rotD * Math.PI / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    makePath();
    makePs(point1, "blue")
    makePs(d, "pink", 4);
    getNewPoint(d, point1, deg, distance);
    // console.log(getLength(d, 0, 1, 17));
    // console.log(getLength(d, 0, 1, 33));
    // console.log(getLength(d, 0, 1, 65));
    // console.log(getLength(d, 0, 1, 129));
    // console.log(getLength(d, 0, 1, 257));

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

function makePs(ps, color, r) {
    var i, p;
    if (!color) { color = "red"; }
    if (!r) { r = 3; }
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

function makeLine(ps, color) {
    var i, p;
    if (!color) { color = "red"; }
    if (ps.length < 2) { return false; }
    p = document.createElementNS("http://www.w3.org/2000/svg", "line");
    p.setAttribute("x1", ps[0]);
    p.setAttribute("y1", ps[1]);
    p.setAttribute("x2", ps[2]);
    p.setAttribute("y2", ps[3]);
    p.setAttribute("stroke", color);
    GL.appendChild(p);

}

//---------------------------
function getNewPoint(d, point, deg, distance) {
    var t, t2, t3;
    t = solveforT(d, point)
    tg = TangentLine(t, d);
    makeLine(tg);    
    // for (tp = 0; tp <= 1.0; tp += 0.1) {
    //     tg = TangentLine(tp, d);

    //     makeLine(tg);
    // }

    if (Number.isNaN(t)) { return; }
    dydx = ref3LineEDiff(t, d);


    tanp = Math.tan(Math.atan2(dydx[1], dydx[0]) + deg * Math.PI / 180.0);

    t2 = solevforTangent(d, tanp);
    //  point2 = algo for point1 +/- degrees
    if (Number.isFinite(t2)) {
        point2 = ref3LineE(t2, d);
        makePs(point2, "green", 3);
        console.log('point2 = ', point2);
    }

    t3 = solveforDistanceFrom(d, t, distance);
    if (Number.isFinite(t3) > 0) {
        point3 = ref3LineE(t3, d);
        makePs(point3, "red", 3);
    }

}


//-------------------------------------------------------------------------
function ref3LineE(t, d) {
    var k1, k2, k3;
    k1 = (1 - t) * (1 - t);
    k2 = 2 * t * (1 - t);
    k3 = t * t;

    return [k1 * d[0] + k2 * d[2] + k3 * d[4],
    k1 * d[1] + k2 * d[3] + k3 * d[5]];
   
}
function Tangent(t, d) {
    //  t -->  tangent
    dydx = ref3LineEDiff(t, d);
    p0 = ref3LineE(t, d);
    return dydx[1] / dydx[0];
}

function TangentLine(t, d) {
    //  t -->  tangent
    var x1 = (1 - t) * d[0] + t * d[2];
    var y1 = (1 - t) * d[1] + t * d[3];
    var x2 = (1 - t) * d[2] + t * d[4];
    var y2 = (1 - t) * d[3] + t * d[5];
    return [x1, y1, x2, y2];

}

function ref3LineEDiff(t, d) {
    //
    //  t -->  [dx/dt , dy/dt]
    //
    var k1, k2, k3;
    k1 = 2 * t - 2;
    k2 = 2 - 4 * t;
    k3 = 2 * t;

    return [k1 * d[0] + k2 * d[2] + k3 * d[4],
    k1 * d[1] + k2 * d[3] + k3 * d[5]];
}
function solevforTangent(d, tan) {
    //
    //  tangent --> t  
    //
    //  Find t for the given tangent slope
    //
    t = Number.NaN;
    var a = 2 * d[0] - 4 * d[2] + 2 * d[4];
    var b = -2 * d[0] + 2 * d[2];
    var c = 2 * d[1] - 4 * d[3] + 2 * d[5];
    var dp = -2 * d[1] + 2 * d[3];
    if (c != a * tan) {
        tp = (b * tanp - dp) / (c - a * tanp);
        if (tp >= 0 && tp <= 1) {
            t = tp;
        }
    }
    return t;
}
function solveforT(d, point) {
    //
    //  point --> t
    //
    //  finds t corresponding to given point
    //  if point is not on the curve, returns NaN
    //
    var t, p, q, r, t1, t2;
    var pointOnCurve = false;
    var pointInRange1 = false;
    var pointInRange2 = false;
    p = d[0] - 2 * d[2] + d[4];
    q = -2 * d[0] + 2 * d[2];
    r = d[0] - point[0];
    if (p == 0) {
        if (q != 0) {
            t1 = r / q;
            t2 = r / q;
            if (t1 >= 0 && t1 <= 1) {
                pointInRange1 = true;
            }
        }
    }
    else {
        delta = q * q - 4 * p * r;
        if (delta >= 0) {
            t1 = (-q - Math.sqrt(delta)) / p / 2.0;
            t2 = (-q + Math.sqrt(delta)) / p / 2.0;
            if (t1 >= 0 && t1 <= 1) {
                pointInRange1 = true;
            }
            if (t2 >= 0 && t2 <= 1) {
                pointInRange2 = true;
            }
        }
    }
    if (pointInRange1) {
        p1 = ref3LineE(t1, d);
        if (Math.abs(p1[1] - point[1]) < 0.001) {
            pointOnCurve = true;
            t = t1;
        }

    }
    if (pointInRange2) {
        p1 = ref3LineE(t2, d);
        if (Math.abs(p1[1] - point[1]) < 0.001) {
            pointOnCurve = true;
            t = t2;
        }

    }
    if (pointOnCurve) {
        return t;
    }
    else {
        return Number.NaN;
    }
}
function solveforDistanceFrom(d, t0, distance) {
    //
    //  t0, distance --> t
    //
    //  find the parameter t , for the given distance from t0
    //
    if (distance == 0) {
        return t0;
    }
    var dist0 = getLength_high(d, 0, t0);
    return solveForLength(d, dist0 + distance);
}
function solveForLength(d, length) {
    //
    //  distance --> t
    //
    //  finds t for the given length
    //
    var total = getLength_high(d, 0, 1);
    if (length < 0 || length > total)
        return Number.NaN;
    var t1 = 0, t2 = 1.0, tm = 0, i = 0;

    for (i = 0; i < 20; i++) {
        tm = (t1 + t2) / 2.0;
        if (getLength_medium(d, 0, tm) > length) {
            t2 = tm;
        }
        else {
            t1 = tm;
        }
    }
    return (t1 + t2) / 2.0;
}
function tFromDist(dist, it) {
    var i,
        t1 = 0, t2 = 1, tm = 0;
    if (!it) { it = 20; }

    for (i = 0; i < it; i++) {
        tm = (t1 + t2) / 2;
        if (getLength_high(0, tm) > dist) { t2 = tm; }
        else { t1 = tm; }
    }
    return (t1 + t2) / 2;
}

function getLength_low(d, t1, t2) {
    var ts = [-0.1488743389816312,
        0.1488743389816312,
    -0.4333953941292472,
        0.4333953941292472,
    -0.6794095682990244,
        0.6794095682990244,
    -0.8650633666889845,
        0.8650633666889845,
    -0.9739065285171717,
        0.9739065285171717];
    var w = [0.2955242247147529,
        0.2955242247147529,
        0.2692667193099963,
        0.2692667193099963,
        0.2190863625159820,
        0.2190863625159820,
        0.1494513491505806,
        0.1494513491505806,
        0.0666713443086881,
        0.0666713443086881];
    var t0 = (t1 + t2) / 2.0;
    var r = (t2 - t1) / 2.0;
    var sum = 0;
    for (i = 0; i < ts.length; i++) {
        t = r * ts[i] + t0;
        p = ref3LineEDiff(t, d);
        dsdt = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        sum += w[i] * dsdt;
    }
    return (sum * r);
}
function getLength_medium(d, t1, t2) {
    var ts = [-0.0950125098376374,
        0.0950125098376374,
    -0.2816035507792589,
        0.2816035507792589,
    -0.4580167776572274,
        0.4580167776572274,
    -0.6178762444026438,
        0.6178762444026438,
    -0.7554044083550030,
        0.7554044083550030,
    -0.8656312023878318,
        0.8656312023878318,
    -0.9445750230732326,
        0.9445750230732326,
    -0.9894009349916499,
        0.9894009349916499];
    var w = [0.1894506104550685,
        0.1894506104550685,
        0.1826034150449236,
        0.1826034150449236,
        0.1691565193950025,
        0.1691565193950025,
        0.1495959888165767,
        0.1495959888165767,
        0.1246289712555339,
        0.1246289712555339,
        0.0951585116824928,
        0.0951585116824928,
        0.0622535239386479,
        0.0622535239386479,
        0.0271524594117541,
        0.0271524594117541];
    var t0 = (t1 + t2) / 2.0;
    var r = (t2 - t1) / 2.0;
    var sum = 0;
    for (i = 0; i < ts.length; i++) {
        t = r * ts[i] + t0;
        p = ref3LineEDiff(t, d);
        dsdt = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        sum += w[i] * dsdt;
    }
    return (sum * r);
}
function getLength_high(d, t1, t2) {
    var ts = [-0.0640568928626056,
        0.0640568928626056,
    -0.1911188674736163,
        0.1911188674736163,
    -0.3150426796961634,
        0.3150426796961634,
    -0.4337935076260451,
        0.4337935076260451,
    -0.5454214713888396,
        0.5454214713888396,
    -0.6480936519369755,
        0.6480936519369755,
    -0.7401241915785544,
        0.7401241915785544,
    -0.8200019859739029,
        0.8200019859739029,
    -0.8864155270044011,
        0.8864155270044011,
    -0.9382745520027328,
        0.9382745520027328,
    -0.9747285559713095,
        0.9747285559713095,
    -0.9951872199970213,
        0.9951872199970213];
    var w = [0.1279381953467522,
        0.1279381953467522,
        0.1258374563468283,
        0.1258374563468283,
        0.1216704729278034,
        0.1216704729278034,
        0.1155056680537256,
        0.1155056680537256,
        0.1074442701159656,
        0.1074442701159656,
        0.0976186521041139,
        0.0976186521041139,
        0.0861901615319533,
        0.0861901615319533,
        0.0733464814110803,
        0.0733464814110803,
        0.0592985849154368,
        0.0592985849154368,
        0.0442774388174198,
        0.0442774388174198,
        0.0285313886289337,
        0.0285313886289337,
        0.0123412297999872,
        0.0123412297999872];
    var t0 = (t1 + t2) / 2.0;
    var r = (t2 - t1) / 2.0;
    var sum = 0;
    for (i = 0; i < ts.length; i++) {
        t = r * ts[i] + t0;
        p = ref3LineEDiff(t, d);
        dsdt = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        sum += w[i] * dsdt;
    }
    return (sum * r);
}
function getLength(d, t1, t2, level) {
    switch (level) {
        case 1:
            return getLength_low(d, t1, t2);
        case 2:
            return getLength_medium(d, t1, t2);
        case 3:
            return getLength_high(d, t1, t2);
    }
}
//-------------------------------------------------------------------------
function restart() {
    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
    startDoc();
}
