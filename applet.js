const Applet = imports.ui.applet;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;

const API_URL = "https://api.waqi.info/feed/here/?token=b4949c538171c9621832dea970bfdbcfdc62c108";
const REFRESH_SECONDS = 600;

class AqiApplet extends Applet.TextApplet {
    constructor(metadata, orientation, panelHeight, instanceId) {
        super(orientation, panelHeight, instanceId);

        this.set_applet_label("AQI …");
        this.set_applet_tooltip("Loading air quality data…");

        // Smooth color transitions
        this._applet_label.set_style(`
            padding: 2px 6px;
            border-radius: 6px;
            transition-duration: 400ms;
            transition-property: background-color, color;
        `);

        this._update();
    }

    _update() {
        Util.spawn_async(
            ["bash", "-c", `curl -s "${API_URL}"`],
            (stdout) => {
                try {
                    let json = JSON.parse(stdout);
                    if (json?.status !== "ok") {
                        this._showError();
                        return;
                    }

                    let data = json.data;
                    let aqi = data.aqi;
                    let pm25 = data.iaqi?.pm25?.v ?? null;
                    let pm10 = data.iaqi?.pm10?.v ?? null;
                    let city = data.city?.name || "Unknown";

                    let label = `AQI ${aqi}`;
                    if (pm25 !== null) label += ` | PM2.5 ${pm25}`;
                    if (pm10 !== null) label += ` | PM10 ${pm10}`;

                    this.set_applet_label(label);
                    this.set_applet_tooltip(
                        `Location: ${city}\nAQI: ${aqi}\nPM2.5: ${pm25 ?? "n/a"} µg/m³\nPM10: ${pm10 ?? "n/a"} µg/m³`
                    );

                    if (pm25 !== null) {
                        this._applyPm25Color(pm25);
                    }

                } catch (e) {
                    this._showError();
                    log(`AQI applet error: ${e}`);
                }
            }
        );

        Mainloop.timeout_add_seconds(REFRESH_SECONDS, () => {
            this._update();
            return true;
        });
    }

    _showError() {
        this.set_applet_label("AQI error");
        this._applet_label.set_style("");
    }

    // WHO-inspired PM2.5 thresholds
    _pm25Color(pm25) {
        if (pm25 <= 5)  return "#2ecc71";   // very good
        if (pm25 <= 15) return "#a3e635";   // good
        if (pm25 <= 25) return "#facc15";   // moderate
        if (pm25 <= 35) return "#fb923c";   // unhealthy for sensitive
        if (pm25 <= 50) return "#ef4444";   // unhealthy
        return "#7c2d12";                   // hazardous
    }

    _applyPm25Color(pm25) {
        let bg = this._pm25Color(pm25);
        let text = this._idealTextColor(bg);

        this._applet_label.set_style(`
            background-color: ${bg};
            color: ${text};
            padding: 2px 6px;
            border-radius: 6px;
            font-weight: bold;
            transition-duration: 400ms;
            transition-property: background-color, color;
        `);
    }

    // Make it theme-aware (light/dark panels)
    _idealTextColor(bg) {
        let c = bg.substring(1);
        let rgb = [
            parseInt(c.substr(0, 2), 16),
            parseInt(c.substr(2, 2), 16),
            parseInt(c.substr(4, 2), 16),
        ];
        let luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]);
        return luminance > 140 ? "#000000" : "#ffffff";
    }
}

function main(metadata, orientation, panelHeight, instanceId) {
    return new AqiApplet(metadata, orientation, panelHeight, instanceId);
}
