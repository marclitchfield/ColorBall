## ColorBall

node program that receives streaming IMU (pitch, acceleration, yaw) data from a Sphero and changes its color in response. Two modes are supported:

* hsv - (the default) yaw controls hue. saturation and brightness are fixed at 100%.
* rgb - roll controls red, pitch controls green, yaw controls blue 


## Usage

    node colorball.js [rgb | hsv]


## SDK

node-sphero sdk is from boundsj/node-sphero

