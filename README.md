sudo apt update 

sudo apt install -y gjs curl cinnamon-dev

sudo apt install -y code

mkdir -p ~/.local/share/cinnamon/applets/aqi@baka

cd ~/.local/share/cinnamon/applets/aqi@baka

code .

Alt + F2 / restart system
r
Enable the applet:
1) Right-click panel → Applets
2) Find Air Quality Index
3) Click Add to panel

Zip the app:

cd ~/.local/share/cinnamon/applets

zip -r aqi@baka.zip aqi@baka

Remove:

rm -rf ~/.local/share/cinnamon/applets/aqi@baka
