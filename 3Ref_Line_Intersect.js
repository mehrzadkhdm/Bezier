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
    line;

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 6; i++) {
        d[i] = Math.floor(Math.random() * 400);
    }
    rot = (rotD * Math.PI) / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContent.setAttribute("class", "svgCont");
        document.getElementById("content").appendChild(svgContent);
    }
    makePath();
    

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
        console.log('t = ', pointsInt[1]);
        console.log('intersection points = ', pointsInt[0]);
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
function solveForLineIntersection(line) {
    //
    //  line --> [points,t]
    //
    //  finds t corresponding to the intersection of a line and the curve
    //  if there is no intersection, returns NaN
    //
    var eps = 1e-8;
    var px = line[0], py = line[1],
        qx = line[2], qy = line[3],
        dx = qx - px, dy = qy - py;
    var p = (d[1] - 2 * d[3] + d[5]) * dx
        - (d[0] - 2 * d[2] + d[4]) * dy;
    var q = (-2 * d[1] + 2 * d[3]) * dx
        - (-2 * d[0] + 2 * d[2]) * dy;
    var r = d[1] * dx - d[0] * dy + line[0] * dy - line[1] * dx;
    var t, t1, t2, xy;
    var pointInRange1 = false;
    var pointInRange2 = false;

    var result = [], t = [];
    if (Math.abs(p) < eps) {
        if (Math.abs(q) > eps) {
            t1 = r / q;
            t2 = r / q;
            if (t1 >= 0 && t1 <= 1) {
                xy = ref3LineE(t1);
                if ((xy[0] - line[0]) * (xy[0] - line[2]) <= 0
                    && (xy[1] - line[1] * (xy[1] - line[3])) <= 0) {
                    pointInRange1 = true;
                    t = [t1];
                    result = xy;
                }
            }
        }
    }
    else {
        delta = q * q - 4 * p * r;
        if (delta >= 0) {
            t1 = (-q - Math.sqrt(delta)) / p / 2.0;
            t2 = (-q + Math.sqrt(delta)) / p / 2.0;
            if (t1 >= 0 && t1 <= 1) {
                xy = ref3LineE(t1);

                if ((xy[0] - line[0]) * (xy[0] - line[2]) <= 0
                    && (xy[1] - line[1]) * (xy[1] - line[3]) <= 0) {
                    pointInRange1 = true;
                    t = [t1];
                    result = xy;
                }
            }
            if (t2 >= 0 && t2 <= 1) {
                xy = ref3LineE(t2);

                if ((xy[0] - line[0]) * (xy[0] - line[2]) <= 0
                    && (xy[1] - line[1]) * (xy[1] - line[3]) <= 0) {
                    pointInRange2 = true;
                    if (pointInRange1) {
                        result = [result[0], result[1], xy[0], xy[1]];
                        t = [t1, t2];
                    }
                    else {
                        result = xy;
                        t = [t2];
                    }
                }

            }
        }
    }

    return [result,t];
}
//-------------------------------------------------------------------------


function ref3LineE(t) {
    var k1, k2, k3;
    k1 = (1 - t) * (1 - t);
    k2 = 2 * t * (1 - t);
    k3 = t * t;

    return [k1 * d[0] + k2 * d[2] + k3 * d[4],
    k1 * d[1] + k2 * d[3] + k3 * d[5]];
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