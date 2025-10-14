let sevenTV_cosmetics = {
    badges: {},
    paints: {},
    sets: {}
}

async function displayCosmeticPaint(user_id, color, textElement) {
    const displayedPaint = false;

    try {
        const foundPaint = Object.values(sevenTV_cosmetics.paints).find(paint => paint.owner.find(o => o.id === String(user_id)));
        const randomColor = getRandomTwitchColor();

        color = color ? fixNameColor(color) : randomColor || 'white';

        const can_display_paints = getSetting("paints");
        const fontStroke = getSetting("fontStroke");

        if (foundPaint && can_display_paints) {
            let style = `background-image: ${foundPaint.backgroundImage};`

            if (getSetting("paintShadows")) {
                style += ` filter: ${foundPaint.shadows};`;
            } else if (fontStroke) {
                style += ` -webkit-text-stroke: 1px black;`;
            }

            textElement.classList.add('paint');

            textElement.style.cssText = style;
            textElement.style.backgroundColor = color;
        } else {
            textElement.classList.remove('paint');
            textElement.style.cssText = "";
            textElement.style.backgroundColor = "unset";
        }

        textElement.style.color = color;
    } catch (err) {
        console.error(err)
    } finally {
        return displayedPaint;
    }
}

async function getPaintName(user_id) { // I DONT THINK ITS USED ANYWHERE SO NO NEED TO UPDATE THIS... I GUESS?
    const foundUser = cosmetics.user_info.find(user => user["ttv_user_id"] === user_id);

    if (foundUser && foundUser["paint_id"]) {
        const foundPaint = cosmetics.paints.find(paint => paint.id === foundUser["paint_id"]);

        if (foundPaint) {
            return foundPaint.name
        } else {
            return null
        }
    }

    return null
}

async function pushCosmeticUserUsingGQL(seventv_id) {
    const response = await fetch('https://7tv.io/v3/gql', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "query": "query GetUserForUserPage($id: ObjectID!) { user(id: $id) { id username display_name avatar_url style { color paint { id kind name function color angle shape image_url repeat stops { at color } shadows { x_offset y_offset radius color } } badge { id kind name tooltip tag host { url files { name static_name width height frame_count size format } } } } connections { username id platform } } }",
            "variables": {
                "id": `${seventv_id}`
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();

    if (data && data["data"]) {
        data = data["data"];
    }

    if (!data?.["user"] || !data["user"]?.["connections"] || !data["user"]["connections"].length || !Object.keys(data["user"]).length) { return; };
    const foundTwitchConnection = data["user"]["connections"].find(connection => connection?.platform == "TWITCH");

    if (foundTwitchConnection) {
        if (data["user"]["style"]["badge"]) {
            const badge = await window.seventv.main.parse.badge(data["user"]["style"]["badge"]);

            badge.owner.push(foundTwitchConnection);

            if (!sevenTV_cosmetics.badges[badge.id]) {
                sevenTV_cosmetics.badges[badge.id] = badge;
            }
        }
        if (data["user"]["style"]["paint"]) {
            const paint = await window.seventv.main.parse.paint(data["user"]["style"]["paint"]);

            paint.owner.push(foundTwitchConnection);

            if (!sevenTV_cosmetics.paints[paint.id]) {
                sevenTV_cosmetics.paints[paint.id] = paint;
            }
        }
    }
}

function argbToRgba(color) {
    if (color < 0) {
        color = color >>> 0;
    }

    const red = (color >> 24) & 0xFF;
    const green = (color >> 16) & 0xFF;
    const blue = (color >> 8) & 0xFF;
    return `rgba(${red}, ${green}, ${blue}, 1)`;
}