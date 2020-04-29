var svgContent, elm, rot, GL,
    point1 = [], point2 = [],
    angGap = 30, angle1
cx = 200, cy = 300, rx = 120, ry = 40, rotD = 30;

rot = rotD * Math.PI / 180;

window.onload = () => startDoc();

function startDoc() {
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    //svgContent.addEventListener('mousedown', onMouseDown);
    makeEllipse();
    selectPointOnEllipse()
    testTan();
    makeBtn();
}

//---------------------------------
function makeEllipse(color) {
    if (!color) { color = "lightgreen"; }
    elm = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse');
    elm.setAttribute('cx', cx);
    elm.setAttribute('cy', cy);
    elm.setAttribute('rx', rx);
    elm.setAttribute('ry', ry);
    elm.setAttribute("transform", "rotate(" + rotD + " " + cx + " " + cy + ")");
    elm.setAttribute('stroke', 'black');
    elm.setAttribute('fill', "none");
    svgContent.appendChild(elm);

    GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgContent.appendChild(GL);
}

function makePs(ps, color) {
    var i, p;
    if (ps.length < 2) { return false; }
    else {
        for (i = 0; i < ps.length; i += 2) {
            p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            p.setAttribute("cx", ps[i]);
            p.setAttribute("cy", ps[i + 1]);
            p.setAttribute("r", 3);
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
function selectPointOnEllipse() {
    var i, r, newAng,
        ang = [], points = [];

    for (i = 0; i < 360; i += angGap) {
        newAng = i * Math.PI / 180;
        ang.push(newAng);
        r = rx * ry / Math.sqrt((ry * ry * Math.cos(newAng) * Math.cos(newAng)) + (rx * rx * Math.sin(newAng) * Math.sin(newAng)));
        //newAng += rot;
        // get x, y from angle - ignoring ellipse rotation
        points.push(cx + (r * Math.cos(newAng + rot)));
        points.push(cy + (r * Math.sin(newAng + rot)));
    }


    // if ellipse is rotated - find new x, y
    // if (rotD != 0) {
    //     for (i = 0; i < points.length; i += 2) {
    //         r = Math.sqrt(Math.pow(points[i] - cx, 2) + Math.pow(points[i + 1] - cy, 2));
    //         newAng = Math.atan2(points[i + 1] - cy, cx - points[i]);
    //         points[i] = cx + Math.cos(newAng + rot) * r;
    //         points[i + 1] = cy + Math.sin(newAng + rot) * r;
    //     }
    // }
    // random choose a point on ellipse
    i = Math.floor(Math.random() * ang.length);
    ang = ang[i];
    console.log("Angle (rad): ", ang);
    console.log("Angle (deg): ", ang * 180 / Math.PI);
    point1 = [points[i * 2], points[i * 2 + 1]];
    angle1 = ang;
    console.log("Point: [x, y]: ", point1);
    //makePs(points, "red");
    makePs(point1, "blue");
}

function makeBtn() {
    btn = document.createElement('input');
    btn.type = "button";
    btn.value = "restart";
    btn.className = "btn";
    btn.addEventListener('click', restart);
    svgContent.parentNode.appendChild(btn);
}

//-------------------------------------------------------------------------
function restart() {

    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
    startDoc();
}
// function pointToTan(point) {
//     //var r = Math.sqrt((ry * ry * Math.cos(newAng) * Math.cos(newAng)) + (rx * rx * Math.sin(newAng) * Math.sin(newAng)));
//     theta = Math.atan2(point[1] - cy, point[0] - cx);
//     t = Math.atan2((point[1] - cy) / ry, (point[0] - cx) / rx);

//     tan = Math.atan2(ry * Math.cos(t), -rx * Math.sin(t));
//     console.log('theta, t, tan= ', theta * 180 / Math.PI, t * 180 / Math.PI, tan * 180 / Math.PI)
//     return tan;
// }
function AngleToTan(angle) {
    var r = rx * ry / Math.sqrt((ry * ry * Math.cos(angle) * Math.cos(angle)) + (rx * rx * Math.sin(angle) * Math.sin(angle))),
        xp = r * Math.cos(angle),
        yp = r * Math.sin(angle)


    t = Math.atan2(yp / ry, xp / rx);
    if (t < 0)
        t += 2.0 * Math.PI;

    tan = Math.atan2(ry * Math.cos(t), -rx * Math.sin(t)) + rot;
    if (tan < 0)
        tan += 2.0 * Math.PI;
    var rm = (rx + ry) / 2;
    xp = r * Math.cos(angle + rot);
    yp = r * Math.sin(angle + rot)
    TanLine = [cx + xp + rm * Math.cos(tan), cy + yp + rm * Math.sin(tan),
    cx + xp - rm * Math.cos(tan), cy + yp - rm * Math.sin(tan)];
    makeLine(TanLine);
    pr = distancefromAngle(angle);
    console.log('angle, t, length =', angle * 180 / Math.PI, t * 180 / Math.PI, pr)
    return Math.tan(tan);
}

function TanToAngle(tan) {
    var eps = 1e-8,
        t = Math.atan(-ry / rx / Math.tan(Math.atan(tan) - rot)),
        theta = Math.atan2(ry * Math.sin(t), rx * Math.cos(t));
    if (theta < 0)
        theta += 2.0 * Math.PI;
    if (Math.abs(theta - 2.0 * Math.PI) < eps)
        theta = 0;
    var thetap = theta - Math.PI;
    if (thetap < 0)
        thetap += 2.0 * Math.PI;
    if (Math.abs(thetap - 2.0 * Math.PI) < eps)
        thetap = 0;
    return [theta, thetap];

}
function distancefromAngle(angle) {
    var eps = 1e-8;
    if (Math.abs(angle) < eps) return 0;
    if (Math.abs(angle - Math.PI / 2) < eps) return getLength(Math.PI / 2.0);
    if (Math.abs(angle - Math.PI) < eps) return 2.0 * getLength(Math.PI / 2.0);
    if (Math.abs(angle - 3.0 * Math.PI / 2) < eps) return 3.0 * getLength(Math.PI / 2.0);
    if (Math.abs(angle - 2 * Math.PI) < eps) return 4.0 * getLength(Math.PI / 2.0);

    var q = 0;
    while (angle > Math.PI / 2.0 + eps) {
        q += 1;
        angle -= Math.PI / 2.0;
    }

    angle = Math.atan2(Math.sin(angle) / ry, Math.cos(angle) / rx);
    if (angle < 0)
        angle += 2.0 * Math.PI;

    var dist = getLength(angle);
    if (q > 0)
        dist += q * getLength(Math.PI / 2);
    return dist;

}
function angleFromDistance(distance) {
    var eps = 1e-8;
    var qp = getLength(Math.PI / 2.0);

    if (Math.abs(distance) < eps) return 0;
    if (Math.abs(distance - qp) < eps) return Math.PI / 2;
    if (Math.abs(distance - 2 * qp) < eps) return Math.PI;
    if (Math.abs(distance - 3 * qp) < eps) return 3.0 * Math.PI / 2.0;
    if (Math.abs(distance - 4 * qp) < eps) return 2 * Math.PI;

    var q = 0;
    while (distance > qp + eps) {
        q += 1;
        distance -= qp;
    }
    var t1 = 0, t2 = Math.PI / 2, tm = (t1 + t2) / 2.0;
    var i;
    for (i = 0; i < 30; i++) {
        if (getLength(tm) > distance)
            t2 = tm;
        else
            t1 = tm;
        tm = (t1 + t2) / 2.0;

    }
    tm += q * Math.PI / 2.0;
    theta = Math.atan2(ry * Math.sin(tm), rx * Math.cos(tm));
    if (theta < 0)
        theta += 2.0 * Math.PI;
    if (Math.abs(theta - 2.0 * Math.PI) < eps)
        theta = 0;
    return theta;


}
function getLength(angle) {

    var ts = [-0.0640568928626056, 0.0640568928626056,
    -0.1911188674736163, 0.1911188674736163,
    -0.3150426796961634, 0.3150426796961634,
    -0.4337935076260451, 0.4337935076260451,
    -0.5454214713888396, 0.5454214713888396,
    -0.6480936519369755, 0.6480936519369755,
    -0.7401241915785544, 0.7401241915785544,
    -0.8200019859739029, 0.8200019859739029,
    -0.8864155270044011, 0.8864155270044011,
    -0.9382745520027328, 0.9382745520027328,
    -0.9747285559713095, 0.9747285559713095,
    -0.9951872199970213, 0.9951872199970213];
    var w = [0.1279381953467522, 0.1279381953467522,
        0.1258374563468283, 0.1258374563468283,
        0.1216704729278034, 0.1216704729278034,
        0.1155056680537256, 0.1155056680537256,
        0.1074442701159656, 0.1074442701159656,
        0.0976186521041139, 0.0976186521041139,
        0.0861901615319533, 0.0861901615319533,
        0.0733464814110803, 0.0733464814110803,
        0.0592985849154368, 0.0592985849154368,
        0.0442774388174198, 0.0442774388174198,
        0.0285313886289337, 0.0285313886289337,
        0.0123412297999872, 0.0123412297999872];

    var r;

    t0 = angle / 2.0;
    r = t0;
    var sum = 0;
    for (i = 0; i < ts.length; i++) {
        t = r * ts[i] + t0;

        p = [-rx * Math.sin(t), ry * Math.cos(t)];
        dsdt = Math.sqrt(p[0] * p[0] + p[1] * p[1]);
        sum += w[i] * dsdt;
    }
    return (sum * r);
}
//---------------------------
function testTan() {
    // the algo below doesn't work - see console for results
    //var tan1 = pointToTan(point1);
    var tan2 = AngleToTan(angle1);
    var ang2 = TanToAngle(tan2)
    console.log('angle = ', [ang2[0] * 180.0 / Math.PI, ang2[1] * 180.0 / Math.PI]);
    console.log('Reverse distance = ', 180.0 / Math.PI * angleFromDistance(distancefromAngle(angle1)));
    // if (rx > ry) { tan = Math.atan2((cy * point1[1]) / (ry * ry), (cx * point1[0]) / (rx * rx)); }
    // else { tan = Math.atan2((cy * point1[1]) / (rx * rx), (cx * point1[0]) / (ry * ry)); }
    // needs converting from slope to direction ??????????
    //console.log("Incorrect: ", tan2 * 180 / Math.PI);
}