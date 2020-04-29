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
    rotD = 0;

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 8; i++) {
        d[i] = Math.floor(Math.random() * 400);
    }
    rot = (rotD * Math.PI) / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svgContent.setAttribute("class", "svgCont");
        document.getElementById("content").appendChild(svgContent);
    }
    makePath();
    //makePs(d, "pink", 4);
    pointsTest();

    btn = document.createElement("input");
    btn.type = "button";
    btn.value = "restart";
    btn.className = "btn";
    btn.addEventListener("click", restart);
    svgContent.parentNode.appendChild(btn);
}

//---------------------------------
function makePath(color) {
    if (!color) {
        color = "black";
    }
    elm = document.createElementNS("http://www.w3.org/2000/svg", "path");
    elm.setAttribute('d', "M" + d[0] + "," + d[1] + " C" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5] + " " + d[6] + "," + d[7]);
    //elm.setAttribute("transform", "rotate(" + rotD + " 100 100)");
    elm.setAttribute("stroke", "black");
    elm.setAttribute("stroke-width", "1");
    elm.setAttribute("fill", "none");
    svgContent.appendChild(elm);
    GL = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgContent.appendChild(GL);
}
function makeLine(line, color) {
    //console.log(line);
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
    //console.log(l);
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

///TEST
//---------------------------
function pointsTest() {
    /* testing the false
    var p = [Math.floor(Math.random() * 400), Math.floor(Math.random() * 400)],
        t = tFromPoint(p);
    
    console.log("=================");
    console.log(p);
    console.log(t);
    */

    var i,
        t = Math.random(),
        p = ref4LineE(t),
        tTest = tFromPoint(p);

    makePs(p, "pink", 5);

    console.log("=================");
    console.log("Point: ", p);
    console.log("Original t: ", t);
    console.log("returned t: ", tTest);
    console.log("inaccuracy: ", t - tTest);

    makePs(ref4LineE(tTest), "blue", 3);
}
//-------------------------------------------------------------------------
function tFromPoint(point) {
    // finds t corresponding to given point
    // if point is not on the curve, returns false
    if (point[0] == d[0] && point[1] == d[1])
        return 0;
    if (point[0] == d[6] && point[1] == d[7])
        return 1;
    


    var p = -d[0] + 3 * d[2] - 3 * d[4] + d[6],
        q = 3 * d[0] - 6 * d[2] + 3 * d[4],
        r = -3 * d[0] + 3 * d[2],
        s = d[0] - point[0];
    
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
            p = ref4LineE(t1[0]);
            if (Math.abs(p[1] - point[1]) < 0.000000001)
                return t1[0];
        }
    }
    t2 = complexSub(y2, dy);
    if (Math.abs(t2[1]) < 0.000000001) {
        if (t2[0] >= 0 && t2[0] < 1.000000001) {
            p = ref4LineE(t2[0]);
            if (Math.abs(p[1] - point[1]) < 0.000000001)
                return t2[0];
        }
    }
    t3 = complexSub(y3, dy);
    if (Math.abs(t3[1]) < 0.000000001) {
        if (t3[0] >= 0 && t3[0] < 1.000000001) {
            p = ref4LineE(t3[0]);
            if (Math.abs(p[1] - point[1]) < 0.000000001)
                return t3[0];
        }
    }

    return false;



}
//-------------------------------------------------------------------------
function ref4LineE(t) {
    k1 = Math.pow(1 - t, 3);
    k2 = 3 * Math.pow(1 - t, 2) * t;
    k3 = 3 * (1 - t) * t * t;
    k4 = Math.pow(t, 3);
    return [k1 * d[0] + k2 * d[2] + k3 * d[4] + k4 * d[6],
    k1 * d[1] + k2 * d[3] + k3 * d[5] + k4 * d[7]];
    // p = -d[0] + 3 * d[2] - 3 * d[4] + d[6];
    // q = 2 * d[0] - 4 * d[2] + 2 * d[4];
    // r = -d[0] + d[2];
}
function ref4LineDiff(t) {
    // t --> [dx/dt , dy/dt]
    var t2 = t * t;
    var k1 = -3 * t2 + 6 * t - 3,
        k2 = 9 * t2 - 12 * t + 3,
        k3 = -9 * t2 + 6 * t,
        k4 = 3 * t2;

    return [k1 * d[0] + k2 * d[2] + k3 * d[4] + k4 * d[6], k1 * d[1] + k2 * d[3] + k3 * d[5] + k4 * d[7]];
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
}
