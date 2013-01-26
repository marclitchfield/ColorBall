var spheroModule = require('node-sphero');
var tinycolor = require('tinycolor2');
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

sphero.on('notification', function(message) {
        var imuData = {
                pitch: message.DATA.readInt16BE(0),
                roll: message.DATA.readInt16BE(2),
                yaw: message.DATA.readInt16BE(4)
        };

        var colorFunc = process.argv[0] === 'rgb' ? imuRgb : imuHsv;
        var color = colorFunc(imuData);

        sphero.setRGBLED(color.r, color.g, color.b);

        console.log(imuData, color.r, color.g, color.b);
});

function imuHsv(imuData) {
    return tinycolor({ 
        h: imuData.yaw + 180, 
        s: 100,
        v: 100 
    }).toRgb();
}

function imuRgb(imuData) {
    function toComponent(degree) {
        return (180 - Math.abs(degree)) / 180 * 255;
    }

    return {
        r: toComponent(imuData.roll),
        g: toComponent(imuData.pitch),
        b: toComponent(imuData.yaw)
    };
}

sphero.connect();

