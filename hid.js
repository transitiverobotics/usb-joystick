/**
* An even  simpler joystick for ROS, reading from a locally connected USB
* controllers directly using hid, becaue gamepad-node dow not work on Ubuntu 20.
*/
const HID = require('node-hid');
const { ROSs, getForVersion } = require('@transitive-sdk/utils-ros');
const { usb } = require('usb');

// console.log(HID.devices());

const MAX_SPEED = 1.0;
// speed going backwards reduced to a forth the forward speed by default
const REVERSE_FACTOR = 4;
const MAX_TWIST = 1.0;

const controllers = [
  {
    description: 'ps4',
    vendorId: 1356,
    productId: 2508,
  }
];

/** gets the raw HID buffer */
const onData = (data) => {
  let angular = (data[1] - (0xff / 2)) / (0xff / 2);
  let linear = (data[2] - (0xff / 2)) / (0xff / 2);

  linear = Math.min(-linear, MAX_SPEED);
  angular = Math.min(-angular, MAX_TWIST);

  linear = Math.abs(linear) < 0.01 ? 0 : linear;
  angular = Math.abs(angular) < 0.01 ? 0 : angular;

  console.log({linear, angular});
  for (let ros of ROSs) {
    ros.publish('/cmd_vel', 'geometry_msgs/Twist', {
        linear: {x: linear, y: 0, z: 0},
        angular: {x: 0, y: 0, z: angular}
      }, false);
  }
};

/** See whether any known controllers are connected and if so connect to them */
const connectHID = () => {

  const devices = HID.devices();
  console.log(devices, controllers);

  controllers.forEach(controller => {
    const device = devices.find(device =>
      device.vendorId == controller.vendorId
        && device.productId == controller.productId);

    if (device) {
      // we found a known controller, connect to it
      console.log(`Found ${device}, connecting (${controller})`);

      const hid = new HID.HID(device.vendorId, device.productId);
      hid.on('data', onData);
      hid.on('error', (...args) => {
        console.log('*** ERROR:', args);
        hid.close();
      });
    }
  });
};

/** Watch USB and try to connect to new devices */
const watchUSB = () => {
  usb.addEventListener('connect', (event) => {
    console.log('USB device connected');
    connectHID();
  });

  usb.addEventListener('disconnect', (event) => {
    console.log('USB device disconnected');
  });
};

const start = async () => {
  for (let ros of ROSs) {
    await ros.init();
  }

  connectHID();
  watchUSB();
};

start();

/* Need to manually quit the loop if it is running. */
process.on('SIGINT', () => {
  console.log('\n\nquitting');
  process.exit(0);
});
