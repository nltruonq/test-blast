const cron = require("node-cron");

const User = require("../models/User");

const findUserHasUsagePackage = async () => {
    try {
        console.log("Start schedule");
        const users = await User.find({}, { packages: { $slice: -1 } });
        const list = [];
        users.forEach((e, i) => {
            let threedays = new Date(Date.now());
            threedays.setDate(threedays.getDate() - 3);
            if (e?.packages?.length === 1) {
                const expiration_date = e.packages[0].expiration_date;
                const [d, m, y] = expiration_date.split("/");
                if (
                    threedays.getDate() === parseInt(d) &&
                    threedays.getMonth() + 1 === parseInt(m) &&
                    threedays.getFullYear() === parseInt(y)
                ) {
                    // sendMail(e.email, "BLAST", "<p>Gói bạn đang sử dụng sắp hết hạn</p>");
                    console.log(e.email, "Gói bạn đang sử dụng còn 3 ngày nữa hết hạn!");
                    list.push(e);
                }
            }
        });
        console.log("End schedule");
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
