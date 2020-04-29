var point = {
    x: 0,
    y: 0

    // fullName : function() {
    //   return this.firstName + " " + this.lastName;
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

    //for (i = 0; i < 8; i++) { d[i] = Math.floor(Math.random() * 400); }
    rot = rotD * Math.PI / 180;
    if (!svgContent) {
        svgContent = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgContent.setAttribute('class', 'svgCont');
        document.getElementById('content').appendChild(svgContent);
    }

    d = [cx + rx, cy,
    cx + rx, cy + alpha * ry,
    cx + alpha * rx, cy + ry,
        cx, cy + ry];
    makeEllipse();
    makePath("red");
    makePs(d, "pink", 3);
    var t;
    for (t = 0; t <= 1; t += 0.1) {
        xy = ref4LineE(t);
        theta = Math.atan2(xy[1] - cy, xy[0] - cx) * 180.0 / Math.PI;
        console.log('t =', Math.round(1000 * t) / 1000);
        console.log('theta = ', Math.fround(theta), 180 * FindAngle(t) / Math.PI);
        console.log('[x,y] = [', Math.fround(xy[0]), ',', Math.fround(xy[1]), ']');
    }
    FindT(1.0)


}

//---------------------------------
function makeEllipse(c, rxp, ryp) {
    if (!c)
        c = [cx, cy];
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
    elm.setAttribute('stroke', 'blue');
    elm.setAttribute('fill', "none");
    svgContent.appendChild(elm);
}

function makePath(color) {
    if (!color) { color = "black"; }
    elm = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    console.log()
    elm.setAttribute('d', "M" + d[0] + "," + d[1] + " C" + " " + d[2] + "," + d[3] + " " + d[4] + "," + d[5] + " " + d[6] + "," + d[7]);
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
    startDoc();
    console.clear();
}
function ref4LineE(t) {
    k1 = Math.pow(1 - t, 3);
    k2 = 3 * Math.pow(1 - t, 2) * t;
    k3 = 3 * (1 - t) * t * t;
    k4 = Math.pow(t, 3);
    return [k1 * d[0] + k2 * d[2] + k3 * d[4] + k4 * d[6],
    k1 * d[1] + k2 * d[3] + k3 * d[5] + k4 * d[7]];
}
function FindAngle(t) {
    k1 = Math.pow(1 - t, 3);
    k2 = 3 * Math.pow(1 - t, 2) * t;
    k3 = 3 * (1 - t) * t * t;
    k4 = Math.pow(t, 3);
    var dy = (alpha * k2 + k3 + k4) * ry,
        dx = (k1 + k2 + alpha * k3) * rx;
    return Math.atan2(dy, dx);
}
function FindT(angle) {
    var i, eps = 1e-8, t1 = 0, t2 = 1.0, tm, repeat = 20;
    if (Math.abs(angle) < eps) return 0;
    if (Math.abs(angle - Math.PI / 2.0) < eps) return 1;
    for (i = 0; i < repeat; i++) {
        tm = (t1 + t2) / 2.0;
        console.log('tm = ', tm)
        if (FindAngle(tm) > angle)
            t2 = tm;
        else
            t1 = tm;
    }
    console.log(FindAngle(tm))
    return tm;
}

function hull(t) {
    var p = this.points,
        _p = [],
        pt,
        q = [],
        idx = 0,
        i = 0,
        l = 0;
    q[idx++] = p[0];
    q[idx++] = p[1];
    q[idx++] = p[2];
    if (this.order === 3) {
        q[idx++] = p[3];
    }
    // we lerp between all points at each iteration, until we have 1 point left.
    while (p.length > 1) {
        _p = [];
        for (i = 0, l = p.length - 1; i < l; i++) {
            pt = utils.lerp(t, p[i], p[i + 1]);
            q[idx++] = pt;
            _p.push(pt);
        }
        p = _p;
    }
    return q;
}
function split(t1, t2) {
    // shortcuts
    if (t1 === 0 && !!t2) {
        return this.split(t2).left;
    }
    if (t2 === 1) {
        return this.split(t1).right;
    }

    // no shortcut: use "de Casteljau" iteration.
    var q = this.hull(t1);
    var result = {
        left:
            this.order === 2
                ? new Bezier([q[0], q[3], q[5]])
                : new Bezier([q[0], q[4], q[7], q[9]]),
        right:
            this.order === 2
                ? new Bezier([q[5], q[4], q[2]])
                : new Bezier([q[9], q[8], q[6], q[3]]),
        span: q
    };

    // make sure we bind _t1/_t2 information!
    result.left._t1 = utils.map(0, 0, 1, this._t1, this._t2);
    result.left._t2 = utils.map(t1, 0, 1, this._t1, this._t2);
    result.right._t1 = utils.map(t1, 0, 1, this._t1, this._t2);
    result.right._t2 = utils.map(1, 0, 1, this._t1, this._t2);

    // if we have no t2, we're done
    if (!t2) {
        return result;
    }

    // if we have a t2, split again:
    t2 = utils.map(t2, t1, 1, 0, 1);
    var subsplit = result.right.split(t2);
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