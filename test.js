// // const calculateTimeLeft = (endTime) => {
// //   const targetTimeUTC = new Date(endTime);

// //   // Convert UTC time to Pakistan Standard Time (UTC+5)
// //   const targetTimePST = new Date(targetTimeUTC.getTime() + 5 * 60 * 60 * 1000);
// //   console.log("Converted Time (PST):", targetTimePST);

// //   const nowUTC = new Date();
// //   const nowPST = new Date(nowUTC.getTime() + 5 * 60 * 60 * 1000); // Convert current time to PST
// //   console.log("Current Time (PST):", nowPST);

// //   const difference = targetTimePST - nowPST;
// //   console.log("Time Left in MS:", difference);

// //   if (difference <= 0) return "00:00:00";

// //   const hours = String(Math.floor(difference / 3600000)).padStart(2, "0");
// //   const minutes = String(Math.floor((difference % 3600000) / 60000)).padStart(
// //     2,
// //     "0"
// //   );
// //   const seconds = String(Math.floor((difference % 60000) / 1000)).padStart(
// //     2,
// //     "0"
// //   );

// //   return `${hours}:${minutes}:${seconds}`;
// // };

// // // Test with UTC time
// // console.log(calculateTimeLeft("2025-03-29T10:00:00Z")); // Should give 03:00:00 (PST)

// const calculateTimeLeft = (endTimePST) => {
//   console.log(typeof(endTimePST));
//   console.log(endTimePST);

//   // Get current time in PST
//   const now = new Date().toLocaleTimeString();

//   console.log(typeof(now));
//   console.log(now);

//   const difference = endTimePST - now;
// //   console.log(difference)

//   if (difference <= 0) return "00:00:00";

//   const hours = String(Math.floor(difference / 3600000)).padStart(2, "0");
//   const minutes = String(Math.floor((difference % 3600000) / 60000)).padStart(
//     2,
//     "0"
//   );
//   const seconds = String(Math.floor((difference % 60000) / 1000)).padStart(
//     2,
//     "0"
//   );

//   return `${hours}:${minutes}:${seconds}`;
// };

// console.log(Date());
// // console.log(calculateTimeLeft("4:00:00 PM"));

// console.log(new Date("Sat Mar 29 2025 15:17:52 GMT+0500 (Pakistan Standard Time)").toLocaleTimeString() - new Date("Sat Mar 29 2025 15:17:52 GMT+0500 (Pakistan Standard Time)").toLocaleTimeString())

let arr1 = [{id: "232"}, {id: "3434"}];
let arr2 = [{id: "232"}, {id: "3434"}];

arr1.push(arr2);
console.log(arr1);
arr1 = arr1.flat();
console.log(arr1);

