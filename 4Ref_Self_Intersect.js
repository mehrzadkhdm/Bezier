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
    rotD = 30,
    line,
    cx = 520, cy = 600, rx = 450, ry = 100;;

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 8; i++) {
        d[i] = Math.floor(Math.random() * 400);
    }
    d = [400, 700, 500, 100, 900, 900, 200, 300];
    rotD = Math.floor(Math.random() * 360);
    rx = Math.floor(Math.random() * 400);
    ry = Math.floor(Math.random() * 300)
    rot = (rotD * Math.PI) / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContent.setAttribute("class", "svgCont");
        document.getElementById("content").appendChild(svgContent);
    }
    makePath();
    makeEllipse([cx, cy], rx, ry);

    pointsInt = solveForCurveIntersection();

    makePs(pointsInt[0], "blue", 3);


    btn = document.createElement("input");
    btn.type = "button";
    btn.value = "restart";
    btn.className = "btn";
    btn.addEventListener("click", restart);
    svgContent.parentNode.appendChild(btn);
    //svgContent.addEventListener('mousedown', onMouseDown);



    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    //svgContent.addEventListener('mousedown', onMouseDown);
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


        pointsInt = solveForCurveIntersection();
        // console.log('t = ', pointsInt[1]);
        // console.log('intersection points = ', pointsInt[0]);
        makePs(pointsInt[0], "blue", 3);


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
function solveForCurveIntersection() {
    //
    //  curve --> [points, t]
    //
    //  finds t corresponding to the intersection of a line and the curve
    //  if there is no intersection, returns NaN
    //
    var eps = 1e-8;
    var t0 = performance.now();
    //var y = new Array(101);
    var result = [], t = [];
    var xArr = new Array(51);
    var yArr = new Array(51);
    var i, j, f1, f2, xy, a, b, fa, fb, m, fm;
    var ct = Math.cos(rot), st = Math.sin(rot), xp, xp;
    //xy[0] = [;
    //console.log(ref4LineE[0.01 * 1)
    var sortXY = a => [...a.keys()].sort((b, c) => a[b] - a[c]);
    for (i = 0; i < 51; i++) {
        xy = ref4LineE(i / 50);
        xArr[i] = xy[0];
        yArr[i] = xy[1];
    }
    console.log('x indices = ', sortXY(xArr));
    console.log('y indices  ', sortXY(yArr));

    xp = (d[0] - cx) * ct + (d[1] - cy) * st;
    yp = -(d[0] - cx) * st + (d[1] - cy) * ct;
    var divisions = 1000;
    f1 = Math.pow(xp / rx, 2) + Math.pow(yp / ry, 2) - 1.0;
    for (i = 0; i < divisions + 1; i++) {
        xy = ref4LineE(i / divisions);
        xp = (xy[0] - cx) * ct + (xy[1] - cy) * st;
        yp = -(xy[0] - cx) * st + (xy[1] - cy) * ct;
        f2 = Math.pow(xp / rx, 2) + Math.pow(yp / ry, 2) - 1.0;
        if (f1 * f2 <= 0) {
            fa = f1;
            fb = f2;
            a = (i - 1) / divisions;
            b = i / divisions;
            for (j = 0; j < 50; j++) {
                m = (a + b) / 2;
                xy = ref4LineE(m);
                xp = (xy[0] - cx) * ct + (xy[1] - cy) * st;
                yp = -(xy[0] - cx) * st + (xy[1] - cy) * ct;
                fm = Math.pow(xp / rx, 2) + Math.pow(yp / ry, 2) - 1.0;
                if (f1 * fm <= 0)
                    b = m;
                else
                    a = m;
            }
            t.push(i / divisions);
            result.push(xy[0]);
            result.push(xy[1]);
            console.log('root near t= ', i / divisions);
            console.log('root t= ', m);
        }
        f1 = f2;
        //y[i] = xy[1]
    }

    var t1 = performance.now();
    console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    //console.log('y = ', xy);
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

function ref4List2() {

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
    console.clear();
    startDoc();

}