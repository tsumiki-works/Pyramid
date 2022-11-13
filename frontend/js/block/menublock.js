function push_requests_menublocks(req) {
    const MENU_WIDTH = 190.0;
    const MENU_HEIGHT = canvas.height - LOGO_HEIGHT;
    for (let i = 0; i < 5; i++) {
        const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [90, 100 + 60*i]);
        req.push([
            [pos[0], pos[1], 0.0],
            [100, 50, 1.0],
            TYPE_TO_COL[i],
            null,
            [0.0, 0.0, 0.0, 0.0],
            true,
        ]);
    }
    // ブロック増設予定地
    for (let i = 5; i < 10; i++) {
        const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [90, 120 + 60*i]);
        req.push([
            [pos[0], pos[1], 0.0],
            [100, 50, 1.0],
            [0.2, 0.2, 0.2, 0.5],
            null,
            [0.0, 0.0, 0.0, 0.0],
            true,
        ]);
    }
}