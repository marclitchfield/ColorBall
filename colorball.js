var spheroModule = require('node-sphero');
var sphero = new spheroModule.Sphero();

sphero.on('connected', function() {
        sphero.setStabilization(false);
        sphero.setBackLED(1);
        sphero.setRGBLED(0,0,0);
        sphero.setDataStreaming([
                sphero.sensors.imu_roll,
                sphero.sensors.imu_pitch,
                sphero.sensors.imu_yaw
        ]);
});

sphero.on('error', function(message) {
	console.log(message);
});

sphero.on('notification', function(message) {
        var imuData = {
                pitch: readValue(message.DATA, 0),
                roll: readValue(message.DATA, 2),
                yaw: readValue(message.DATA, 4)
        };

        var h =  imuData.yaw + 180, s = 100, l = 100;
            //s = (imuData.pitch + 180)/360*100.0,
            //l = (imuData.yaw + 180)/360*100.0;

        var color = hslToRgb(h, s, l);
        sphero.setRGBLED(color[0], color[1], color[2]);

        console.log(h, s, l, color[0], color[1], color[2]);
});

function readValue(data, pos) {
        return data.readInt8(pos) << 8 | data.readInt8(pos + 1);
}

function hslToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
    
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
    
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
    
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
            
        case 1:
            r = q;
            g = v;
            b = p;
            break;
            
        case 2:
            r = p;
            g = v;
            b = t;
            break;
            
        case 3:
            r = p;
            g = q;
            b = v;
            break;
            
        case 4:
            r = t;
            g = p;
            b = v;
            break;
            
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

sphero.connect();

