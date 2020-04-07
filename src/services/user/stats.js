let Mission = require('./../../models/Mission');
const jwt = require('jsonwebtoken');

function getStatsModel(mission) {
    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "October", "November", "December"];

    let data = [];
    mission.forEach((value) => {
        const us_date = value.date.split("/");
        const date = new Date(us_date[1] + "/" + us_date[0] + "/" + us_date[2]).getMonth();
        console.log(date, value.deal);
        data[date] = data[date] ? data[date] + parseFloat(value.deal) : parseFloat(value.deal);
    });

    for (let i = 0; i !== 12; i++) {
        if (!data[i]) {
            data[i] = 0;
        }
    }
    const result = {
        labels: labels,
        data: data
    };
    return result;
}

let getStats = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const mission = await Mission.find({ user_id: data._id });
        if (!mission) {
            throw new Error()
        }
        console.log("data=>", getStatsModel(mission));
        res.status(200).send(mission)//getStatsModel(mission))
    } catch (error) {
        res.status(401).send({ error: error })
    }
}

let getMonthlyDeals = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        const month = req.body.month
        const mission = await Mission.aggregate(
            [
                {
                    "$match": {
                        "user_id": { "$regex": data._id, "$options": "i" },
                    }
                },
                {
                    "$unwind": "$user_id"
                },
                {
                    "$match": {
                        "user_id": { "$regex": data._id, "$options": "i" },
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "date": { "$first": "$date" },
                        "deal": { "$first": "$deal" }
                    }
                }
            ]
        )
        const add = (a, b) => a + b
        if (mission) {
            let deals = []
            for (let i = 0; i < mission.length; i++) {
                const splitedDate = mission[i].date.split("/")
                if (month.toString() === splitedDate[1]) {
                    deals.push(parseInt(mission[i].deal))
                }
            }
            const result = deals.reduce(add)
            res.status(200).send({ nbMissionPerMonth: deals.length, priceEachMission: deals, totalDeals: result })
        }
        else {
            res.status(401).send({ error: "no mission found for this user" })
        }
    } catch (err) {
        console.log(err)
        res.status(401).send({ error: err })
    }
}

let getMonthlyMission = async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        const month = req.body.month
        const mission = await Mission.aggregate(
            [
                {
                    "$match": {
                        "user_id": { "$regex": data._id, "$options": "i" },
                    }
                },
                {
                    "$unwind": "$user_id"
                },
                {
                    "$match": {
                        "user_id": { "$regex": data._id, "$options": "i" },
                    }
                },

            ]
        )
        const add = (a, b) => a + b
        if (mission) {
            let deals = []
            for (let i = 0; i < mission.length; i++) {
                const splitedDate = mission[i].date.split("/")
                if (month.toString() === splitedDate[1]) {
                    deals.push(mission[i])
                }
            }
            res.status(200).send({ nbMissionPerMonth: deals.length, totalMission: deals })
        }
        else {
            res.status(401).send({ error: "no mission found for this user" })
        }
    } catch (err) {
        console.log(err)
        res.status(401).send({ error: err })
    }
}

let getCa = async (req, res) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    const data = jwt.verify(token, process.env.JWT_KEY);
    try {
        const mission = await Mission.find({ user_id: data._id });
        if (!mission) {
            throw new Error()
        }
        let result = getStatsModel(mission);
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        let reponse = result.data.reduce(reducer);
        console.log("data=>", result);
        res.status(200).send({
            ca: reponse
        })
    } catch (error) {
        res.status(401).send({ error: error })
    }
}

module.exports = {
    getStats,
    getMonthlyDeals,
    getMonthlyMission,
    getCa
};
