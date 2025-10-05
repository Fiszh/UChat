const site_blur = document.getElementById("site_blur");

// COLOR PICKER

const defaultColor = '#191919';

const pickr = Pickr.create({
    el: '#color-picker',
    theme: 'monolith',
    appClass: 'picker_dark',
    default: defaultColor,
    components: {
        preview: false,
        opacity: true,
        hue: true,
        interaction: {
            input: true,
            save: false,
            cancel: false,
            clear: true,
        },
    },
});

const colorBox = document.querySelector('.chat_preview');
const pickerButton = document.querySelector('.pcr-button');

pickr.on('change', (color) => {
    colorBox.style.background = color.toHEXA().toString();
    pickerButton.style.setProperty('--pcr-color', color.toHEXA().toString());
});

pickr.on('clear', () => {
    colorBox.style.background = defaultColor;
    pickr.setColor(defaultColor);
});

// PATCHES

const topbar = document.getElementById("topbar");
const version_patches = document.getElementById("version-patches");
const patches = document.getElementById("patches");

topbar.addEventListener("click", async () => {
    site_blur.classList.remove("no-blur");

    version_patches.style.display = "block";

    if (!patches.children.length) {
        const res = await fetch("https://api.github.com/repos/Fiszh/UChat/commits?per_page=50&page=1");

        if (!res.ok) {
            patches.innerHTML = "Failed to get recent patches."
        } else {
            const data = await res.json();

            if (data) {
                for (const commit of data) {
                    if (commit.commit.author.name == "github-actions") { continue; };
                    const patch = document.createElement("li");
                    patch.innerHTML = `${commit.commit.message.replace(/\n/g, "<br>")}<br><br><strong>By: ${commit.commit.author.name}<br>On: ${commit.commit.author.date.replace("T", " ").replace("Z", "")}</strong>`;
                    patch.id = "patch";
                    patches.appendChild(patch);

                    const link_commit = document.createElement("a");
                    link_commit.href = commit.html_url;
                    link_commit.target = "_blank";
                    link_commit.rel = "noopener noreferrer";

                    patch.appendChild(link_commit);
                }
            } else {
                patches.innerHTML = "No data returned.";
            }
        }
    };
})

site_blur.addEventListener("click", () => {
    site_blur.classList.add("no-blur");

    version_patches.style.display = "none";
})