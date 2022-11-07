// create_menublock(10, 100, -1, "plus");

function create_menublock(x, y, type, content){
    
}

function push_requests_menublocks(req) {
    const MENU_WIDTH = 190.0;
    const MENU_HEIGHT = canvas.height - LOGO_HEIGHT;
    const pos = convert_2dscreen_to_2dunnormalizedviewport(canvas.width, canvas.height, [100, 100]);

        req.push([
            [pos[0], pos[1], 0.0],
            [100, 50, 1.0],
            [0.3, 0.8, 0.9, 1.0],
            null,
            [0.0, 0.0, 0.0, 0.0],
            true,
        ]);
}