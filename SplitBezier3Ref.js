var point = {
    x: 0,
    y: 0

    // fullName : function() {
    //   return firstName + " " + lastName;
    // }
};
var svgContent, line, elm, ps, rot, GL, cx = 200, cy = 120,
    rx = 200, ry = 80, rotD = 0;
var alpha = (Math.sqrt(7.0) - 1.0) / 3.0;
var i, svgContent, elm, rot, GL, ps,
    d = [100, 0, 200, 20, 300, 50],
    rot = rotD * Math.PI / 180;
var points = [];

window.onload = () => startDoc();

function startDoc() {
    var t;
    for (i = 0; i < 6; i++) { d[i] = Math.floor(Math.random() * 400); }
    rot = rotD * Math.PI / 180;




    var p1 = Object.create(point),
        p2 = Object.create(point),
        p3 = Object.create(point);
    p1.x = d[0];
    p1.y = d[1];
    p2.x = d[2];
    p2.y = d[3];
    p3.x = d[4];
    p3.y = d[5];
    points = [p1, p2, p3];


    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }
    makePath();
    makePs([d[0], d[1], d[4], d[5]], "pink", 4);
    splitTest();

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
    elm.setAttribute('stroke', color);
    elm.setAttribute('stroke-miterlimit', '1');
    elm.setAttribute('stroke-linejoin', 'round');
    elm.setAttribute('shape-rendering', 'geometricPrecision');
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


//-------------------------------------------------------------------------
function restart() {
    while (svgContent.firstChild) { svgContent.firstChild.remove(); }
    svgContent.parentNode.removeChild(svgContent.nextSibling);
    console.clear();
    startDoc();

}
function ref3LineE(t) {
    return [Math.pow(1 - t, 2) * d[0] + 2 * t * (1 - t) * d[2] + t * t * d[4], Math.pow(1 - t, 2) * d[1] + 2 * t * (1 - t) * d[3] + t * t * d[5]];
}

function splitTest() {
    //
    var dp = split(points, 0.4, 0.6);
    //

    d = [dp[0].x, dp[0].y, dp[1].x, dp[1].y, dp[2].x, dp[2].y];
    makePath('red');
    splitPoints = [dp[0].x, dp[0].y, dp[2].x, dp[2].y];
    makePs(splitPoints, 'blue', 3)
}

function hull(pts, t) {
    var p = pts,
        _p = [],
        pt,
        q = [],
        idx = 0,
        i = 0,
        l = 0

    q[idx++] = p[0];
    q[idx++] = p[1];
    q[idx++] = p[2];


    // we lerp between all points at each iteration, until we have 1 point left.
    while (p.length > 1) {
        _p = [];
        for (i = 0, l = p.length - 1; i < l; i++) {
            pt = lerp(t, p[i], p[i + 1]);
            q[idx++] = pt;
            _p.push(pt);
        }
        p = _p;
    }
    return q;
}


function split(pts, t1, t2) {
    // shortcuts
    if (t1 === 0 && !!t2) {
        return split(pts, t2).left;
    }
    if (t2 === 1) {
        return split(pts, t1).right;
    }

    // no shortcut: use "de Casteljau" iteration.
    var q = hull(pts, t1);
    //console.log('q = ', q)
    var result = {
        left:

            [q[0], q[3], q[5]],
        right:
            [q[5], q[4], q[2]],
        span: q
    };


    // if we have no t2, we're done
    if (!t2) {
        return result;
    }

    // if we have a t2, split again:
    t2 = map(t2, t1, 1, 0, 1);
    var subsplit = split(result.right, t2);
    return subsplit.left;
}

function map(v, ds, de, ts, te) {
    var d1 = de - ds,
        d2 = te - ts,
        v2 = v - ds,
        r = v2 / d1;
    return ts + d2 * r;
}

function lerp(r, v1, v2) {
    var ret = {
        x: v1.x + r * (v2.x - v1.x),
        y: v1.y + r * (v2.y - v1.y)
    };
    if (!!v1.z && !!v2.z) {
        ret.z = v1.z + r * (v2.z - v1.z);
    }
    return ret;
}