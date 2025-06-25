const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/booking', async (req, res) => {
  try {
    const { 
      allocation,
      ccard,
      passengers,
      depositbooking,
      importtarget,
      sessionkey,
      contact,
      userid,
      sid 
    } = req.body;

    const traveltekPayload = {
      allocation,
      ccard,
      passengers,
      depositbooking,
      importtarget: importtarget || 'web',
      sessionkey: sessionkey || 'mock_sessionkey_abcde',
      contact,
      userid: userid || 'mock_user_123',
      sid: sid || 'mock_sid_12345'
    };

    const traveltekResponse = await axios.post(
      'https://fusionapi.traveltek.net/2.1/json/book.pl',
      traveltekPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'YOUR_API_KEY_HERE'
        },
      }
    );

    console.log('traveltekResponse; ', traveltekResponse.data.errors);

    if (traveltekResponse.data.errors.length > 0) {
      return res.status(400).json({ 
        message: 'Booking failed', 
        error: traveltekResponse.data 
      });
    }
    
    res.json({
      message: 'Booking received successfully',
      data: traveltekResponse.data
    });
  } catch (error) {
    if (error.response) {
      console.error('Traveltek error:', error.response.data);
     
      res.status(500).json({ 
        message: 'Booking failed', 
        error: error.response.data 
      });
    } else {
      console.error('Traveltek error:', error.message);

      res.status(500).json({ 
        message: 'Booking failed', 
        error: error.message 
      });
    }
  }
});

app.listen(5000, () => {
  console.log('Backend running at http://localhost:5000');
});