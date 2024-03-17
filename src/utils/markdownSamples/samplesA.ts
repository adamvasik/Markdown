export const sampleA = `# Getting Started with RapidAPI

    Welcome to this quick guide on setting up and using RapidAPI to access a multitude of APIs from a single platform. RapidAPI offers a vast repository of APIs for various purposes, from weather forecasting to machine learning and everything in between.
    
    ## Sign Up for RapidAPI
    
    First things first, you need to create a RapidAPI account. Follow these simple steps:
    
    1. Visit [RapidAPI's Sign Up Page](https://rapidapi.com/signup).
    2. Enter your email, choose a password, and click the "Sign Up" button.
    3. Verify your email address through the confirmation email sent to you.
    
    Congratulations! You now have access to thousands of APIs.
    
    ## Finding the Right API
    
    With your account set up, it's time to find an API that suits your project's needs:
    
    1. Go to the [RapidAPI Hub](https://rapidapi.com/hub).
    2. Use the search bar to find APIs by keywords, categories, or popularity.
    3. Once you find an API you're interested in, click on it to view the details, including endpoints, pricing plans, and usage limits.
    
    ## Subscribing to an API
    
    Before you can start making calls to an API, you need to subscribe to it:
    
    1. On the API's detail page, click the "Subscribe" button.
    2. Choose a subscription plan that fits your needs. Many APIs offer a basic free plan, perfect for testing and small projects.
    3. Confirm your subscription. You're now ready to start using the API!
    
    ## Making Your First API Call
    
    RapidAPI provides code snippets in various languages to help you make your first API call. Here's a basic example in JavaScript:
    
    \`\`\`javascript
    const axios = require('axios');
    
    const options = {
      method: 'GET',
      url: 'https://exampleapi.p.rapidapi.com/endpoints',
      headers: {
        'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY',
        'X-RapidAPI-Host': 'exampleapi.p.rapidapi.com'
      }
    };
    
    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });
    \`\`\`
    
    Replace **'YOUR_RAPIDAPI_KEY'** with your actual RapidAPI key, and adjust the url and **'X-RapidAPI-Host'** values to match the API you're using.
    
    #### Conclusion
    
    You're all set! You've learned how to sign up for RapidAPI, find and subscribe to an API, and make your first API call. The world of APIs is now at your fingertips. Happy coding!
    `