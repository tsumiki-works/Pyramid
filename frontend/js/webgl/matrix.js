// A module for affine transformation matrix for WebGL
//   * create_identity
//   * create_trans
//   * create_scale
//   * create_perse
//   * create_ortho

function create_identity() {
    return [
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0,
    ];
}

function create_trans(trans) {
    let m = create_identity();
    m[12] = trans[0];
    m[13] = trans[1];
    m[14] = trans[2];
    return m;
}

function create_scale(scale) {
    let m = create_identity();
    m[0] = scale[0];
    m[5] = scale[1];
    m[10] = scale[2];
    return m;
}

function create_perse(theta, aspect, near, far) {
    let m = create_identity();
    const t = near * Math.tan(theta * Math.PI / 180.0);
    const r = t * aspect;
    const a = r * 2.0;
    const b = t * 2.0;
    const c = far - near;
    m[0] = near * 2 / a;
    m[5] = near * 2 / b;
    m[10] = -(far + near) / c;
    m[11] = -1;
    m[14] = -(far * near * 2) / c;
    m[15] = 0;
    return m;
}

function create_ortho(width, height, depth) {
    let m = create_identity();
    m[0] = 2.0 / width;
    m[5] = 2.0 / height;
    m[10] = 2.0 / depth;
    return m;
}
