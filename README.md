# node-omega-frekvens
Controls an IKEA FREKVENS LED cube lamp through Node.js driving an Onion Omega 2+.

Companion repo: https://github.com/atesgoral/frekvens-fjarrkontroll

## Omega Setup
You'll need space to install the required packages. Extend your storgage with external storage first. I used an SD card and mounted it as overlay.

To pull this source directly onto Omega:

```
opkg install git git-http
git clone https://github.com/atesgoral/node-omega-frekvens.git
```

Install Node.js, npm, Python and node-gyp:

```
opkg install node node-npm python
npm install -g node-gyp
node-gyp install
```

Edit /etc/opkg/distfeeds.conf and uncomment the following two lines:

```
src/gz openwrt_base http://downloads.openwrt.org/releases/18.06-SNAPSHOT/packages/mipsel_24kc/base
src/gz openwrt_packages http://downloads.openwrt.org/releases/18.06-SNAPSHOT/packages/mipsel_24kc/packages
```

Install GCC + Make:

```
opkg install gcc make
```

Do this thing that I needed to also do to be able to start compiling things:

```
ar -rc /usr/lib/libpthread.a
```

## Build
```
node-gyp configure
node-gyp build
```

## Run
```
node index
```

## Electronics
Pop open your FREKVENS (look at videos of people doing it to avoid hurting the plastic + yourself).

The wires at the back:
- Red (COM) - common wire for both switches
- Black (SW1) - yellow switch imprinted with grid symbol
- White (SW2) - red switch imprinted with power symbol
- Two thicker white wires are the +/- DC power (3.3V)

Unsolder and plop out the stock graphics controller. The connectors:
- IR - unused (but they had plans of adding an IR receiver?)
- MIC - microphone (can be seen from the outside through a tiny hole at the front)
- GND - ground
- LAK - latch
- CLK - clock
- DA - data
- EN - enable
- VCC - power (3.3V)

Onion Omeage 2+ connections:
- GND - ground & enable
- GPIO 0 (out) - data
- GPIO 1 (out) - clock
- GPIO 2 (out) - latch
- GPIO 18 (in) - black wire (SW1) + 10K Ω pulldown resistor
- GPIO 19 (in) - white wire (SW2) + 10K Ω pulldown resistor
- 3.3V - red wire (COM)

Notes:
- Didn't use FREKVENS's own power (neither the VCC nor the white DC wires) to power the Omega. I used an expansion dock powered with a USB cable (which goes through a destroyed version of one of the screw holes at the back). The USB cable gives me the safety net of a serial connection in case WiFi goes AWOL.
- Didn't use the mic.

## Communication with the LED controller board
There is a matrix of 16 x 16 = 256 pixels. The pixels are scanned in a special manner. Split the matrix in two 8 x 16 halves. Scan first half top to bottom and then scan second half top to bottom, while scanning each of the 8 pixel rows left to right. Like so:

```
1------> 17----->
2------> 18----->
3------> 19----->
4------> 20----->
5------> 21----->
6------> 22----->
7------> 23----->
8------> 24----->
9------> 25----->
10-----> 26----->
11-----> 27----->
12-----> 28----->
13-----> 29----->
14-----> 30----->
15-----> 31----->
16-----> 32----->
```

For each pixel:
1. Set data (DA) high/low based on pixel value
2. Toggle clock (CLK) high and then low

Once all pixels are done, toggle latch (LAK) high and then low.

I didn't have to add any additional delays between the toggling. Things seems to work when you're driving the LED controller at full speed.

## Credits
- GPIO code copied from https://github.com/OnionIoT/fast-gpio by @OnionIoT
- Nanosecond timing code copied from https://github.com/KitBishop/Omega-GPIO-I2C-Arduino by @KitBishop
- @eightlines for info on the graphics memory layout + controller board communication and [his own implementation](https://github.com/eightlines/FrekvensMatrix)
- @unframework for kicking off the hardware hacking with me and getting an [Arduino prototype going](https://github.com/unframework/freakvens/)

## License
Need to sort that out still. Both the GPIO and the nanosecond timing code are GPLv3. However, I would like to release my portions as ISC. I probably need to bring in the borrowed bits of code as external libraries to decouple the licenses.
