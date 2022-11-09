function push_requests_menublocks(req) {
    const MENU_WIDTH = 190.0;
    const MENU_HEIGHT = canvas.height - LOGO_HEIGHT;
    for (let i = 0; i < 5; i++) {
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [90, 100 + 60*i]);
        req.push([
            [pos[0], pos[1], 0.0],
            [100, 50, 1.0],
            [0.6 - 0.08*i, 0.9 - 0.04*i, 0.35 + 0.12*i, 1.0], // ゆくゆくは色を格納した配列を呼び出したい
            null,
            [0.0, 0.0, 0.0, 0.0],
            true,
        ]);
    }
    // ブロック増設予定地
    for (let i = 5; i < 10; i++) {
        const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [90, 100 + 60*i]);
            req.push([
                [pos[0], pos[1], 0.0],
                [100, 50, 1.0],
                [0.0, 0.0, 0.0, 0.05],
                null,
                [0.0, 0.0, 0.0, 0.0],
                true,
            ]);
        }
}