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

// let d = new Date();
// console.log(typeof(d));

const { log } = require("console");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "data.csv");

const generateParticipantsCredentials = () => {
  const names = [
    ["Tamia Naeem", "tamianaeem66@gmail.com"],
    ["Muhammad Hassan", "rizvihassanmuhammad@gmail.com"],
    ["Muhammad Sarim Shaikh", "sheikhsarim52@gmail.com"],
    ["Manahil Ayaz", "k233018@nu.edu.pk"],
    ["Abdul Karim Bukhsh Ansari", "abdulkarimbukhshansari@gmail.com"],
    ["Saad Salman", "k214664@nu.edu.pk"],
    ["Muhammad Shumail Tasadduq", "muhammadshumail201@gmail.com"],
    ["Aisha Hadi", "aishaabdulhadi2@gmail.com"],
    ["Shahmir Ahmed Khan", "k224414@nu.edu.pk"],
    ["Rizwan Ansar", "ansarrizwan83@gmail.com"],
    ["Ashhad Hassan Siddiqui", "k213248@nu.edu.pk"],
    ["Rameen", "rameen4601820@cloud.neduet.edu.pk"],
    ["Haseeb Ahmed", "haseebop97@gmail.com"],
    ["Musfirah Waseem", "musfirahwaseem1@gmail.com"],
    ["Saad Ali Khan", "saadalikhan042@gmail.com"],
    ["Laiba Zubair", "k200258@nu.edu.pk"],
    ["Rimsha Zahid", "zrimsha219@gmail.com"],
    ["Ibad Ur Rehman", "k230517@nu.edu.pk"],
    ["Abdul Wasay", "abdulwasay1207@gmail.com"],
    ["Wajiha Usman", "wajihausman53@gmail.com"],
    ["Mahnoor Abbasi", "mahnoorabbasi58@gmail.com"],
    ["Syeda Tayyiba Fatima", "k230853@nu.edu.pk"],
    ["Urooj Iqbal", "uroojiqbal54@gmail.com"],
    ["Ali Wasif", "k224511@nu.edu.pk"],
    ["Syed Muhammad Rayyan", "syed.rayyan52@gmail.com"],
    ["Syed Muhammad Irtiza", "k224638@nu.edu.pk"],
    ["Arman Faisal", "k228708@nu.edu.pk"],
    ["Sahiba Laljee", "k233006@nu.edu.pk"],
    ["Maham Javed", "maham.15587.ac@iqra.edu.pk"],
    ["Kashaf Zia", "kashafzia100@gmail.com"],
    ["Rohail Rashid Khan", "rohailrashid17@gmail.com"],
    ["Syeda Fatima Jaffar", "sfatimajaffar.110@gmail.com"],
    ["Bilal Yousuf", "k233038@nu.edu.pk"],
    ["Umer Yousuf", "k225030@nu.edu.pk"],
    ["Namra Imtiaz", "namraimtiaz04@gmail.com"],
    ["Aisha Riaz", "aisharz.0201@gmail.com"],
    ["Tooba Farooq", "toobafar004@gmail.com"],
    ["Haris Bin Nasir", "hbnasir23@gmail.com"],
    ["Muhib Ali", "muhibali369@gmail.com"],
    ["Mustafa Ahmed", "k225056@nu.edu.pk"],
    ["Huzaifa Ahmed Khan", "huzaifaahmedkhan04@gmail.com"],
  ];
  
  function generateRandomPassword(length = 10) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:.<>?";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars[randomIndex];
    }
    return password;
  }
  
  for (let i = 0; i < names.length; i++) {
    const csvRow =
      names[i][0] +
      "," +
      names[i][1] +
      "," +
      names[i][0].replaceAll(" ", "_") +
      "," +
      generateRandomPassword() + "\n";
      fs.appendFile(filePath, csvRow, (err) => {
        if (err) {
          console.error("Failed to append to CSV:", err);
        } else {
          console.log("Row appended to CSV file successfully.");
        }
      });
  
    console.log(csvRow);
  }
  
}

query = "hello world;";

if (query[query.length - 1] == ';') {
  query = query.substr(0, query.length - 1)
}

console.log(query);


let a = [];
if (Array.isArray(query)) console.log("True");

let ob = [
  {
    q:"q1",
    n:1
  },
  {
    q:"q2",
    n:1
  },
  {
    q:"q3",
    n:1
  }
]

let maxi = 0;
for (let i = 0; i < ob.length; i++) {
  maxi = Math.max(parseInt(ob[i].q.substring(1), 10), maxi);
}

console.log(maxi);


// const uniqueNames = new Set(names);

// console.log("Unique count:", uniqueNames.size == names.length); // should print 42

