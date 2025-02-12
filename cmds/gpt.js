const axios = require('axios');
const { sendMessage } = require('../handles/message');

module.exports = {
  name: 'deepseek',
  description: 'Ask a question to the Deep seek AI',
  role: 1,
  author: 'Asmit',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    if (!prompt) {
      return sendMessage(senderId, {
        text: 'Hello! I am Deep seek AI, how can I help you?'
      }, pageAccessToken);
    }

    const apiUrl = `https://zaikyoo.onrender.com/api/deepseekr1?prompt=${encodeURIComponent(prompt)}&uid=${senderId}`;

    try {
      const response = await axios.get(apiUrl);
      const reply = response.data.response;

      if (reply) {
        const formattedResponse = `💻📦 Deepseek:\n\n${reply}`;
        const maxLength = 2000;

        if (formattedResponse.length > maxLength) {
          const chunks = [];
          let remainingText = formattedResponse;

          while (remainingText.length > 0) {
            chunks.push(remainingText.substring(0, maxLength));
            remainingText = remainingText.substring(maxLength);
          }

          for (const chunk of chunks) {
            await sendMessage(senderId, { text: chunk }, pageAccessToken);
          }
        } else {
          await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
        }
      } else {
        await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Blackbox API:', error);
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
