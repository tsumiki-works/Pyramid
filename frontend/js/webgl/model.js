// A module for creating model
//   * create_model
//   * draw_model

function create_vbo(data) {
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
}

function create_ibo(data) {
    let ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
}

function create_tcbo(data) {
    let tcbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tcbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return tcbo;
}

function create_model(index_count, vtxs, idxs, uvs) {
    return [index_count, create_vbo(vtxs), create_ibo(idxs), create_tcbo(uvs)]
}

function draw_model(model, texid, trans, scale) {
    gl.bindBuffer(gl.ARRAY_BUFFER, model[MODEL_IDX_VBO]);
    gl.vertexAttribPointer(location_position, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, model[MODEL_IDX_TCBO]);
    gl.vertexAttribPointer(location_tex_coord, 2, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model[MODEL_IDX_IBO]);
    if (texid == -1) {
        gl.uniform4fv(uniform_location_frag_option, [0.0, 0.0, 0.0, 0.0]);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.uniform1i(uniform_location_sampler, 0);
    } else {
        gl.uniform4fv(uniform_location_frag_option, [1.0, 0.0, 0.0, 0.0]);
        gl.bindTexture(gl.TEXTURE_2D, image_textures[texid]);
        gl.uniform1i(uniform_location_sampler, 0);
    }
    let mat_trs = create_trans(trans);
    var mat_scl = create_scale(scale);
    var mat_view = create_identity();
    var mat_proj = create_identity();
    gl.uniformMatrix4fv(uniform_location_mat_trs, false, mat_trs);
    gl.uniformMatrix4fv(uniform_location_mat_scl, false, mat_scl);
    gl.uniformMatrix4fv(uniform_location_mat_view, false, mat_view);
    gl.uniformMatrix4fv(uniform_location_mat_proj, false, mat_proj);
    gl.drawElements(gl.TRIANGLES, model[MODEL_IDX_INDEX_COUNT], gl.UNSIGNED_SHORT, 0);
}
