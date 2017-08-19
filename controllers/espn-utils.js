

// my-players-table

module.exports.sendJSONResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};
