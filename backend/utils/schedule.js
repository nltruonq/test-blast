const cron = require("node-cron");

const User = require("../models/User");

const findUserHasUsagePackage = async () => {
    try {
        const date = new Date(Date.now());
        console.log("End schedule", date.toLocaleDateString() + "-" + date.toLocaleTimeString());
    } catch (err) {
        console.log("End schedule with error: ", err.message);
    }
};

// Lập lịch cho công việc chạy vào lúc 0h mỗi ngày
const schedule = async () => {
    cron.schedule(
        "0 0 * * *",
        async () => {
            await findUserHasUsagePackage();
        },
        {
            timezone: "Asia/Ho_Chi_Minh",
        }
    );
};

module.exports = schedule;
