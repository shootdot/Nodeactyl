let req = require(`${process.cwd()}\\utils\\ApplicationRequest.js`);

/**
 * 
 * @param {String} NodeID The node ID to delete
 */
function deleteNode(NodeID) {
    const Req = new req(process.env.APPLICATION_NODEACTYL_HOST, process.env.APPLICATION_NODEACTYL_KEY);
    return Req.deleteRequest("DeleteNode", UserID);
}

module.exports = deleteNode;