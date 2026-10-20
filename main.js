// not in use

// /**
// * A simple joystick for ROS, reading from a locally connected USB gamepad.
// */

// const { installNavigatorShim } = require('gamepad-node');
// const { ROSs, getForVersion } = require('@transitive-sdk/utils-ros');

// const MAX_SPEED = 1.0;
// // speed going backwards reduced to a forth the forward speed by default
// const REVERSE_FACTOR = 4;
// const MAX_TWIST = 1.0;

// const loop = () => setInterval(() => {
//     const gamepads = navigator.getGamepads();

//     for (const gamepad of gamepads) {
//       if (!gamepad?._native.isController) continue;

//       if (gamepad.axes[1] || gamepad.axes[0]) {
//         let [angular = 0, linear = 0] = gamepad.axes;
//         linear = Math.min(-linear, MAX_SPEED);
//         angular = Math.min(-angular, MAX_TWIST);

//         console.log({linear, angular});
//         for (let ros of ROSs) {
//           ros.publish('/cmd_vel', 'geometry_msgs/Twist', {
//               linear: {x: linear, y: 0, z: 0},
//               angular: {x: 0, y: 0, z: angular}
//             }, false);
//         }
//       }
//     }
//   }, 50);

// const start = async () => {

//   installNavigatorShim();

//   for (let ros of ROSs) {
//     await ros.init();
//   }

//   loop();
// };

// start();

// /* Need to manually quit the loop if it is running. */
// process.on('SIGINT', () => {
//   console.log('\n\nquitting');
//   process.exit(0);
// });
