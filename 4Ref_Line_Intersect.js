var i,
    svgContent,
    elm,
    rot,
    GL,
    ps,
    deg,
    d = [],
    point1 = [],
    point2 = [],
    points3 = [],
    rotD = 0,
    line,
    cx = 520, cy = 600, rx = 450, ry = 100;;

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 8; i++) {
        d[i] = Math.floor(Math.random() * 400);
    }
    d = [400, 700, 500, 100, 900, 900, 1200, 300];
    rot = (rotD * Math.PI) / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContent.setAttribute("class", "svgCont");
        document.getElementById("content").appendChild(svgContent);
    }
    makePath();
    //makeEllipse([cx, cy], rx, ry);


    btn = document.createElement("input");
    btn.type = "button";
    btn.value = "restart";
    btn.className = "btn";
    btn.addEventListener("click", restart);
    svgContent.parentNode.appendChild(btn);
    svgContent.addEventListener('mousedown', onMouseDown);



    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    svgContent.addEventListener('mousedown', onMouseDown);
}

//---------------------------------
function makePath(color) {
    if (!color) {
        color = "black";
    }
    elm = document.createElementNS("http://www.w3.org/2000/svg", "path");
    if (d.length == 8)
        elm.setAttribute('d', "M" + d[0] + "," + d[1] + " C" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5] + " " + d[6] + "," + d[7]);
    else if (d.length == 6)
        elm.setAttribute('d', "M" + + d[0] + "," + d[1] + " Q" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5]);
    else
        return;

    elm.setAttribute("stroke", "black");
    elm.setAttribute("stroke-width", "1");
    elm.setAttribute("fill", "none");
    svgContent.appendChild(elm);
    GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgContent.appendChild(GL);
}
function makeLine(line, color) {

    if (!color) {
        color = "red";
    }
    var l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", line[0]);
    l.setAttribute("y1", line[1]);
    l.setAttribute("x2", line[2]);
    l.setAttribute("y2", line[3]);
    l.setAttribute("stroke", color);
    l.setAttribute("stroke-width", 1);
    GL.appendChild(l);

}
function makeEllipse(c, rxp, ryp) {
    if (!rxp)
        rxp = rx;
    if (!ryp)
        ryp = ry;
    console.log("center: ", c);
    elm = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
    elm.setAttribute('cx', c[0]);
    elm.setAttribute('cy', c[1]);
    elm.setAttribute('rx', rxp);
    elm.setAttribute('ry', ryp);
    elm.setAttribute("transform", "rotate(" + rotD + " " + c[0] + " " + c[1] + ")");
    elm.setAttribute('stroke', 'black');
    elm.setAttribute('fill', "none");
    svgContent.appendChild(elm);
}
function makePs(ps, color, r) {
    var i, p;
    if (!color) {
        color = "red";
    }
    if (!r) {
        r = 3;
    }
    if (ps.length < 2) {
        return false;
    } else {
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
function onMouseDown(event) {
    var points, i, cir, btn;
    if (!line) { //start drawing the line
        points = [event.clientX, event.clientY];
        line = document.createElementNS("http://www.w3.org/2000/svg", 'polyline');
        line.setAttribute('points', points);
        line.setAttribute('stroke', 'black');
        svgContent.appendChild(line);
        svgContent.addEventListener('mousemove', onMouseMove);
        svgContent.addEventListener('mouseup', onMouseDown);
    }
    else { //finish drawing the line
        points = line.getAttribute("points").split(",").map(x => parseFloat(x));
        
        //while(svgContent.firstChild){svgContent.firstChild.remove();}
        line = null;
        
        svgContent.removeEventListener('mousemove', onMouseMove);
        svgContent.removeEventListener('mousedown', onMouseDown);
        svgContent.removeEventListener('mouseup', onMouseDown);
        
        

        pointsInt = solveForLineIntersection(points);
        // console.log('t = ', pointsInt[1]);
        // console.log('intersection points = ', pointsInt[0]);
        makePs(pointsInt[0], "blue", 3);


        //ref4List();
        //ref4List2();

        btn = document.createElement('input');
        btn.type = "button";
        btn.value = "restart";
        btn.className = "btn";
        btn.addEventListener('click', restart);
        svgContent.parentNode.appendChild(btn);

    }
}

function onMouseMove(event) {
    var points = line.getAttribute("points").split(",");
    points[2] = event.clientX;
    points[3] = event.clientY;
    line.setAttribute('points', points);

}

///TEST
//---------------------------
function solveForLineIntersection(line) {
    //
    //  line --> [points, t]
    //
    //  finds t corresponding to the intersection of a line and the curve
    //  if there is no intersection, returns NaN
    //
    var eps = 1e-8;
    var px = line[0], py = line[1],
        qx = line[2], qy = line[3],
        dx = qx - px, dy = qy - py;


    var p = (-d[1] + 3 * d[3] - 3 * d[5] + d[7]) * dx
        - (-d[0] + 3 * d[2] - 3 * d[4] + d[6]) * dy;
    var q = (3 * d[1] - 6 * d[3] + 3 * d[5]) * dx
        - (3 * d[0] - 6 * d[2] + 3 * d[4]) * dy;
    var r = (-3 * d[1] + 3 * d[3]) * dx
        - (-3 * d[0] + 3 * d[2]) * dy;
    var s = d[1] * dx - d[0] * dy + line[0] * dy - line[1] * dx;

    var t1, t2, t3, xy;

    var result = [], t = [];
    var pointInRange1 = false;
    var pointInRange2 = false;
    var pointInRange3 = false;



    var e = (r - q * q / p / 3) / p,
        f = (s + 2 * q * q * q / p / p / 27 - q * r / p / 3) / p,
        e3 = e * e * e,
        delta = f * f + 4 * e3 / 27;

    if (delta >= 0) {
        w = [(-f + Math.sqrt(delta)) / 2.0, 0.0]
    }
    else {
        w = [-f / 2.0, Math.sqrt(-delta) / 2.0];
    }
    theta = complexAngle(w) / 3.0;
    r = Math.pow(complexAbs(w), 1.0 / 3.0);
    z1 = complexToCart(r, theta);
    z2 = complexToCart(r, theta + 2.0 * Math.PI / 3.0);
    z3 = complexToCart(r, theta + 4.0 * Math.PI / 3.0);
    y1 = complexSub(z1, complexDiv([e / 3.0, 0], z1));
    y2 = complexSub(z2, complexDiv([e / 3, 0], z2));
    y3 = complexSub(z3, complexDiv([e / 3, 0], z3));
    dy = [q / p / 3.0, 0];
    t1 = complexSub(y1, dy);
    if (Math.abs(t1[1]) < 0.000000001) {
        if (t1[0] >= 0 && t1[0] < 1.000000001) {
            xy = ref4LineE(t1[0]);
            console.log('t1', (xy[0] - line[0]) * (xy[0] - line[2]), (xy[1] - line[1]) * (xy[1] - line[3]));
            if ((xy[0] - line[0]) * (xy[0] - line[2]) <= eps
                && (xy[1] - line[1]) * (xy[1] - line[3]) <= eps) {
                pointInRange1 = true;
                result = xy;
                t = [t1[0]];
            }
        }
    }
    t2 = complexSub(y2, dy);
    if (Math.abs(t2[1]) < 0.000000001) {
        if (t2[0] >= 0 && t2[0] < 1.000000001) {
            xy = ref4LineE(t2[0]);
            console.log('t2', (xy[0] - line[0]) * (xy[0] - line[2]), (xy[1] - line[1]) * (xy[1] - line[3]));
            if ((xy[0] - line[0]) * (xy[0] - line[2]) <= eps
                && (xy[1] - line[1]) * (xy[1] - line[3]) <= eps) {
                pointInRange2 = true;
                if (pointInRange1) {
                    result = [result[0], result[1], xy[0], xy[1]];
                    t = [t1[0], t2[0]];
                }
                else {
                    result = xy;
                    t = [t2[0]];
                }
            }

        }
    }
    t3 = complexSub(y3, dy);
    if (Math.abs(t3[1]) < 0.000000001) {
        if (t3[0] >= 0 && t3[0] < 1.000000001) {
            xy = ref4LineE(t3[0]);
            console.log('t3', (xy[0] - line[0]) * (xy[0] - line[2]), (xy[1] - line[1]) * (xy[1] - line[3]));
            if ((xy[0] - line[0]) * (xy[0] - line[2]) <= eps
                && (xy[1] - line[1]) * (xy[1] - line[3]) <= eps) {
                pointInRange3 = true;
                if (pointInRange1)
                    if (pointInRange2) {
                        result = [result[0], result[1], result[2], result[3], xy[0], xy[1]];
                        t = [t1[0], t2[0], t3[0]];
                    }
                    else {
                        result = [result[0], result[1], xy[0], xy[1]];
                        t = [t1[0], t3[0]];
                    }
                else
                    if (pointInRange2) {
                        result = [result[0], result[1], xy[0], xy[1]];
                        t = [t2[0], t3[0]];
                    }
                    else {
                        result = xy;
                        t = [t3[0]];
                    }
            }
        }
    }
    return [result, t];
}
//-------------------------------------------------------------------------

//-------------------------------------------------------------------------
function ref4LineE(t) {
    k1 = Math.pow(1 - t, 3);
    k2 = 3 * Math.pow(1 - t, 2) * t;
    k3 = 3 * (1 - t) * t * t;
    k4 = Math.pow(t, 3);
    return [k1 * d[0] + k2 * d[2] + k3 * d[4] + k4 * d[6],
    k1 * d[1] + k2 * d[3] + k3 * d[5] + k4 * d[7]];
}
function ref4List() {
    var t0 = performance.now();
    var y = new Array(101),
        y1 = new Array(100),
        y2 = new Array(99),
        y3 = new Array(98),
        dx, dy,
        xy = new Array(101);
    var i, j;
    //xy[0] = [;
    //console.log(ref4LineE[0.01 * 1)
    for (i = 0; i < 5; i++) {
        xy[i] = ref4LineE(0.01 * i);
        y[i] = xy[i][1];
    }
    for (i = 0; i < 4; i++)
        y1[i] = xy[i + 1][1] - xy[i][1];
    for (i = 0; i < 3; i++)
        y2[i] = y1[i + 1] - y1[i];
    for (i = 0; i < 2; i++)
        y3[i] = y2[i + 1] - y2[i];
    dy = y3[1] - y3[0];

    for (i = 1; i < 98; i++)
        y3[i] = y3[i - 1] + dy;
    for (i = 1; i < 99; i++)
        y2[i] = y2[i - 1] + y3[i - 1];
    for (i = 1; i < 100; i++)
        y1[i] = y1[i - 1] + y2[i - 1];
    for (i = 1; i < 101; i++)
        y[i] = y[i - 1] + y1[i - 1];
    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    console.log('y = ', y[100]);
}
function ref4List2() {
    var t0 = performance.now();
    //var y = new Array(101);

    var i, j, f1, f2, xy;
    //xy[0] = [;
    //console.log(ref4LineE[0.01 * 1)
    f1 = Math.pow((d[0] - cx) / rx, 2) + Math.pow((d[1] - cy) / ry, 2) - 1.0;
    for (i = 0; i < 1001; i++) {
        xy = ref4LineE(0.001 * i);
        f2 = Math.pow((xy[0] - cx) / rx, 2) + Math.pow((xy[1] - cy) / ry, 2) - 1.0;
        if (f1 * f2 <= 0) {
            console.log('root near t= ', 0.001 * i, f1, f2);
        }
        f1 = f2;
        //y[i] = xy[1]
    }

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    //console.log('y = ', xy);
}


function complexAdd(a, b) {
    return [a[0] + b[0], a[1] + b[1]];
}
function complexSub(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
}
function complexMult(a, b) {
    return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function complexDiv(a, b) {
    dv = b[0] * b[0] + b[1] * b[1];
    mt = complexMult(a, complexConj(b));
    return [mt[0] / dv, mt[1] / dv];
}
function complexConj(a) {
    return [a[0], -a[1]];
}
function complexAbs(a) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1]);
}
function complexAngle(a) {
    return Math.atan2(a[1], a[0]);
}
function complexToCart(r, th) {
    return [r * Math.cos(th), r * Math.sin(th)];
}
function dot(p) {

}
//-------------------------------------------------------------------------
function restart() {
    while (svgContent.firstChild) {
        svgContent.firstChild.remove();
    }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
    startDoc();
    console.clear();
}