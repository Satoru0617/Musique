const axios = require('axios');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'cdp',
  description: 'Get couple DP images.',
  usage: 'Get couple display pictures',
  author: 'Asmit',
  async execute(senderId, args, pageAccessToken) {
    const apiUrl = 'https://c-v5.onrender.com/v1/cdp/get';

    try {
      // Inform the user that the bot is fetching images
      await sendMessage(senderId, { text: 'Please wait a moment while we fetch your couple DP images... 🙏' }, pageAccessToken);

      // Fetch couple DP from the API
      const response = await axios.get(apiUrl);

      // Check if the API response contains valid URLs
      if (!response.data || !response.data.male || !response.data.female) {
        throw new Error('Invalid API response structure');
      }

      const { male, female } = response.data;

      // Send the male DP image
      await sendMessage(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: male,
            is_reusable: true
          }
        }
      }, pageAccessToken);

      // Small delay before sending the female DP to ensure smooth delivery
      setTimeout(async () => {
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: female,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }, 1000); // 1-second delay

    } catch (error) {
      console.error('Error fetching couple DP:', error.response?.data || error.message);
      await sendMessage(senderId, {
        text: 'Sorry, an error occurred while fetching the couple DP. Please try again later.'
      }, pageAccessToken);
    }
  }
};
