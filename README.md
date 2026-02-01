# Air Quality Index applet for Linux Mint
<img width="371" height="141" alt="Screenshot from 2025-12-18 21-32-19" src="https://github.com/user-attachments/assets/279112bc-409d-4f24-8ab4-dbb7947650dc" />

Linux Mint missing an AQI applet, I tried making my own. This is not proprietary code. | Relied on AI for fine tuning 

* * *

No free public APIs for my hometown, so I am forced to use the nearest station API, which is about 40 miles away, thus pointless. Need to find a workaround.

Terminal commands to enable the applet and remove it:

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

Working image:
<img width="402" height="160" alt="Screenshot from 2025-12-17 23-26-10" src="https://github.com/user-attachments/assets/8b5512ea-e7b5-4279-9cf3-ff3945943dcd" />


* * *
* * *
* * *


