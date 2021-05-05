module.exports = function (req, res) {
    if (res.rawStatus === 200) {
        return res.json(res.rawResponse); 
    } else {
        return res.status(400).json(res.rawResponse); 
    }
}