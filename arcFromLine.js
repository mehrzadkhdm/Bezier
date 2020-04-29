var svgContent, line, elm, ps, rot, GL, cx, cy,
    rx = 100, ry = 80, rotD = 45;
rot = rotD * Math.PI / 180;

window.onload = () => startDoc();

function startDoc() {
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    svgContent.addEventListener('mousedown', onMouseDown);
}

//---------------------------------
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

function makePs(ps, temp) {
    console.log(ps);
    var i, p;
    if (GL) {
        svgContent.removeChild(GL);
        GL = null;
    }
    if (temp) {
        GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
        svgContent.appendChild(GL);
    }
    if (ps.length < 2) { return false; }
    else {
        for (i = 1; i < ps.length; i += 2) {
            p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            p.setAttribute("cx", ps[i]);
            p.setAttribute("cy", ps[i + 1]);
            p.setAttribute("r", 3);
            p.setAttribute("fill", "red");
            if (temp) { GL.appendChild(p); }
            else { svgContent.appendChild(p); }
        }
    }
}

//---------------------------
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

        pointsInt = findEllipseCenter(points);
        //makePs(pointsInt);

        btn = document.createElement('input');
        btn.type = "button";
        btn.value = "restart";
        btn.className = "btn";
        btn.addEventListener('click', restart);
        svgContent.parentNode.appendChild(btn);
        //console.log("line cords: " + points);
    }
}

function onMouseMove(event) {
    var points = line.getAttribute("points").split(",");
    points[2] = event.clientX;
    points[3] = event.clientY;
    line.setAttribute('points', points);

    //pointsInt = cutEllipse(points);
    //makePs(pointsInt, 1);
}

//-------------------------------

function findEllipseCenter(linePs) {
    var eps = 1e-8;
    var cx, cy;
    var length, i, a, b, c, x, fx, jx,
        x1 = linePs[0], y1 = linePs[1], x2 = linePs[2], y2 = linePs[3];
    var L = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var phi = Math.atan2(y2 - y1, x2 - x1);
    var dx = L * Math.cos(phi - rot);
    var dy = L * Math.sin(phi - rot);
    //console.log("dx, dy = ", dx, dy)
    var t2pt1 = Math.atan2(-dx / rx, dy / ry);
    var sint2mt1 = 0.5 * Math.sqrt(dx * dx / rx / rx + dy * dy / ry / ry)
    var z = 1.0;

    if (Math.abs(sint2mt1) <= 1 + eps) {
        if (Math.abs(sint2mt1) > 1)
            sint2mt1 = 1.0;
    }
    else {
        z = sint2mt1;
        sint2mt1 = 1.0;
        //console.log('z= ', z)
    }

    var t2mt1 = Math.asin(sint2mt1);
    var t1 = t2pt1 - t2mt1;
    var t2 = t2pt1 + t2mt1;
    //console.log("t1, t2 = ", t1, t2)
    var x1p = z * (rx * Math.cos(t1) * Math.cos(rot) - ry * Math.sin(t1) * Math.sin(rot));
    var y1p = z * (rx * Math.cos(t1) * Math.sin(rot) + ry * Math.sin(t1) * Math.cos(rot));
    var x2p = z * (rx * Math.cos(t2) * Math.cos(rot) - ry * Math.sin(t2) * Math.sin(rot));
    var y2p = z * (rx * Math.cos(t2) * Math.sin(rot) + ry * Math.sin(t2) * Math.cos(rot));
    //console.log('[P1 , p2]= ', [x1p, y1p], [x2p, y2p]);
    // if (Math.abs(x2p - x1p - dx) < eps)
    //     cx = x1 - x1p;
    // else
    //     cx = x1 - x2p;

    // if (Math.abs(y2p - y1p - dy) < eps)
    //     cy = y1 - y1p;
    // else
    //     cy = y1 - y2p;
    cx = x1 - x1p;
    cy = y1 - y1p;
    //console.log("x1p: ", x1p, "x2p:", x2p, 'cx = ', cx);
    //console.log("y1p: ", y1p, "y2p:", y2p, 'cy = ', cy);
    // first ellipse
    makeEllipse([cx, cy], rx * z, ry * z);
    t1 = t2pt1 + t2mt1 - Math.PI;
    t2 = t2pt1 - t2mt1 + Math.PI;
    //console.log("==== t1, t2 = ", t2pt1, t2mt1, t1, t2)
    x1p = z * (rx * Math.cos(t1) * Math.cos(rot) - ry * Math.sin(t1) * Math.sin(rot));
    y1p = z * (rx * Math.cos(t1) * Math.sin(rot) + ry * Math.sin(t1) * Math.cos(rot));
    x2p = z * (rx * Math.cos(t2) * Math.cos(rot) - ry * Math.sin(t2) * Math.sin(rot));
    y2p = z * (rx * Math.cos(t2) * Math.sin(rot) + ry * Math.sin(t2) * Math.cos(rot));
    //console.log('[P1 , p2]= ', [x1p, y1p], [x2p, y2p]);
    // if (Math.abs(x2p - x1p - dx) < eps)
    //     cx = x1 - x1p;
    // else
    //     cx = x1 - x2p;

    // if (Math.abs(y2p - y1p - dy) < eps)
    //     cy = y1 - y1p;
    // else
    //     cy = y1 - y2p;
    cx = x1 - x1p;
    cy = y1 - y1p;
    //console.log("x1p: ", x1p, "x2p:", x2p, 'cx = ', cx);
    //console.log("y1p: ", y1p, "y2p:", y2p, 'cy = ', cy);
    // second ellipse
    makeEllipse([cx, cy], rx * z, ry * z);


    //  if x1 = x2  or y1 = y2 we will have 0 in denominator 
    //  so we just change to make x2-x1=1 or y2-y1=1 in this case
    console.log("x1: ", x1, "x2:", x2);
    console.log("y1: ", y1, "y2:", y2);
}



function pInLine(intPs, linePs) {
    var maxX = Math.max(linePs[0], linePs[2]),
        minX = Math.min(linePs[0], linePs[2]),
        maxY = Math.max(linePs[1], linePs[3]),
        minY = Math.min(linePs[1], linePs[3]);

    for (i = 1; i < intPs.length; i += 2) {
        if (!(intPs[i] >= minX && intPs[i] <= maxX && intPs[i + 1] >= minY && intPs[i + 1] <= maxY)) {
            intPs.splice(i, 2);
            i -= 2;
        }
    }
    return intPs;
}

//-------------------------------------------------------------------------
function restart() {
    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
    startDoc();
    console.clear();
}











