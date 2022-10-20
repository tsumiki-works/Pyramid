// A module for affine transformation matrix for WebGL
//   * create_identity
//   * create_trans
//   * create_scale

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

function create_proj(proj) {
    let m = create_identity();
    return m;
}