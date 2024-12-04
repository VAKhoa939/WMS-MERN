const router = require("express").Router();

router.post("/", (req, res) => {
  const userMessage = req.body;
  const aiMessages = createAIMessages(userMessage);
  res.status(200).json(aiMessages);
});

module.exports = router;

function createAIMessages(userMessage) {
  const aiMessage = {
    content: userMessage.content,
    className: "incoming",
    type: "text",
  };
  const messageList = [];
  messageList.push(aiMessage);
  return messageList;
}
